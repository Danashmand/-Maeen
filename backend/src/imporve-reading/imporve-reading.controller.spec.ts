import { Test, TestingModule } from '@nestjs/testing';
import { ImporveReadingController } from './imporve-reading.controller';
import { ImporveReadingService } from './imporve-reading.service';

describe('ImporveReadingController', () => {
  let controller: ImporveReadingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImporveReadingController],
      providers: [ImporveReadingService],
    }).compile();

    controller = module.get<ImporveReadingController>(ImporveReadingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
