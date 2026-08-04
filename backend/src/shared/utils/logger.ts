export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private formatMessage(level: string, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaString}`;
  }

  debug(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug(this.formatMessage('DEBUG', message, meta));
    }
  }

  info(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.info(this.formatMessage('INFO', message, meta));
  }

  warn(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.warn(this.formatMessage('WARN', message, meta));
  }

  error(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.error(this.formatMessage('ERROR', message, meta));
  }

  public stream = {
    write: (message: string): void => {
      this.info(message.trim());
    },
  };
}

export const logger = new Logger();
