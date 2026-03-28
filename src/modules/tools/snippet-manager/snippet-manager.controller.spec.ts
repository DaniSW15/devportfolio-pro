import { Test, TestingModule } from '@nestjs/testing';
import { SnippetManagerController } from './snippet-manager.controller';

describe('SnippetManagerController', () => {
  let controller: SnippetManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnippetManagerController],
    }).compile();

    controller = module.get<SnippetManagerController>(SnippetManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
