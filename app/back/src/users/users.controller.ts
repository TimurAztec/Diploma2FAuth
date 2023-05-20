import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { UsersService } from './users.service';
import { ReturnUser, UpdateUserDto } from './user.dto';
import { User } from './user.schema';
import { Types } from 'mongoose';
import { GlobalConstants } from 'src/misc/constants';
import { RoleService } from 'src/auth/role.service';
import { Permissions } from 'src/auth/permissions.decorator';

@Controller('users')
export class UsersController {

    constructor(protected readonly userService: UsersService,
                protected readonly roleService: RoleService) {}

    @Permissions(GlobalConstants.Permissions.READ_STAFF)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get(':id')
    public async findOne(@Res() res, @Param('id') id: string) {
        try {
            const response = await this.userService.findOne(new Types.ObjectId(id));
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.READ_STAFF)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    public async findAll(@Res() res) {
        try {
            const response = await this.userService.findAll();
            const users: ReturnUser[] = [];
            response.forEach((user: User) => {
                users.push({
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                })
            });
            return res.status(HttpStatus.OK).json(users);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.DELETE_STAFF)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    public async delete(@Req() req, @Res() res, @Param('id') id: string) {
        try {
            // const user = await this.userService.findOne(new Types.ObjectId(id));
            // if (req.user && GlobalConstants.Roles.ROLES_VALUES.get(req.user.role.name) >= GlobalConstants.Roles.ROLES_VALUES.get(user.role.name)) {
            //     throw new BadRequestException("You are not priviligiated enough to change this user!");
            // }
            const response = await this.userService.delete(new Types.ObjectId(id));
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.EDIT_STAFF)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('modify')
    public async modify(@Req() req, @Res() res, @Body() updateUserDto: UpdateUserDto) {
        try {
            const user = await this.userService.findOne(new Types.ObjectId(updateUserDto.id));
            // if (req.user && GlobalConstants.Roles.ROLES_VALUES.get(req?.user?.role?.name) >= GlobalConstants.Roles.ROLES_VALUES.get(user?.role?.name)) {
            //     throw new BadRequestException("You are not priviligiated enough to change this user!");
            // }
            user.email = updateUserDto.email;
            user.name = updateUserDto.name;
            user.role = await this.roleService.findOne(new Types.ObjectId(updateUserDto.role));
            // if (Array.from(GlobalConstants.Roles.ROLES_VALUES.keys()).includes(updateUserDto.role.name)) {
            //     user.role = updateUserDto.role;
            // } else {
            //     throw new BadRequestException("Non existent role!");
            // }
            const response = await this.userService.modify(user);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }
}
