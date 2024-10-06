'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import useLoading from '@/hooks/use-loading';
import { client } from '@/lib/api';
import toast from 'react-hot-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/state/user';
import { createCookie } from '@/utils/cookie';
import { COOKIE_NAME } from '@/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Redirects } from '@/constants/redirects';

export default function LoginClientPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, toggle } = useLoading();
  const search = useSearchParams();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { setUser } = useUser();
  const { replace } = useRouter();
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    toggle(true);
    const req = await client.POST('/auth/login', {
      body: values,
    });
    if (req.error) {
      toast.error(req.error.message);
      toggle();
      return;
    }
    setUser(req.data.user);
    toast.success(`Welcome ${req.data.user.name}`);
    createCookie(COOKIE_NAME, req.data.token, 30);
    toggle();
    replace(search?.get('to') ?? Redirects.AFTER_AUTH);
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Lets sign you in
        </CardTitle>
        <CardDescription className="text-center">
          Please enter your details to login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@mail.com"
                        type="email"
                        inputMode="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="johndoe@mail.com"
                          type={showPassword ? 'text' : 'password'}
                          inputMode="text"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={togglePasswordVisibility}
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className="w-full mt-4"
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Register
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Dont have an account?{' '}
            <Link href="/auth/register" className="underline">
              Register
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
