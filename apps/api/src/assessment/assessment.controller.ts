import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AssessmentDto, AssessmentQuizQuestion, RoleType } from '@career-clarity/shared-types';
import { AssessmentService } from './assessment.service';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

@ApiTags('Assessment & Career Clarity Report')
@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Get('quiz')
  @ApiOperation({ summary: 'Get diagnostic quiz questions tailored to an engineering discipline' })
  @ApiQuery({
    name: 'role',
    enum: ['backend', 'frontend', 'fullstack', 'ai_engineer'],
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Diagnostic quiz questions' })
  getQuizQuestions(@Query('role') role?: RoleType): AssessmentQuizQuestion[] {
    return this.assessmentService.getQuizQuestions(role || 'backend');
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Submit onboarding assessment quiz and generate personal Career Clarity Report',
  })
  @ApiResponse({ status: 201, description: 'Career clarity report generated and saved' })
  submitAssessment(
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitAssessmentDto,
  ): Promise<AssessmentDto> {
    return this.assessmentService.submitAssessment(userId, dto);
  }

  @Get('latest')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve the most recent Career Clarity Report for authenticated user',
  })
  @ApiResponse({ status: 200, description: 'Latest assessment report or null' })
  getLatestAssessment(@CurrentUser('id') userId: string): Promise<AssessmentDto | null> {
    return this.assessmentService.getLatestAssessment(userId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve assessment history for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of past assessments' })
  getAssessmentHistory(@CurrentUser('id') userId: string): Promise<AssessmentDto[]> {
    return this.assessmentService.getAssessmentHistory(userId);
  }
}
