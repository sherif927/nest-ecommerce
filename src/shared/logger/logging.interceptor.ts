import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

/**
 * interceptor class implemented
 * as a logging service.
 *
 * @export
 * @class LoggingInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestObject = context.switchToHttp().getRequest();
    const responseObject = context.switchToHttp().getResponse();
    const methodType = requestObject.method;
    const url = requestObject.url;
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() => Logger.log(`${methodType} ${url} ${Date.now() - now}ms`, context.getClass().name)),
      );
  }
}