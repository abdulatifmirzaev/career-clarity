import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  RoadmapNodeDto,
  RoleType,
  SkillDto,
  UserSkillProgressDto,
} from '@career-clarity/shared-types';
import { UpdateSkillProgressDto } from './dto/update-progress.dto';
import { RoadmapService } from './roadmap.service';

@ApiTags('Roadmap & Skills')
@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get('skills')
  @ApiOperation({ summary: 'Get all engineering skills with AI-era relevance tags' })
  @ApiResponse({ status: 200, description: 'List of skills' })
  getAllSkills(): Promise<SkillDto[]> {
    return this.roadmapService.getAllSkills();
  }

  @Get('user/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user overall skill progression summary' })
  @ApiResponse({ status: 200, description: 'Progression summary' })
  getUserProgress(@CurrentUser('id') userId: string) {
    return this.roadmapService.getUserProgressSummary(userId);
  }

  @Get(':role')
  @ApiOperation({
    summary: 'Get interactive skill roadmap graph nodes for a specific engineering role',
  })
  @ApiParam({
    name: 'role',
    enum: ['backend', 'frontend', 'fullstack', 'ai_engineer'],
    description: 'Target engineering discipline',
  })
  @ApiResponse({ status: 200, description: 'Hierarchical roadmap node list' })
  getRoadmapByRole(@Param('role') role: RoleType): Promise<RoadmapNodeDto[]> {
    return this.roadmapService.getRoadmapByRole(role);
  }

  @Patch('skills/:skillId/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user learning progress for a specific skill' })
  @ApiParam({ name: 'skillId', description: 'Unique ID of the skill' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  updateProgress(
    @CurrentUser('id') userId: string,
    @Param('skillId') skillId: string,
    @Body() dto: UpdateSkillProgressDto,
  ): Promise<UserSkillProgressDto> {
    return this.roadmapService.updateSkillProgress(userId, skillId, dto.status);
  }
}
