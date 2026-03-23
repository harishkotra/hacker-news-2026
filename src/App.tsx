import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StoryList } from './components/StoryList';
import { StoryDetail } from './components/StoryDetail';
import { StaticPage } from './components/StaticPage';
import { UserProfile } from './components/UserProfile';
import { StoryType, PageType } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<StoryType>('top');
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeStaticPage, setActiveStaticPage] = useState<'guidelines' | 'faq' | 'lists' | 'security' | 'legal' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle browser back button (simple)
  useEffect(() => {
    const handlePopState = () => {
      if (selectedUserId) {
        setSelectedUserId(null);
      } else if (selectedStoryId) {
        setSelectedStoryId(null);
      } else if (activeStaticPage) {
        setActiveStaticPage(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedStoryId, activeStaticPage, selectedUserId]);

  const handleStorySelect = (id: number) => {
    setSelectedStoryId(id);
    setSelectedUserId(null);
    setActiveStaticPage(null);
    window.history.pushState({ storyId: id }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    window.history.pushState({ userId }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStaticPageSelect = (page: 'guidelines' | 'faq' | 'lists' | 'security' | 'legal') => {
    setActiveStaticPage(page);
    setSelectedStoryId(null);
    setSelectedUserId(null);
    window.history.pushState({ page }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedUserId) setSelectedUserId(null);
    else if (selectedStoryId) setSelectedStoryId(null);
    else if (activeStaticPage) setActiveStaticPage(null);
    window.history.back();
  };

  const handleTabChange = (tab: StoryType) => {
    setActiveTab(tab);
    setSelectedStoryId(null);
    setSelectedUserId(null);
    setActiveStaticPage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg text-theme-text selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onSearchChange={setSearchTerm}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedUserId ? (
            <UserProfile 
              key="user"
              userId={selectedUserId}
              onBack={handleBack}
              onStorySelect={handleStorySelect}
            />
          ) : selectedStoryId ? (
            <StoryDetail 
              key="detail" 
              id={selectedStoryId} 
              onBack={handleBack} 
              onUserClick={handleUserClick}
            />
          ) : activeStaticPage ? (
            <StaticPage 
              key="static"
              pageId={activeStaticPage}
              onBack={handleBack}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-theme-border" />
                  <span className="text-[10px] font-mono font-bold text-theme-muted uppercase tracking-[0.3em]">
                    The Front Page of the Future
                  </span>
                  <div className="h-px flex-1 bg-theme-border" />
                </div>
                <h1 className="text-4xl sm:text-6xl font-display font-bold text-theme-text tracking-tight text-center">
                  Hacker News <span className="text-orange-500">2026</span>
                </h1>
                <p className="text-theme-muted text-center mt-4 max-w-xl mx-auto font-medium">
                  A high-performance interface for the world's most influential tech community.
                  Built for speed, clarity, and the next decade of innovation.
                </p>
              </header>

              <StoryList 
                type={activeTab} 
                onStorySelect={handleStorySelect} 
                onUserClick={handleUserClick}
                searchTerm={searchTerm}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-theme-border bg-theme-card py-12 px-4 mt-20 transition-colors duration-300">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs">
                Y
              </div>
              <span className="font-display font-bold text-lg">HN 2026</span>
            </div>
            <p className="text-sm text-theme-muted leading-relaxed">
              Reimagining the Hacker News experience with modern web standards and a focus on readability.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-theme-muted">Official</h4>
              <ul className="text-sm text-theme-text space-y-2 opacity-80">
                <li><button onClick={() => handleStaticPageSelect('guidelines')} className="hover:text-orange-500 transition-colors text-left w-full">Guidelines</button></li>
                <li><button onClick={() => handleStaticPageSelect('faq')} className="hover:text-orange-500 transition-colors text-left w-full">FAQ</button></li>
                <li><button onClick={() => handleStaticPageSelect('lists')} className="hover:text-orange-500 transition-colors text-left w-full">Lists</button></li>
                <li><a href="https://github.com/HackerNews/API" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">API</a></li>
                <li><button onClick={() => handleStaticPageSelect('security')} className="hover:text-orange-500 transition-colors text-left w-full">Security</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-theme-muted">Legal & Contact</h4>
              <ul className="text-sm text-theme-text space-y-2 opacity-80">
                <li><button onClick={() => handleStaticPageSelect('legal')} className="hover:text-orange-500 transition-colors text-left w-full">Legal</button></li>
                <li><a href="https://www.ycombinator.com/apply/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">Apply to YC</a></li>
                <li><a href="mailto:hn@ycombinator.com" className="hover:text-orange-500 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-theme-muted">Connect</h4>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com/ycombinator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-theme-bg text-theme-muted hover:bg-orange-500 hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com/HackerNews" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-theme-bg text-theme-muted hover:bg-orange-500 hover:text-white transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="mailto:hn@ycombinator.com" className="p-2 rounded-full bg-theme-bg text-theme-muted hover:bg-orange-500 hover:text-white transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <div className="pt-4">
              <p className="text-[10px] text-theme-muted font-mono">
                &copy; 2026 HN REBUILD PROTOTYPE. <br />
                POWERED BY Y COMBINATOR API.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
