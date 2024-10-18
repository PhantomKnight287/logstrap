import { Button } from '@/components/ui/button';
import { logger } from '../../../logstrap';

export default function Home() {
  logger.info('ok');
  logger.info('ok 1');
  logger.info('ok 2');
  logger.info('ok 3');

  return (
    <>
      <Button>Ok</Button>
    </>
  );
}
