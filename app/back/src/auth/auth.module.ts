import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schema';
import { RoleService } from './role.service';
import { PermissionsController, RolesController } from './roles.controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('APP_SECRET'),
          signOptions: { expiresIn: '1d' }
      })
    }),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema}])
  ],
  controllers: [AuthController, RolesController, PermissionsController],
  providers: [AuthService, RoleService],
  exports: [AuthService, RoleService, JwtModule]
})
export class AuthModule {}
