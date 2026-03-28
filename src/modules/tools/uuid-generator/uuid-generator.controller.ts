import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('uuid-generator')
export class UuidGeneratorController {}
