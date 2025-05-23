'use client';

import { useState } from 'react';
import { Box, Container, CssBaseline, Typography } from '@mui/material';
import { IBook } from '../../core/model/book.model';
import data from '../../core/mock/data';
import { BookDisplay } from 'components/BookDisplaySingle';

export default function BookSingle() {
  // For now, using the first book from mock data
  // In the future, you'll get the book ID from URL params and find the specific book
  const [book] = useState<IBook>(data[5]); // If you want to change the book change the index number (0-5)

  const handleRatingChange = (newRating: number) => {
    // TODO: In future sprints, this will connect to API to update rating
    console.log('Rating updated to:', newRating);
  };

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
          Book Details
        </Typography>

        <BookDisplay book={book} onRatingChange={handleRatingChange} />
      </Box>
    </Container>
  );
}
