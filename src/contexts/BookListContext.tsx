'use client';

import React, { createContext, useContext, useState } from 'react';
import { IBook } from 'core/model/book.model';

type BookListContextProps = {
  books: IBook[];
  filters: Record<string, string>;
  scrollY: number;
  setBooks: (books: IBook[]) => void;
  setFilters: (filters: Record<string, string>) => void;
  setScrollY: (y: number) => void;
  cursors: number[];
  setCursors: (cursors: number[]) => void;
};

const BookListContext = createContext<BookListContextProps | undefined>(undefined);

export const BookListProvider = ({ children }: { children: React.ReactNode }) => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({
    isbn13: '',
    authors: '',
    publication_year: '',
    original_title: '',
    title: '',
    rating: '4.7'
  });
  const [scrollY, setScrollY] = useState(0);
  const [cursors, setCursors] = useState<number[]>([0]);

  return (
    <BookListContext.Provider value={{ books, setBooks, filters, setFilters, scrollY, setScrollY, cursors, setCursors }}>
      {children}
    </BookListContext.Provider>
  );
};

export const useBookList = () => {
  const ctx = useContext(BookListContext);
  if (!ctx) throw new Error('useBookList must be used within BookListProvider');
  return ctx;
};
