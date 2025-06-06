import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, Box, IconButton, ListItem, ListItemAvatar, ListItemText, Rating, Typography, ListItemButton } from '@mui/material';
import { IBook } from 'core/model/book.model';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import { useBookList } from 'contexts/BookListContext';

export function BookListItem({ book, onDelete }: { book: IBook; onDelete: (isbn13: number) => void }) {
  const { setScrollY } = useBookList();
  const avg = book.ratings?.average ?? 0;

  const handleClick = () => {
    setScrollY(window.scrollY);
  };

  return (
    <ListItem
      alignItems="flex-start"
      disablePadding
      secondaryAction={
        <IconButton edge="end" aria-label={`delete ${book.title}`} onClick={() => onDelete(book.isbn13)}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemButton component={Link} href={`/books/book/${book.isbn13}`} sx={{ textDecoration: 'none' }} onClick={handleClick}>
        <ListItemAvatar>
          <Avatar alt={book.title} src={book.icons?.small || book.icons?.large} variant="square" sx={{ width: 56, height: 84, mr: 2 }} />
        </ListItemAvatar>

        <ListItemText
          primary={
            <Typography variant="subtitle1" fontWeight="bold" component="div">
              {book.title}
            </Typography>
          }
          secondaryTypographyProps={{ component: 'div' }}
          secondary={
            <Box mt={1}>
              <Typography variant="body2" color="text.secondary" component="div">
                by {book.authors}
              </Typography>
              <Typography variant="body2" component="div">
                ISBN: {book.isbn13}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                <Rating name="average-rating" value={avg} precision={0.1} readOnly size="small" />
                <Typography variant="body2" component="div">
                  ({avg.toFixed(2)})
                </Typography>
              </Box>
            </Box>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

export function NoBook() {
  return (
    <ListItem>
      <ListItemAvatar>
        <CommentsDisabledIcon />
      </ListItemAvatar>
      <ListItemText primary="No Elements" />
    </ListItem>
  );
}
