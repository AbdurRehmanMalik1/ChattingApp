import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class JoinMultipleRoomsDto {
    @IsArray({ message: 'chatIds must be an array of strings' })
    @ArrayNotEmpty({ message: 'chatIds should not be empty' })
    @IsString({ each: true, message: 'Each chatId must be a string' })
    chatIds: string[];
}