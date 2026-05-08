import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get('dashboard')
  @Roles('admin')
  getDashboard() {
    return this.usersService.getDashboard();
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @Roles('admin')
  create(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Patch('password')
  updatePassword(@Request() req: any, @Body('password') password: string) {
    return this.usersService.updatePassword(req.user.id, password);
  }
}
