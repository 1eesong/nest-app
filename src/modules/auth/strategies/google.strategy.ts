import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { SocialConfigService } from 'src/config/social/config.service';
import { RegisterType } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private socialConfigService: SocialConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: socialConfigService.googleClientId as string,
      clientSecret: socialConfigService.googleClientSecret as string,
      callbackURL: socialConfigService.googleCallbackURL as string,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user = await this.usersService.findUserBySocialId(
      profile._json.sub,
      RegisterType.GOOGLE,
    );

    if (user) {
      done(null, user);
      return;
    }

    // 유저가 없는 경우, 회원가입
    const newUser = await this.usersService.createUser({
      email: profile._json.email as string,
      socialId: profile._json.sub,
      name: profile._json.name || '',
      registerType: RegisterType.GOOGLE,
    });

    done(null, newUser);
  }
}
