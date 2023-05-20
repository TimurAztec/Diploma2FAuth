import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GlobalConstants } from 'src/misc/constants';
import { RoleService } from './role.service';
import { JwtAuthGuard } from './jwt.guard';
import { RoleGuard } from './role.guard';
import { Types } from 'mongoose';
import { RoleDto, UpdateRoleDto } from './role.dto';
import { Permissions } from './permissions.decorator';


@Controller('roles')
export class RolesController {
    constructor(protected readonly authService: AuthService,
                protected readonly rolesService: RoleService) {}

    @Permissions(GlobalConstants.Permissions.READ_ROLES)            
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get(':id')
    public async findOne(@Res() res, @Param('id') id: string) {
        try {
            const response = await this.rolesService.findOne(new Types.ObjectId(id));
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.READ_ROLES)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    public async findAll(@Res() res) {
        try {
            const response = await this.rolesService.findAll();
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.DELETE_ROLES)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    public async delete(@Req() req, @Res() res, @Param('id') id: string) {
        try {
            const response = await this.rolesService.delete(new Types.ObjectId(id));
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.EDIT_ROLES) 
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put('modify')
    public async modify(@Req() req, @Res() res, @Body() updateRoleDto: UpdateRoleDto) {
        try {
            const role = await this.rolesService.findOne(new Types.ObjectId(updateRoleDto.id));
            role.permissions = updateRoleDto.permissions;
            role.name = updateRoleDto.name;
            const response = await this.rolesService.modify(role);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.EDIT_ROLES)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    public async create(@Req() req, @Res() res, @Body() roleDto: RoleDto) {
        try {
            const response = await this.rolesService.create(roleDto);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }
}

@Controller('permissions')
export class PermissionsController {
    @Permissions(GlobalConstants.Permissions.READ_ROLES)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    public async findAll(@Res() res) {
        try {
            const response = Object.keys(GlobalConstants.Permissions)
            .filter(key => typeof GlobalConstants.Permissions[key] === 'string' && key !== 'PRIVATE_VALUE')
            .map(key => GlobalConstants.Permissions[key]);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }
}
