import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AttemptQuestionDto {
  @ApiProperty({
    example: true,
    description: 'Whether the user successfully solved/understood the question',
  })
  @IsBoolean()
  @IsNotEmpty()
  solved!: boolean;

  @ApiPropertyOptional({
    example: 'Good discussion on sliding window counters with Redis Lua script.',
    description: 'Optional personal notes on the solution approach',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
