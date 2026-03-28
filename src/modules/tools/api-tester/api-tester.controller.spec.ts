import { Test, TestingModule } from '@nestjs/testing';
import { ApiTesterController } from './api-tester.controller';

describe('ApiTesterController', () => {
  let controller: ApiTesterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiTesterController],
    }).compile();

    controller = module.get<ApiTesterController>(ApiTesterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
