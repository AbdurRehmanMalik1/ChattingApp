import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { jwtConstants } from './constants';  // Path to your jwt constants file

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("canActivate is being called");
    const client = context.switchToWs().getClient();  // Get the WebSocket client
    const token = this.extractTokenFromHeader(client);  // Extract token from WebSocket handshake

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      client['user'] = payload;  // Attach user info to the WebSocket client
    } catch (error) {
      throw new WsException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(client: any): string | undefined {
    const token = client.handshake.query.token || client.handshake.headers['authorization'];
    return token ? token.replace('Bearer ', '') : undefined;
  }
}
