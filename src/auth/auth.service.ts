import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { User } from 'src/users/user.schema';
import { ForgotPasswordDto } from './forgotPassword.dto';
import { I2FTokenReset, IAuth, IResetPassword } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
const util = require('util');
import * as QRcode from 'qrcode';

@Injectable()
export class AuthService {

    constructor(protected configService: ConfigService,
                protected usersService: UsersService,
                protected jwtService: JwtService) {}

    public async authenticate(authDto: AuthDto): Promise<IAuth> {
        const user: User = await this.validateUser(authDto);
        const jwtPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
        const authToken = this.jwtService.sign(jwtPayload);
        
        return { authToken, user };
    }

    public async validateUser(authDto: AuthDto): Promise<User> {
        const user: User = await this.usersService.findOneByEmail(authDto.email);
        
        if (!user) throw new NotFoundException('User does not exist!');

        const passwordCheck = await bcrypt.compare(authDto.password, user.password);

        if (!passwordCheck) throw new NotFoundException('Invalid credentials!');

        const twofaauthcheck = await speakeasy.totp.verify({ 
            secret: user.twofasecret,
            encoding: 'hex',
            token: authDto.twofatoken 
        });

        if (!twofaauthcheck) throw new NotFoundException('Invalid 2FA token!');

        return user;
    }

    public async getForgotPasswordLink(forgotPasswordDto: ForgotPasswordDto, token: boolean = false) {
        const user = await this.usersService.findOneByEmail(forgotPasswordDto.email);

        if (!user) throw new NotFoundException('Invalid email!');

        const jwtPayload = {email: user.email}
        const restoreToken = this.jwtService.sign(jwtPayload);

        return {link: `${this.configService.get<string>('DOMAIN')}/auth/forgot${token ? '2FToken' : 'Password'}/${restoreToken}`};
    }

    public async resetPassword(resetPassord: IResetPassword): Promise<boolean> {
        try {
            const {email} = this.jwtService.verify(resetPassord.token);
            let user = await this.usersService.findOneByEmail(email);

            if (!user) throw new NotFoundException('Invalid email!');

            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(resetPassord.password, salt);
            user = {
                ...user,
                password: hash
            };
            await this.usersService.modify(user);
            return true;
        } catch (e) {
            throw new NotFoundException('Invalid reset token!');
        }
    }

    public async reset2FToken(token: string): Promise<string> {
        try {
            const {email} = this.jwtService.verify(token);
            let user = await this.usersService.findOneByEmail(email);

            if (!user) throw new NotFoundException('Invalid email!');

            const tokenReset: I2FTokenReset = await this.get2FToken();

            user = {
                ...user,
                twofasecret: tokenReset.secret.hex
            };
            await this.usersService.modify(user);
            return tokenReset.qrUrl;
        } catch (e) {
            throw new NotFoundException('Invalid reset token!');
        }
    }

    public async get2FToken(): Promise<I2FTokenReset> {
        const secret = speakeasy.generateSecret({
            name: 'diploma2fauth'
        });
        const qrUrl =  await util.promisify(QRcode.toDataURL)(secret.otpauth_url);
        return {secret, qrUrl}
    }
}