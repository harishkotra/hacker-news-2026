import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';
import { User, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { HNItem, HNUser } from '../types';
import { fetchItem, fetchItems } from '../services/hnApi';
import { cn } from '../lib/utils';

interface CommentProps {
  id: number;
  depth?: number;
  onUserClick: (userId: string) => void;
  isNew?: boolean;
  forceCollapsed?: boolean;
}

export const Comment: React.FC<CommentProps> = ({ id, depth = 0, onUserClick, isNew, forceCollapsed }) => {
  const [comment, setComment] = useState<HNItem | null>(null);
  const [replies, setReplies] = useState<HNItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (forceCollapsed !== undefined) {
      setCollapsed(forceCollapsed);
    }
  }, [forceCollapsed]);

  useEffect(() => {
    const loadComment = async () => {
      try {
        const item = await fetchItem(id);
        setComment(item);
      } finally {
        setLoading(false);
      }
    };
    loadComment();
  }, [id]);

  const loadReplies = async () => {
    if (comment?.kids && replies.length === 0) {
      const items = await fetchItems(comment.kids.slice(0, 10)); // Increased limit
      setReplies(items.filter(i => i && !i.deleted && !i.dead));
    }
  };

  if (loading || !comment || comment.deleted || comment.dead) return null;

  return (
    <motion.div 
      initial={isNew ? { backgroundColor: 'rgba(249, 115, 22, 0.05)', opacity: 0 } : { opacity: 0 }}
      animate={isNew ? { backgroundColor: 'rgba(249, 115, 22, 0)', opacity: 1 } : { opacity: 1 }}
      transition={{ 
        opacity: { duration: 0.5 },
        backgroundColor: { duration: 3, delay: 1 }
      }}
      className={cn(
        "relative pl-4 sm:pl-6 border-l-2 transition-colors",
        isNew ? "border-orange-500 rounded-r-xl" : "border-theme-border hover:border-orange-500/30",
        depth > 0 ? "mt-4" : "mt-6"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-theme-bg text-theme-muted transition-colors"
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => onUserClick(comment.by)}
          className="flex items-center gap-1.5 text-xs font-bold text-theme-text hover:text-orange-500 transition-colors group"
        >
          <User className="w-3.5 h-3.5 text-theme-muted group-hover:text-orange-500" />
          {comment.by}
        </button>
        <span className="text-[10px] text-theme-muted uppercase tracking-tighter font-medium">
          {formatDistanceToNow(new Date(comment.time * 1000))} ago
        </span>
        {isNew && (
          <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[8px] font-bold uppercase tracking-widest animate-pulse">
            New
          </span>
        )}
      </div>

      {!collapsed && (
        <>
          <div 
            className="text-sm text-theme-text leading-relaxed prose prose-sm max-w-none prose-zinc prose-p:my-2 prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: comment.text || '' }}
          />
          
          {comment.kids && comment.kids.length > 0 && (
            <div className="mt-4">
              {replies.length === 0 ? (
                <button 
                  onClick={loadReplies}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-orange-500/10 transition-all"
                >
                  <MessageSquare className="w-3 h-3" />
                  Show {comment.kids.length} replies
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  {replies.map(reply => (
                    <Comment 
                      key={reply.id} 
                      id={reply.id} 
                      depth={depth + 1} 
                      onUserClick={onUserClick}
                      forceCollapsed={forceCollapsed}
                    />
                  ))}
                  {comment.kids.length > replies.length && (
                    <button 
                      onClick={loadReplies}
                      className="text-xs text-theme-muted italic hover:text-orange-500 transition-colors ml-4"
                    >
                      + {comment.kids.length - replies.length} more replies
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
