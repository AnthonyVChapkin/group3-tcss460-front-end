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
  title: <FormattedMessage id="Book Pages" />,
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
          title: <FormattedMessage id="View a Book" />,
          type: 'item',
          url: '/books/book',
          icon: icons.BookIcon
        },
        {
          id: 'view-books',
          title: <FormattedMessage id="View Books" />,
          type: 'item',
          url: '/books/list',
          icon: icons.CollectionsBookmarkIcon
        }
      ]
    }
  ]
};

export default bookPages;
