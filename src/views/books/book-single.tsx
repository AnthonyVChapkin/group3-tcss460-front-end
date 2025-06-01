'use client';

import { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Typography, Alert, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IBook } from '../../core/model/book.model';
import { BookDisplay } from 'components/BookDisplaySingle';
import axios from 'utils/axios';

export default function BookSingle({ isbn13 }: { isbn13: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [book, setBook] = useState<IBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch book data from API
  useEffect(() => {
    console.log('=== BookSingle API-Only Mode ===');
    console.log('ISBN13:', isbn13);
    console.log('Session status:', status);

    const fetchBookFromAPI = async () => {
      try {
        console.log('Fetching book from API...');
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`/books?isbn13=${isbn13}`);
        console.log('API response:', response.data);

        if (response.data.books && response.data.books.length > 0) {
          const apiBook = response.data.books[0];

          // Transform API book data to match our IBook interface
          const transformedBook: IBook = {
            isbn13: parseInt(apiBook.isbn13),
            authors: apiBook.authors,
            publication: parseInt(apiBook.publication),
            original_title: apiBook.original_title,
            title: apiBook.title,
            ratings: {
              average: apiBook.ratings.average,
              count: apiBook.ratings.count,
              rating_1: apiBook.ratings.rating_1,
              rating_2: apiBook.ratings.rating_2,
              rating_3: apiBook.ratings.rating_3,
              rating_4: apiBook.ratings.rating_4,
              rating_5: apiBook.ratings.rating_5
            },
            icons: {
              large: apiBook.icons?.large,
              small: apiBook.icons?.small
            }
          };

          console.log('API Book Images:', {
            large: apiBook.icons?.large,
            small: apiBook.icons?.small
          });
          console.log('Transformed book:', transformedBook);
          setBook(transformedBook);
        } else {
          throw new Error('Book not found in API response');
        }
      } catch (err: any) {
        console.error('Failed to fetch book from API:', err);
        setError(`Failed to load book: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a session
    if (status === 'authenticated') {
      fetchBookFromAPI();
    }
  }, [isbn13, status]);

  // Handle auth redirects
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('User is unauthenticated, redirecting...');
      router.push('/login');
    }
  }, [status, router]);

  const handleRatingChange = async (newRating: number) => {
    console.log('Rating updated to:', newRating);

    // Refresh the book data from API to show updated counts
    try {
      console.log('Refreshing book data after rating update...');
      const response = await axios.get(`/books?isbn13=${isbn13}`);

      if (response.data.books && response.data.books.length > 0) {
        const apiBook = response.data.books[0];

        // Transform API book data to match our IBook interface
        const transformedBook: IBook = {
          isbn13: parseInt(apiBook.isbn13),
          authors: apiBook.authors,
          publication: parseInt(apiBook.publication),
          original_title: apiBook.original_title,
          title: apiBook.title,
          ratings: {
            average: apiBook.ratings.average,
            count: apiBook.ratings.count,
            rating_1: apiBook.ratings.rating_1,
            rating_2: apiBook.ratings.rating_2,
            rating_3: apiBook.ratings.rating_3,
            rating_4: apiBook.ratings.rating_4,
            rating_5: apiBook.ratings.rating_5
          },
          icons: {
            large: apiBook.icons?.large,
            small: apiBook.icons?.small
          }
        };

        console.log('Book data refreshed with updated ratings');
        setBook(transformedBook);
      }
    } catch (err) {
      console.log('Could not refresh book data after rating update:', err);
      // Don't show error to user since the rating update itself succeeded
    }
  };

  if (status === 'loading') {
    return (
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh'
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading session...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box sx={{ marginTop: 8 }}>
          <Alert severity="warning">You need to be logged in to view this page.</Alert>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh'
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading book from API...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
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
          <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
            {error}
          </Alert>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Failed to load book with ISBN: {isbn13}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!book) {
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
          <Alert severity="warning" sx={{ width: '100%', maxWidth: 600 }}>
            Book not found for ISBN: {isbn13}
          </Alert>
        </Box>
      </Container>
    );
  }

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
          Book Details (API Data)
        </Typography>

        <BookDisplay book={book} onRatingChange={handleRatingChange} />
      </Box>
    </Container>
  );
}
