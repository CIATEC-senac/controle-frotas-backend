import { Storage } from '@google-cloud/storage';

export class GcsService {
  // Cria uma instância do GCS
  private readonly storage = new Storage();
  // Nome do bucket, obtido nas variáveis de ambiente
  private readonly bucketName = process.env.GCS_BUCKET_NAME;

  async getSignedUrl(
    fileName: string, // Nome do arquivo que será enviado
    contentType = 'application/octet-stream', // Tipo do conteúdo que será enviado
  ): Promise<string> {
    // Acessa o bucket especificado
    const bucket = this.storage.bucket(this.bucketName);
    // Acessa (ou cria referência) ao arquivo dentro do bucket
    const file = bucket.file(fileName);

    // Define as opções para gerar a URL assinada
    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      contentType,
    };

    // Gera a URL assinada usando as opções acima
    const [url] = await file.getSignedUrl(options);
    return url; // Retorna a URL assinada
  }
}
