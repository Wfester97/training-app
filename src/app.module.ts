import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        console.log('DB_HOST', process.env.DB_HOST);
        console.log('DB_PORT', process.env.DB_PORT);
        console.log('DB_USER', process.env.DB_USER);
        console.log(
          'DB_PASS type/len',
          typeof process.env.DB_PASS,
          process.env.DB_PASS ? process.env.DB_PASS.length : 'EMPTY',
        );
        console.log('DB_NAME', process.env.DB_NAME);

        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,   
          database: process.env.DB_NAME,
          synchronize: true,            
          autoLoadEntities: true,
        };
      },
    }),

    UsersModule,
  ],
})
export class AppModule {}
