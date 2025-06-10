'use client';
import { useBookList } from 'contexts/BookListContext';
import { BookCreateForm } from 'components/BookCreateForm';
import { IBook } from 'core/model/book.model';

export default function BookCreate() {
  const { books, setBooks } = useBookList();

  const handleSave = (book: IBook) => {
    setBooks([book, ...books]);
  };

  return <BookCreateForm onSave={handleSave} />;
}
