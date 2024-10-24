'use client';

import { testServerAction } from './action';

export default function Client() {
  return <button onClick={() => testServerAction()}>OK</button>;
}
