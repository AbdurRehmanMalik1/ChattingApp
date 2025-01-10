import { ConfigService } from '@nestjs/config';

export const jwtConstants = {
  // Define the constant as a function that can be injected and accessed properly
  get secret() {
    const configService = new ConfigService();
    return configService.get<string>('JWT_SECRET');
  },
};