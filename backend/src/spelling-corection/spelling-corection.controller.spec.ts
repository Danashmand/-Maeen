import { Test, TestingModule } from '@nestjs/testing';
import { SpellingCorectionController } from './spelling-corection.controller';
import { SpellingCorectionService } from './spelling-corection.service';

describe('SpellingCorectionController', () => {
  let controller: SpellingCorectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpellingCorectionController],
      providers: [SpellingCorectionService],
    }).compile();

    controller = module.get<SpellingCorectionController>(SpellingCorectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
