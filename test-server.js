const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Parse JSON bodies
app.use(express.json());

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.sendStatus(200);
});

// Main QR generation endpoint that matches the DigitalOcean function
app.post('/', async (req, res) => {
  try {
    const { text, size = 300, format = 'base64', color, background } = req.body;

    // Metin kontrolü
    if (!text) {
      return res.status(400).json({
        error: 'Lütfen "text" veya "url" parametresi gönderin',
        example: { text: 'https://digitalocean.com' }
      });
    }

    // QR kod seçenekleri
    const options = {
      width: size,
      margin: 2,
      color: {
        dark: color || '#000000',
        light: background || '#FFFFFF'
      }
    };

    // Format'a göre QR kod oluştur
    switch (format) {
      case 'base64':
        const qrData = await QRCode.toDataURL(text, options);
        res.json({
          success: true,
          text: text,
          format: 'base64',
          qrCode: qrData,
          info: 'Base64 formatında - <img src="..." /> ile kullanabilirsiniz'
        });
        break;

      case 'svg':
        const svgData = await QRCode.toString(text, { ...options, type: 'svg' });
        res.set('Content-Type', 'text/plain');
        res.send(svgData);
        break;

      case 'png':
        const buffer = await QRCode.toBuffer(text, options);
        res.set('Content-Type', 'image/png');
        res.send(buffer);
        break;

      default:
        res.status(400).json({
          error: 'Geçersiz format. Kullanılabilir: base64, svg, png',
          receivedFormat: format
        });
    }
  } catch (error) {
    res.status(500).json({
      error: 'QR kod oluşturulurken hata oluştu',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'QR Code Generator API is running' });
});

app.listen(PORT, () => {
  console.log(`QR Code Generator test server running on port ${PORT}`);
  console.log(`Test with: http://localhost:${PORT}`);
});