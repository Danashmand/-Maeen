import { Test, TestingModule } from '@nestjs/testing';
import { ReadingService } from './reading.service';

describe('ReadingService', () => {
  let service: ReadingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadingService],
    }).compile();

    service = module.get<ReadingService>(ReadingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
