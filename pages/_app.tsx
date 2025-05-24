import '../styles/globals.css';
import { useEffect } from 'react';

interface HomeProps {
  systemConfig: any;
  nextVersion: string;
  codeReportTotals: { totalFiles: number; totalLines: number };
}

export default function App({ Component, pageProps }: { Component: React.ComponentType<any>; pageProps: any }) {
  // Ensure the default theme is set on the client after hydration
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light'); // Match the SSR default
  }, []);
  return <Component {...pageProps} />;
}