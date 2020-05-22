import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * creates a decorator that retrieves
 * the user from the request after
 * injection by auth middleware.
 *
 * @param {unknown} data
 * @param {ExecutionContext} ctx
 * @returns User
 */
export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user: any = req.user;
  return user;
})