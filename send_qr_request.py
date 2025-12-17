import requests
import json

def generate_qr_code(url, text, size=300, format='base64', color='#000000', background='#FFFFFF', function_url=None):
    """
    QR kodu oluşturmak için DigitalOcean Function'a istek gönderir
    """
    if function_url is None:
        # Buraya kendi DigitalOcean Function URL'nizi yazın
        # Doğru format: https://$API_HOST/$NAMESPACE/$FUNCTION
      function_url = "https://sea-lion-app-tat7o.ondigitalocean.app/qr/qr-generator"
    
    payload = {
        'text': text,
        'size': size,
        'format': format,
        'color': color,
        'background': background
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(function_url, headers=headers, data=json.dumps(payload))
        
        if response.status_code == 200:
            # If format is SVG, the response is text, not JSON
            if format == 'svg':
                return {
                    'success': True,
                    'qrCode': response.text,
                    'format': 'svg',
                    'text': text
                }, response
            else:
                return response.json(), response
        else:
            print(f"Hata: {response.status_code}")
            print(response.text)
            return None, response
            
    except Exception as e:
        print(f"İstek gönderilirken hata oluştu: {e}")
        return None, None

def save_qr_image(qr_data, filename):
    """
    Base64 formatındaki QR kodu dosyaya kaydeder
    """
    if qr_data.startswith('data:image/png;base64,'):
        import base64
        # Base64 kısmını ayır
        header, encoded = qr_data.split(',', 1)
        # Base64 decode et ve dosyaya yaz
        with open(filename, 'wb') as f:
            f.write(base64.b64decode(encoded))
        print(f"QR kodu {filename} dosyasına kaydedildi")
    else:
        print("Geçersiz QR kodu formatı")

def main():
    # Kullanıcıdan URL girmesini iste
    text = input("QR koduna dönüştürmek istediğiniz URL'yi girin: ").strip()
    
    if not text:
        print("URL boş olamaz!")
        return
    
    # Kullanıcıdan diğer parametreleri de al
    size_input = input("QR kod boyutunu girin (varsayılan 300): ").strip()
    size = int(size_input) if size_input.isdigit() else 300
    
    format_input = input("Format seçin (base64/svg/png - varsayılan base64): ").strip().lower()
    if format_input not in ['base64', 'svg', 'png']:
        format_input = 'base64'
    
    # Renk bilgilerini kullanıcıdan al
    color = input("QR kod rengini girin (hex formatında, varsayılan #000000): ").strip()
    if not color:
        color = '#000000'
    
    background = input("Arka plan rengini girin (hex formatında, varsayılan #FFFFFF): ").strip()
    if not background:
        background = '#FFFFFF'
    
    # URL ve diğer parametrelerle API isteğini gönder
    function_url = ' '  # Kendi URL'nizi buraya yazın
    
    # QR kodu oluştur
    result, response = generate_qr_code(None, text, size=size, format=format_input, color=color, background=background, function_url=function_url)
    
    if result and result.get('success'):
        print("QR kodu başarıyla oluşturuldu!")
        print(f"Format: {result.get('format')}")
        
        # Format tipine göre QR kodu dosyaya kaydet
        format_type = result.get('format')
        qr_code_data = result.get('qrCode')
        
        if format_type == 'base64' and qr_code_data:
            save_qr_image(qr_code_data, 'qr_code.png')
        elif format_type == 'svg' and response:
            # SVG formatında doğrudan string olarak döner
            with open('qr_code.svg', 'w', encoding='utf-8') as f:
                f.write(response.text)
            print("QR kodu qr_code.svg dosyasına kaydedildi")
        elif format_type == 'png' and response:
            # PNG formatı base64 olarak döner mi kontrol et
            if qr_code_data:
                save_qr_image(qr_code_data, 'qr_code.png')
        
        # Konsola QR kodu bilgilerini yaz
        print("\nQR Kodu Bilgileri:")
        print(f"Metin: {result.get('text')}")
        print(f"Format: {result.get('format')}")
        print(f"Boyut: {size}px")
    else:
        print("QR kodu oluşturulamadı")
        if result:
            print(f"Hata: {result.get('error', 'Bilinmeyen hata')}")

if __name__ == '__main__':
    main()
