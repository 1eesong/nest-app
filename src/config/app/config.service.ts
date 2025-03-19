import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  jwtService: string | Buffer<ArrayBufferLike> | undefined;
  constructor(private configService: ConfigService) {}

  get JwtSecret() {
    return this.configService.get<string>('app.jwtSecret');
  }

  get jwtRefreshSecret() {
    return this.configService.get<string>('app.jwtRefreshSecret');
  }

  get port() {
    return this.configService.get<number>('app.port');
  }
}
