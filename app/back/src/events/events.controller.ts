import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { Types } from "mongoose";
import { RoleGuard } from "src/auth/role.guard";
import { GlobalConstants } from "src/misc/constants";
import { Roles } from "src/auth/roles.decorator";
import { EventDto } from "./event.dto";
import { EventsService } from "./events.service";

@Controller('events')
export class EventsController {

    constructor(protected eventsService: EventsService) {}

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    public async findOne(@Res() res, @Param('id') id: string) {
        try {
            const response = await this.eventsService.findOne(new Types.ObjectId(id));
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    public async findAll(@Res() res) {
        try {
            const response = await this.eventsService.findAll();
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
    @Delete(':id')
    public async delete(@Res() res, @Param('id') id: number) {
        try {
            const response = await this.eventsService.delete(id);
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
    @Put()
    public async modify(@Res() res, @Body() updateItemDto: EventDto) {
        try {
            if (!updateItemDto._id) {
                throw new BadRequestException("_id is required!");
            }
            const response = await this.eventsService.modify(updateItemDto);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    // @Roles(GlobalConstants.SUPER_ADMIN_ROLE, GlobalConstants.ADMIN_ROLE, GlobalConstants.MANAGER_ROLE)
    @UseGuards(JwtAuthGuard)
    @Post()
    public async create(@Res() res, @Body() updateItemDto: EventDto) {
        try {
            const response = await this.eventsService.create(updateItemDto);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

}