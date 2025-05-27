'use client';

import { useParams } from 'next/navigation'; 
import SingleBook from 'views/books/book-single';

// ==============================|| BOOK VIEW PAGE ||============================== //

export default function BookPage() {
  const { isbn13 } = useParams();

  return isbn13 && typeof isbn13 === 'string' ? <SingleBook isbn13={isbn13} /> : <SingleBook isbn13={''} />;
}
