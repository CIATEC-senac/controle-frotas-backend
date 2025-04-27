import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { Enterprise } from './enterprise/entities/enterprise.entity';
import { ExcelModule } from './excel/excel.module';
import { HistoryApproval } from './history/entities/history-approval.entity';
import { History } from './history/entities/history.entity';
import { UnplannedStop } from './history/entities/unplanned-stop.entity';
import { HistoryModule } from './history/history.module';
import { AppLoggerMiddleware } from './lib/middlewares/applogger';
import { Maintenance } from './maintenance/entities/maintenance.entity';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { NotificationUser } from './notifications/entities/notification-user.entity';
import { Notification } from './notifications/entities/notification.entity';
import { PdfModule } from './pdf/pdf.module';
import { Route } from './route/entities/route.entity';
import { RouteModule } from './route/route.module';
import { StatsModule } from './stats/stats.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { Vehicle } from './vehicle/entities/vehicle.entity';
import { VehicleModule } from './vehicle/vehicle.module';

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
        UnplannedStop,
        Notification,
        NotificationUser,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    VehicleModule,
    MaintenanceModule,
    RouteModule,
    HistoryModule,
    EnterpriseModule,
    PdfModule,
    ExcelModule,
    StatsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
