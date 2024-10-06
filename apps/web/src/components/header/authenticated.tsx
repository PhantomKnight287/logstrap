'use client';

import Link from 'next/link';
import { User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useFetchUser from '@/hooks/use-fetch-user';

export default function AuthenticatedHeader() {
  const { user, loading } = useFetchUser();

  return (
    <header className="border-b flex items-center justify-center">
      <div className="flex items-center justify-between py-4 container">
        <Link href="/" className="text-2xl font-bold">
          Logo
        </Link>
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-10 w-40 rounded"></div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-between">
                <span>Wallet Balance</span>
                <span className="font-semibold">${user.walletBalance}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost">Log in</Button>
        )}
      </div>
    </header>
  );
}
