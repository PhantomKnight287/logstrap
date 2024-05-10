"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_URL, COOKIE_NAME } from "@/constants";
import { readCookie } from "@/lib/cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { HTTPSnippet } from "httpsnippet";

const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter name of the chat." }),
});

export function CreateAPIKeyModal({ projectId }: { projectId: string }) {
  const [modalOpened, setModalOpened] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const { replace, refresh } = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = readCookie(COOKIE_NAME);
    if (!token) replace("/login");
    setLoading(true);

    const req = await fetch(`${API_URL}/api-keys/${projectId}`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    });
    setLoading(false);
    const body = await req.json();
    if (!req.ok) return toast.error(body.message);
    form.reset();
    refresh();
    setModalOpened(false);
  }

  return (
    <>
      <Button
        variant={"secondary"}
        className={"ml-auto"}
        onClick={() => {
          setModalOpened((o) => !o);
        }}
      >
        <Plus />
      </Button>
      <Dialog open={modalOpened} onOpenChange={setModalOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Api Key</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="For Server 1" {...field} />
                    </FormControl>
                    <FormDescription>The name of your key.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col w-full gap-4">
                <Button type="submit" loading={loading}>
                  Create
                </Button>
                <Button
                  type="button"
                  variant={"secondary"}
                  disabled={loading}
                  onClick={() => {
                    if (loading) return;
                    setModalOpened(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ApiUsage() {
  const snippet = useMemo(() => {
    return new HTTPSnippet({
      log: {
        entries: [
          {
            request: {
              method: "POST",
              headers: [
                {
                  name: "X-API-KEY",
                  value: "YOUR API KEY",
                },
              ],
              url: `${API_URL}/logs`,
              postData: {
                text: JSON.stringify({
                  statusCode: "200",
                  path: "/query?message=hi",
                  message: "Failed to authenticate request",
                  requestHeaders: '{Authorization:"Bearer undefined"}',
                  requestBody: "'{}'",
                  responseHeader: "{'x-ratelimit-remaining':20}",
                  responseBody:
                    "'{'message':'Failed to authneticate request'}'",
                  stackTrace: "<stack trace of error>",
                  method: "GET",
                }),
              },
            },
          },
        ],
      },
      postData: {},
    });
  }, []);
  console.log(snippet.convert("javascript", "fetch", { indent: "\t" }));

  return null;
}
