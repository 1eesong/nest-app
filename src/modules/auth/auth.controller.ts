import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogInDto } from './dto/log-in.dto';
import { RequestOrigin } from 'src/decorators/request-origin.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { GoogleAuthGuard } from './guards/google.guard';

@ApiTags('유저 인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '유저 인증',
    description: '유저 로그인, 유저 등록 api 입니다.',
  })
  @ApiResponse({
    type: ResponseRegisterDto,
    status: HttpStatus.CREATED,
  })
  @ApiBody({
    type: RegisterDto,
  })
  @Post('signup')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseRegisterDto> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: '유저 로그인',
    description: '유저 로그인 api',
  })
  @ApiBody({
    type: LogInDto,
  })
  @Post('signin')
  async logIn(
    @Body() logInDto: LogInDto,
    @RequestOrigin() origin,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken, accessOptions, refreshOptions } =
      await this.authService.logIn(logInDto, origin);

    res.cookie('Authentication', accessToken, accessOptions);
    res.cookie('Refresh', refreshToken, refreshOptions);

    return res.json({
      message: '로그인 성공!',
      accessToken,
      refreshToken,
    });
  }

  @Get('signin/google')
  @UseGuards(GoogleAuthGuard)
  googleLogIn() {}

  @Get('signin/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(
    @RequestUser() user: User,
    @RequestOrigin() origin: string,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken, accessOptions, refreshOptions } =
      this.authService.googleLogin(user.email, origin);

    res.cookie('Authentication', accessToken, accessOptions);
    res.cookie('Refresh', refreshToken, refreshOptions);

    return res.json({
      message: '로그인 성공!',
      accessToken,
      refreshToken,
    });
  }

  @Post('signout')
  signOut(@Res() res: Response, @RequestOrigin() origin: string) {
    const { accessOptions, refreshOptions } =
      this.authService.expireJwtToken(origin);
    res.cookie('Authentication', '', accessOptions);
    res.cookie('Refresh', '', refreshOptions);

    res.json({
      message: '로그아웃 완료',
    });
  }

  // @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(JwtAuthGuard)
  // @Post('upload-profile')
  // async uploadProfile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @RequestUser() user: User,
  // ) {
  //   // const resultUrl = await this.authService.uploadProfile(file, user);
  //   // return { resultUrl };
  // }
}
