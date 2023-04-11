import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseGuards } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { Types } from "mongoose";
import { RoleGuard } from "src/auth/role.guard";
import { GlobalConstants } from "src/misc/constants";
import { Roles } from "src/auth/roles.decorator";
import { ItemDto } from "./item.dto";

@Controller('inventory')
export class InventoryController {

    constructor(protected inventoryService: InventoryService) {}

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    public async findOne(@Res() res, @Param('id') id: string) {
        try {
            const response = await this.inventoryService.findOne(new Types.ObjectId(id));
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
            const response = await this.inventoryService.findAll();
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
            const response = await this.inventoryService.delete(id);
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
    public async modify(@Res() res, @Body() updateItemDto: ItemDto) {
        try {
            if (!updateItemDto._id) {
                throw new BadRequestException("_id is required!");
            }
            const response = await this.inventoryService.modify(updateItemDto);
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
    @Post()
    public async create(@Res() res, @Body() updateItemDto: ItemDto) {
        try {
            const response = await this.inventoryService.create(updateItemDto);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

}