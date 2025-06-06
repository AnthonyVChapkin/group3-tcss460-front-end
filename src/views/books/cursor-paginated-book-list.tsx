'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { Box, Container, CssBaseline, Divider, List, Typography, CircularProgress, Button, Grid } from '@mui/material';
import { BookListItem, NoBook } from 'components/BookListItem';
import axios from 'utils/axios';
import { useBookList } from 'contexts/BookListContext';

export default function CursorPaginatedBooksList() {
  const { booksCursor, setBooksCursor, setScrollY, cursors, setCursors } = useBookList();

  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const limit = 10;

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
      setTotal(pagination.totalRecords);

      if (isForward) {
        setCursors([...cursors, nextCursor]);
      }
    } catch (error) {
      console.error('Error fetching cursor paginated books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Always fetch using the current “last” cursor (initially [0])
    const current = cursors[cursors.length - 1];
    fetchBooks(current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const prevCursor = updated[updated.length - 1];
    setCursors(updated);
    fetchBooks(prevCursor, false);
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

  const hasMore = cursors[cursors.length - 1] + limit < total;
  const canGoBack = cursors.length > 1;

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress size={48} />
              </Box>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Showing {booksCursor.length} of {total} books
                </Typography>
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
