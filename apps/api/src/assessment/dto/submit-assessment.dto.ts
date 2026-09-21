import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { QuizAnswer, RoleType, SubmitAssessmentRequest } from '@career-clarity/shared-types';

export class QuizAnswerDto implements QuizAnswer {
  @ApiProperty({ example: 'q-sys-1', description: 'Question unique identifier' })
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @ApiProperty({
    example: 2,
    description: 'Selected option index (0-indexed)',
    minimum: 0,
    maximum: 3,
  })
  @IsInt()
  @Min(0)
  @Max(3)
  selectedOption!: number;
}

export class SubmitAssessmentDto implements SubmitAssessmentRequest {
  @ApiProperty({
    example: 'backend',
    enum: ['backend', 'frontend', 'fullstack', 'ai_engineer'],
    description: 'Target engineering discipline being assessed',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['backend', 'frontend', 'fullstack', 'ai_engineer'])
  role!: RoleType;

  @ApiProperty({
    example: 4,
    description: 'Total professional years of software engineering experience',
    minimum: 0,
    maximum: 40,
  })
  @IsInt()
  @Min(0)
  @Max(40)
  yearsExp!: number;

  @ApiProperty({
    type: [QuizAnswerDto],
    description: 'User answers to diagnostic assessment questions',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers!: QuizAnswerDto[];

  @ApiPropertyOptional({
    example: 'TypeScript, NestJS, PostgreSQL, AWS',
    description: 'Self-reported primary tech stack',
  })
  @IsOptional()
  @IsString()
  primaryStack?: string;
}
