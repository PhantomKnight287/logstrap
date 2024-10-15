import { Metadata } from 'next';
import ErrorPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Error',
  description: 'An error occurred',
};

export default function ErrorPage() {
  return <ErrorPageClient />;
}
