import AuthenticatedHeader from '@/components/header/authenticated';
import { PropsWithChildren } from 'react';

export default function DashboardLayout(props: PropsWithChildren) {
  return (
    <>
      <AuthenticatedHeader />
      {props.children}
    </>
  );
}
