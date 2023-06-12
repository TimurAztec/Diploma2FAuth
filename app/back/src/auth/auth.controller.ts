import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { CreateUserDto, ReturnUser } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import * as speakeasy from 'speakeasy';

import { User } from 'src/users/user.schema';
import { Response } from 'express';
import { ForgotPasswordDto } from './forgotPassword.dto';
import { ResetPasswordDto } from './resetPassword.dto';
import { I2FTokenReset } from './auth.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { GlobalConstants } from 'src/misc/constants';
import { RoleService } from './role.service';


@Controller('auth')
export class AuthController {
    constructor(protected readonly authService: AuthService,
                protected readonly userService: UsersService,
                protected readonly rolesService: RoleService,
                protected mailerService: MailerService) {}

    @Post('signin')
    public async login(@Res() res: Response, @Body() authDto: AuthDto) {
        try {
            const response = await this.authService.authenticate(authDto);
            const returnUser: ReturnUser = {
                _id: response.user._id,
                email: response.user.email,
                phone: response.user.phone,
                description: response.user.description,
                name: response.user.name,
                role: response.user.role
            };
            return res.status(HttpStatus.OK).json({accessToken: response.accessToken, user: returnUser});
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Post('signup')
    public async register(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
        try {
            const user = new User();
            user.name = createUserDto.name;
            user.email = createUserDto.email;
            user.password = createUserDto.password;
            user.role = await this.rolesService.findOneByName(GlobalConstants.Roles.DEFAULT_ROLE);
            const tokenReset: I2FTokenReset = await this.authService.get2FToken();
            user.twofasecret = tokenReset.secret.hex;
            await this.userService.create(user);
            return res.status(HttpStatus.OK).json({tokenUrl: tokenReset.qrUrl});
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Post('forgotPassword')
    public async forgotPassword(@Res() res: Response, @Body() forgotPasswordDto: ForgotPasswordDto) {
        try {
            const response = await this.authService.getForgotPasswordLink(forgotPasswordDto);
            this.mailerService
                .sendMail({
                    to: forgotPasswordDto.email,
                    from: process.env.EMAIL_ID,
                    subject: 'Password reset',
                    html: `<a href="${response.link}">password reset link</a>`
                });
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Post('forgotPassword/:id')
    public async resetPassword(@Res() res: Response, @Body() resetPasswordDto: ResetPasswordDto, @Param('id') token: string) {
        try {
            const response = await this.authService.resetPassword({
                password: resetPasswordDto.password,
                token: token
            });
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Post('forgotToken')
    public async forgotToken(@Res() res: Response, @Body() forgotPasswordDto: ForgotPasswordDto) {
        try {
            const response = await this.authService.getForgotPasswordLink(forgotPasswordDto, true);
            this.mailerService
                .sendMail({
                    to: forgotPasswordDto.email,
                    from: process.env.EMAIL_ID,
                    subject: 'Token reset',
                    html: `<a href="${response.link}">token reset link</a>`
                });
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Get('forgotToken/:id')
    public async resetToken(@Res() res: Response, @Param('id') token: string) {
        try {
            const qrUrl = await this.authService.reset2FToken(token);
            return res.status(HttpStatus.OK).json({tokenUrl: qrUrl});
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }
}
