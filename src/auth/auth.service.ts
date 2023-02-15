import { Injectable, NotFoundException } from '@nestjs/common';
import { IAuth, Role } from '../users/user.interface';
import { AuthDto } from './auth.dto';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {

    constructor(protected configService: ConfigService,
                protected usersService: UsersService) {}

    public async authenticate(authDto: AuthDto): Promise<IAuth> {
        const user = await this.usersService.findOneByEmail(authDto.email);
        
        if (!user) throw new NotFoundException('User does not exist!');

        const passwordCheck = await bcrypt.compare(authDto.password, user.password);

        if (!passwordCheck) throw new NotFoundException('Invalid credentials!');

        const twofaauthcheck = await speakeasy.totp.verify({ 
            secret: user.twofasecret,
            encoding: 'hex',
            token: authDto.twofatoken 
        });

        if (!twofaauthcheck) throw new NotFoundException('Invalid 2FA token!');

        const authToken = sign({...user}, this.configService.get<string>('APP_SECRET'));

        return { authToken, user };
    }

}