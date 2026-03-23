import React, { useState } from 'react';
import { Terminal, TrendingUp, Clock, MessageSquare, Zap, Search, Bookmark, Palette, Type, Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import { StoryType } from '../types';
import { useTheme, Theme, Font } from '../hooks/useTheme';

interface NavbarProps {
  activeTab: StoryType;
  onTabChange: (tab: StoryType) => void;
  onSearchChange: (searchTerm: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onSearchChange }) => {
  const { theme, setTheme, font, setFont } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const tabs: { id: StoryType; label: string; icon: React.ReactNode }[] = [
    { id: 'trending', label: 'Trending', icon: <Flame className="w-4 h-4" /> },
    { id: 'top', label: 'Top', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'new', label: 'New', icon: <Clock className="w-4 h-4" /> },
    { id: 'show', label: 'Show', icon: <Zap className="w-4 h-4" /> },
    { id: 'ask', label: 'Ask', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'job', label: 'Jobs', icon: <Terminal className="w-4 h-4" /> },
    { id: 'bookmarks', label: 'Saved', icon: <Bookmark className="w-4 h-4" /> },
  ];

  const themes: { id: Theme; label: string; color: string }[] = [
    { id: 'light', label: 'Light', color: 'bg-white' },
    { id: 'dark', label: 'Dark', color: 'bg-zinc-900' },
    { id: 'sepia', label: 'Sepia', color: 'bg-[#f4ecd8]' },
    { id: 'high-contrast', label: 'Contrast', color: 'bg-black border border-white' },
  ];

  const fonts: { id: Font; label: string }[] = [
    { id: 'sans', label: 'Sans' },
    { id: 'serif', label: 'Serif' },
    { id: 'outfit', label: 'Outfit' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-theme-border px-4 py-3 transition-colors duration-300">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onTabChange('trending')}
          >
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              Y
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:block text-theme-text">
              HN <span className="text-orange-500">2026</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-theme-text text-theme-bg shadow-md" 
                    : "text-theme-muted hover:bg-theme-bg hover:text-theme-text"
                )}
              >
                {tab.icon}
                <span className="hidden lg:block">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
            <input 
              type="text" 
              placeholder="Search stories..." 
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-theme-bg text-theme-text border-none rounded-full pl-9 pr-4 py-1.5 text-sm w-48 focus:ring-2 focus:ring-orange-500/20 focus:w-64 transition-all outline-none"
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                showSettings ? "bg-orange-500 text-white" : "bg-theme-bg text-theme-muted hover:bg-theme-border"
              )}
            >
              <Palette className="w-4 h-4" />
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl p-4 shadow-xl border border-theme-border animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-theme-muted uppercase tracking-widest">
                      <Palette className="w-3 h-3" />
                      Theme
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            theme === t.id 
                              ? "border-orange-500 bg-orange-500/10 text-orange-600" 
                              : "border-theme-border hover:border-theme-muted text-theme-text"
                          )}
                        >
                          <div className={cn("w-3 h-3 rounded-full", t.color)} />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-theme-muted uppercase tracking-widest">
                      <Type className="w-3 h-3" />
                      Typography
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {fonts.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFont(f.id)}
                          className={cn(
                            "px-2 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            font === f.id 
                              ? "border-orange-500 bg-orange-500/10 text-orange-600" 
                              : "border-theme-border hover:border-theme-muted text-theme-text"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="w-8 h-8 rounded-full bg-theme-bg flex items-center justify-center text-theme-muted hover:bg-theme-border transition-colors">
            <span className="text-xs font-bold">JD</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
