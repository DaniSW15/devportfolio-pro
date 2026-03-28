import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('timestamp-converter')
export class TimestampConverterController {}
