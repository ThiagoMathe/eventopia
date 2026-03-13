import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        // O '||' garante que se o env falhar, o TS ainda terá uma string
        secretOrKey: config.get<string>('JWT_SECRET') || 'fallback_secret_key', 
    });
  }

  async validate(payload: any) {
    // O que retornarmos aqui será anexado ao req.user
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}