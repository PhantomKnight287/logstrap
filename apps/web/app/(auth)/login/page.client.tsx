"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { API_URL, COOKIE_NAME } from "@/constants";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { createCookie } from "@/lib/cookie";
import { useRouter } from "next/navigation";
import { useUser } from "@/state/user";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1, { message: "Please enter a username" }),
  password: z.string().min(8, { message: "Too short password." }),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const { replace } = useRouter();
  const { setUser } = useUser();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const req = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(values),
    });
    setLoading(false);
    const body = await req.json();
    if (!req.ok) {
      return toast.error(getErrorMessage(body.message));
    }
    createCookie(COOKIE_NAME, body.token, 365);
    setUser(body.user);
    toast(`Welcome ${body.user.name}`);
    replace("/");
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Login
            </Button>

            <div className="mt-4 text-center text-sm">
              Dont have an account?{" "}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
