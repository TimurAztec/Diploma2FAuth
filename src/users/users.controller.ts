import { Controller, Delete, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(protected userService: UsersService) {}

    @Get(':id')
    public async findOne(@Res() res, @Param('id') id: number) {
        try {
            const response = await this.userService.findOne(id);
            return res.status(HttpStatus.OK).json({response});
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Get()
    public async findAll(@Res() res) {
        try {
            const response = await this.userService.findAll();
            return res.status(HttpStatus.OK).json({response});
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }

    @Delete(':id')
    public async delete(@Res() res, @Param('id') id: number) {
        try {
            const response = await this.userService.delete(id);
            return res.status(HttpStatus.OK).json({response});
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json(error.response);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(error.message);
        }
    }
}
