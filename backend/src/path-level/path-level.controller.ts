import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PathLevelService } from './path-level.service';
import { CreatePathLevelDto } from './dto/create-path-level.dto';
import { UpdatePathLevelDto } from './dto/update-path-level.dto';

@Controller('path-level')
export class PathLevelController {
  constructor(private readonly pathLevelService: PathLevelService) {}

  @Post()
  create(@Body() createPathLevelDto: CreatePathLevelDto) {
    return this.pathLevelService.create(createPathLevelDto);
  }

  @Get()
  findAll() {
    return this.pathLevelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pathLevelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePathLevelDto: UpdatePathLevelDto) {
    return this.pathLevelService.update(+id, updatePathLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pathLevelService.remove(+id);
  }
}
