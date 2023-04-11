import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UsersService } from './users.service';
import { GlobalConstants } from 'src/misc/constants';
import { ReturnUser, UpdateUserDto } from './user.dto';
import { User } from './user.schema';
import { Types } from 'mongoose';

@Controller('users')
export class UsersController {

    constructor(protected userService: UsersService) {}

    @Roles('admin')
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

    // @Roles('admin')
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

    @Roles(GlobalConstants.SUPER_ADMIN_ROLE, GlobalConstants.ADMIN_ROLE, GlobalConstants.MANAGER_ROLE)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    public async delete(@Req() req, @Res() res, @Param('id') id: string) {
        try {
            const user = await this.userService.findOne(new Types.ObjectId(id));
            if (req.user && GlobalConstants.ROLES_VALUES.get(req.user.role) >= GlobalConstants.ROLES_VALUES.get(user.role)) {
                throw new BadRequestException("You are not priviligiated enough to change this user!");
            }
            const response = await this.userService.delete(new Types.ObjectId(id));
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Roles(GlobalConstants.SUPER_ADMIN_ROLE, GlobalConstants.ADMIN_ROLE, GlobalConstants.MANAGER_ROLE)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('modify')
    public async modify(@Req() req, @Res() res, @Body() updateUserDto: UpdateUserDto) {
        try {
            const user = await this.userService.findOne(new Types.ObjectId(updateUserDto.id));
            if (req.user && GlobalConstants.ROLES_VALUES.get(req.user.role) >= GlobalConstants.ROLES_VALUES.get(user.role)) {
                throw new BadRequestException("You are not priviligiated enough to change this user!");
            }
            user.email = updateUserDto.email;
            user.name = updateUserDto.name;
            if (Array.from(GlobalConstants.ROLES_VALUES.keys()).includes(updateUserDto.role)) {
                user.role = updateUserDto.role;
            } else {
                throw new BadRequestException("Non existent role!");
            }
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
