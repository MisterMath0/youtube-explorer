import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';

function YoutubeExplorer({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default YoutubeExplorer;