import { Test, TestingModule } from '@nestjs/testing';
import { Base64ToolService } from './base64-tool.service';

describe('Base64ToolService', () => {
  let service: Base64ToolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Base64ToolService],
    }).compile();

    service = module.get<Base64ToolService>(Base64ToolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
