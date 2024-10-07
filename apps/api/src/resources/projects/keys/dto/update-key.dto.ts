import { PartialType } from '@nestjs/swagger';
import { CreateKeyDto } from './create-key.dto';

export class UpdateKeyDto extends PartialType(CreateKeyDto) {}
