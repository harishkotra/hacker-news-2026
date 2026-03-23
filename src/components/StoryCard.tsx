import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, MessageSquare, ArrowBigUp, User, Bookmark, Clock } from 'lucide-react';
import { HNItem } from '../types';
import { getDomain } from '../services/hnApi';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useBookmarks } from '../hooks/useBookmarks';

interface StoryCardProps {
  story: HNItem;
  index: number;
  onSelect: (id: number) => void;
  onUserClick?: (userId: string) => void;
  isSelected?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, index, onSelect, onUserClick, isSelected }) => {
  const domain = getDomain(story.url);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(story.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group relative flex items-start gap-5 p-5 rounded-3xl transition-all cursor-pointer border",
        isSelected 
          ? "bg-theme-card shadow-2xl shadow-orange-500/10 border-orange-500 ring-1 ring-orange-500/20" 
          : "hover:bg-theme-card hover:shadow-2xl hover:shadow-orange-500/5 border-theme-border hover:border-orange-500/20"
      )}
      onClick={() => onSelect(story.id)}
    >
      {/* Upvote Section */}
      <div className="flex flex-col items-center justify-center bg-theme-bg group-hover:bg-orange-500/10 rounded-2xl p-2.5 min-w-[56px] transition-colors border border-theme-border group-hover:border-orange-500/20">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Upvote logic would go here
          }}
          className="p-1 rounded-lg hover:bg-orange-500/20 text-theme-muted hover:text-orange-500 transition-colors"
        >
          <ArrowBigUp className="w-7 h-7" />
        </button>
        <span className="text-sm font-mono font-bold text-theme-muted group-hover:text-orange-500">{story.score || 0}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-theme-muted opacity-50">#{index + 1}</span>
            <span className="px-2 py-0.5 rounded-full bg-theme-bg text-[10px] font-bold text-theme-muted uppercase tracking-widest group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
              {story.type}
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(story);
            }}
            className={cn(
              "p-2 rounded-xl transition-all",
              bookmarked ? "text-orange-500 bg-orange-500/10" : "text-theme-muted hover:text-theme-text hover:bg-theme-bg"
            )}
          >
            <Bookmark className={cn("w-4 h-4", bookmarked && "fill-current")} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <h3 className="text-lg sm:text-xl font-display font-bold text-theme-text leading-tight group-hover:text-orange-500 transition-colors">
            {story.title}
          </h3>
          {domain && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-theme-muted group-hover:text-theme-text transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{domain}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-theme-muted">
          <button 
            onClick={(e) => {
              if (onUserClick) {
                e.stopPropagation();
                onUserClick(story.by);
              }
            }}
            className="flex items-center gap-2 font-bold text-theme-text hover:text-orange-500 transition-colors group/user"
          >
            <User className="w-3.5 h-3.5 text-theme-muted group-hover/user:text-orange-500" />
            @{story.by}
          </button>
          
          <div className="flex items-center gap-2 font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-theme-muted" />
            <span className="text-theme-text">{story.descendants || 0}</span> comments
          </div>
          
          <div className="flex items-center gap-2 text-theme-muted opacity-70">
            <Clock className="w-3.5 h-3.5" />
            {formatDistanceToNow(new Date(story.time * 1000))} ago
          </div>
        </div>
      </div>
    </motion.div>
  );
};
