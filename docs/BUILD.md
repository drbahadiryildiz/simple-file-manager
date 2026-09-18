# Build

## Gereksinimler

- Node.js / npm
- Expo hesabı
- EAS CLI erişimi

Expo projesi:

- `@dr.bahadiryildiz/simple-file-manager`
- EAS Project ID: `e8f4f83b-ccec-4c44-8e33-f469809cbcd5`

## İlk kurulum

Bağımlılıklar yalnızca ilk kurulumda veya `package.json` değiştiğinde kurulmalıdır:

```bash
npm install
```

## Kurulabilir APK

```bash
npx eas-cli@latest build -p android --profile release
```

Alternatif geliştirme/deneme APK profili:

```bash
npx eas-cli@latest build -p android --profile preview
```

## Google Play AAB

```bash
npx eas-cli@latest build -p android --profile production
```

## Sürüm

Güncel sürüm: `1.3.4`  
Android versionCode: `9`
