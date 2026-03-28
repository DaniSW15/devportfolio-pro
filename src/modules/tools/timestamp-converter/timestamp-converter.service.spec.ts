import { Test, TestingModule } from '@nestjs/testing';
import { TimestampConverterService } from './timestamp-converter.service';

describe('TimestampConverterService', () => {
  let service: TimestampConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimestampConverterService],
    }).compile();

    service = module.get<TimestampConverterService>(TimestampConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
