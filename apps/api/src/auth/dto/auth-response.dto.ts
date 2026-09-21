import { ApiProperty } from '@nestjs/swagger';

export class SafeUserDto {
  @ApiProperty({ example: 'clv123456789' })
  id!: string;

  @ApiProperty({ example: 'engineer@company.com' })
  email!: string;

  @ApiProperty({ example: 'Alex Chen', nullable: true })
  name!: string | null;

  @ApiProperty({ example: 4, nullable: true })
  yearsExp!: number | null;

  @ApiProperty({ example: 'TypeScript, React, Node.js', nullable: true })
  primaryStack!: string | null;

  @ApiProperty()
  createdAt!: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Short-lived JWT access token (15m)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Long-lived JWT refresh token (7d)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken!: string;

  @ApiProperty({ type: SafeUserDto })
  user!: SafeUserDto;
}
