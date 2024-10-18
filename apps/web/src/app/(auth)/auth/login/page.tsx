import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Metadata } from 'next';
import LoginClientPage from './page.client';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" aria-label="Go back">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <LoginClientPage />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to continue',
};
