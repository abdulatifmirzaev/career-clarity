import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AttemptQuestionDto } from './dto/attempt-question.dto';
import { QueryQuestionsDto } from './dto/query-questions.dto';
import { InterviewService } from './interview.service';

@ApiTags('Interview Preparation')
@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get('questions')
  @ApiOperation({
    summary: 'List and filter role & level-calibrated technical interview questions',
  })
  @ApiResponse({ status: 200, description: 'Paginated questions list' })
  getQuestions(@Query() query: QueryQuestionsDto) {
    return this.interviewService.getQuestions(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user question-solving statistics and completion rates' })
  @ApiResponse({ status: 200, description: 'User preparation statistics' })
  getUserStats(@CurrentUser('id') userId: string) {
    return this.interviewService.getUserStats(userId);
  }

  @Get('questions/:id')
  @ApiOperation({ summary: 'Get question details, hints, and architectural deep-dive solutions' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question details' })
  getQuestionById(@Param('id') id: string) {
    return this.interviewService.getQuestionById(id);
  }

  @Post('questions/:id/attempt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark an interview question as solved or save custom notes' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Attempt recorded' })
  recordAttempt(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: AttemptQuestionDto,
  ) {
    return this.interviewService.recordAttempt(userId, id, dto);
  }
}
