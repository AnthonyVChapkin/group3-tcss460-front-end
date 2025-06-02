import { BookListProvider } from '../../../contexts/BookListContext';

// ==============================|| BOOKLIST LAYOUT ||============================== //

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BookListProvider>{children}</BookListProvider>;
}
