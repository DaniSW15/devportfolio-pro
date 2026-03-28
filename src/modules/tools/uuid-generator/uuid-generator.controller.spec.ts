import { Test, TestingModule } from '@nestjs/testing';
import { UuidGeneratorController } from './uuid-generator.controller';

describe('UuidGeneratorController', () => {
  let controller: UuidGeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UuidGeneratorController],
    }).compile();

    controller = module.get<UuidGeneratorController>(UuidGeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
