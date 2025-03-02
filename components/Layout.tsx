import React from 'react';
import Link from 'next/link';
import { BookOpen, Github, Youtube } from 'lucide-react';
import { ModeToggle } from './ui/mode-toggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
          <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
            <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5" />
                <span className="font-semibold text-lg tracking-tight">YT Explorer</span>
              </div>
              
              <div className="hidden md:flex">
                <Link href="/docs" className="flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/mistermath0/youtube-explorer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="GitHub Repository"
                >
                  <Github size={18} className="text-muted-foreground" />
                </a>
                <ModeToggle />
              </div>
            </div>
          </header>
          
          <main>{children}</main>
          
          <footer className="border-t border-border py-6 bg-background">
            <div className="container max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} YouTube Explorer. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      );
};
export default Layout;