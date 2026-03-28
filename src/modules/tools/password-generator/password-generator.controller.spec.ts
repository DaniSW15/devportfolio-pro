import { Test, TestingModule } from '@nestjs/testing';
import { PasswordGeneratorController } from './password-generator.controller';

describe('PasswordGeneratorController', () => {
  let controller: PasswordGeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordGeneratorController],
    }).compile();

    controller = module.get<PasswordGeneratorController>(PasswordGeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
