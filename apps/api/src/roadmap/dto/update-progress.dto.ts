import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SkillProgressStatus, UpdateSkillProgressRequest } from '@career-clarity/shared-types';

export class UpdateSkillProgressDto implements UpdateSkillProgressRequest {
  @ApiProperty({
    example: 'mastered',
    enum: ['not_started', 'in_progress', 'mastered'],
    description: 'Current mastery status for the specified skill',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['not_started', 'in_progress', 'mastered'], {
    message: 'Status must be one of: not_started, in_progress, mastered',
  })
  status!: SkillProgressStatus;
}
