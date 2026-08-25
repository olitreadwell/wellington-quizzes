import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wellington Quizzes',
  description:
    'Every pub quiz around Wellington on one calendar — venues, times, details, and map links.',
};

/**
 * Root layout: wraps every route in the HTML shell.
 *
 * @param props - Layout props
 * @param props.children - Rendered route content
 * @returns The root HTML document
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
