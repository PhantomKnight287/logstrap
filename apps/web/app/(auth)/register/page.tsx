import { Metadata } from "next";
import { RegisterForm } from "./page.client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account to start using LogsTrap",
};
export default function Register() {
  const cookiesStore = cookies();
  const token = cookiesStore.get(COOKIE_NAME);
  if (token?.value) return redirect("/");
  return (
    <div className="container flex min-h-screen h-screen w-screen flex-col items-center justify-center bg-background">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <ChevronLeft className="me-2 h-4 w-4" />
        Home
      </Link>

      <RegisterForm />
    </div>
  );
}
