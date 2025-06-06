'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { Box, Container, CssBaseline, Divider, List, Typography, CircularProgress, Button, Grid } from '@mui/material';
import { BookListItem, NoBook } from 'components/BookListItem';
import axios from 'utils/axios';
import { useBookList } from 'contexts/BookListContext';

export default function CursorPaginatedBooksList() {
  const { books, setBooks, setScrollY } = useBookList();
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchBooks = async (nextCursor = 0) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: limit.toString(), cursor: nextCursor.toString() });
      const response = await axios.get(`/books/cursor?${params.toString()}`);

      const { entries, pagination } = response.data;

      setBooks(entries);
      setCursor(pagination.cursor + limit);
      setTotal(pagination.totalRecords);
      setHasMore(pagination.cursor + limit < pagination.totalRecords);
    } catch (error) {
      console.error('Error fetching cursor paginated books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(0);
  }, []);

  const handleNext = () => {
    fetchBooks(cursor);
    setScrollY(0);
  };

  // Not connected to web api yet.
  const handleDelete = (isbn13: number) => {
    setBooks(books.filter((book) => book.isbn13 !== isbn13));
  };

  const booksAsComponents = books.map((book, index, books) => (
    <Fragment key={book.isbn13}>
      <BookListItem book={book} onDelete={handleDelete} />
      {index < books.length - 1 && <Divider variant="middle" component="li" />}
    </Fragment>
  ));

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />

      <Grid container spacing={2}>
        {/* Book List */}
        <Grid item xs={12}>
          <Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress size={48} />
              </Box>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Showing {books.length} of {total} books
                </Typography>
                <List>{booksAsComponents.length ? booksAsComponents : <NoBook />}</List>

                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button onClick={handleNext} variant="contained" disabled={!hasMore || isLoading}>
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
