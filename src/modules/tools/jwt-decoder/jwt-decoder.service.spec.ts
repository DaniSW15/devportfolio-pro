import { Test, TestingModule } from '@nestjs/testing';
import { JwtDecoderService } from './jwt-decoder.service';

describe('JwtDecoderService', () => {
  let service: JwtDecoderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtDecoderService],
    }).compile();

    service = module.get<JwtDecoderService>(JwtDecoderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
