import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CouponesService } from './coupones.service';
import { CreateCouponeDto } from './dto/create-coupone.dto';
import { UpdateCouponeDto } from './dto/update-coupone.dto';

@Controller('coupones')
export class CouponesController {
  constructor(private readonly couponesService: CouponesService) {}

  @Post()
  create(@Body() createCouponeDto: CreateCouponeDto) {
    return this.couponesService.create(createCouponeDto);
  }

  @Get()
  findAll() {
    return this.couponesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponeDto: UpdateCouponeDto) {
    return this.couponesService.update(+id, updateCouponeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponesService.remove(+id);
  }
}
