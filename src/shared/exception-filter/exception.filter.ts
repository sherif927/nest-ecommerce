import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from './error-response';

/**
 * Filter class implemented to 
 * provide helpful error messages 
 * to the clients or testers.
 *
 * @export
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const { method, url } = req;
    const res = ctx.getResponse();
    const status = exception.getStatus ?
      exception.getStatus() :
      HttpStatus.INTERNAL_SERVER_ERROR;


    const errorResponse: ErrorResponse = {
      status, method, url,
      timeStamp: new Date().toLocaleString(),
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR ?
          exception.message || null : 'Internal Server Error'
    }

    return res.status(status).json(errorResponse);

  }
}