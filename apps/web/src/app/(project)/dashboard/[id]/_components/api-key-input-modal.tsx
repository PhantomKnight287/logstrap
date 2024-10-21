'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { client } from '@/lib/api';
import toast from 'react-hot-toast';
import { createCookie, generateKeyCookieName } from '@/utils/cookie';

const schema = z.object({
  apiKey: z
    .string()
    .min(1, { message: 'Please enter an API Key' })
    .startsWith('key_', { message: 'API Key must start with "key_" prefix' }),
});

export function ApiKeyInputModal({
  open,
  projectId,
  authToken,
}: {
  open: boolean;
  projectId: string;
  authToken: string;
}) {
  const [isOpen, setIsOpen] = useState(open);
  const [isVerifying, setIsVerifying] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      apiKey: '',
    },
  });
  async function onSubmit(data: z.infer<typeof schema>) {
    setIsVerifying(true);
    const req = await client.POST('/projects/{id}/keys/verify', {
      params: {
        path: {
          id: projectId,
        },
      },
      body: {
        key: data.apiKey,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    setIsVerifying(false);
    if (req.error) {
      toast.error(req.error.message);
    } else {
      createCookie(
        generateKeyCookieName(projectId, req.data.id),
        data.apiKey,
        365,
      );
      setIsOpen(false);
      window.location.reload();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter API Key</DialogTitle>
          <DialogDescription>
            Enter the API key to decrypt the request body
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="key_..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isVerifying}
              loading={isVerifying}
            >
              Verify
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
