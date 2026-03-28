import { Test, TestingModule } from '@nestjs/testing';
import { TimestampConverterController } from './timestamp-converter.controller';

describe('TimestampConverterController', () => {
  let controller: TimestampConverterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimestampConverterController],
    }).compile();

    controller = module.get<TimestampConverterController>(TimestampConverterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
