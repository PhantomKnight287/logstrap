import { createLogger, format, transports } from 'winston';
import { format as formatDate } from 'date-fns';

const customFormat = format.printf(
  ({ timestamp, level, stack, message, context }) => {
    const formatedDate = formatDate(timestamp, 'yyyy-MM-dd HH:mm:ss');
    return `${formatedDate} -  [${level}] [${context}] - ${stack || message}`;
  },
);

const options = {
  file: {
    filename: 'error.log',
    level: 'error',
  },
  console: {
    level: 'silly',
  },
};

const devLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.colorize(),
    customFormat,
  ),
  transports: [new transports.Console(options.console)],
};

const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.File(options.file),
    new transports.File({
      filename: 'combine.log',
      level: 'info',
    }),
  ],
};
const instanceLogger =
  process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export const loggerInstance = createLogger(instanceLogger);
