import { Category } from '../enums/category.enum';

export interface Celebrity {
  Assignee: string;
  Name: string;
  Instagram: string;
  ProfileImage: string;
  Twitter: string;
  Iranian: boolean;
  Status: string;
  'Category (Singer, Athlete, etc)': Category;
  'A link to supporting post or tweet': string;
  Note: string;
  'Status Options': string;
}

export const CelebrityKeys = [
  'Assignee',
  'Name',
  'Instagram',
  'ProfileImage',
  'Twitter',
  'Iranian',
  'Status',
  'Category (Singer, Athlete, etc)',
  'A link to supporting post or tweet',
  'Note',
  'Status Options',
];
