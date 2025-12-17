const QRCode = require('qrcode');

/**
 * DigitalOcean Function - QR Kod Oluşturucu
 *
 * Parametreler:
 * - text / url : QR koda dönüştürülecek metin (zorunlu)
 * - size       : QR kod boyutu (varsayılan: 300)
 * - format     : base64 | png | svg (varsayılan: base64)
 * - margin     : Kenar boşluğu (varsayılan: 1)
 * - color      : QR rengi (varsayılan: #000000)
 * - background : Arkaplan rengi (varsayılan: #FFFFFF)
 */

async function main(args) {

  // ✅ CORS headers (manuel eklenmeli)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // ✅ Preflight (OPTIONS) isteğini yakala
  if (args.__ow_method === 'options') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Parametreler
    const text = args.text || args.url;
    const size = parseInt(args.size) || 300;
    const format = args.format || 'base64';
    const margin = args.margin !== undefined ? parseInt(args.margin) : 1;
    const errorCorrectionLevel =
      ['L', 'M', 'Q', 'H'].includes(args.errorCorrectionLevel)
        ? args.errorCorrectionLevel
        : 'M';

    // Zorunlu alan kontrolü
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

    // QR seçenekleri
    const options = {
      width: size,
      margin: margin,
      errorCorrectionLevel: errorCorrectionLevel,
      color: {
        dark: args.color || '#000000',
        light: args.background || '#FFFFFF'
      }
    };

    // 🔁 Format’a göre çıktı
    switch (format) {

      case 'base64': {
        const qr = await QRCode.toDataURL(text, options);
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: {
            success: true,
            format: 'base64',
            text: text,
            qrCode: qr
          }
        };
      }

      case 'svg': {
        const svg = await QRCode.toString(text, { ...options, type: 'svg' });
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'image/svg+xml'
          },
          body: svg
        };
      }

      case 'png': {
        const buffer = await QRCode.toBuffer(text, options);
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'image/png'
          },
          body: buffer.toString('base64')
        };
      }

      default:
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: {
            error: 'Geçersiz format',
            allowedFormats: ['base64', 'svg', 'png'],
            received: format
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
