'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function ErrorPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error') || 'An unknown error occurred';

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6 mr-2" />
            Error Occurred
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground" role="alert">
            {error}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleGoBack} variant="outline">
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
