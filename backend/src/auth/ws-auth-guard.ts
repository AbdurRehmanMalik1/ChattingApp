import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { jwtConstants } from './constants';  // Path to your jwt constants file
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client : Socket = context.switchToWs().getClient();  // Get the WebSocket client
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
  
  private extractTokenFromHeader(client: Socket): string {
      const authHeadertoken = client.handshake.auth.token;
      return authHeadertoken ? authHeadertoken.split(' ')[1] : null;
  }
}
