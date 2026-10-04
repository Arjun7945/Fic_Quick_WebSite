import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Ficcado Journal & Chronicles | Ficcado Clothings',
  description:
    'Explore the aesthetic core of Ficcado. Interactive aura canvas, 380 GSM combed cotton science, limited capsule philosophy, and our 2025 founding story.',
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
