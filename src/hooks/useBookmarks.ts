import { useState, useEffect } from 'react';
import { HNItem } from '../types';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<HNItem[]>(() => {
    const saved = localStorage.getItem('hn_bookmarks_2026');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hn_bookmarks_2026', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (item: HNItem) => {
    setBookmarks((prev) => {
      if (prev.find((b) => b.id === item.id)) return prev;
      return [item, ...prev];
    });
  };

  const removeBookmark = (id: number) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const isBookmarked = (id: number) => {
    return bookmarks.some((b) => b.id === id);
  };

  const toggleBookmark = (item: HNItem) => {
    if (isBookmarked(item.id)) {
      removeBookmark(item.id);
    } else {
      addBookmark(item);
    }
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark };
}
