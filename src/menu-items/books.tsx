// third-party
import { FormattedMessage } from 'react-intl';

// assets
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import BookIcon from '@mui/icons-material/Book';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { LocalLibraryIcon, BookIcon, CollectionsBookmarkIcon };

// ==============================|| MENU ITEMS - PAGES ||============================== //

const bookPages: NavItemType = {
  id: 'book-pages',
  title: <FormattedMessage id="book-pages" />,
  type: 'group',
  children: [
    {
      id: 'books',
      title: <FormattedMessage id="books" />,
      type: 'collapse',
      icon: icons.LocalLibraryIcon,
      children: [
        {
          id: 'view-book',
          title: <FormattedMessage id="view-book" />,
          type: 'item',
          url: '/books/book/9780618260300',
          icon: icons.BookIcon
        },
        {
          id: 'view-books',
          title: <FormattedMessage id="view-books" />,
          type: 'item',
          url: '/books/list',
          icon: icons.CollectionsBookmarkIcon
        }
      ]
    }
  ]
};

export default bookPages;
