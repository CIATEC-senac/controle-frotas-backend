import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Render } from '@nestjs/common';
import { Buffer } from 'buffer';
import { UserService } from 'src/user/user.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly userService: UserService,
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

    return {
      data: new Date().toLocaleDateString('pt-BR'),

      user: user,

      veiculo: {
        modelo: 'Mercedes Sprinter',
        placa: 'ABC-1234',
        km: '23.456 km',
      },

      rotas: [
        {
          nome: 'Rota 1 - Centro',
          horarioInicio: '08:00',
          horarioFim: '09:30',
          tempo: '1h 30min',
        },
        {
          nome: 'Rota 2 - Bairro A',
          horarioInicio: '10:00',
          horarioFim: '11:15',
          tempo: '1h 15min',
        },
        {
          nome: 'Rota 3 - Bairro B',
          horarioInicio: '13:00',
          horarioFim: '14:00',
          tempo: '1h',
        },
      ],
    };
  }
}
