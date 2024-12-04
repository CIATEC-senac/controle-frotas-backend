import * as https from 'https';

export async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
  const apiKey = 'AIzaSyBDE4ksnbBdrkh5ZnBl21pZ3V-Ypj5oKQQ'; 
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';

      
      response.on('data', (chunk) => {
        data += chunk;
      });

     
      response.on('end', () => {
        try {
          const result = JSON.parse(data);

      
          if (result.status === 'OK' && result.results[0]) {
            const location = result.results[0].geometry.location;
            resolve({ latitude: location.lat, longitude: location.lng });
          } else {
            reject(new Error(`Endereço não encontrado: ${address}`));
          }
        } catch (error) {
          reject(new Error('Erro ao processar a resposta da API de geocodificação'));
        }
      });
    }).on('error', (error) => {
      reject(new Error('Erro ao consultar a API do geocoding: ' + error.message));
    });
  });
}
