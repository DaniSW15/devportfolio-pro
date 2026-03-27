import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from 'src/config/config/config.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.database.host,
                port: configService.database.port,
                username: configService.database.username,
                password: configService.database.password,
                database: configService.database.database,
                autoLoadEntities: true,
                entities: [__dirname + '/../../modules/**/*.entity{.ts}'],
                synchronize: configService.nodeEnv !== 'production',
                logging: configService.nodeEnv === 'development',
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
                migrationsRun: false,
            }),
        }),
    ],
})
export class DatabaseModule { }
