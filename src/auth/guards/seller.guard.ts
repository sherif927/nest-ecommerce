import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

/**
 * class responsible for role
 * authorization, if the user
 * is not a seller then a 401
 * error is thrown.
 *
 * @export
 * @class SellerGuard
 * @implements {CanActivate}
 */
export class SellerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (user && user.seller) return true;
    throw new UnauthorizedException('User is not a Vendor');
  }
}