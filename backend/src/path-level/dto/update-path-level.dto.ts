import { PartialType } from '@nestjs/mapped-types';
import { CreatePathLevelDto } from './create-path-level.dto';

export class UpdatePathLevelDto extends PartialType(CreatePathLevelDto) {}
