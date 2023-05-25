import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { ClientsService } from './client.service';
import { Types } from 'mongoose';
import { GlobalConstants } from 'src/misc/constants';
import { Permissions } from 'src/auth/permissions.decorator';
import { CreateClientDto, UpdateClientDto } from './client.dto';

@Controller('clients')
export class ClientsController {

    constructor(protected readonly clientsService: ClientsService) {}

    @Permissions(GlobalConstants.Permissions.READ_CLIENTS)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get(':id')
    public async findOne(@Res() res, @Param('id') id: string) {
        try {
            const response = await this.clientsService.findOne(new Types.ObjectId(id));
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.READ_CLIENTS)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    public async findAll(@Res() res) {
        try {
            const response = await this.clientsService.findAll();
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.DELETE_CLIENTS)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    public async delete(@Req() req, @Res() res, @Param('id') id: string) {
        try {
            const response = await this.clientsService.delete(new Types.ObjectId(id));
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.EDIT_CLIENTS)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    public async create(@Res() res, @Body() createClientDto: CreateClientDto) {
        try {
            const response = await this.clientsService.create(createClientDto);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Permissions(GlobalConstants.Permissions.EDIT_CLIENTS)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('modify')
    public async modify(@Req() req, @Res() res, @Body() updateClientDto: UpdateClientDto) {
        try {
            const client = await this.clientsService.findOne(new Types.ObjectId(updateClientDto.id));
            if (!client) throw new BadRequestException('Client does not exist');
            const response = await this.clientsService.modify(client);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }
}
