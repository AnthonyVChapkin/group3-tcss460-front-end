'use client';

import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Box, Container, CssBaseline, Divider, List, Typography, CircularProgress, Button, Grid } from '@mui/material';
import { BookListItem, NoBook } from 'components/BookListItem';
import axios from 'utils/axios';
import { useBookList } from 'contexts/BookListContext';
import { usePathname } from 'next/navigation';

export default function CursorPaginatedBooksList() {
  const { booksCursor, setBooksCursor, setScrollY, cursors, setCursors, cursorTotalPages, setCursorTotalPages } = useBookList();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const listRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      if (pathname === '/books/cursor') {
        setScrollY(window.scrollY);
      }
    };
  }, [pathname, setScrollY]);

  useEffect(() => {
    if (booksCursor.length > 0) {
      const saved = window.scrollY;
      if (saved > 0) window.scrollTo(0, saved);
    }
  }, [booksCursor]);

  const fetchBooks = async (nextCursor: number, isForward: boolean) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        cursor: nextCursor.toString()
      });
      const response = await axios.get(`/books/cursor?${params.toString()}`);
      const { entries, pagination } = response.data;
      setBooksCursor(entries);
      setScrollY(0);
      const totalPages = Math.ceil(pagination.totalRecords / limit);
      setCursorTotalPages(totalPages);
      if (isForward) {
        setCursors([...cursors, nextCursor]);
      }
    } catch {
      setBooksCursor([]);
      setCursorTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (booksCursor.length === 0) {
      if (cursors.length === 0) {
        setCursors([0]);
        fetchBooks(0, false);
      } else {
        const last = cursors[cursors.length - 1];
        fetchBooks(last, false);
      }
    }
  }, []);

  const handleNext = () => {
    const current = cursors[cursors.length - 1];
    const newCursor = current + limit;
    fetchBooks(newCursor, true);
  };

  const handlePrevious = () => {
    if (cursors.length <= 1) return;
    const updated = [...cursors];
    updated.pop();
    const prev = updated[updated.length - 1];
    setCursors(updated);
    fetchBooks(prev, false);
  };

  const handleDelete = (isbn13: number) => {
    setBooksCursor(booksCursor.filter((b) => b.isbn13 !== isbn13));
  };

  const booksAsComponents = booksCursor.map((book, idx) => (
    <Fragment key={book.isbn13}>
      <BookListItem book={book} onDelete={handleDelete} />
      {idx < booksCursor.length - 1 && <Divider variant="middle" component="li" />}
    </Fragment>
  ));

  const canGoBack = cursors.length > 1;
  const pageNumber = cursors.length;

  useEffect(() => {
    setHasMore(pageNumber < cursorTotalPages);
  }, [pageNumber, cursorTotalPages]);

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
                <Box display="flex" justifyContent="center" mb={2}>
                  <Typography variant="body1">
                    Page {pageNumber} of {cursorTotalPages}
                  </Typography>
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
