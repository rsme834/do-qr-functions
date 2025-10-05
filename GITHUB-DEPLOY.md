# 🚀 GitHub + DigitalOcean Deploy Rehberi

Git repository hazır! Şimdi GitHub'a yükleyip DigitalOcean ile bağlayalım.

## ✅ Tamamlanan Adımlar

- [x] Git repository başlatıldı
- [x] Dosyalar commit edildi
- [x] Main branch oluşturuldu

---

## 📤 Adım 1: GitHub'da Repository Oluştur

### Seçenek A: GitHub Web Arayüzü (Kolay)

1. [github.com](https://github.com) → Giriş yap
2. Sağ üstte **"+"** → **"New repository"**
3. Repository ayarları:
   - **Repository name:** `do-qr-functions` (veya istediğin isim)
   - **Description:** "QR kod oluşturucu - DigitalOcean Functions"
   - **Public** veya **Private** (önerim: Public - portfolio için)
   - ❌ **README ekleme** (zaten var)
   - ❌ **.gitignore ekleme** (zaten var)
   - ❌ **License ekleme** (isterseniz sonra)
4. **"Create repository"** tıkla

### Seçenek B: GitHub CLI (Hızlı)

```bash
# GitHub CLI kurulu ise
gh repo create do-qr-functions --public --source=. --remote=origin --push
```

---

## 🔗 Adım 2: GitHub'a Push Et

Repository oluşturduktan sonra GitHub'un verdiği URL'yi kullan:

```bash
# SENIN GitHub kullanıcı adınla değiştir
git remote add origin https://github.com/KULLANICI_ADI/do-qr-functions.git

# Push et
git push -u origin main
```

**Örnek:**
```bash
git remote add origin https://github.com/secho/do-qr-functions.git
git push -u origin main
```

### Push sonrası kontrol:
```bash
git remote -v
# origin  https://github.com/KULLANICI_ADI/do-qr-functions.git (fetch)
# origin  https://github.com/KULLANICI_ADI/do-qr-functions.git (push)
```

---

## 🌊 Adım 3: DigitalOcean App Platform'a Bağla

### 1. App Platform'a Git
- [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
- **"Create App"** butonuna tıkla

### 2. GitHub'ı Bağla
- **Service Provider:** GitHub seç
- İlk kez ise: **"Authorize DigitalOcean"** → İzin ver
- **Repository:** `do-qr-functions` seç
- **Branch:** `main` seç
- **"Next"** tıkla

### 3. Kaynak Yapılandırması
DigitalOcean `project.yml` dosyasını otomatik algılar:

✅ **Algılanan yapı:**
- **Type:** Functions
- **Name:** qr-generator
- **Runtime:** Node.js 18
- **Build Command:** Otomatik
- **Package:** qr

Değişiklik gerekmez, **"Next"** tıkla.

### 4. Plan Seç
- **Functions:** Free tier (90,000 GiB-seconds/ay dahil)
- **App Platform:** Free tier (yeterli)
- **"Next"** tıkla

### 5. Environment Variables (İsteğe bağlı)
Şimdilik gerek yok, **"Next"** tıkla.

### 6. App Bilgileri
- **App Name:** `qr-functions` (veya istediğin)
- **Region:** Frankfurt (fra1) öneriyorum
- **"Next"** tıkla

### 7. Review & Deploy
- Tüm ayarları kontrol et
- **"Create Resources"** tıkla

### 8. Deploy Başladı! 🎉
- İlk deploy 2-3 dakika sürer
- **"Building"** → **"Deploying"** → **"Active"** aşamaları

---

## 🔗 Adım 4: URL'yi Al ve Test Et

Deploy tamamlanınca:

1. **App sayfasında** fonksiyon URL'ini göreceksin
2. Şuna benzer bir URL:
   ```
   https://do-qr-functions-xxxxx.ondigitalocean.app/api/qr-generator
   ```

### Test et (cURL):
```bash
curl -X POST \
  "https://do-qr-functions-xxxxx.ondigitalocean.app/api/qr-generator" \
  -H "Content-Type: application/json" \
  -d '{"text": "Merhaba GitHub!"}'
```

### test.html'i güncelle:
1. `test.html` dosyasını aç
2. `YOUR-FUNCTION-URL-HERE` kısmını yeni URL ile değiştir
3. Kaydet ve tarayıcıda aç

---

## 🔄 Otomatik Deploy (En Önemli Kısım!)

Artık her kod değişikliğinde **otomatik deploy** olacak:

```bash
# Kod değiştir
nano packages/qr/qr-generator/index.js

# Commit & Push
git add .
git commit -m "QR kod boyut limiti eklendi"
git push origin main

# DigitalOcean otomatik deploy eder! 🚀
```

App Platform sayfasında **deployments** sekmesinden deploy durumunu izleyebilirsin.

---

## 📊 Deploy Özeti

| Özellik | Durum |
|---------|-------|
| Auto-deploy | ✅ Her git push |
| Rollback | ✅ Tek tıkla eski versiyona dön |
| Preview | ✅ Branch deploy (PRs için) |
| Logs | ✅ Gerçek zamanlı |
| Monitoring | ✅ Metrikler ve alerts |
| Domain | ✅ Custom domain eklenebilir |

---

## 🎯 Sonraki Adımlar

### 1. Custom Domain Ekle (İsteğe bağlı)
App Platform → Settings → Domains → Add Domain

### 2. Environment Variables Ekle
App Platform → Settings → Environment → Add Variable

### 3. Yeni Fonksiyon Ekle
```bash
# Yeni fonksiyon oluştur
mkdir -p packages/image/resizer
# Kod yaz
# project.yml'e ekle
git push
# Otomatik deploy!
```

### 4. Monitoring Kur
App Platform → Insights → Alerts oluştur

---

## ❓ Sorun Giderme

### "Build failed"
- **Logs** sekmesinde hatayı kontrol et
- package.json'da dependency eksik mi?
- project.yml doğru yapılandırılmış mı?

### "Function not responding"
- Runtime doğru mu? (Node.js 18)
- Timeout yeterli mi? (10000 ms)
- Memory yeterli mi? (256 MB)

### "GitHub sync failed"
- App Platform → Settings → Source
- **Reconnect GitHub** dene

### Deploy edilmiyor
- Branch doğru mu? (`main`)
- GitHub webhook aktif mi? (Settings → Webhooks)

---

## 🎓 Pro İpuçları

1. **Branch Protection:** `main` branch'i koru
2. **PR Preview:** Her PR için otomatik preview URL
3. **Staged Deploys:** Test → Production pipeline
4. **Secrets:** Hassas bilgiler için Environment Variables
5. **Monitoring:** Alert'ler kur (hata oranı, response time)

---

## 📈 Ücretsiz Limitler

- **Functions:** 90,000 GiB-seconds/ay
- **Bandwidth:** 100 GB/ay
- **Build Minutes:** 400/ay
- **Domains:** Sınırsız

Öğrenci projeleri için **tamamen ücretsiz!** 🎉

---

## 🔗 Faydalı Linkler

- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [Functions Documentation](https://docs.digitalocean.com/products/functions/)
- [GitHub Actions Integration](https://docs.digitalocean.com/products/app-platform/how-to/manage-deployments/)

---

**🎉 Tebrikler!** Artık GitHub'a her push'ında fonksiyonun otomatik deploy olacak!
