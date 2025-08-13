import { IsString, IsNumber, IsOptional, Min, Max, Length } from 'class-validator';

export class CreateHabitDto {
  @IsString({ message: 'Название привычки должно быть строкой' })
  @Length(3, 30, { message: 'Название привычки должно содержать от 3 до 30 символов' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @Length(0, 200, { message: 'Описание не должно превышать 200 символов' })
  description?: string;

  @IsNumber({}, { message: 'Количество дней должно быть числом' })
  @Min(1, { message: 'Количество дней должно быть больше 0' })
  @Max(365, { message: 'Количество дней не может превышать 365' })
  goalDays: number;

  @IsOptional()
  @IsString({ message: 'Иконка должна быть строкой' })
  icon?: string;
}
