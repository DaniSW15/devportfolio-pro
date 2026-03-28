import { Test, TestingModule } from '@nestjs/testing';
import { JsonFormatterController } from './json-formatter.controller';

describe('JsonFormatterController', () => {
  let controller: JsonFormatterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonFormatterController],
    }).compile();

    controller = module.get<JsonFormatterController>(JsonFormatterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
