# Hacker News 2026 🚀

A modern, high-performance, and highly customizable Hacker News client built for the next generation of tech enthusiasts.


### Screenshots

<img width="1309" height="1286" alt="Screenshot at Mar 23 19-01-48" src="https://github.com/user-attachments/assets/2dbbae53-2b6d-4030-be0c-ed83cda31027" />
<img width="1347" height="1251" alt="Screenshot at Mar 23 19-02-13" src="https://github.com/user-attachments/assets/2f1416e0-7f12-4eb9-a311-4341b17de9ee" />
<img width="1340" height="1239" alt="Screenshot at Mar 23 19-02-24" src="https://github.com/user-attachments/assets/ca365790-14b6-4c08-9ded-1066b8def9b8" />
<img width="1267" height="1247" alt="Screenshot at Mar 23 19-02-40" src="https://github.com/user-attachments/assets/27d68e69-24f1-483c-acf0-0c4cd401a48b" />
<img width="1265" height="1245" alt="Screenshot at Mar 23 19-02-51" src="https://github.com/user-attachments/assets/05cec97e-dbdc-45e1-b5b4-bfc7c5d97bd0" />
<img width="1322" height="1246" alt="Screenshot at Mar 23 19-03-02" src="https://github.com/user-attachments/assets/038bc2f8-0e80-4f2b-ab56-c7a7a98f714d" />
<img width="1175" height="1244" alt="Screenshot at Mar 23 19-03-57" src="https://github.com/user-attachments/assets/66ab0da3-e3b8-4099-8af9-786c987cd46a" />

## Why I Built This

Hacker News is the heartbeat of the tech world, but its interface hasn't changed much in decades. I wanted to create a reading experience that respects the original's simplicity while embracing modern web standards. **Hacker News 2026** is my vision of a "pro" reading environment—fast, accessible, and deeply customizable.

I focused on three core pillars:
1. **Readability**: Multiple themes (Sepia, High Contrast) and font choices (Serif, Outfit) to reduce eye strain.
2. **Efficiency**: Keyboard-first navigation (`J`/`K` to move, `Enter` to open) for power users.
3. **Real-time**: Intelligent polling that keeps you updated on trending discussions without refreshing.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite (for near-instant HMR and optimized builds)
- **Styling**: Tailwind CSS (Utility-first, theme-aware)
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Data Fetching**: Hacker News Firebase API (via custom service layer)

## Architecture

The project follows a clean, modular architecture:

```mermaid
graph TD
    App[App.tsx] --> Nav[Navbar]
    App --> List[StoryList]
    App --> Detail[StoryDetail]
    App --> Profile[UserProfile]
    
    List --> Card[StoryCard]
    Detail --> Comment[Comment Component]
    
    Hooks[Custom Hooks] --> Bookmarks[useBookmarks]
    Hooks --> Theme[useTheme]
    
    Services[Services] --> API[hnApi.ts]
```

### Key Components

- **`StoryList`**: Handles infinite scrolling, keyboard navigation logic, and real-time polling.
- **`StoryDetail`**: Manages complex comment trees and real-time updates for active discussions.
- **`ThemeContext`**: A robust system that injects CSS variables globally for instant mode switching.

## Features

- 🌓 **4 Distinct Themes**: Light, Dark, Sepia, and High Contrast.
- 🔡 **Font Customization**: Choose between Sans, Serif, and the modern Outfit font.
- ⌨️ **Keyboard Shortcuts**:
  - `J` / `K`: Navigate stories
  - `Enter`: Open story
  - `B`: Toggle bookmark
- 📊 **User Insights**: Detailed stats for every HN user, including karma and submission breakdowns.
- 🔖 **Local Bookmarks**: Save stories for later, persisted in your browser.
- 🔄 **Smart Polling**: Automatically fetches new comments and updates scores.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/harishkotra/hacker-news-2026.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

I'd love to see this project grow! Here are some ideas for features you could add:

- [ ] **Search Integration**: Add Algolia-powered search for historical stories.
- [ ] **Offline Support**: Implement a Service Worker for PWA capabilities.
- [ ] **User Mentions**: Highlight mentions in comment threads.
- [ ] **Custom Filters**: Filter stories by domain or minimum score.

### How to Contribute

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request

Inspired by [https://x.com/MakerThrive/status/2035533184176144475](https://x.com/MakerThrive/status/2035533184176144475)
