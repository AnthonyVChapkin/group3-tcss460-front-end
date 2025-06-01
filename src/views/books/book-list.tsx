'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { Box, Container, CssBaseline, Divider, List, Typography, CircularProgress, TextField, Button, Grid } from '@mui/material';
import { IBook } from '../../core/model/book.model';
import { BookListItem, NoBook } from 'components/BookListItem';
import axios from 'utils/axios';

export default function BooksList() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    isbn13: '',
    authors: '',
    publication_year: '',
    original_title: '',
    title: '',
    rating: '4.7' // To not load too many books at once.
  });

  const fetchBooks = async () => {
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
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Not connected to the web api yet.
  const handleDelete = (isbn13: number) => {
    setBooks(books.filter((book) => book.isbn13 !== isbn13));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

  const booksAsComponents = books.map((book, index, books) => (
    <Fragment key={book.isbn13}>
      <BookListItem book={book} onDelete={handleDelete} />
      {index < books.length - 1 && <Divider variant="middle" component="li" />}
    </Fragment>
  ));

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Books
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="ISBN-13" name="isbn13" value={filters.isbn13} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Authors" name="authors" value={filters.authors} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Publication Year"
                name="publication_year"
                value={filters.publication_year}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Original Title"
                name="original_title"
                value={filters.original_title}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Title" name="title" value={filters.title} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Min Rating" name="rating" value={filters.rating} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained">
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 4, width: '100%' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress size={48} />
            </Box>
          ) : (
            <List>{booksAsComponents.length ? booksAsComponents : <NoBook />}</List>
          )}
        </Box>
      </Box>
    </Container>
  );
}
