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
import { Textarea } from "@/components/ui/textarea";
import { API_URL, COOKIE_NAME } from "@/constants";
import { readCookie } from "@/lib/cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCirclePlus, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter name of the chat." }),
  description: z.string().optional(),
});

export function CreateProjectModal() {
  const [modalOpened, setModalOpened] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const { replace } = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = readCookie(COOKIE_NAME);
    if (!token) replace("/login");
    setLoading(true);

    const req = await fetch(`${API_URL}/projects`, {
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
    form.reset()
    replace(`/projects/${body.id}`);
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
            <DialogTitle>Create New Project</DialogTitle>
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
                      <Input placeholder="Side Project" {...field} />
                    </FormControl>
                    <FormDescription>The name of your project.</FormDescription>
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
                        placeholder="Projec to learn xyz..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Description of your project
                    </FormDescription>
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
