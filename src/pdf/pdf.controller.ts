import { Controller, Get, Param, StreamableFile, Render } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Buffer } from 'buffer';
import { UserService } from 'src/user/user.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { RouteService } from 'src/route/route.service';
import { HistoryService } from 'src/history/history.service';
import * as moment from 'moment';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
    private readonly routeService: RouteService,
    private readonly historyService: HistoryService,
  ) {}

  @Get()
  async printPDF(@Param('id') id: string) {
    const userId = await this.userService.findOneById(Number(id));
    const url = `http://localhost:3000/pdf/print/${userId}`;

    const data = await this.pdfService.generatePdf(url);
    return new StreamableFile(Buffer.from(data));
  }

  @Get('print/:userId')
  @Render('templates/route')
  async renderPDF(@Param('userId') userId: string) {
    const user = await this.userService.findOneById(Number(userId));
    const vehicle = await this.vehicleService.findOneBy(Number(userId));
    const route = await this.routeService.findByDriverId(Number(userId));
    const history = await this.historyService.findAllByDriverId(Number(userId));

    // Tradução do cargo
    const cargoTraduzido = {
      0: 'Administrador',
      1: 'Gerente',
      2: 'Motorista',
    };

    // Tradução do status
    const statusTraduzido = {
      0: 'Pendente',
      1: 'Aprovado',
      2: 'Reprovado',
    };

    // Formatar histórico
    const historicoFormatado = history.map((h) => {
      const start = moment(h.startedAt);
      const end = moment(h.endedAt);

      return {
        ...h,
        data: start.format('DD/MM/YYYY'),
        inicio: start.format('HH:mm'),
        termino: end.format('HH:mm'),
        status: statusTraduzido[h.status] || 'Desconhecido',
      };
    });

    return {
      data: moment().format('DD/MM/YYYY'),
      user: {
        ...user,
        role: cargoTraduzido[user.role] || 'Desconhecido',
      },
      vehicle,
      route,
      history: historicoFormatado,
    };
  }
}
