import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import RegisterClientPage from './page.client';

export default function RegisterPage() {
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
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Lets get you started
            </CardTitle>
            <CardDescription className="text-center">
              Please enter your details to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterClientPage />
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Register
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an account to get started',
};
