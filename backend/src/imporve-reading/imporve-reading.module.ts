import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImporveReadingService } from './imporve-reading.service';
import { ImporveReadingController } from './imporve-reading.controller';
import { ImproveReading, ImproveReadingSchema } from './improve-reading.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ImproveReading.name, schema: ImproveReadingSchema }]),
  ],
  controllers: [ImporveReadingController],
  providers: [ImporveReadingService],
})
export class ImporveReadingModule {}
