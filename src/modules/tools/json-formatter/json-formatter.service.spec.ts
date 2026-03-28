import { Test, TestingModule } from '@nestjs/testing';
import { JsonFormatterService } from './json-formatter.service';

describe('JsonFormatterService', () => {
  let service: JsonFormatterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonFormatterService],
    }).compile();

    service = module.get<JsonFormatterService>(JsonFormatterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
