
// 2. components/Layout.js
import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from './ui/mode-toggle';
import { Github } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <ThemeProvider defaultTheme="dark" attribute="class">
            <div className="min-h-screen bg-background">
                <header className="border-b">
                    <div className="container flex items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">YT Explorer</span>
                        </div>
                        <div className="flex justify-center mt-4 mb-8">
                            <Link href="/docs" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Documentation
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/mistermath0/youtube-explorer"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            >
                                <Github size={20} />
                            </a>
                            <ModeToggle />
                        </div>
                    </div>
                </header>
                <main>{children}</main>
                <footer className="border-t py-6 md:py-0">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} YouTube Explorer. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </ThemeProvider>
    );
};

export default Layout;