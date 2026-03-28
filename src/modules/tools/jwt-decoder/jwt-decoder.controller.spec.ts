import { Test, TestingModule } from '@nestjs/testing';
import { JwtDecoderController } from './jwt-decoder.controller';

describe('JwtDecoderController', () => {
  let controller: JwtDecoderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JwtDecoderController],
    }).compile();

    controller = module.get<JwtDecoderController>(JwtDecoderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
