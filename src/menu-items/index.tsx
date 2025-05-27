// project import
import samplePage from './sample-page';
import other from './other';
import pages from './messages';
import bookPages from './books';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [samplePage, pages, bookPages, other]
};

export default menuItems;
