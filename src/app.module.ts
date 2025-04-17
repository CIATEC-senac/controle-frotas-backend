import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppLoggerMiddleware } from './lib/middlewares/applogger';
import { Maintenance } from './maintenance/entities/maintenance.entity';
import { ManutencaoModule } from './maintenance/maintenance.module';
import { Route } from './route/entities/route.entity';
import { RouteModule } from './route/route.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { Vehicle } from './vehicle/entities/vehicle.entity';
import { VehicleModule } from './vehicle/vehicle.module';
import { HistoryModule } from './history/history.module';
import { History } from './history/entities/history.entity';
import { PdfModule } from './pdf/pdf.module';
import { Enterprise } from './enterprise/entities/enterprise.entity';
import { HistoryApproval } from './history/entities/history-approval.entity';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // Nome do serviço do PostgreSQL no docker-compose.yml
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Vehicle,
        Maintenance,
        Route,
        History,
        HistoryApproval,
        Enterprise,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    VehicleModule,
    ManutencaoModule,
    RouteModule,
    HistoryModule,
    PdfModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppLoggerMiddleware)
      .forRoutes('user', 'vehicle', 'maintenance', 'route', 'history', 'pdf');
  }
}
