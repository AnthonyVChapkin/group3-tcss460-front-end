import { IRatings } from './ratings.model';
import { IUrlIcon } from './urlIcon.model';

export interface IBook {
  isbn13: number;
  authors: string;
  publication: number;
  original_title: string;
  title: string;
  ratings: IRatings;
  icons: IUrlIcon;
}
