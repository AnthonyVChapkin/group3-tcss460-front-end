'use client';

import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Box, Container, CssBaseline, Divider, List, Typography, CircularProgress, TextField, Button, Grid, Paper } from '@mui/material';
import { BookListItem, NoBook } from 'components/BookListItem';
import axios from 'utils/axios';
import { useBookList } from 'contexts/BookListContext';
import { usePathname } from 'next/navigation';

export default function BooksList() {
  const { books, setBooks, filters, setFilters, scrollY, setScrollY } = useBookList();
  const [isLoading, setIsLoading] = useState(false);

  const bookListRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      if (pathname === 'books/list') {
        setScrollY(window.scrollY);
      }
    };
  }, [pathname, setScrollY]);

  useEffect(() => {
    if (books.length > 0 && scrollY > 0) {
      window.scrollTo(0, scrollY);
    }
  }, [books]);

  const fetchBooks = async ({ scrollToTop = false } = {}) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value.trim() !== '') {
          params.append(key, value.trim());
        }
      }

      const response = await axios.get(`/books?${params.toString()}`);
      setBooks(response.data.books || []);

      if (scrollToTop) {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (books.length === 0) {
      fetchBooks();
    }
  }, []);

  // Not connected to web api yet.
  const handleDelete = (isbn13: number) => {
    setBooks(books.filter((book) => book.isbn13 !== isbn13));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks({ scrollToTop: true });
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
        {/* Sidebar Filter Form */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              position: 'sticky',
              top: 72,
              zIndex: 1000,
              backgroundColor: 'background.paper',
              padding: 2,
              paddingTop: 3,
              border: '1px solid #ccc'
            }}
          >
            <Typography component="h1" variant="h6" sx={{ mb: 2 }}>
              Filter Books
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <TextField fullWidth label="ISBN-13" name="isbn13" value={filters.isbn13} onChange={handleInputChange} />
                </Grid>
                <Grid item>
                  <TextField fullWidth label="Authors" name="authors" value={filters.authors} onChange={handleInputChange} />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Publication Year"
                    name="publication_year"
                    value={filters.publication_year}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Original Title"
                    name="original_title"
                    value={filters.original_title}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item>
                  <TextField fullWidth label="Title" name="title" value={filters.title} onChange={handleInputChange} />
                </Grid>
                <Grid item>
                  <TextField fullWidth label="Min Rating" name="rating" value={filters.rating} onChange={handleInputChange} />
                </Grid>
                <Grid item>
                  <Button type="submit" fullWidth variant="contained">
                    Apply Filters
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Book List */}
        <Grid item xs={12} md={8}>
          <Box ref={bookListRef}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress size={48} />
              </Box>
            ) : (
              <List>{booksAsComponents.length ? booksAsComponents : <NoBook />}</List>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
