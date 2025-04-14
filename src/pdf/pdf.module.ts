import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { UserModule } from 'src/user/user.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { RouteModule } from 'src/route/route.module';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [UserModule, VehicleModule, RouteModule, HistoryModule],
  providers: [PdfService],
  controllers: [PdfController],
  exports: [PdfService],
})
export class PdfModule {}
