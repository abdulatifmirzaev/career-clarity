import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'engineer@company.com',
    description: 'Unique user email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'P@ssw0rd2026',
    description: 'User password (minimum 8 characters)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @ApiPropertyOptional({
    example: 'Alex Chen',
    description: 'Full name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 4,
    description: 'Years of professional software engineering experience',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  yearsExp?: number;

  @ApiPropertyOptional({
    example: 'TypeScript, React, Node.js, PostgreSQL',
    description: 'Primary engineering technologies and stack',
  })
  @IsOptional()
  @IsString()
  primaryStack?: string;
}
