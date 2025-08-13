import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  HttpCode,
  HttpStatus,
  Put
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto, UpdateHabitDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { User } from '../entities';

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async getHabits(@CurrentUser() user: User) {
    return this.habitsService.getHabits(user.id);
  }

  @Post()
  async createHabit(@CurrentUser() user: User, @Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.createHabit(user.id, createHabitDto);
  }

  @Put(':id')
  async updateHabit(
    @Param('id') habitId: string,
    @CurrentUser() user: User,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.updateHabit(habitId, user.id, updateHabitDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHabit(@Param('id') habitId: string, @CurrentUser() user: User) {
    await this.habitsService.deleteHabit(habitId, user.id);
  }

  @Get('dashboard/data')
  async getDashboardData(@CurrentUser() user: User) {
    return this.habitsService.getDashboardData(user.id);
  }

  @Post(':id/complete')
  async toggleCompletion(
    @Param('id') habitId: string,
    @CurrentUser() user: User,
    @Body('date') dateISO: string,
  ) {
    return this.habitsService.toggleCompletion(habitId, user.id, dateISO);
  }

  @Get(':id/completions')
  async getCompletions(@Param('id') habitId: string, @CurrentUser() user: User) {
    return this.habitsService.getCompletionsForHabit(habitId, user.id);
  }
}
