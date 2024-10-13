import { PartialType } from '@nestjs/mapped-types';
import { CreatevirtualTeacherDto } from './create-virtualTeacher.dto';

export class UpdateVirtualTeacherDto extends PartialType(CreatevirtualTeacherDto) {}
