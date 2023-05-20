import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/users/user.schema';
import { RoleService } from './role.service';
import { Types } from 'mongoose';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector, protected readonly rolesService: RoleService) {}

  protected matchPermissions(permissions: string[], userPermissions: string[]) {
    return permissions.every((permission) => userPermissions.includes(permission));
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user || !user.role) {
      return false;
    }
    if (typeof user.role == "string") {
      user.role = await this.rolesService.findOne(new Types.ObjectId(user.role));
    }
    return this.matchPermissions(permissions, user.role.permissions);
  }
}
