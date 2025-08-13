import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User, Habit, Completion } from '../entities';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'habit_tracker',
  entities: [User, Habit, Completion],
  autoLoadEntities: true,
  synchronize: (process.env.TYPEORM_SYNC === 'true') || (process.env.NODE_ENV !== 'production'),
  logging: process.env.NODE_ENV === 'development',
  retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS || '5', 10),
  retryDelay: parseInt(process.env.DB_RETRY_DELAY_MS || '2000', 10),
};
