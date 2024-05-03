import { clc, yellow } from "~/shared/packages/logger/colors-util";
import {
  isString,
  isFunction,
  isPlainObject,
  isUndefined,
} from "~/shared/common/utils/validation";

export type LogLevel = "log" | "error" | "warn" | "debug" | "verbose" | "fatal";

export interface ILogger {
  log(message: any, ...optionalParams: any[]): any;
  error(message: any, ...optionalParams: any[]): any;
  warn(message: any, ...optionalParams: any[]): any;
  debug?(message: any, ...optionalParams: any[]): any;
  verbose?(message: any, ...optionalParams: any[]): any;
  fatal?(message: any, ...optionalParams: any[]): any;
  setLogLevels?(levels: LogLevel[]): any;
}

export const LOGGER_SYMBOLS = Symbol.for("Logger");

export interface LoggerOptions {
  logLevels?: LogLevel[];
  timestamp?: boolean;
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  day: "2-digit",
  month: "2-digit",
});

// Adapted from NestJS - Console Logger
// https://github.com/nestjs/nest/blob/master/packages/common/services/console-logger.service.ts
export class Logger implements ILogger {
  private static lastTimestampAt?: number;
  private context?: string;
  private options?: LoggerOptions;

  constructor(context?: string, options?: LoggerOptions) {
    if (context) {
      this.context = context;
      this.options = options;
    }
  }

  log(message: any, ...optionalParams: any[]) {
    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...optionalParams,
    ]);

    this.printMessages(messages, context, "log");
  }

  error(message: any, ...optionalParams: any[]) {
    const { messages, context, stack } =
      this.getContextAndStackAndMessagesToPrint([message, ...optionalParams]);

    this.printMessages(messages, context, "error", "stderr");
    this.printStackTrace(stack!);
  }

  warn(message: any, ...optionalParams: any[]) {
    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...optionalParams,
    ]);
    this.printMessages(messages, context, "warn");
  }

  debug(message: any, ...optionalParams: any[]) {
    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...optionalParams,
    ]);
    this.printMessages(messages, context, "debug");
  }

  verbose(message: any, ...optionalParams: any[]) {
    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...optionalParams,
    ]);
    this.printMessages(messages, context, "verbose");
  }

  fatal(message: any, ...optionalParams: any[]) {
    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...optionalParams,
    ]);
    this.printMessages(messages, context, "fatal");
  }

  setLogLevels(levels: LogLevel[]) {
    if (!this.options) {
      this.options = {};
    }
    this.options.logLevels = levels;
  }

  setContext(context: string) {
    this.context = context;
  }

  resetContext() {
    this.context = undefined;
  }

  protected printMessages(
    messages: unknown[],
    context = "",
    logLevel: LogLevel = "log",
    writeStreamType?: "stdout" | "stderr",
  ) {
    messages.forEach((message) => {
      const pidMessage = this.formatPid(process.pid);
      const contextMessage = this.formatContext(context);
      const timestampDiff = this.updateAndGetTimestampDiff();
      const formattedLogLevel = logLevel.toUpperCase().padStart(7, " ");
      const formattedMessage = this.formatMessage(
        logLevel,
        message,
        pidMessage,
        formattedLogLevel,
        contextMessage,
        timestampDiff,
      );

      process[writeStreamType ?? "stdout"].write(formattedMessage);
    });
  }

  protected updateAndGetTimestampDiff(): string {
    const includeTimestamp = Logger.lastTimestampAt && this.options?.timestamp;
    const result = includeTimestamp
      ? this.formatTimestampDiff(Date.now() - Logger.lastTimestampAt!)
      : "";
    Logger.lastTimestampAt = Date.now();
    return result;
  }

  protected formatPid(pid: number) {
    return `[App] ${pid}  - `;
  }

  protected formatTimestampDiff(timestampDiff: number) {
    return yellow(` +${timestampDiff}ms`);
  }

  protected formatContext(context: string): string {
    return context ? yellow(`[${context}] `) : "";
  }

  protected formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ) {
    const output = this.stringifyMessage(message, logLevel);
    pidMessage = this.colorize(pidMessage, logLevel);
    formattedLogLevel = this.colorize(formattedLogLevel, logLevel);
    return `${pidMessage}${this.getTimestamp()} ${formattedLogLevel} ${contextMessage}${output}${timestampDiff}\n`;
  }

  protected stringifyMessage(message: unknown, logLevel: LogLevel): string {
    if (isFunction(message)) {
      const messageAsStr = Function.prototype.toString.call(message);
      const isClass = messageAsStr.startsWith("class ");
      if (isClass) {
        // If the message is a class, we will display the class name.
        return this.stringifyMessage(message.name, logLevel);
      }
      // If the message is a non-class function, call it and re-resolve its value.
      return this.stringifyMessage(message(), logLevel);
    }

    return isPlainObject(message) || Array.isArray(message)
      ? `${this.colorize("Object:", logLevel)}\n${JSON.stringify(
          message,
          (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          2,
        )}\n`
      : this.colorize(message as string, logLevel);
  }

  protected printStackTrace(stack: string) {
    if (!stack) {
      return;
    }
    process.stderr.write(`${stack}\n`);
  }

  private getContextAndStackAndMessagesToPrint(args: unknown[]) {
    if (args.length === 2) {
      return this.isStackFormat(args[1])
        ? {
            messages: [args[0]],
            stack: args[1] as string,
            context: this.context,
          }
        : {
            messages: [args[0]],
            context: args[1] as string,
          };
    }

    const { messages, context } = this.getContextAndMessagesToPrint(args);
    if (messages?.length <= 1) {
      return { messages, context };
    }
    const lastElement = messages[messages.length - 1];
    const isStack = isString(lastElement);
    if (!isStack && !isUndefined(lastElement)) {
      return { messages, context };
    }
    return {
      stack: lastElement as string,
      messages: messages.slice(0, messages.length - 1),
      context,
    };
  }

  private isStackFormat(stack: unknown) {
    if (!isString(stack) && !isUndefined(stack)) {
      return false;
    }

    return /^(.)+\n\s+at .+:\d+:\d+/.test(stack!);
  }

  private getContextAndMessagesToPrint(args: unknown[]) {
    if (args?.length <= 1) {
      return { messages: args, context: this.context };
    }
    const lastElement = args[args.length - 1];
    const isContext = isString(lastElement);
    if (!isContext) {
      return { messages: args, context: this.context };
    }
    return {
      context: lastElement as string,
      messages: args.slice(0, args.length - 1),
    };
  }

  protected getTimestamp(): string {
    return dateTimeFormatter.format(Date.now());
  }

  protected colorize(message: string, logLevel: LogLevel) {
    const color = this.getColorByLogLevel(logLevel);
    return color(message);
  }

  private getColorByLogLevel(level: LogLevel) {
    switch (level) {
      case "debug":
        return clc.magentaBright;
      case "warn":
        return clc.yellow;
      case "error":
        return clc.red;
      case "verbose":
        return clc.cyanBright;
      case "fatal":
        return clc.bold;
      default:
        return clc.green;
    }
  }
}

export function useLogger(context?: string, options?: LoggerOptions) {
  return new Logger(context, options);
}
