# Raine Fivem Yönetim

## Proje Hakkında
Bu proje, Discord sunucuları için geliştirilmiş özel bir moderasyon ve yönetim botudur. Bot, sunucu yönetimi, kullanıcı etkileşimi ve moderasyon işlemleri için tasarlanmıştır.

## Özellikler
1. **IC İsim Yönetimi**
   - Yetkililer tarafından kullanıcı isimlerini onaylama/reddetme
   - Otomatik isim değiştirme sistemi
   - İsim uzunluğu kontrolü (32 karakter sınırı)

2. **Moderasyon Özellikleri**
   - Mesaj silme logları
   - Kullanıcı giriş yönetimi
   - Rol otomatik verme sistemi

3. **Veritabanı Entegrasyonu**
   - MongoDB veritabanı bağlantısı
   - Kullanıcı verilerini saklama ve yönetme

4. **Slash Komutları**
   - Modern Discord slash komut sistemi
   - Sağ tık menü komutları
   - Kolay kullanılabilir arayüz

## Kurulum
1. Gerekli paketlerin kurulumu:
```bash
npm install
```

2. Gerekli bağımlılıklar:
- Node.js
- MongoDB
- Discord.js v13.17.1
- Mongoose
- dotenv

3. Yapılandırma:
- `config/Guild.Config.json` dosyasını düzenleyin:
  - Discord bot token
  - Client ID
  - Guild ID
  - Rol ID'leri
  - Log kanal ID'leri

4. Botu başlatma:
```bash
node raine.js
```

## Proje Yapısı
```
├── config/             # Yapılandırma dosyaları
├── database/          # Veritabanı işlemleri
├── events/            # Discord event handlers
├── server/            # Komut dosyaları
├── raine.js           # Ana bot dosyası
├── package.json       # Proje bağımlılıkları
└── ecosystem.config.js # PM2 yapılandırması
```

## Güvenlik
- Bot token'ı ve diğer hassas bilgiler config dosyasında saklanır
- Rol ve yetki kontrolleri
- Hata yönetimi ve loglama sistemi

## Geliştirici
- Yazar: rainesalvo
- Versiyon: 1.0.0
- Lisans: ISC

## Notlar
- Bot, Discord.js v13.17.1 sürümü ile geliştirilmiştir
- MongoDB veritabanı kullanılmaktadır
- Slash komutları ve sağ tık menüleri destekler
- Otomatik rol verme sistemi mevcuttur
- Mesaj silme logları tutulmaktadır 
