'use client';

import { useState, useEffect } from 'react';
import { Paper, Stack, TextField, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import { IBook } from 'core/model/book.model';

export function BookCreateForm({ onSave }: { onSave: (book: IBook) => void }) {
  /* ------------ form state ------------ */
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [publication, setPublication] = useState('');
  const [originalTitle, setOriginal] = useState('');
  const [isbn13, setIsbn13] = useState('');
  const [smallUrl, setSmallUrl] = useState('');
  const [largeUrl, setLargeUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ------------ auto-clear alerts ------------ */
  useEffect(() => {
    if (error || success) {
      const id = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(id);
    }
  }, [error, success]);

  /* ------------ submit ------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !authors || !isbn13) {
      setError('Title, Authors, and ISBN-13 are required.');
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        title,
        authors,
        publication: publication ? Number(publication) : undefined,
        original_title: originalTitle || undefined,
        isbn13: Number(isbn13),
        icons: { small: smallUrl.trim() || undefined, large: largeUrl.trim() || undefined }
      };

      const newBook: IBook = {
        ...payload,
        ratings: {
          average: 0,
          count: 0,
          rating_1: 0,
          rating_2: 0,
          rating_3: 0,
          rating_4: 0,
          rating_5: 0
        }
      } as IBook;

      onSave(newBook); // hand back to page
      setSuccess('Book created successfully!');
      reset();
    } catch (err: any) {
      console.error('Create failed:', err);
      setError(err.response?.data?.message ?? 'Failed to create book.');
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setTitle('');
    setAuthors('');
    setPublication('');
    setOriginal('');
    setIsbn13('');
    setSmallUrl('');
    setLargeUrl('');
  };

  /* ------------ ui ------------ */
  return (
    <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Create New Book
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
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
          <TextField
            label="Authors"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            required
            fullWidth
            helperText="Separate multiple authors with commas"
          />
          <TextField label="Publication" value={publication} onChange={(e) => setPublication(e.target.value)} type="number" fullWidth />
          <TextField label="Original Title" value={originalTitle} onChange={(e) => setOriginal(e.target.value)} fullWidth />
          <TextField label="ISBN-13" value={isbn13} onChange={(e) => setIsbn13(e.target.value)} required fullWidth />
          <TextField label="Small Cover URL" value={smallUrl} onChange={(e) => setSmallUrl(e.target.value)} fullWidth />
          <TextField label="Large Cover URL" value={largeUrl} onChange={(e) => setLargeUrl(e.target.value)} fullWidth />

          <Box sx={{ position: 'relative' }}>
            <Button type="submit" variant="contained" disabled={busy} fullWidth>
              Create Book
            </Button>
            {busy && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
