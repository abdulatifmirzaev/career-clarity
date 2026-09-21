import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { LevelComparisonRequest } from '@career-clarity/shared-types';

export class CompareLevelDto implements LevelComparisonRequest {
  @ApiProperty({
    example: 4,
    description: 'Years of professional software engineering experience',
    minimum: 0,
    maximum: 40,
  })
  @IsInt()
  @Min(0)
  @Max(40)
  @IsNotEmpty()
  yearsExp!: number;

  @ApiPropertyOptional({
    example: 'Senior Software Engineer',
    description: 'Current or most recent official job title',
  })
  @IsOptional()
  @IsString()
  currentTitle?: string;

  @ApiPropertyOptional({
    example: 4,
    description:
      'Self-rated system design & architecture proficiency (1: Fundamentals, 5: Planetary scale)',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  systemDesignScore?: number;

  @ApiPropertyOptional({
    example: 3,
    description:
      'Self-rated technical leadership & cross-functional scope (1: Scoped tasks, 5: Org-wide strategy)',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  leadershipScore?: number;
}
