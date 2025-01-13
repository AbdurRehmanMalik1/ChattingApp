import { IsNotEmpty, IsString } from "class-validator";

export class JoinRoomDto {
    @IsString({ message: 'chatId must be a string' })
    @IsNotEmpty({ message: 'chatId cannot be empty' })
    chatId: string;
}