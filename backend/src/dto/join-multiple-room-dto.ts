import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class JoinMultipleRoomsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  chatIds: string[];
}
