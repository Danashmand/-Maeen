import { Injectable } from '@nestjs/common';
import { CreatePathLevelDto } from './dto/create-path-level.dto';
import { UpdatePathLevelDto } from './dto/update-path-level.dto';

@Injectable()
export class PathLevelService {
  create(createPathLevelDto: CreatePathLevelDto) {
    return 'This action adds a new pathLevel';
  }

  findAll() {
    return `This action returns all pathLevel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pathLevel`;
  }

  update(id: number, updatePathLevelDto: UpdatePathLevelDto) {
    return `This action updates a #${id} pathLevel`;
  }

  remove(id: number) {
    return `This action removes a #${id} pathLevel`;
  }
}
