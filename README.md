# Basit Dosya Yöneticisi

Android için Expo/React Native tabanlı kişisel dosya yöneticisi.

## Özellikler

- Dahili depolamayı listeleme
- Klasörlerde gezinme
- Dosya ve klasör oluşturma
- Yeniden adlandırma
- Kopyalama ve taşıma (hedef klasöre gidip Yapıştır)
- Dosya ve klasör silme
- Android 11+ için Tüm dosyalara erişim ayarına yönlendirme

## APK oluşturma

Node.js 22+ kurulu bir bilgisayarda:

```bash
npm install
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

İlk EAS çalıştırmasında Expo hesabı ve proje yapılandırması istenebilir. Build tamamlandığında EAS doğrudan kurulabilir `.apk` indirme bağlantısı verir.

## İlk açılış

Uygulama dosyaları okuyamazsa **Erişim Ayarını Aç** düğmesine basın. Android'in **Tüm dosyalara erişim** ekranında **Dosya Yöneticisi** uygulamasını etkinleştirin ve uygulamaya geri dönün.

> Android'in koruduğu bazı uygulama-özel dizinleri (özellikle yeni Android sürümlerinde bazı `Android/data` içerikleri) sistem tarafından yine kısıtlanabilir.
