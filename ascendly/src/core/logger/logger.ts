import Config from 'react-native-config';

/**
 * Log levels for the application
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private isLoggingEnabled: boolean;
  private envName: string;

  constructor() {
    this.isLoggingEnabled = Config.ENABLE_LOGGING === 'true';
    this.envName = Config.ENV || 'unknown';
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.envName}] [${level}]: ${message}`;
  }

  public debug(message: string, ...args: any[]): void {
    if (this.isLoggingEnabled) {
      console.log(this.formatMessage(LogLevel.DEBUG, message), ...args);
    }
  }

  public info(message: string, ...args: any[]): void {
    if (this.isLoggingEnabled) {
      console.info(this.formatMessage(LogLevel.INFO, message), ...args);
    }
  }

  public warn(message: string, ...args: any[]): void {
    if (this.isLoggingEnabled) {
      console.warn(this.formatMessage(LogLevel.WARN, message), ...args);
    }
  }

  public error(message: string, ...args: any[]): void {
    // We usually want to log errors even if general logging is disabled, 
    // but here we follow the ENABLE_LOGGING flag as per requirements.
    if (this.isLoggingEnabled) {
      console.error(this.formatMessage(LogLevel.ERROR, message), ...args);
    }
  }
}

export const logger = new Logger();
export default logger;
