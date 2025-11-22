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
  // CORS başlıklarını ekle
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
    'Access-Control-Max-Age': '86400', // 24 saat
    'Content-Type': 'application/json'
  };

  try {
    // OPTIONS preflight isteği için yanıt
    const method = args.__ow_method || args.httpMethod || '';
    if (method.toLowerCase() === 'options') {
      return {
        statusCode: 204, // No Content
        headers: corsHeaders
      };
    }

    // Tüm diğer istekler için CORS header'larını ekle
    const responseHeaders = { ...corsHeaders };

    // Parametreleri al
    const text = args.text || args.url;
    const size = args.size || 300;
    const format = args.format || 'base64';

    // Metin kontrolü
    if (!text) {
      return {
        statusCode: 400,
        headers: responseHeaders,
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
          headers: responseHeaders,
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
            ...responseHeaders,
            'Content-Type': 'text/plain'
          },
          body: qrData
        };

      case 'png':
        const buffer = await QRCode.toBuffer(text, options);
        return {
          statusCode: 200,
          headers: {
            ...responseHeaders,
            'Content-Type': 'image/png'
          },
          body: buffer.toString('base64')
        };

      default:
        return {
          statusCode: 400,
          headers: responseHeaders,
          body: {
            error: 'Geçersiz format. Kullanılabilir: base64, svg, png',
            receivedFormat: format
          }
        };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: {
        error: 'QR kod oluşturulurken hata oluştu',
        details: error.message
      }
    };
  }
}

exports.main = main;
