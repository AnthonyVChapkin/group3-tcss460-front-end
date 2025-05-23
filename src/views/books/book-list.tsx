'use client';

import { useState, Fragment } from 'react';
import { IBook } from '../../core/model/book.model';
import data from '../../core/mock/data';
import { BookListItem, NoBook } from 'components/BookListItem';
import { Box, Container, CssBaseline, Divider, List, Typography } from '@mui/material';

export default function BooksList() {
  const [books, setBooks] = useState<IBook[]>(data);

  const handleDelete = (isbn13: number) => {
    setBooks(books.filter((book) => book.isbn13 != isbn13));
  };

  const booksAsComponents = books.map((book, index, books) => {
    return (
      <Fragment key={book.isbn13}>
        <BookListItem book={book} onDelete={handleDelete}></BookListItem>
        {index < books.length - 1 && <Divider variant="middle" component="li" />}
      </Fragment>
    );
  });

  return (
    <>
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
          <Box sx={{ mt: 1 }}>
            <List>{booksAsComponents.length ? booksAsComponents : <NoBook />}</List>
          </Box>
        </Box>
      </Container>
    </>
  );
}
