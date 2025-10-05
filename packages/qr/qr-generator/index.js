const QRCode = require('qrcode');

/**
 * DigitalOcean Function - QR Kod Oluşturucu
 *
 * Kullanım:
 * - text: QR koda dönüştürülecek metin/URL (zorunlu)
 * - size: QR kod boyutu (varsayılan: 300)
 * - format: Çıktı formatı: 'base64', 'png', 'svg' (varsayılan: 'base64')
 */

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

async function main(args) {
  // Handle CORS preflight request
  if (args.__ow_method === 'options') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: {}
    };
  }

  try {
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
          headers: { ...corsHeaders, 'Content-Type': 'image/svg+xml' },
          body: qrData
        };

      case 'png':
        const buffer = await QRCode.toBuffer(text, options);
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'image/png' },
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
