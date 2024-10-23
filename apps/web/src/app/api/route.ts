import { createRouteHandler, logger } from '../../logstrap';

export const GET = createRouteHandler(async (req: Request) => {
  logger.info('hello world');
  return Response.json({message:"Hello world"})
  return new Response('Hello World', { status: 200 });
});

export const POST = createRouteHandler(async (req: Request) => {
  logger.info('hello world - POST');
  return new Response('Hello World', { status: 200 });
});
