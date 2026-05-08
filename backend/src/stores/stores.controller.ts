import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { StoresService } from './stores.service';

@Controller('stores')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.storesService.findAll(query);
  }

  @Get('owner')
  @Roles('store_owner')
  getStoreByOwner(@Request() req: any) {
    return this.storesService.getStoreByOwner(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  @Post()
  @Roles('admin')
  create(@Body() body: any) {
    return this.storesService.create(body);
  }
}
