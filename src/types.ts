export interface HNItem {
  id: number;
  deleted?: boolean;
  type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  by: string;
  time: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export interface HNUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

export type StoryType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job' | 'bookmarks' | 'trending';
export type PageType = StoryType | 'guidelines' | 'faq' | 'lists' | 'security' | 'legal';
