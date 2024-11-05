import { Test, TestingModule } from '@nestjs/testing';
import { ImporveReadingService } from './imporve-reading.service';

describe('ImporveReadingService', () => {
  let service: ImporveReadingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImporveReadingService],
    }).compile();

    service = module.get<ImporveReadingService>(ImporveReadingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
