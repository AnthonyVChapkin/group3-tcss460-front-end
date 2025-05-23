import DeleteIcon from '@mui/icons-material/Delete';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import { Avatar, Box, IconButton, ListItem, ListItemAvatar, ListItemText, Rating, Typography } from '@mui/material';
import { IBook } from '../core/model/book.model';

export function BookListItem({ book, onDelete }: { book: IBook; onDelete: (isbn13: number) => void }) {
  return (
    <ListItem
      alignItems="flex-start"
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(book.isbn13)}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar alt={book.title} src={book.icons?.small || book.icons?.large} variant="square" sx={{ width: 56, height: 84, mr: 2 }} />
      </ListItemAvatar>

      <ListItemText
        primary={
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {book.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {book.authors}
            </Typography>
          </Box>
        }
        secondary={
          <Box mt={1}>
            <Typography variant="body2">ISBN: {book.isbn13}</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Rating name="average-rating" value={book.ratings.average} precision={0.1} readOnly size="small" />
              <Typography variant="body2">({book.ratings.average.toFixed(2)})</Typography>
            </Box>
          </Box>
        }
      />
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
