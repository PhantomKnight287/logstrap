'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNewApiKeySchema } from './schema';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { readCookie } from '@/utils/cookie';
import { COOKIE_NAME } from '@/constants';
import { useRouter } from 'next/navigation';
import { Redirects } from '@/constants/redirects';
import { Textarea } from '@/components/ui/textarea';
import useFetchUser from '@/hooks/use-fetch-user';
import { purgeCache } from '@/lib/revalidate';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import useClipboard from '@/hooks/use-clipboard';
import { Check, Copy } from 'lucide-react';

export default function CreateNewApiKeyClient({ id }: { id: string }) {
  const { replace } = useRouter();
  const { loading, toggle } = useLoading();
  const { user } = useFetchUser();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { copied, copy } = useClipboard();
  const form = useForm<z.infer<typeof createNewApiKeySchema>>({
    resolver: zodResolver(createNewApiKeySchema),
    defaultValues: {
      name: '',
      mode: 'test',
    },
  });

  async function onSubmit(values: z.infer<typeof createNewApiKeySchema>) {
    try {
      const token = readCookie(COOKIE_NAME);
      toggle(true);
      const req = await client.POST('/projects/{id}/keys', {
        body: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          path: {
            id,
          },
        },
      });
      if (req.error) {
        toast.error(req.error.message);
        toggle();
        return;
      }
      toast.success(`New Key Created`);
      await purgeCache(`api-keys::${id}`);
      toggle();
      setApiKey(req.data.key);
    } catch (e) {
      toggle();
      toast.error((e as Error)?.message);
    }
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Create API Key
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
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a key mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                    {field.value == 'live' && !user?.emailVerified ? (
                      <p className="text-sm text-muted-foreground">
                        Generating keys for live mode requires your email to be
                        verified.
                      </p>
                    ) : null}
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
                        placeholder="Describe this api key(optional)"
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
        {apiKey != null ? (
          <Alert className="mt-6">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle className="leading-4">
              Make sure to copy your key now as you will not be able to see it
              again.
            </AlertTitle>
            <AlertDescription>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-1 justify-center">
                  <Input disabled value={apiKey!} />
                  <Button
                    variant={'secondary'}
                    onClick={() => {
                      copy(apiKey!);
                    }}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    replace(`${Redirects.AFTER_PROJECT_CREATED(id)}/keys`);
                  }}
                  variant={'outline'}
                >
                  I&apos;ve copied my key
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
