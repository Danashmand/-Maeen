import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImproveReadingService } from './imporve-reading.service';
import { ImporveReadingController } from './imporve-reading.controller';
import { ImproveReading, ImproveReadingSchema } from './improve-reading.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ImproveReading.name, schema: ImproveReadingSchema }]),
  ],
  controllers: [ImporveReadingController],
  providers: [ImproveReadingService],
})
export class ImporveReadingModule {}
