import { NextResponse } from 'next/server';
import { withTracing } from './logstrap';

export default withTracing()((req) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  req;
  return NextResponse.next();
});
