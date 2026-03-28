import { Test, TestingModule } from '@nestjs/testing';
import { ColorPaletteService } from './color-palette.service';

describe('ColorPaletteService', () => {
  let service: ColorPaletteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColorPaletteService],
    }).compile();

    service = module.get<ColorPaletteService>(ColorPaletteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
