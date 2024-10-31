import { Test, TestingModule } from '@nestjs/testing';
import { SpellingCorectionService } from './spelling-corection.service';

describe('SpellingCorectionService', () => {
  let service: SpellingCorectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpellingCorectionService],
    }).compile();

    service = module.get<SpellingCorectionService>(SpellingCorectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
