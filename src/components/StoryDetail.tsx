import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ArrowLeft, ExternalLink, MessageSquare, Share2, Bookmark, ArrowBigUp, Filter, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { HNItem } from '../types';
import { fetchItem, fetchItems, getDomain } from '../services/hnApi';
import { Comment } from './Comment';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';
import { useBookmarks } from '../hooks/useBookmarks';
import { cn } from '../lib/utils';

interface StoryDetailProps {
  id: number;
  onBack: () => void;
  onUserClick: (userId: string) => void;
}

type SortOption = 'top' | 'newest' | 'oldest' | 'karma';

export const StoryDetail: React.FC<StoryDetailProps> = ({ id, onBack, onUserClick }) => {
  const [story, setStory] = useState<HNItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('top');
  const [comments, setComments] = useState<HNItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentIds, setNewCommentIds] = useState<Set<number>>(new Set());
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [pollInterval, setPollInterval] = useState(30000);
  const [copied, setCopied] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const lastCommentCountRef = useRef<number>(0);
  const pollCountRef = useRef<number>(0);

  useEffect(() => {
    const loadStory = async (isUpdate = false) => {
      if (!isUpdate) setLoading(true);
      try {
        const item = await fetchItem(id);
        
        // If comment count changed, reset poll interval to aggressive
        if (item.descendants !== story?.descendants) {
          setPollInterval(30000);
          pollCountRef.current = 0;
        } else {
          // If no change for 5 polls, start backing off
          pollCountRef.current += 1;
          if (pollCountRef.current > 5) {
            setPollInterval(prev => Math.min(prev * 1.5, 300000)); // Max 5 mins
          }
        }

        setStory(item);
        
        if (item.kids) {
          if (!isUpdate) setLoadingComments(true);
          const fetchedComments = await fetchItems(item.kids.slice(0, 50));
          const validComments = fetchedComments.filter(c => c && !c.deleted && !c.dead);
          
          if (isUpdate && validComments.length > lastCommentCountRef.current) {
            // Find new comments
            const currentIds = new Set(comments.map(c => c.id));
            const newIds = new Set<number>();
            validComments.forEach(c => {
              if (!currentIds.has(c.id)) newIds.add(c.id);
            });
            setNewCommentIds(prev => new Set([...prev, ...newIds]));
          }
          
          setComments(validComments);
          lastCommentCountRef.current = validComments.length;
          if (!isUpdate) setLoadingComments(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isUpdate) setLoading(false);
      }
    };

    loadStory();

    let timeoutId: NodeJS.Timeout;
    const poll = () => {
      timeoutId = setTimeout(async () => {
        await loadStory(true);
        poll();
      }, pollInterval);
    };
    
    poll();

    return () => clearTimeout(timeoutId);
  }, [id, pollInterval]);

  const handleShare = async () => {
    if (!story) return;
    const url = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sortedComments = useMemo(() => {
    const items = [...comments];
    switch (sortBy) {
      case 'newest':
        return items.sort((a, b) => b.time - a.time);
      case 'oldest':
        return items.sort((a, b) => a.time - b.time);
      case 'karma':
        // HN API doesn't give comment karma directly in the item, 
        // but it's often inferred by order. For this demo, we'll use a mix of kids count if available
        return items.sort((a, b) => (b.kids?.length || 0) - (a.kids?.length || 0));
      case 'top':
      default:
        return items; // Default order is usually 'top' from API
    }
  }, [comments, sortBy]);

  if (loading) return null;
  if (!story) return <div>Story not found</div>;

  const domain = getDomain(story.url);
  const bookmarked = isBookmarked(story.id);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-theme-muted hover:text-theme-text transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to feed</span>
      </button>

      <div className="glass-card rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl shadow-orange-500/5">
        <div className="flex items-start gap-6 mb-8">
          <div className="flex flex-col items-center gap-2 bg-theme-bg p-3 rounded-2xl border border-theme-border">
            <button className="p-1 rounded-md hover:bg-orange-500/10 text-theme-muted hover:text-orange-600 transition-colors">
              <ArrowBigUp className="w-8 h-8" />
            </button>
            <span className="text-sm font-mono font-bold text-theme-text">{story.score || 0}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-theme-text leading-tight mb-4">
              {story.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-theme-muted mb-6">
              <span className="font-bold text-theme-text">@{story.by}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(story.time * 1000))} ago</span>
              {domain && (
                <>
                  <span>•</span>
                  <a 
                    href={story.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline flex items-center gap-1 font-medium"
                  >
                    {domain} <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {story.url && (
                <a 
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hn-button bg-theme-text text-theme-bg flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Story
                </a>
              )}
              <button 
                onClick={() => toggleBookmark(story)}
                className={cn(
                  "hn-button flex items-center gap-2 transition-all",
                  bookmarked 
                    ? "bg-orange-500 text-white hover:bg-orange-600" 
                    : "bg-theme-bg text-theme-muted hover:bg-theme-border"
                )}
              >
                <Bookmark className={cn("w-4 h-4", bookmarked && "fill-current")} />
                {bookmarked ? 'Saved' : 'Save'}
              </button>
              <button 
                onClick={handleShare}
                className={cn(
                  "hn-button flex items-center gap-2 transition-all",
                  copied 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : "bg-theme-bg text-theme-muted hover:bg-theme-border"
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>

        {story.text && (
          <div 
            className="prose prose-zinc max-w-none mb-8 p-6 bg-theme-bg text-theme-text rounded-2xl border border-theme-border"
            dangerouslySetInnerHTML={{ __html: story.text }}
          />
        )}
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-theme-border pb-4">
          <h2 className="text-xl font-display font-bold flex items-center gap-2 text-theme-text">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            Discussion
            <motion.span 
              key={story.descendants}
              initial={{ scale: 1.2, color: '#f97316' }}
              animate={{ scale: 1, color: 'var(--muted)' }}
              className="text-sm font-normal"
            >
              ({story.descendants || 0} comments)
            </motion.span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full bg-orange-500",
                pollInterval <= 60000 && "animate-pulse"
              )} />
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                {pollInterval <= 60000 ? 'Live' : 'Polling'}
              </span>
            </div>
            <button 
              onClick={() => setAllCollapsed(!allCollapsed)}
              className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors py-1 px-2 rounded-lg hover:bg-orange-500/10"
            >
              {allCollapsed ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Expand All
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Collapse All
                </>
              )}
            </button>
            <div className="h-4 w-px bg-theme-border" />
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-theme-muted" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer text-theme-muted hover:text-theme-text"
              >
                <option value="top">Top Comments</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="karma">Most Replies</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {loadingComments ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {sortedComments.map(comment => (
                <Comment 
                  key={comment.id} 
                  id={comment.id} 
                  onUserClick={onUserClick}
                  isNew={newCommentIds.has(comment.id)}
                  forceCollapsed={allCollapsed}
                />
              ))}
              {(!story.kids || story.kids.length === 0) && (
                <div className="text-center py-12 text-theme-muted italic">
                  No comments yet. Be the first to start the conversation.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
