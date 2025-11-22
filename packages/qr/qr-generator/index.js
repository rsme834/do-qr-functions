const QRCode = require('qrcode');

/**
 * DigitalOcean Function - QR Kod Oluşturucu
 *
 * Kullanım:
 * - text: QR koda dönüştürülecek metin/URL (zorunlu)
 * - size: QR kod boyutu (varsayılan: 300)
 * - format: Çıktı formatı: 'base64', 'png', 'svg' (varsayılan: 'base64')
 */

async function main(args) {
  try {
    // CORS başlıklarını ekle
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin'
    };

    // OPTIONS preflight isteği için yanıt
    if (args.__ow_method === 'options' || args.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    // Parametreleri al
    const text = args.text || args.url;
    const size = args.size || 300;
    const format = args.format || 'base64';

    // Metin kontrolü
    if (!text) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: {
          error: 'Lütfen "text" veya "url" parametresi gönderin',
          example: { text: 'https://digitalocean.com' }
        }
      };
    }

    // QR kod seçenekleri
    const options = {
      width: size,
      margin: 2,
      color: {
        dark: args.color || '#000000',
        light: args.background || '#FFFFFF'
      }
    };

    let qrData;

    // Format'a göre QR kod oluştur
    switch (format) {
      case 'base64':
        qrData = await QRCode.toDataURL(text, options);
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: {
            success: true,
            text: text,
            format: 'base64',
            qrCode: qrData,
            info: 'Base64 formatında - <img src="..." /> ile kullanabilirsiniz'
          }
        };

      case 'svg':
        qrData = await QRCode.toString(text, { ...options, type: 'svg' });
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/plain',
            ...corsHeaders
          },
          body: qrData
        };

      case 'png':
        const buffer = await QRCode.toBuffer(text, options);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'image/png',
            ...corsHeaders
          },
          body: buffer.toString('base64')
        };

      default:
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: {
            error: 'Geçersiz format. Kullanılabilir: base64, svg, png',
            receivedFormat: format
          }
        };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: {
        error: 'QR kod oluşturulurken hata oluştu',
        details: error.message
      }
    };
  }
}

exports.main = main;
