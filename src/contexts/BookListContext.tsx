'use client';

import React, { createContext, useContext, useState } from 'react';
import { IBook } from 'core/model/book.model';

type BookListContextProps = {
  books: IBook[];
  setBooks: (books: IBook[]) => void;

  booksCursor: IBook[];
  setBooksCursor: (books: IBook[]) => void;
  cursors: number[];
  setCursors: React.Dispatch<React.SetStateAction<number[]>>;
  cursorTotalPages: number;
  setCursorTotalPages: (cursorTotalPages: number) => void;

  booksOffset: IBook[];
  setBooksOffset: (books: IBook[]) => void;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;

  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;
  scrollY: number;
  setScrollY: (y: number) => void;
};

const BookListContext = createContext<BookListContextProps | undefined>(undefined);

export const BookListProvider = ({ children }: { children: React.ReactNode }) => {
  const [books, setBooks] = useState<IBook[]>([]);

  const [booksCursor, setBooksCursor] = useState<IBook[]>([]);
  const [cursors, setCursors] = useState<number[]>([0]);
  const [cursorTotalPages, setCursorTotalPages] = useState<number>(0);

  const [booksOffset, setBooksOffset] = useState<IBook[]>([]);
  const [offset, setOffset] = useState<number>(0);

  const [filters, setFilters] = useState<Record<string, string>>({
    isbn13: '',
    authors: '',
    publication_year: '',
    original_title: '',
    title: '',
    rating: '4.7',
  });
  const [scrollY, setScrollY] = useState(0);

  return (
    <BookListContext.Provider
      value={{
        books,
        setBooks,
        booksCursor,
        setBooksCursor,
        cursors,
        setCursors,
        cursorTotalPages,
        setCursorTotalPages,
        booksOffset,
        setBooksOffset,
        offset,
        setOffset,
        filters,
        setFilters,
        scrollY,
        setScrollY
      }}
    >
      {children}
    </BookListContext.Provider>
  );
};

export const useBookList = () => {
  const ctx = useContext(BookListContext);
  if (!ctx) throw new Error('useBookList must be used within BookListProvider');
  return ctx;
};
