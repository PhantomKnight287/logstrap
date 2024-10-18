'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNewProjectSchema } from './schema';
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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { readCookie } from '@/utils/cookie';
import { COOKIE_NAME } from '@/constants';
import { useRouter } from 'next/navigation';
import { Redirects } from '@/constants/redirects';
import { Textarea } from '@/components/ui/textarea';

export default function CreateNewProjectClient() {
  const { replace } = useRouter();
  const { loading, toggle } = useLoading();

  const form = useForm<z.infer<typeof createNewProjectSchema>>({
    resolver: zodResolver(createNewProjectSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof createNewProjectSchema>) {
    const token = readCookie(COOKIE_NAME);
    toggle(true);
    const req = await client.POST('/projects', {
      body: values,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (req.error) {
      toast.error(req.error.message);
      toggle();
      return;
    }
    toast.success(`New Project Created`);
    toggle();
    replace(Redirects.AFTER_PROJECT_CREATED(req.data.id));
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Lets create your project
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A nice project"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A project that I will never abandon"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Url of your project"
                        type="url"
                        {...field}
                      />
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
              Create
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
