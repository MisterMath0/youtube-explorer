import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'YouTube Explorer',
  description: 'Extract YouTube channel information, videos, and transcripts with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider 
          defaultTheme="dark" 
          attribute="class"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}