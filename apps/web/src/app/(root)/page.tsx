import { Button } from '@/components/ui/button';
import { logger } from '../../logstrap';

export default function Home() {
  logger.log('Hello world');
  logger.warn("Hello world 2")
  return (
    <>
      <Button>Ok</Button>
    </>
  );
}
