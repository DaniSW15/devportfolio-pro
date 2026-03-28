import { Test, TestingModule } from '@nestjs/testing';
import { SnippetManagerService } from './snippet-manager.service';

describe('SnippetManagerService', () => {
  let service: SnippetManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnippetManagerService],
    }).compile();

    service = module.get<SnippetManagerService>(SnippetManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
