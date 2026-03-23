import React, { useEffect, useState } from 'react';
import { HNUser, HNItem } from '../types';
import { fetchUser, fetchItems } from '../services/hnApi';
import { StoryCard } from './StoryCard';
import { ArrowLeft, User, Award, Calendar, Loader2, FileText, MessageSquare, BarChart3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface UserProfileProps {
  userId: string;
  onBack: () => void;
  onStorySelect: (id: number) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onBack, onStorySelect }) => {
  const [user, setUser] = useState<HNUser | null>(null);
  const [submissions, setSubmissions] = useState<HNItem[]>([]);
  const [filterType, setFilterType] = useState<string>('story');
  const [loading, setLoading] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [stats, setStats] = useState({ stories: 0, comments: 0, polls: 0, jobs: 0 });

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const userData = await fetchUser(userId);
        setUser(userData);
        
        if (userData.submitted && userData.submitted.length > 0) {
          setLoadingSubmissions(true);
          // Fetch a larger batch for better stats (up to 100)
          const items = await fetchItems(userData.submitted.slice(0, 100));
          const validItems = items.filter(i => i && !i.deleted && !i.dead);
          setSubmissions(validItems);
          
          // Calculate stats from the fetched batch
          const newStats = validItems.reduce((acc, item) => {
            if (item.type === 'story') acc.stories++;
            else if (item.type === 'comment') acc.comments++;
            else if (item.type === 'poll') acc.polls++;
            else if (item.type === 'job') acc.jobs++;
            return acc;
          }, { stories: 0, comments: 0, polls: 0, jobs: 0 });
          setStats(newStats);
          
          setLoadingSubmissions(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  const filteredSubmissions = submissions.filter(s => s.type === filterType);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-theme-muted font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!user) return <div className="text-center py-20 text-theme-text">User not found</div>;

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
        <span className="text-sm font-bold uppercase tracking-widest">Back</span>
      </button>

      <div className="glass-card rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl shadow-orange-500/5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
          <div className="w-24 h-24 bg-orange-500/10 rounded-3xl flex items-center justify-center border border-orange-500/20 shadow-inner">
            <User className="w-12 h-12 text-orange-500" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-theme-text mb-6">
              {user.id}
            </h1>
            
            {user.about && (
              <div 
                className="prose prose-zinc prose-sm max-w-none p-6 bg-theme-bg text-theme-text rounded-2xl border border-theme-border mb-8"
                dangerouslySetInnerHTML={{ __html: user.about }}
              />
            )}

            {/* Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border flex flex-col items-center gap-1">
                <BarChart3 className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-xl font-display font-bold text-theme-text">
                  {user.submitted?.length || 0}
                </span>
                <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest text-center">
                  Submissions
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border flex flex-col items-center gap-1">
                <FileText className="w-5 h-5 text-blue-500 mb-1" />
                <span className="text-xl font-display font-bold text-theme-text">
                  {stats.stories}
                </span>
                <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest text-center">
                  Stories
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border flex flex-col items-center gap-1">
                <MessageSquare className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="text-xl font-display font-bold text-theme-text">
                  {stats.comments}
                </span>
                <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest text-center">
                  Comments
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border flex flex-col items-center gap-1">
                <Award className="w-5 h-5 text-purple-500 mb-1" />
                <span className="text-xl font-display font-bold text-theme-text">
                  {user.karma.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest text-center">
                  Karma
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border flex flex-col items-center gap-1 col-span-2 sm:col-span-1">
                <Calendar className="w-5 h-5 text-zinc-400 mb-1" />
                <span className="text-xs font-display font-bold text-theme-text text-center">
                  {formatDistanceToNow(new Date(user.created * 1000))} ago
                </span>
                <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest text-center">
                  Joined
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-theme-border pb-4 gap-4">
          <h2 className="text-xl font-display font-bold text-theme-text">
            Recent Submissions
          </h2>
          
          <div className="flex items-center gap-2 bg-theme-bg p-1 rounded-xl border border-theme-border">
            {['story', 'poll', 'job', 'comment'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                  filterType === type 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-theme-muted hover:text-theme-text"
                )}
              >
                {type}s
              </button>
            ))}
          </div>
        </div>
        
        {loadingSubmissions ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredSubmissions.map((story, index) => (
              <StoryCard 
                key={story.id} 
                story={story} 
                index={index} 
                onSelect={onStorySelect}
              />
            ))}
            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12 text-theme-muted italic">
                No recent {filterType} submissions found.
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
