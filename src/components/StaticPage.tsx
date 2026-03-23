import React from 'react';
import { motion } from 'motion/react';
import { STATIC_PAGES } from '../constants/staticPages';
import { ArrowLeft, Shield, BookOpen, HelpCircle, List, Scale } from 'lucide-react';

interface StaticPageProps {
  pageId: 'guidelines' | 'faq' | 'lists' | 'security' | 'legal';
  onBack: () => void;
}

export const StaticPage: React.FC<StaticPageProps> = ({ pageId, onBack }) => {
  const page = STATIC_PAGES[pageId];

  const getIcon = () => {
    switch (pageId) {
      case 'guidelines': return <BookOpen className="w-8 h-8 text-orange-500" />;
      case 'faq': return <HelpCircle className="w-8 h-8 text-orange-500" />;
      case 'lists': return <List className="w-8 h-8 text-orange-500" />;
      case 'security': return <Shield className="w-8 h-8 text-orange-500" />;
      case 'legal': return <Scale className="w-8 h-8 text-orange-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-4"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-theme-muted hover:text-theme-text transition-colors mb-12 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Back</span>
      </button>

      <header className="mb-16 text-center">
        <div className="inline-flex p-4 rounded-3xl bg-orange-500/10 mb-6 border border-orange-500/20 shadow-sm">
          {getIcon()}
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-theme-text mb-4 tracking-tight">
          {page.title}
        </h1>
        <p className="text-theme-muted text-lg font-medium">
          {page.subtitle}
        </p>
      </header>

      <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-orange-500/5">
        <div 
          className="prose prose-zinc prose-lg max-w-none 
            prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
            prose-p:text-theme-muted prose-p:leading-relaxed
            prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-theme-text"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>

      <footer className="mt-16 text-center">
        <p className="text-sm text-theme-muted font-medium">
          Last updated: March 2026
        </p>
      </footer>
    </motion.div>
  );
};
