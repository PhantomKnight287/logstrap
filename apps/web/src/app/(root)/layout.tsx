import { Header } from '@/components/header';
import { PropsWithChildren } from 'react';

export default function BaseLayout(props: PropsWithChildren) {
  return (
    <>
      <Header />
      {props.children}
    </>
  );
}
