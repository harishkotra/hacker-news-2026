import React, { useEffect, useState, useRef, useMemo } from 'react';
import { HNItem, StoryType } from '../types';
import { fetchStoryIds, fetchItems } from '../services/hnApi';
import { StoryCard } from './StoryCard';
import { Loader2, Radio } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';
import { ErrorBoundary } from './ErrorBoundary';

interface StoryListProps {
  type: StoryType;
  onStorySelect: (id: number) => void;
  onUserClick: (userId: string) => void;
  searchTerm: string;
}

const ITEMS_PER_PAGE = 20;

export const StoryList: React.FC<StoryListProps> = ({ type, onStorySelect, onUserClick, searchTerm }) => {
  const [stories, setStories] = useState<HNItem[]>([]);
  const [allIds, setAllIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const { bookmarks, toggleBookmark } = useBookmarks();
  const observerTarget = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const filteredStories = useMemo(() => {
    if (!searchTerm) return stories;
    const term = searchTerm.toLowerCase();
    return stories.filter(story => 
      story.title.toLowerCase().includes(term) || 
      story.by.toLowerCase().includes(term)
    );
  }, [stories, searchTerm]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'j':
          setSelectedIndex(prev => Math.min(prev + 1, filteredStories.length - 1));
          break;
        case 'k':
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'enter':
          if (selectedIndex >= 0 && selectedIndex < filteredStories.length) {
            onStorySelect(filteredStories[selectedIndex].id);
          }
          break;
        case 'b':
          if (selectedIndex >= 0 && selectedIndex < filteredStories.length) {
            toggleBookmark(filteredStories[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredStories, selectedIndex, onStorySelect, toggleBookmark]);

  // Scroll selected into view
  useEffect(() => {
    if (selectedIndex >= 0 && containerRef.current) {
      const selectedElement = containerRef.current.children[selectedIndex + (type !== 'bookmarks' ? 1 : 0)] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedIndex, type]);

  // Initial load
  useEffect(() => {
    if (type === 'bookmarks') {
      setStories(bookmarks);
      setLoading(false);
      setSelectedIndex(-1);
      return;
    }

    const loadInitialStories = async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      try {
        let ids: number[] = [];
        if (type === 'trending') {
          // Fetch top stories and apply hot algorithm
          const topIds = await fetchStoryIds('top');
          const initialIds = topIds.slice(0, 100); // Fetch a good pool for trending
          const items = await fetchItems(initialIds);
          const validItems = items.filter(item => item && !item.deleted && !item.dead);
          
          // Hot algorithm: (score - 1) / (hours_since_submission + 2)^1.8
          const now = Math.floor(Date.now() / 1000);
          const trendingItems = validItems.sort((a, b) => {
            const ageA = (now - a.time) / 3600;
            const ageB = (now - b.time) / 3600;
            const scoreA = (a.score || 0) / Math.pow(ageA + 2, 1.8);
            const scoreB = (b.score || 0) / Math.pow(ageB + 2, 1.8);
            return scoreB - scoreA;
          });
          
          const sortedIds = trendingItems.map(item => item.id);
          setAllIds(sortedIds);
          setStories(trendingItems.slice(0, ITEMS_PER_PAGE));
        } else {
          ids = await fetchStoryIds(type);
          setAllIds(ids);
          const initialIds = ids.slice(0, ITEMS_PER_PAGE);
          const items = await fetchItems(initialIds);
          setStories(items.filter(item => item && !item.deleted && !item.dead));
        }
      } catch (err) {
        setError('Failed to load stories. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialStories();
  }, [type, bookmarks]);

  // Infinite scroll logic
  const loadMore = async () => {
    if (loadingMore || type === 'bookmarks' || stories.length >= allIds.length) return;

    setLoadingMore(true);
    try {
      const nextIds = allIds.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
      const nextItems = await fetchItems(nextIds);
      const validItems = nextItems.filter(item => item && !item.deleted && !item.dead);
      setStories(prev => [...prev, ...validItems]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Failed to load more stories:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, loadingMore, allIds, page, type]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-theme-muted font-medium animate-pulse">Fetching the future of tech...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl max-w-md mx-auto border border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  if (type === 'bookmarks' && stories.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-theme-bg text-theme-muted p-8 rounded-3xl max-w-md mx-auto border border-dashed border-theme-border">
          <p className="font-medium mb-2">No bookmarks yet</p>
          <p className="text-sm">Stories you save will appear here for quick access.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-2 py-4 outline-none">
      {type !== 'bookmarks' && (
        <div className="flex items-center justify-end gap-2 px-4 mb-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            <Radio className="w-3 h-3 text-orange-500 animate-pulse" />
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Live Updates</span>
          </div>
        </div>
      )}
      
      {filteredStories.map((story, index) => (
        <ErrorBoundary key={story.id}>
          <StoryCard 
            story={story} 
            index={index} 
            onSelect={onStorySelect}
            onUserClick={onUserClick}
            isSelected={index === selectedIndex}
          />
        </ErrorBoundary>
      ))}

      {/* Infinite Scroll Trigger */}
      {type !== 'bookmarks' && stories.length < allIds.length && (
        <div ref={observerTarget} className="py-8 flex justify-center">
          {loadingMore && <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />}
        </div>
      )}

      {filteredStories.length === 0 && searchTerm && (
        <div className="text-center py-20 text-theme-muted italic">
          No stories matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};
