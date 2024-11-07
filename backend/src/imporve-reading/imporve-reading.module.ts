import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImproveReadingService } from './imporve-reading.service';
import { ImproveReadingController } from './imporve-reading.controller';
import { ImproveReading, ImproveReadingSchema } from './improve-reading.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule,
    MongooseModule.forFeature([{ name: "ImproveReading", schema: ImproveReadingSchema }]),
  ],
  controllers: [ImproveReadingController],
  providers: [ImproveReadingService],
})
export class ImporveReadingModule {}
