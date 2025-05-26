import { useState } from 'react';
import { Box, Card, CardContent, Typography, Rating, Chip, Grid, Paper, Divider, Stack } from '@mui/material';
import { IBook } from '../core/model/book.model';

export function BookDisplay({ book, onRatingChange }: { book: IBook; onRatingChange: (newRating: number) => void }) {
  const [userRating, setUserRating] = useState<number>(book.ratings.average);

  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setUserRating(newValue);
      onRatingChange(newValue);
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <Card elevation={3} sx={{ width: '100%', maxWidth: 1000 }}>
      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Book Cover Section - Using LARGE image */}
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
                {book.original_title !== book.title && (
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Original Title:</strong> {book.original_title}
                  </Typography>
                )}
              </Box>

              {/* Current Rating Display (matching BookListItem style) */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Current Rating
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating name="average-rating" value={book.ratings.average} precision={0.1} readOnly size="small" />
                  <Typography variant="body2">({book.ratings.average.toFixed(2)})</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Based on {formatNumber(book.ratings.count)} ratings
                </Typography>
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
                  <Rating value={userRating} onChange={handleRatingChange} size="large" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Click stars to rate this book
                  </Typography>
                </Box>
              </Paper>

              {/* Rating Breakdown */}
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Rating Breakdown
                </Typography>
                <Stack spacing={1}>
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = book.ratings[`rating_${stars}` as keyof typeof book.ratings] as number;
                    const percentage = (count / book.ratings.count) * 100;

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
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
