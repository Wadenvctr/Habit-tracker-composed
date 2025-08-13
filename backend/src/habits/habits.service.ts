import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Habit, Completion, User } from '../entities';
import { CreateHabitDto, UpdateHabitDto } from './dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private habitRepository: Repository<Habit>,
    @InjectRepository(Completion)
    private completionRepository: Repository<Completion>,
  ) {}

  async getHabits(userId: string): Promise<Habit[]> {
    return this.habitRepository.find({
      where: { userId },
      relations: ['completions'],
      order: { createdAt: 'DESC' },
    });
  }

  async createHabit(userId: string, createHabitDto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitRepository.create({
      ...createHabitDto,
      userId,
    });

    return this.habitRepository.save(habit);
  }

  async updateHabit(habitId: string, userId: string, updateHabitDto: UpdateHabitDto): Promise<Habit> {
    const habit = await this.habitRepository.findOne({ where: { id: habitId } });
    
    if (!habit) {
      throw new NotFoundException('Привычка не найдена');
    }

    if (habit.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой привычке');
    }

    Object.assign(habit, updateHabitDto);
    return this.habitRepository.save(habit);
  }

  async deleteHabit(habitId: string, userId: string): Promise<void> {
    const habit = await this.habitRepository.findOne({ where: { id: habitId } });
    
    if (!habit) {
      throw new NotFoundException('Привычка не найдена');
    }

    if (habit.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой привычке');
    }

    await this.habitRepository.remove(habit);
  }

  async getCompletionsForHabit(habitId: string, userId: string): Promise<string[]> {
    const habit = await this.habitRepository.findOne({ where: { id: habitId } });
    
    if (!habit) {
      throw new NotFoundException('Привычка не найдена');
    }

    if (habit.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой привычке');
    }

    const completions = await this.completionRepository.find({
      where: { habitId },
      order: { date: 'DESC' },
    });

    return completions.map(completion => completion.date);
  }

  async toggleCompletion(habitId: string, userId: string, dateISO: string): Promise<{ added?: boolean; removed?: boolean }> {
    const habit = await this.habitRepository.findOne({ where: { id: habitId } });
    
    if (!habit) {
      throw new NotFoundException('Привычка не найдена');
    }

    if (habit.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой привычке');
    }

    const existingCompletion = await this.completionRepository.findOne({
      where: { habitId, date: dateISO },
    });

    if (existingCompletion) {
      await this.completionRepository.remove(existingCompletion);
      return { removed: true };
    } else {
      const completion = this.completionRepository.create({
        habitId,
        date: dateISO,
      });
      await this.completionRepository.save(completion);
      return { added: true };
    }
  }

  async getDashboardData(userId: string): Promise<{
    habits: Habit[];
    completions: Record<string, string[]>;
  }> {
    const habits = await this.habitRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const habitIds = habits.map(habit => habit.id);
    const allCompletions = habitIds.length > 0 
      ? await this.completionRepository.find({
          where: { habitId: In(habitIds) },
          order: { date: 'DESC' },
        })
      : [];

    const completions: Record<string, string[]> = {};
    for (const habit of habits) {
      completions[habit.id] = allCompletions
        .filter(completion => completion.habitId === habit.id)
        .map(completion => completion.date);
    }

    return {
      habits,
      completions,
    };
  }
}
