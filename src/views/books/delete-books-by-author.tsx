'use client';

import React, { useState } from 'react';
import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography, Alert, List } from '@mui/material';
import axios from 'utils/axios';
import { IBook } from 'core/model/book.model';
import { BookListItem, NoBook } from 'components/BookListItem';

export default function DeleteBooksByAuthorPage() {
  const [author, setAuthor] = useState('');
  const [deletedBooks, setDeletedBooks] = useState<IBook[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setError('Author is required');
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.delete('/books/rangeOfBooks', {
        data: { authors: author.trim() }
      });
      setDeletedBooks(response.data.deletedBooks || []);
      setSuccess(response.data.message || 'Books deleted successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete books');
      setDeletedBooks([]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" gutterBottom>
          Delete Books by Author
        </Typography>
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
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField label="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} required fullWidth />
            <Box sx={{ position: 'relative' }}>
              <Button type="submit" variant="contained" disabled={busy} fullWidth>
                Delete Books
              </Button>
              {busy && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
            </Box>
          </Stack>
        </Box>
        <Box sx={{ mt: 4 }}>
          {deletedBooks.length > 0 ? (
            <List>
              {deletedBooks.map((book) => (
                <BookListItem key={book.isbn13} book={book} onDelete={() => {}} isDeletable={false} />
              ))}
            </List>
          ) : (
            success && <NoBook />
          )}
        </Box>
      </Paper>
    </Box>
  );
}
