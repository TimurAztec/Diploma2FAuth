import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import * as speakeasy from 'speakeasy';
import * as QRcode from 'qrcode';
const util = require('util');
import { User } from 'src/users/user.schema';
import { Role } from 'src/users/user.interface';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(protected readonly authService: AuthService,
                protected readonly userService: UsersService) {}

    @Post('signin')
    public async login(@Res() res: Response, @Body() authDto: AuthDto) {
        try {
            const response = await this.authService.authenticate(authDto);
            return res.status(HttpStatus.OK).json({response});
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
            const secret = speakeasy.generateSecret({
                name: 'diploma2fauth'
            });
            const user = new User();
            user.name = createUserDto.name;
            user.email = createUserDto.email;
            user.password = createUserDto.password;
            user.role = Role.Customer;
            user.twofasecret = secret.hex;
            await this.userService.create(user);
            const data_url =  await util.promisify(QRcode.toDataURL)(secret.otpauth_url);
            return res.status(HttpStatus.OK).send('<img src="' + data_url + '">');
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }
}
