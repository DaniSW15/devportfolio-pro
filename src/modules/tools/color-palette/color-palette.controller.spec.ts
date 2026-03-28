import { Test, TestingModule } from '@nestjs/testing';
import { ColorPaletteController } from './color-palette.controller';

describe('ColorPaletteController', () => {
  let controller: ColorPaletteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColorPaletteController],
    }).compile();

    controller = module.get<ColorPaletteController>(ColorPaletteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
