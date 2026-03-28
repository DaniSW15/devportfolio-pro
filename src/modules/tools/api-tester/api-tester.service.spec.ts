import { Test, TestingModule } from '@nestjs/testing';
import { ApiTesterService } from './api-tester.service';

describe('ApiTesterService', () => {
  let service: ApiTesterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiTesterService],
    }).compile();

    service = module.get<ApiTesterService>(ApiTesterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
