import { IsString } from "class-validator";

export class JoinRoomDto {
    @IsString()
    chatId: string;
}
