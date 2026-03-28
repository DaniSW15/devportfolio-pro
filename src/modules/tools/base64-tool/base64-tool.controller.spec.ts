import { Test, TestingModule } from '@nestjs/testing';
import { Base64ToolController } from './base64-tool.controller';

describe('Base64ToolController', () => {
  let controller: Base64ToolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Base64ToolController],
    }).compile();

    controller = module.get<Base64ToolController>(Base64ToolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
