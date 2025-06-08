'use client';

import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Box, Container, CssBaseline, Divider, List, Typography, CircularProgress, Button, Grid, TextField } from '@mui/material';
import { BookListItem, NoBook } from 'components/BookListItem';
import axios from 'utils/axios';
import { useBookList } from 'contexts/BookListContext';
import { usePathname } from 'next/navigation';

export default function OffsetPaginatedBooksList() {
  const { booksOffset, setBooksOffset, offset, setOffset, offsetTotalPages, setOffsetTotalPages, setScrollY } = useBookList();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageInput, setPageInput] = useState('');
  const limit = 10;
  const listRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      if (pathname === '/books/offset') {
        setScrollY(window.scrollY);
      }
    };
  }, [pathname, setScrollY]);

  useEffect(() => {
    if (booksOffset.length > 0) {
      const saved = window.scrollY;
      if (saved > 0) window.scrollTo(0, saved);

      const currentPage = offset / limit + 1;
      setHasMore(currentPage < offsetTotalPages);
    }
  }, [booksOffset, offset, offsetTotalPages]);

  const fetchBooksOffset = async (nextOffset: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: nextOffset.toString()
      });
      const response = await axios.get(`/books/offset?${params.toString()}`);
      const { entries, pagination } = response.data;
      setBooksOffset(entries);
      setScrollY(0);

      const totalPages = Math.ceil(pagination.totalRecords / limit);
      setOffsetTotalPages(totalPages);

      const currentPage = nextOffset / limit + 1;
      setHasMore(currentPage < totalPages);
    } catch {
      setBooksOffset([]);
      setHasMore(false);
      setOffsetTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (booksOffset.length === 0) {
      fetchBooksOffset(offset);
    }
  }, []);

  const handleNext = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchBooksOffset(newOffset);
    setPageInput('');
  };

  const handlePrevious = () => {
    if (offset === 0) return;
    const newOffset = offset - limit;
    setOffset(newOffset);
    fetchBooksOffset(newOffset);
    setPageInput('');
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(pageInput, 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > offsetTotalPages) {
      return;
    }
    const newOffset = (pageNum - 1) * limit;
    setOffset(newOffset);
    fetchBooksOffset(newOffset);
    setPageInput('');
  };

  const handleDelete = (isbn13: number) => {
    setBooksOffset(booksOffset.filter((b) => b.isbn13 !== isbn13));
  };

  const booksAsComponents = booksOffset.map((book, idx) => (
    <Fragment key={book.isbn13}>
      <BookListItem book={book} onDelete={handleDelete} />
      {idx < booksOffset.length - 1 && <Divider variant="middle" component="li" />}
    </Fragment>
  ));

  const canGoBack = offset > 0;
  const currentPage = offset / limit + 1;

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box ref={listRef}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress size={48} />
              </Box>
            ) : (
              <>
                <Box display="flex" justifyContent="center" alignItems="center" mb={2} gap={2}>
                  <Typography variant="body1">
                    Page {currentPage} of {offsetTotalPages}
                  </Typography>
                  <TextField
                    size="small"
                    label="Go to page"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleGoToPage();
                      }
                    }}
                  />
                  <Button variant="contained" onClick={handleGoToPage} disabled={isLoading || !pageInput}>
                    Go
                  </Button>
                </Box>
                <List>{booksAsComponents.length ? booksAsComponents : <NoBook />}</List>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button onClick={handlePrevious} variant="contained" disabled={!canGoBack || isLoading}>
                    Previous Page
                  </Button>
                  <Button onClick={handleNext} variant="contained" disabled={!hasMore || isLoading}>
                    Next Page
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
