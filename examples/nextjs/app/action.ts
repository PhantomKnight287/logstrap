'use server';

import { logger, withLoggerFactory } from '@/logstrap';

const { serverActionWithLogger } = withLoggerFactory.createLoggers();

async function _testServerAction() {
  logger.log('Please work');
  console.log('Great');
}

export const testServerAction = serverActionWithLogger(_testServerAction, {
  name: '@/actions/testServerAction',
});
