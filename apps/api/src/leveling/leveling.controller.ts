import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyDto, LevelComparisonResult } from '@career-clarity/shared-types';
import { CompareLevelDto } from './dto/compare-level.dto';
import { LevelingService } from './leveling.service';

@ApiTags('Leveling Benchmark')
@Controller('leveling')
export class LevelingController {
  constructor(private readonly levelingService: LevelingService) {}

  @Get('companies')
  @ApiOperation({
    summary: 'Get all benchmark tech companies and their normalized level structures',
  })
  @ApiResponse({
    status: 200,
    description: 'List of companies with level details',
  })
  getCompanies(): Promise<CompanyDto[]> {
    return this.levelingService.getAllCompanies();
  }

  @Post('compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Calculate cross-company estimated engineering level based on experience & competencies',
  })
  @ApiResponse({
    status: 200,
    description: 'Level comparison report across Google, Meta, Stripe, and regional tech tiers',
  })
  compareLevel(@Body() dto: CompareLevelDto): Promise<LevelComparisonResult> {
    return this.levelingService.compareLevel(dto);
  }
}
