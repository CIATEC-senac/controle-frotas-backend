import { Storage } from '@google-cloud/storage';

export class GcsService {
  private readonly storage = new Storage();
  private readonly bucketName = process.env.GCS_BUCKET_NAME;

  async getSignedUrl(
    fileName: string,
    contentType = 'application/octet-stream',
  ): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      contentType,
    };

    const [url] = await file.getSignedUrl(options);
    return url;
  }
}
