import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Rating, Chip, Grid, Paper, Divider, Stack, Alert, CircularProgress } from '@mui/material';
import { IBook } from '../core/model/book.model';
import axios from 'utils/axios';

export function BookDisplay({ book, onRatingChange }: { book: IBook; onRatingChange: (newRating: number) => void }) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get user's previous rating from localStorage (simulating user session)
  useEffect(() => {
    const savedRating = localStorage.getItem(`user_rating_${book.isbn13}`);
    if (savedRating) {
      setUserRating(parseInt(savedRating));
    }
  }, [book.isbn13]);

  const handleRatingChange = async (_event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue === null) return;

    console.log('Rating change initiated:', newValue);
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const previousRating = userRating;
      console.log('Previous rating:', previousRating);

      if (previousRating !== null) {
        // User is changing their existing rating
        console.log('Updating existing rating from', previousRating, 'to', newValue);

        // First, decrement the old rating
        await axios.patch(`/books/ratings/${book.isbn13}`, {
          ratingType: previousRating,
          value: 1,
          action: 'decrement'
        });

        // Then increment the new rating (keeping total count the same)
        await axios.patch(`/books/ratings/${book.isbn13}`, {
          ratingType: newValue,
          value: 1,
          action: 'increment'
        });

        setSuccess(`Rating updated from ${previousRating} to ${newValue} stars!`);
      } else {
        // User is rating for the first time
        console.log('Adding new rating:', newValue);

        await axios.patch(`/books/ratings/${book.isbn13}`, {
          ratingType: newValue,
          value: 1,
          action: 'increment'
        });

        setSuccess(`Thank you for rating this book ${newValue} stars!`);
      }

      // Update local state and localStorage
      setUserRating(newValue);
      localStorage.setItem(`user_rating_${book.isbn13}`, newValue.toString());

      // Call the parent callback to potentially refresh book data
      onRatingChange(newValue);

      console.log('Rating update successful');
    } catch (err: any) {
      console.error('Error updating rating:', err);
      setError(err.response?.data?.message || 'Failed to update rating. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Clear alerts after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <Card elevation={3} sx={{ width: '100%', maxWidth: 1000 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Alert Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Book Cover Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.icons?.large || book.icons?.small}
                alt={book.title}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onError={(e) => {
                  // Final fallback: use a simple book emoji placeholder
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';

                  // Create a simple div placeholder
                  const placeholder = document.createElement('div');
                  placeholder.style.width = '300px';
                  placeholder.style.height = '450px';
                  placeholder.style.backgroundColor = '#f5f5f5';
                  placeholder.style.border = '2px dashed #ddd';
                  placeholder.style.borderRadius = '8px';
                  placeholder.style.display = 'flex';
                  placeholder.style.alignItems = 'center';
                  placeholder.style.justifyContent = 'center';
                  placeholder.style.color = '#666';
                  placeholder.style.fontSize = '16px';
                  placeholder.style.textAlign = 'center';
                  placeholder.innerHTML = `
                    <div>
                      <div style="font-size: 48px; margin-bottom: 10px;">📚</div>
                      <div>No Image Available</div>
                    </div>
                  `;

                  // Replace the broken image with the placeholder
                  target.parentNode?.replaceChild(placeholder, target);
                }}
              />
            </Box>
          </Grid>

          {/* Book Details Section */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Title and Author */}
              <Box>
                <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  by {book.authors}
                </Typography>
                <Chip label={`Published ${book.publication}`} variant="outlined" sx={{ mt: 1 }} />
              </Box>

              {/* ISBN and Original Title */}
              <Box>
                <Typography variant="body1">
                  <strong>ISBN:</strong> {book.isbn13}
                </Typography>
                {/* Always show Original Title section, handle missing data gracefully */}
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Original Title:</strong> {book.original_title || book.title || 'Not available'}
                </Typography>
              </Box>

              {/* Current Rating - Always show this section */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Current Rating
                </Typography>
                {book.ratings ? (
                  <>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating name="average-rating" value={book.ratings.average || 0} precision={0.1} readOnly size="small" />
                      <Typography variant="body2">({(book.ratings.average || 0).toFixed(2)})</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Based on {formatNumber(book.ratings.count || 0)} ratings
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No rating data available
                  </Typography>
                )}
              </Box>

              <Divider />

              {/* User Rating Section */}
              <Paper elevation={1} sx={{ p: 3, backgroundColor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Rate This Book
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Your Rating:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating value={userRating} onChange={handleRatingChange} size="large" sx={{ mb: 1 }} disabled={isLoading} />
                    {isLoading && <CircularProgress size={20} />}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {userRating ? `You rated this book ${userRating} star${userRating !== 1 ? 's' : ''}` : 'Click stars to rate this book'}
                  </Typography>
                </Box>
              </Paper>

              {/* Rating Breakdown */}
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Rating Breakdown
                </Typography>
                {book.ratings ? (
                  <Stack spacing={1}>
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = (book.ratings[`rating_${stars}` as keyof typeof book.ratings] as number) || 0;
                      const percentage = book.ratings.count > 0 ? (count / book.ratings.count) * 100 : 0;

                      return (
                        <Box key={stars} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2" sx={{ minWidth: '60px' }}>
                            {stars} star{stars !== 1 ? 's' : ''}:
                          </Typography>
                          <Box
                            sx={{
                              flexGrow: 1,
                              height: 8,
                              backgroundColor: 'grey.200',
                              borderRadius: 1,
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              sx={{
                                width: `${percentage}%`,
                                height: '100%',
                                backgroundColor: 'primary.main',
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: '80px', textAlign: 'right' }}>
                            {formatNumber(count)} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No rating breakdown available
                  </Typography>
                )}
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
