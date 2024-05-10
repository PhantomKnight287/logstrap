import { IsString } from 'class-validator';

export class CreateApiKeyDTO {
  @IsString()
  name: string;
}
