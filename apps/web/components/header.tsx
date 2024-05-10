"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import Link from "next/link";
import {
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenu,
} from "@/components/ui/navigation-menu";
import { ComponentProps, useEffect } from "react";
import { ScrollText, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUser } from "@/state/user";
import { readCookie } from "@/lib/cookie";
import { API_URL, COOKIE_NAME } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const pathname = usePathname();
  const { user, setUser } = useUser();

  async function fetchUser(token: string) {
    const req = await fetch(`${API_URL}/auth/hydrate`, {
      body: undefined,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!req.ok) {
      return;
    } else {
      const body = await req.json();
      setUser(body);
    }
  }

  useEffect(() => {
    const token = readCookie(COOKIE_NAME);
    if (!token) return;
    fetchUser(token);
  }, []);
  if (["/login", "/register"].includes(pathname)) return null;

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 container">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="lg:hidden" size="icon" variant="outline">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="/" className="flex flex-row items-center gap-4">
            <ScrollText className="h-6 w-6" />
            <span className="font-semibold">LogsTrap</span>
            <span className="sr-only">LogsTrap</span>
          </Link>
          <div className="grid gap-2 py-6">
            <Link
              href="/projects"
              className="font-semibold hover:text-gray-400 transition-all duration-100"
            >
              Projects
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <Link className="mr-6 hidden lg:!flex gap-2 items-center" href="/">
        <ScrollText className="h-6 w-6" />
        <span className="font-semibold">LogsTrap</span>
        <span className="sr-only">ShadCN</span>
      </Link>
      <NavigationMenu className="hidden lg:!flex">
        <NavigationMenuList>
          <NavigationMenuLink asChild>
            <Link
              href="/projects"
              className="font-semibold hover:text-gray-400 transition-all duration-100"
            >
              Projects
            </Link>
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
      {user?.id ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto">
              <User />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="ml-auto flex gap-2">
          <Link
            href={"/login"}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Sign in
          </Link>
          <Link
            href={"/register"}
            className={buttonVariants({
              variant: "default",
            })}
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}

function MenuIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
