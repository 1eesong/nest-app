import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { UserRole } from 'src/modules/users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: '이메일',
    example: 'test@test.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: '비밀번호',
    example: 'Password123!',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({ type: String, description: '이름', example: 'test' })
  @IsString()
  name: string;
}
