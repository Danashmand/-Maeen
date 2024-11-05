import { Module } from '@nestjs/common';
import { ImporveReadingService } from './imporve-reading.service';
import { ImporveReadingController } from './imporve-reading.controller';

@Module({
  controllers: [ImporveReadingController],
  providers: [ImporveReadingService],
})
export class ImporveReadingModule {}
