# Simple File Manager v1.3

Android / Expo tabanlı kişisel dosya yöneticisi.

## v1.3'te ana düzeltme

Önceki sürümde React Native dosya sistemi katmanı Android'in geniş depolama izni açık olsa bile mevcut klasörlerin içeriğini okumada tutarsız davranabiliyordu.

Bu sürümde dosya sistemi işlemleri yerel Expo Android modülü üzerinden doğrudan `java.io.File` ile yapılır. Android 11+ için erişim durumu `Environment.isExternalStorageManager()` ile kontrol edilir ve gerektiğinde uygulamanın özel "Tüm dosyalara erişim" ayarı açılır.

Desteklenen işlemler:
- Dahili ortak depolamayı listeleme
- Klasörlere girme / geri çıkma
- Dosya ve klasör oluşturma
- Yeniden adlandırma
- Kopyalama / taşıma / yapıştırma
- Silme
- Dosyayı uygun Android uygulamasıyla açma
- Açık / koyu tema
- A− / A+ görünüm ölçeği
- Safe-area uyumlu üst ve alt alan
- Uygulama ikonu ve splash ekranı
- Hakkında ve geri bildirim e-postası

> Android'in sistem koruması nedeniyle `/Android/data` ve `/Android/obb` gibi bazı alanlar tüm dosyalara erişim verilse dahi kısıtlı olabilir.

## Build

Bu klasör doğrudan mevcut GitHub / EAS proje kökünün üzerine kopyalanmak üzere hazırlanmıştır.

Native modül eklendiği için bu sürümde bir kez `npm install` çalıştırın. Sonra normal Git push ve EAS preview build yeterlidir.


## v1.3.1
- Emülatörde yeniden adlandırma sonrası görülen yanlış hata mesajı giderildi.
- Taşıma/rename işlemleri çift tetiklemeye karşı kilitlendi ve native tarafta idempotent hale getirildi.
- Alt çubuktaki klasör/dosya oluşturma artısı ikonun üzerine alındı.
