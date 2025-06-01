'use client';

import { useState, useEffect, Fragment } from 'react';
import { IBook } from '../../core/model/book.model';
import { BookListItem, NoBook } from 'components/BookListItem';
import {
  Box,
  Container,
  CssBaseline,
  Divider,
  List,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'utils/axios';

export default function BooksList() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('/books?rating=4.5');
        setBooks(response.data.books);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load books from the API.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Not connected to the web api yet.
  const handleDelete = (isbn13: number) => {
    setBooks(books.filter((book) => book.isbn13 !== isbn13));
  };

  const booksAsComponents = books.map((book, index) => (
    <Fragment key={book.isbn13}>
      <BookListItem book={book} onDelete={handleDelete} />
      {index < books.length - 1 && <Divider variant="middle" component="li" />}
    </Fragment>
  ));

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5">
          Books
        </Typography>
        <Box sx={{ mt: 4, width: '100%' }}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '30vh'
              }}
            >
              <CircularProgress size={50} />
              <Typography sx={{ mt: 2 }}>Loading books...</Typography>
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <List>{books.length ? booksAsComponents : <NoBook />}</List>
          )}
        </Box>
      </Box>
    </Container>
  );
}
