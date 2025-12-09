import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A showcase of professional projects, personal experiments, and open-source contributions spanning product management, development, and business solutions.',
  keywords: 'projects, portfolio, software development, product management, business solutions, web applications',
  openGraph: {
    title: 'Projects',
    description: 'Explore my portfolio of impactful projects and technical solutions.',
    type: 'profile',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}