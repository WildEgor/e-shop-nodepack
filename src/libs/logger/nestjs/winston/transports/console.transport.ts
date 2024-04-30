import * as winston from 'winston';
import { IConsoleTransportOpts, LogColors, LogLevel, LogLevels } from '../../logger.models';

/**
 * @description Console transport for Winston Logger can be print in stdout colorized or json format
 */
export class ConsoleTransport {

  public static create(opts: IConsoleTransportOpts): winston.transports.ConsoleTransportInstance {
    if (opts?.format === 'json') {
      return new winston.transports.Console({
        format: winston.format.json({
          deterministic: true,
        }),
      });
    }

    if (opts?.native) {
      // TODO: make nest like logs
    }

    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf((log: winston.Logform.TransformableInfo) => {
          const color = this.mapLogLevelColor(log.level as LogLevel);

          const prefix = `${log?.data?.label ? `[${log.data.label}]` : ''}`;

          return `${this.colorize(color, `${prefix}  - ${String(process.pid).padEnd(6)}`)} ${log.timestamp}    ${
            log?.data?.correlationId
              ? `(${this.colorize(LogColors.cyan, log.data.correlationId)})`
              : ''
          } ${this.colorize(color, log.level.toUpperCase())} ${
            log?.data?.source
              ? `${this.colorize(LogColors.cyan, `[${log.data.source}]`)}`
              : ''
          } ${this.colorize(
            color,
            `${log.message} - ${log.data.error ? log.data.error : ''}`,
          )}${
            typeof log?.data?.durationMs !== 'undefined'
              ? this.colorize(color, ` +${log.data.durationMs}ms`)
              : ''
          }${
            log?.data?.stack ? this.colorize(color, `  - ${log.data.stack}`) : ''
          }${
            log?.data?.props
              ? `\n  - Props: ${JSON.stringify(log.data.props, null, 4)}`
              : ''
          }`;
        }),
      ),
    });
  }

  private static colorize(color: LogColors, message: string): string {
    return `${color}${message}\x1b[0m`;
  }

  private static mapLogLevelColor(level: LogLevel): LogColors {
    switch (level) {
      case LogLevels.Debug:
        return LogColors.blue;
      case LogLevels.Info:
        return LogColors.green;
      case LogLevels.Log:
        return LogColors.green;
      case LogLevels.Warn:
        return LogColors.yellow;
      case LogLevels.Error:
        return LogColors.red;
      case LogLevels.Verbose:
        return LogColors.pink;
      case LogLevels.Emergency:
        return LogColors.bgRed;
      case LogLevels.Silent:
        return LogColors.black;
      default:
        return LogColors.cyan;
    }
  }

}
