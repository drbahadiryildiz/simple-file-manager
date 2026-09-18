export type Language = 'en' | 'tr' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'ru';

export type TranslationKey =
  | 'fileManager'
  | 'opening'
  | 'decreaseView'
  | 'increaseView'
  | 'switchLightTheme'
  | 'switchDarkTheme'
  | 'about'
  | 'goUp'
  | 'changeStorage'
  | 'sort'
  | 'refresh'
  | 'toCopy'
  | 'toMove'
  | 'clipboardHint'
  | 'paste'
  | 'filesLoading'
  | 'protectedFolder'
  | 'fileAccessRequired'
  | 'folderOpenFailed'
  | 'protectedFolderMessage'
  | 'permissionScreenMessage'
  | 'folderRestricted'
  | 'openSpecialAccess'
  | 'goParent'
  | 'tryAgain'
  | 'emptyFolder'
  | 'folder'
  | 'createFolder'
  | 'createFile'
  | 'sortTitle'
  | 'sortNameAsc'
  | 'sortNameDesc'
  | 'sortSizeAsc'
  | 'sortSizeDesc'
  | 'sortDateDesc'
  | 'sortDateAsc'
  | 'foldersFirst'
  | 'close'
  | 'storage'
  | 'internalStorage'
  | 'externalStorage'
  | 'genericStorage'
  | 'phoneStorage'
  | 'externalStorageHint'
  | 'extraStorage'
  | 'open'
  | 'copy'
  | 'move'
  | 'rename'
  | 'delete'
  | 'cancel'
  | 'newFolder'
  | 'newFile'
  | 'save'
  | 'version'
  | 'aboutDescription'
  | 'contact'
  | 'openStorageSettings'
  | 'feedbackHint'
  | 'reportBug'
  | 'requestFeature'
  | 'requestEdit'
  | 'language'
  | 'chooseLanguage'
  | 'invalidNameTitle'
  | 'invalidNameMessage'
  | 'writeAccessUnverified'
  | 'itemExists'
  | 'operationFailed'
  | 'deleteConfirmTitle'
  | 'deleteFolderConfirm'
  | 'deleteFileConfirm'
  | 'deleteFailed'
  | 'invalidDestination'
  | 'invalidDestinationMessage'
  | 'sameFolder'
  | 'sameFolderMessage'
  | 'sameNameTitle'
  | 'overwriteMessage'
  | 'overwrite'
  | 'copiedTitle'
  | 'copiedMessage'
  | 'emailFailed'
  | 'contactPrefix'
  | 'permissionScreenFailed'
  | 'permissionScreenFailedMessage'
  | 'unknownError'
  | 'protectedErrorSuffix'
  | 'permissionErrorSuffix'
  | 'later'
  | 'permissionPromptMessage'
  | 'permissionScreenOpen'
  | 'fileOpenFailed'
  | 'storageWriteAccessMissing'
  | 'storageUnavailable'
  | 'defaultNewFolderName'
  | 'defaultNewFileName'
  | 'feedbackBug'
  | 'feedbackFeature'
  | 'feedbackEdit'
  | 'descriptionLabel'
  | 'deviceAndroidLabel';

export const LANGUAGES: Array<{ code: Language; nativeName: string }> = [
  { code: 'en', nativeName: 'English' },
  { code: 'tr', nativeName: 'Türkçe' },
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'fr', nativeName: 'Français' },
  { code: 'es', nativeName: 'Español' },
  { code: 'it', nativeName: 'Italiano' },
  { code: 'pt', nativeName: 'Português' },
  { code: 'ru', nativeName: 'Русский' },
];

export const LANGUAGE_LOCALES: Record<Language, string> = {
  en: 'en-US',
  tr: 'tr-TR',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  it: 'it-IT',
  pt: 'pt-PT',
  ru: 'ru-RU',
};

const en: Record<TranslationKey, string> = {
  fileManager: 'File Manager',
  opening: 'Opening…',
  decreaseView: 'Decrease view size',
  increaseView: 'Increase view size',
  switchLightTheme: 'Switch to light theme',
  switchDarkTheme: 'Switch to dark theme',
  about: 'About',
  goUp: 'Go to parent folder',
  changeStorage: 'Change storage',
  sort: 'Sort',
  refresh: 'Refresh',
  toCopy: 'To copy',
  toMove: 'To move',
  clipboardHint: 'Go to the destination folder and tap Paste.',
  paste: 'Paste',
  filesLoading: 'Reading files…',
  protectedFolder: 'Folder protected by Android',
  fileAccessRequired: 'File access required',
  folderOpenFailed: 'Folder could not be opened',
  protectedFolderMessage: 'Android additionally protects other apps’ data inside Android/data and Android/obb.',
  permissionScreenMessage: 'The normal app permissions screen is not enough. Enable Simple File Manager in Android’s special “All files access” screen.',
  folderRestricted: 'This folder may be restricted by the device or Android.',
  openSpecialAccess: 'Open special file access',
  goParent: 'Go to parent folder',
  tryAgain: 'Try again',
  emptyFolder: 'This folder is empty.',
  folder: 'Folder',
  createFolder: 'Create folder',
  createFile: 'Create file',
  sortTitle: 'Sort',
  sortNameAsc: 'Name (A → Z)',
  sortNameDesc: 'Name (Z → A)',
  sortSizeAsc: 'Size (Small → Large)',
  sortSizeDesc: 'Size (Large → Small)',
  sortDateDesc: 'Date (Newest → Oldest)',
  sortDateAsc: 'Date (Oldest → Newest)',
  foldersFirst: 'Folders are always shown above files.',
  close: 'Close',
  storage: 'Storage',
  internalStorage: 'Internal Storage',
  externalStorage: 'External Storage',
  genericStorage: 'Storage',
  phoneStorage: 'Phone shared storage',
  externalStorageHint: 'SD card or USB storage',
  extraStorage: 'Additional storage',
  open: 'Open',
  copy: 'Copy',
  move: 'Move',
  rename: 'Rename',
  delete: 'Delete',
  cancel: 'Cancel',
  newFolder: 'New folder',
  newFile: 'New file',
  save: 'Save',
  version: 'Version',
  aboutDescription: 'A simple, offline Android file manager focused on local file operations.',
  contact: 'Contact',
  openStorageSettings: 'Open special file access setting',
  feedbackHint: 'You can send a bug report, feature request or edit request by email.',
  reportBug: 'Report bug',
  requestFeature: 'Request feature',
  requestEdit: 'Request edit',
  language: 'Language',
  chooseLanguage: 'Choose language',
  invalidNameTitle: 'Invalid name',
  invalidNameMessage: 'File and folder names cannot contain / or \\.',
  writeAccessUnverified: 'File write permission could not be verified.',
  itemExists: 'A file or folder with this name already exists.',
  operationFailed: 'Operation failed',
  deleteConfirmTitle: 'Delete?',
  deleteFolderConfirm: '“{name}” and everything inside it will be permanently deleted.',
  deleteFileConfirm: '“{name}” will be permanently deleted.',
  deleteFailed: 'Could not delete',
  invalidDestination: 'Invalid destination',
  invalidDestinationMessage: 'A folder cannot be copied or moved into itself or one of its subfolders.',
  sameFolder: 'Same folder',
  sameFolderMessage: 'Source and destination are the same.',
  sameNameTitle: 'An item with the same name exists',
  overwriteMessage: '“{name}” already exists in the destination folder. Overwrite it?',
  overwrite: 'Overwrite',
  copiedTitle: 'Copied',
  copiedMessage: '“{name}” was copied to this folder.',
  emailFailed: 'Email app could not be opened',
  contactPrefix: 'Contact',
  permissionScreenFailed: 'Permission screen could not be opened',
  permissionScreenFailedMessage: 'Android’s special file access screen could not be opened.',
  unknownError: 'Unknown error',
  protectedErrorSuffix: 'Android protects Android/data and Android/obb contents belonging to other apps at the system level. Operations are not available in these protected folders.',
  permissionErrorSuffix: 'The normal “App permissions” page is not enough. Make sure Simple File Manager is enabled in the special “All files access” screen.',
  later: 'Later',
  permissionPromptMessage: 'Simple File Manager needs Android’s special “All files access” permission. This is different from the normal app permissions screen.',
  permissionScreenOpen: 'Open permission screen',
  fileOpenFailed: 'File could not be opened',
  storageWriteAccessMissing: 'Storage may be readable, but file write access is not available. Enable the special “All files access” permission.',
  storageUnavailable: 'Storage is not accessible.',
  defaultNewFolderName: 'New folder',
  defaultNewFileName: 'new_file.txt',
  feedbackBug: 'Bug Report',
  feedbackFeature: 'Feature Request',
  feedbackEdit: 'Edit Request',
  descriptionLabel: 'Description',
  deviceAndroidLabel: 'Device / Android version (if known)',
};

const translations: Record<Language, Partial<Record<TranslationKey, string>>> = {
  en,
  tr: {
    fileManager: 'Dosya Yöneticisi', opening: 'Açılıyor…', decreaseView: 'Görünümü küçült', increaseView: 'Görünümü büyüt',
    switchLightTheme: 'Açık temaya geç', switchDarkTheme: 'Karanlık temaya geç', about: 'Hakkında', goUp: 'Üst klasöre çık',
    changeStorage: 'Depolama birimini değiştir', sort: 'Sıralama', refresh: 'Yenile', toCopy: 'Kopyalanacak', toMove: 'Taşınacak',
    clipboardHint: 'Hedef klasöre gidip Yapıştır’a bas.', paste: 'Yapıştır', filesLoading: 'Dosyalar okunuyor…',
    protectedFolder: 'Android tarafından korunan klasör', fileAccessRequired: 'Dosya erişimi gerekli', folderOpenFailed: 'Klasör açılamadı',
    protectedFolderMessage: 'Android/data ve Android/obb içindeki diğer uygulama verileri Android tarafından ayrıca korunur.',
    permissionScreenMessage: 'Normal “Uygulama izinleri” ekranı yeterli değildir. Android’in özel “Tüm dosyalara erişim” ekranında Simple File Manager anahtarını açın.',
    folderRestricted: 'Bu klasör cihaz veya sistem tarafından kısıtlanıyor olabilir.', openSpecialAccess: 'Özel Dosya Erişimi İznini Aç',
    goParent: 'Üst Klasöre Dön', tryAgain: 'Tekrar Dene', emptyFolder: 'Bu klasör boş.', folder: 'Klasör',
    createFolder: 'Klasör oluştur', createFile: 'Dosya oluştur', sortTitle: 'Sıralama', sortNameAsc: 'Ada göre (A → Z)',
    sortNameDesc: 'Ada göre (Z → A)', sortSizeAsc: 'Boyuta göre (Küçük → Büyük)', sortSizeDesc: 'Boyuta göre (Büyük → Küçük)',
    sortDateDesc: 'Tarihe göre (Yeni → Eski)', sortDateAsc: 'Tarihe göre (Eski → Yeni)', foldersFirst: 'Klasörler her zaman dosyaların üstünde gösterilir.',
    close: 'Kapat', storage: 'Depolama', internalStorage: 'Dahili Depolama', externalStorage: 'Harici Depolama', genericStorage: 'Depolama',
    phoneStorage: 'Telefonun ortak depolama alanı', externalStorageHint: 'SD kart veya USB depolama', extraStorage: 'Ek depolama alanı',
    open: 'Aç', copy: 'Kopyala', move: 'Taşı', rename: 'Yeniden adlandır', delete: 'Sil', cancel: 'Vazgeç',
    newFolder: 'Yeni klasör', newFile: 'Yeni dosya', save: 'Kaydet', version: 'Sürüm',
    aboutDescription: 'Basit, çevrimdışı ve yerel dosya işlemlerine odaklanan Android dosya yöneticisi.', contact: 'İletişim',
    openStorageSettings: 'Özel dosya erişimi ayarını aç', feedbackHint: 'Hata, özellik veya düzenleme talebinizi e-posta ile iletebilirsiniz.',
    reportBug: 'Hata bildir', requestFeature: 'Özellik iste', requestEdit: 'Düzenleme iste', language: 'Dil', chooseLanguage: 'Dil seçin',
    invalidNameTitle: 'Geçersiz ad', invalidNameMessage: 'Dosya veya klasör adında / veya \\ karakteri kullanılamaz.',
    writeAccessUnverified: 'Dosya yazma yetkisi doğrulanamadı.', itemExists: 'Bu isimde bir dosya veya klasör zaten var.',
    operationFailed: 'İşlem başarısız', deleteConfirmTitle: 'Silinsin mi?', deleteFolderConfirm: '“{name}” klasörü ve içindekiler kalıcı olarak silinecek.',
    deleteFileConfirm: '“{name}” kalıcı olarak silinecek.', deleteFailed: 'Silinemedi', invalidDestination: 'Geçersiz hedef',
    invalidDestinationMessage: 'Bir klasör kendi içine veya alt klasörlerinden birine kopyalanamaz/taşınamaz.', sameFolder: 'Aynı klasör',
    sameFolderMessage: 'Kaynak ve hedef aynı.', sameNameTitle: 'Aynı isimde öğe var',
    overwriteMessage: 'Hedef klasörde “{name}” zaten var. Mevcut öğenin üzerine yazılsın mı?', overwrite: 'Üzerine Yaz',
    copiedTitle: 'Kopyalandı', copiedMessage: '“{name}” bu klasöre kopyalandı.', emailFailed: 'E-posta açılamadı',
    contactPrefix: 'İletişim', permissionScreenFailed: 'İzin ekranı açılamadı', permissionScreenFailedMessage: 'Android özel dosya erişimi ekranı açılamadı.',
    unknownError: 'Bilinmeyen hata', protectedErrorSuffix: 'Android, diğer uygulamalara ait Android/data ve Android/obb içeriklerini sistem düzeyinde korur. Bu özel klasörlerde işlem yapılamaz.',
    permissionErrorSuffix: '“Uygulama izinleri” sayfası yeterli değildir. Özel “Tüm dosyalara erişim” ekranında Simple File Manager anahtarının açık olduğundan emin olun.',
    later: 'Sonra', permissionPromptMessage: 'Simple File Manager için Android’in özel “Tüm dosyalara erişim” yetkisini açmanız gerekiyor. Normal uygulama izinleri ekranından farklıdır.',
    permissionScreenOpen: 'İzin Ekranını Aç', fileOpenFailed: 'Dosya açılamadı',
    storageWriteAccessMissing: 'Depolama okunabiliyor olabilir ancak dosya yazma yetkisi yok. “Tüm dosyalara erişim” özel iznini açın.',
    storageUnavailable: 'Depolamaya erişilemiyor.', defaultNewFolderName: 'Yeni klasör', defaultNewFileName: 'yeni_dosya.txt',
    feedbackBug: 'Hata Bildirimi', feedbackFeature: 'Özellik Talebi', feedbackEdit: 'Düzenleme Talebi',
    descriptionLabel: 'Açıklama', deviceAndroidLabel: 'Cihaz / Android sürümü (varsa)',
  },
  de: {
    fileManager: 'Dateimanager', opening: 'Wird geöffnet…', decreaseView: 'Ansicht verkleinern', increaseView: 'Ansicht vergrößern',
    switchLightTheme: 'Zum hellen Design wechseln', switchDarkTheme: 'Zum dunklen Design wechseln', about: 'Info', goUp: 'Zum übergeordneten Ordner',
    changeStorage: 'Speicher wechseln', sort: 'Sortieren', refresh: 'Aktualisieren', toCopy: 'Zu kopieren', toMove: 'Zu verschieben',
    clipboardHint: 'Zielordner öffnen und Einfügen wählen.', paste: 'Einfügen', filesLoading: 'Dateien werden gelesen…',
    protectedFolder: 'Von Android geschützter Ordner', fileAccessRequired: 'Dateizugriff erforderlich', folderOpenFailed: 'Ordner konnte nicht geöffnet werden',
    protectedFolderMessage: 'Android schützt Daten anderer Apps in Android/data und Android/obb zusätzlich.',
    permissionScreenMessage: 'Die normalen App-Berechtigungen reichen nicht aus. Aktivieren Sie Simple File Manager unter „Zugriff auf alle Dateien“.',
    folderRestricted: 'Dieser Ordner kann vom Gerät oder von Android eingeschränkt sein.', openSpecialAccess: 'Speziellen Dateizugriff öffnen',
    goParent: 'Zum übergeordneten Ordner', tryAgain: 'Erneut versuchen', emptyFolder: 'Dieser Ordner ist leer.', folder: 'Ordner',
    createFolder: 'Ordner erstellen', createFile: 'Datei erstellen', sortTitle: 'Sortieren', sortNameAsc: 'Name (A → Z)', sortNameDesc: 'Name (Z → A)',
    sortSizeAsc: 'Größe (Klein → Groß)', sortSizeDesc: 'Größe (Groß → Klein)', sortDateDesc: 'Datum (Neu → Alt)', sortDateAsc: 'Datum (Alt → Neu)',
    foldersFirst: 'Ordner werden immer über Dateien angezeigt.', close: 'Schließen', storage: 'Speicher', internalStorage: 'Interner Speicher',
    externalStorage: 'Externer Speicher', genericStorage: 'Speicher', phoneStorage: 'Gemeinsamer Telefonspeicher', externalStorageHint: 'SD-Karte oder USB-Speicher',
    extraStorage: 'Zusätzlicher Speicher', open: 'Öffnen', copy: 'Kopieren', move: 'Verschieben', rename: 'Umbenennen', delete: 'Löschen', cancel: 'Abbrechen',
    newFolder: 'Neuer Ordner', newFile: 'Neue Datei', save: 'Speichern', version: 'Version',
    aboutDescription: 'Ein einfacher Offline-Dateimanager für lokale Android-Dateioperationen.', contact: 'Kontakt',
    openStorageSettings: 'Einstellung für speziellen Dateizugriff öffnen', feedbackHint: 'Fehler, Funktionswünsche oder Änderungswünsche können per E-Mail gesendet werden.',
    reportBug: 'Fehler melden', requestFeature: 'Funktion anfragen', requestEdit: 'Änderung anfragen', language: 'Sprache', chooseLanguage: 'Sprache wählen',
    invalidNameTitle: 'Ungültiger Name', invalidNameMessage: 'Datei- und Ordnernamen dürfen / oder \\ nicht enthalten.',
    writeAccessUnverified: 'Schreibzugriff konnte nicht bestätigt werden.', itemExists: 'Eine Datei oder ein Ordner mit diesem Namen existiert bereits.',
    operationFailed: 'Vorgang fehlgeschlagen', deleteConfirmTitle: 'Löschen?', deleteFolderConfirm: '„{name}“ und der gesamte Inhalt werden dauerhaft gelöscht.',
    deleteFileConfirm: '„{name}“ wird dauerhaft gelöscht.', deleteFailed: 'Löschen fehlgeschlagen', invalidDestination: 'Ungültiges Ziel',
    invalidDestinationMessage: 'Ein Ordner kann nicht in sich selbst oder einen Unterordner kopiert/verschoben werden.', sameFolder: 'Gleicher Ordner',
    sameFolderMessage: 'Quelle und Ziel sind identisch.', sameNameTitle: 'Element mit gleichem Namen vorhanden',
    overwriteMessage: '„{name}“ ist im Zielordner bereits vorhanden. Überschreiben?', overwrite: 'Überschreiben',
    copiedTitle: 'Kopiert', copiedMessage: '„{name}“ wurde in diesen Ordner kopiert.', emailFailed: 'E-Mail-App konnte nicht geöffnet werden',
    contactPrefix: 'Kontakt', permissionScreenFailed: 'Berechtigungsseite konnte nicht geöffnet werden', permissionScreenFailedMessage: 'Die Android-Seite für speziellen Dateizugriff konnte nicht geöffnet werden.',
    unknownError: 'Unbekannter Fehler', protectedErrorSuffix: 'Android schützt Android/data und Android/obb anderer Apps auf Systemebene. In diesen Ordnern sind keine Aktionen möglich.',
    permissionErrorSuffix: 'Die normale Berechtigungsseite reicht nicht aus. Aktivieren Sie Simple File Manager unter „Zugriff auf alle Dateien“.',
    later: 'Später', permissionPromptMessage: 'Simple File Manager benötigt Androids spezielle Berechtigung „Zugriff auf alle Dateien“.',
    permissionScreenOpen: 'Berechtigungsseite öffnen', fileOpenFailed: 'Datei konnte nicht geöffnet werden',
    storageWriteAccessMissing: 'Der Speicher ist möglicherweise lesbar, aber Schreibzugriff fehlt. Aktivieren Sie „Zugriff auf alle Dateien“.',
    storageUnavailable: 'Auf den Speicher kann nicht zugegriffen werden.', defaultNewFolderName: 'Neuer Ordner', defaultNewFileName: 'neue_datei.txt',
    feedbackBug: 'Fehlerbericht', feedbackFeature: 'Funktionswunsch', feedbackEdit: 'Änderungswunsch', descriptionLabel: 'Beschreibung',
    deviceAndroidLabel: 'Gerät / Android-Version (falls bekannt)',
  },
  fr: {
    fileManager: 'Gestionnaire de fichiers', opening: 'Ouverture…', decreaseView: 'Réduire l’affichage', increaseView: 'Agrandir l’affichage',
    switchLightTheme: 'Passer au thème clair', switchDarkTheme: 'Passer au thème sombre', about: 'À propos', goUp: 'Dossier parent',
    changeStorage: 'Changer de stockage', sort: 'Trier', refresh: 'Actualiser', toCopy: 'À copier', toMove: 'À déplacer',
    clipboardHint: 'Ouvrez le dossier de destination puis appuyez sur Coller.', paste: 'Coller', filesLoading: 'Lecture des fichiers…',
    protectedFolder: 'Dossier protégé par Android', fileAccessRequired: 'Accès aux fichiers requis', folderOpenFailed: 'Impossible d’ouvrir le dossier',
    protectedFolderMessage: 'Android protège également les données des autres applications dans Android/data et Android/obb.',
    permissionScreenMessage: 'Les autorisations normales ne suffisent pas. Activez Simple File Manager dans « Accès à tous les fichiers ».',
    folderRestricted: 'Ce dossier peut être restreint par l’appareil ou Android.', openSpecialAccess: 'Ouvrir l’accès spécial aux fichiers',
    goParent: 'Dossier parent', tryAgain: 'Réessayer', emptyFolder: 'Ce dossier est vide.', folder: 'Dossier',
    createFolder: 'Créer un dossier', createFile: 'Créer un fichier', sortTitle: 'Trier', sortNameAsc: 'Nom (A → Z)', sortNameDesc: 'Nom (Z → A)',
    sortSizeAsc: 'Taille (Petite → Grande)', sortSizeDesc: 'Taille (Grande → Petite)', sortDateDesc: 'Date (Récent → Ancien)', sortDateAsc: 'Date (Ancien → Récent)',
    foldersFirst: 'Les dossiers sont toujours affichés avant les fichiers.', close: 'Fermer', storage: 'Stockage', internalStorage: 'Stockage interne',
    externalStorage: 'Stockage externe', genericStorage: 'Stockage', phoneStorage: 'Stockage partagé du téléphone', externalStorageHint: 'Carte SD ou stockage USB',
    extraStorage: 'Stockage supplémentaire', open: 'Ouvrir', copy: 'Copier', move: 'Déplacer', rename: 'Renommer', delete: 'Supprimer', cancel: 'Annuler',
    newFolder: 'Nouveau dossier', newFile: 'Nouveau fichier', save: 'Enregistrer', version: 'Version',
    aboutDescription: 'Un gestionnaire de fichiers Android simple et hors ligne, centré sur les opérations locales.', contact: 'Contact',
    openStorageSettings: 'Ouvrir le réglage d’accès spécial', feedbackHint: 'Vous pouvez envoyer par e-mail un bug, une demande de fonctionnalité ou de modification.',
    reportBug: 'Signaler un bug', requestFeature: 'Demander une fonction', requestEdit: 'Demander une modification', language: 'Langue', chooseLanguage: 'Choisir la langue',
    invalidNameTitle: 'Nom invalide', invalidNameMessage: 'Les noms de fichiers et dossiers ne peuvent pas contenir / ou \\.',
    writeAccessUnverified: 'L’autorisation d’écriture n’a pas pu être vérifiée.', itemExists: 'Un fichier ou dossier portant ce nom existe déjà.',
    operationFailed: 'Échec de l’opération', deleteConfirmTitle: 'Supprimer ?', deleteFolderConfirm: '« {name} » et tout son contenu seront supprimés définitivement.',
    deleteFileConfirm: '« {name} » sera supprimé définitivement.', deleteFailed: 'Suppression impossible', invalidDestination: 'Destination invalide',
    invalidDestinationMessage: 'Un dossier ne peut pas être copié ou déplacé dans lui-même ou un sous-dossier.', sameFolder: 'Même dossier',
    sameFolderMessage: 'La source et la destination sont identiques.', sameNameTitle: 'Un élément du même nom existe',
    overwriteMessage: '« {name} » existe déjà dans le dossier de destination. Écraser ?', overwrite: 'Écraser',
    copiedTitle: 'Copié', copiedMessage: '« {name} » a été copié dans ce dossier.', emailFailed: 'Impossible d’ouvrir l’application e-mail',
    contactPrefix: 'Contact', permissionScreenFailed: 'Impossible d’ouvrir l’écran d’autorisation', permissionScreenFailedMessage: 'Impossible d’ouvrir l’écran Android d’accès spécial aux fichiers.',
    unknownError: 'Erreur inconnue', protectedErrorSuffix: 'Android protège au niveau système les contenus Android/data et Android/obb des autres applications.',
    permissionErrorSuffix: 'La page normale des autorisations ne suffit pas. Activez Simple File Manager dans « Accès à tous les fichiers ».',
    later: 'Plus tard', permissionPromptMessage: 'Simple File Manager a besoin de l’autorisation spéciale Android « Accès à tous les fichiers ».',
    permissionScreenOpen: 'Ouvrir les autorisations', fileOpenFailed: 'Impossible d’ouvrir le fichier',
    storageWriteAccessMissing: 'Le stockage est peut-être lisible mais l’écriture est indisponible. Activez « Accès à tous les fichiers ».',
    storageUnavailable: 'Le stockage est inaccessible.', defaultNewFolderName: 'Nouveau dossier', defaultNewFileName: 'nouveau_fichier.txt',
    feedbackBug: 'Rapport de bug', feedbackFeature: 'Demande de fonctionnalité', feedbackEdit: 'Demande de modification', descriptionLabel: 'Description',
    deviceAndroidLabel: 'Appareil / version Android (si connue)',
  },
  es: {
    fileManager: 'Gestor de archivos', opening: 'Abriendo…', decreaseView: 'Reducir vista', increaseView: 'Aumentar vista',
    switchLightTheme: 'Cambiar a tema claro', switchDarkTheme: 'Cambiar a tema oscuro', about: 'Acerca de', goUp: 'Ir a la carpeta superior',
    changeStorage: 'Cambiar almacenamiento', sort: 'Ordenar', refresh: 'Actualizar', toCopy: 'Para copiar', toMove: 'Para mover',
    clipboardHint: 'Ve a la carpeta de destino y pulsa Pegar.', paste: 'Pegar', filesLoading: 'Leyendo archivos…',
    protectedFolder: 'Carpeta protegida por Android', fileAccessRequired: 'Se requiere acceso a archivos', folderOpenFailed: 'No se pudo abrir la carpeta',
    protectedFolderMessage: 'Android protege adicionalmente los datos de otras aplicaciones dentro de Android/data y Android/obb.',
    permissionScreenMessage: 'Los permisos normales no son suficientes. Activa Simple File Manager en “Acceso a todos los archivos”.',
    folderRestricted: 'Esta carpeta puede estar restringida por el dispositivo o Android.', openSpecialAccess: 'Abrir acceso especial a archivos',
    goParent: 'Ir a la carpeta superior', tryAgain: 'Reintentar', emptyFolder: 'Esta carpeta está vacía.', folder: 'Carpeta',
    createFolder: 'Crear carpeta', createFile: 'Crear archivo', sortTitle: 'Ordenar', sortNameAsc: 'Nombre (A → Z)', sortNameDesc: 'Nombre (Z → A)',
    sortSizeAsc: 'Tamaño (Pequeño → Grande)', sortSizeDesc: 'Tamaño (Grande → Pequeño)', sortDateDesc: 'Fecha (Reciente → Antigua)', sortDateAsc: 'Fecha (Antigua → Reciente)',
    foldersFirst: 'Las carpetas siempre se muestran antes que los archivos.', close: 'Cerrar', storage: 'Almacenamiento', internalStorage: 'Almacenamiento interno',
    externalStorage: 'Almacenamiento externo', genericStorage: 'Almacenamiento', phoneStorage: 'Almacenamiento compartido del teléfono', externalStorageHint: 'Tarjeta SD o almacenamiento USB',
    extraStorage: 'Almacenamiento adicional', open: 'Abrir', copy: 'Copiar', move: 'Mover', rename: 'Renombrar', delete: 'Eliminar', cancel: 'Cancelar',
    newFolder: 'Nueva carpeta', newFile: 'Nuevo archivo', save: 'Guardar', version: 'Versión',
    aboutDescription: 'Un gestor de archivos Android sencillo y sin conexión, centrado en operaciones locales.', contact: 'Contacto',
    openStorageSettings: 'Abrir ajuste de acceso especial', feedbackHint: 'Puedes enviar por correo un error, una solicitud de función o de edición.',
    reportBug: 'Reportar error', requestFeature: 'Pedir función', requestEdit: 'Pedir edición', language: 'Idioma', chooseLanguage: 'Elegir idioma',
    invalidNameTitle: 'Nombre no válido', invalidNameMessage: 'Los nombres de archivos y carpetas no pueden contener / o \\.',
    writeAccessUnverified: 'No se pudo verificar el permiso de escritura.', itemExists: 'Ya existe un archivo o carpeta con este nombre.',
    operationFailed: 'La operación falló', deleteConfirmTitle: '¿Eliminar?', deleteFolderConfirm: '“{name}” y todo su contenido se eliminarán permanentemente.',
    deleteFileConfirm: '“{name}” se eliminará permanentemente.', deleteFailed: 'No se pudo eliminar', invalidDestination: 'Destino no válido',
    invalidDestinationMessage: 'Una carpeta no puede copiarse o moverse dentro de sí misma o de una subcarpeta.', sameFolder: 'Misma carpeta',
    sameFolderMessage: 'El origen y el destino son iguales.', sameNameTitle: 'Ya existe un elemento con el mismo nombre',
    overwriteMessage: '“{name}” ya existe en la carpeta de destino. ¿Sobrescribir?', overwrite: 'Sobrescribir',
    copiedTitle: 'Copiado', copiedMessage: '“{name}” se copió a esta carpeta.', emailFailed: 'No se pudo abrir la aplicación de correo',
    contactPrefix: 'Contacto', permissionScreenFailed: 'No se pudo abrir la pantalla de permisos', permissionScreenFailedMessage: 'No se pudo abrir la pantalla especial de acceso a archivos de Android.',
    unknownError: 'Error desconocido', protectedErrorSuffix: 'Android protege a nivel del sistema Android/data y Android/obb de otras aplicaciones.',
    permissionErrorSuffix: 'La página normal de permisos no basta. Activa Simple File Manager en “Acceso a todos los archivos”.',
    later: 'Más tarde', permissionPromptMessage: 'Simple File Manager necesita el permiso especial de Android “Acceso a todos los archivos”.',
    permissionScreenOpen: 'Abrir permisos', fileOpenFailed: 'No se pudo abrir el archivo',
    storageWriteAccessMissing: 'El almacenamiento puede ser legible, pero no hay escritura. Activa “Acceso a todos los archivos”.',
    storageUnavailable: 'No se puede acceder al almacenamiento.', defaultNewFolderName: 'Nueva carpeta', defaultNewFileName: 'nuevo_archivo.txt',
    feedbackBug: 'Informe de error', feedbackFeature: 'Solicitud de función', feedbackEdit: 'Solicitud de edición', descriptionLabel: 'Descripción',
    deviceAndroidLabel: 'Dispositivo / versión de Android (si se conoce)',
  },
  it: {
    fileManager: 'Gestore file', opening: 'Apertura…', decreaseView: 'Riduci visualizzazione', increaseView: 'Aumenta visualizzazione',
    switchLightTheme: 'Passa al tema chiaro', switchDarkTheme: 'Passa al tema scuro', about: 'Informazioni', goUp: 'Cartella superiore',
    changeStorage: 'Cambia memoria', sort: 'Ordina', refresh: 'Aggiorna', toCopy: 'Da copiare', toMove: 'Da spostare',
    clipboardHint: 'Apri la cartella di destinazione e premi Incolla.', paste: 'Incolla', filesLoading: 'Lettura file…',
    protectedFolder: 'Cartella protetta da Android', fileAccessRequired: 'Accesso ai file richiesto', folderOpenFailed: 'Impossibile aprire la cartella',
    protectedFolderMessage: 'Android protegge anche i dati delle altre app in Android/data e Android/obb.',
    permissionScreenMessage: 'I normali permessi non bastano. Abilita Simple File Manager in “Accesso a tutti i file”.',
    folderRestricted: 'Questa cartella potrebbe essere limitata dal dispositivo o da Android.', openSpecialAccess: 'Apri accesso speciale ai file',
    goParent: 'Cartella superiore', tryAgain: 'Riprova', emptyFolder: 'Questa cartella è vuota.', folder: 'Cartella',
    createFolder: 'Crea cartella', createFile: 'Crea file', sortTitle: 'Ordina', sortNameAsc: 'Nome (A → Z)', sortNameDesc: 'Nome (Z → A)',
    sortSizeAsc: 'Dimensione (Piccola → Grande)', sortSizeDesc: 'Dimensione (Grande → Piccola)', sortDateDesc: 'Data (Recente → Vecchia)', sortDateAsc: 'Data (Vecchia → Recente)',
    foldersFirst: 'Le cartelle vengono sempre mostrate sopra i file.', close: 'Chiudi', storage: 'Memoria', internalStorage: 'Memoria interna',
    externalStorage: 'Memoria esterna', genericStorage: 'Memoria', phoneStorage: 'Memoria condivisa del telefono', externalStorageHint: 'Scheda SD o memoria USB',
    extraStorage: 'Memoria aggiuntiva', open: 'Apri', copy: 'Copia', move: 'Sposta', rename: 'Rinomina', delete: 'Elimina', cancel: 'Annulla',
    newFolder: 'Nuova cartella', newFile: 'Nuovo file', save: 'Salva', version: 'Versione',
    aboutDescription: 'Un semplice gestore file Android offline per operazioni locali.', contact: 'Contatto',
    openStorageSettings: 'Apri impostazione accesso speciale', feedbackHint: 'Puoi inviare via e-mail segnalazioni, richieste di funzioni o modifiche.',
    reportBug: 'Segnala bug', requestFeature: 'Richiedi funzione', requestEdit: 'Richiedi modifica', language: 'Lingua', chooseLanguage: 'Scegli lingua',
    invalidNameTitle: 'Nome non valido', invalidNameMessage: 'I nomi di file e cartelle non possono contenere / o \\.',
    writeAccessUnverified: 'Impossibile verificare il permesso di scrittura.', itemExists: 'Esiste già un file o una cartella con questo nome.',
    operationFailed: 'Operazione non riuscita', deleteConfirmTitle: 'Eliminare?', deleteFolderConfirm: '“{name}” e tutto il contenuto verranno eliminati definitivamente.',
    deleteFileConfirm: '“{name}” verrà eliminato definitivamente.', deleteFailed: 'Eliminazione non riuscita', invalidDestination: 'Destinazione non valida',
    invalidDestinationMessage: 'Una cartella non può essere copiata o spostata dentro se stessa o una sottocartella.', sameFolder: 'Stessa cartella',
    sameFolderMessage: 'Origine e destinazione coincidono.', sameNameTitle: 'Esiste un elemento con lo stesso nome',
    overwriteMessage: '“{name}” esiste già nella cartella di destinazione. Sovrascrivere?', overwrite: 'Sovrascrivi',
    copiedTitle: 'Copiato', copiedMessage: '“{name}” è stato copiato in questa cartella.', emailFailed: 'Impossibile aprire l’app e-mail',
    contactPrefix: 'Contatto', permissionScreenFailed: 'Impossibile aprire la schermata dei permessi', permissionScreenFailedMessage: 'Impossibile aprire la schermata Android di accesso speciale ai file.',
    unknownError: 'Errore sconosciuto', protectedErrorSuffix: 'Android protegge a livello di sistema Android/data e Android/obb delle altre app.',
    permissionErrorSuffix: 'La normale pagina dei permessi non basta. Abilita Simple File Manager in “Accesso a tutti i file”.',
    later: 'Più tardi', permissionPromptMessage: 'Simple File Manager richiede il permesso speciale Android “Accesso a tutti i file”.',
    permissionScreenOpen: 'Apri permessi', fileOpenFailed: 'Impossibile aprire il file',
    storageWriteAccessMissing: 'La memoria può essere leggibile ma non scrivibile. Abilita “Accesso a tutti i file”.',
    storageUnavailable: 'Memoria non accessibile.', defaultNewFolderName: 'Nuova cartella', defaultNewFileName: 'nuovo_file.txt',
    feedbackBug: 'Segnalazione bug', feedbackFeature: 'Richiesta funzione', feedbackEdit: 'Richiesta modifica', descriptionLabel: 'Descrizione',
    deviceAndroidLabel: 'Dispositivo / versione Android (se nota)',
  },
  pt: {
    fileManager: 'Gestor de ficheiros', opening: 'A abrir…', decreaseView: 'Diminuir visualização', increaseView: 'Aumentar visualização',
    switchLightTheme: 'Mudar para tema claro', switchDarkTheme: 'Mudar para tema escuro', about: 'Sobre', goUp: 'Pasta superior',
    changeStorage: 'Mudar armazenamento', sort: 'Ordenar', refresh: 'Atualizar', toCopy: 'Para copiar', toMove: 'Para mover',
    clipboardHint: 'Abra a pasta de destino e toque em Colar.', paste: 'Colar', filesLoading: 'A ler ficheiros…',
    protectedFolder: 'Pasta protegida pelo Android', fileAccessRequired: 'Acesso a ficheiros necessário', folderOpenFailed: 'Não foi possível abrir a pasta',
    protectedFolderMessage: 'O Android também protege dados de outras aplicações em Android/data e Android/obb.',
    permissionScreenMessage: 'As permissões normais não bastam. Ative o Simple File Manager em “Acesso a todos os ficheiros”.',
    folderRestricted: 'Esta pasta pode estar restringida pelo dispositivo ou Android.', openSpecialAccess: 'Abrir acesso especial a ficheiros',
    goParent: 'Pasta superior', tryAgain: 'Tentar novamente', emptyFolder: 'Esta pasta está vazia.', folder: 'Pasta',
    createFolder: 'Criar pasta', createFile: 'Criar ficheiro', sortTitle: 'Ordenar', sortNameAsc: 'Nome (A → Z)', sortNameDesc: 'Nome (Z → A)',
    sortSizeAsc: 'Tamanho (Pequeno → Grande)', sortSizeDesc: 'Tamanho (Grande → Pequeno)', sortDateDesc: 'Data (Recente → Antiga)', sortDateAsc: 'Data (Antiga → Recente)',
    foldersFirst: 'As pastas são sempre mostradas acima dos ficheiros.', close: 'Fechar', storage: 'Armazenamento', internalStorage: 'Armazenamento interno',
    externalStorage: 'Armazenamento externo', genericStorage: 'Armazenamento', phoneStorage: 'Armazenamento partilhado do telefone', externalStorageHint: 'Cartão SD ou armazenamento USB',
    extraStorage: 'Armazenamento adicional', open: 'Abrir', copy: 'Copiar', move: 'Mover', rename: 'Mudar nome', delete: 'Eliminar', cancel: 'Cancelar',
    newFolder: 'Nova pasta', newFile: 'Novo ficheiro', save: 'Guardar', version: 'Versão',
    aboutDescription: 'Um gestor de ficheiros Android simples e offline, focado em operações locais.', contact: 'Contacto',
    openStorageSettings: 'Abrir definição de acesso especial', feedbackHint: 'Pode enviar por e-mail erros, pedidos de funcionalidades ou alterações.',
    reportBug: 'Reportar erro', requestFeature: 'Pedir funcionalidade', requestEdit: 'Pedir alteração', language: 'Idioma', chooseLanguage: 'Escolher idioma',
    invalidNameTitle: 'Nome inválido', invalidNameMessage: 'Os nomes de ficheiros e pastas não podem conter / ou \\.',
    writeAccessUnverified: 'Não foi possível verificar a permissão de escrita.', itemExists: 'Já existe um ficheiro ou pasta com este nome.',
    operationFailed: 'Operação falhou', deleteConfirmTitle: 'Eliminar?', deleteFolderConfirm: '“{name}” e todo o conteúdo serão eliminados permanentemente.',
    deleteFileConfirm: '“{name}” será eliminado permanentemente.', deleteFailed: 'Não foi possível eliminar', invalidDestination: 'Destino inválido',
    invalidDestinationMessage: 'Uma pasta não pode ser copiada ou movida para si própria ou para uma subpasta.', sameFolder: 'Mesma pasta',
    sameFolderMessage: 'A origem e o destino são iguais.', sameNameTitle: 'Já existe um item com o mesmo nome',
    overwriteMessage: '“{name}” já existe na pasta de destino. Substituir?', overwrite: 'Substituir',
    copiedTitle: 'Copiado', copiedMessage: '“{name}” foi copiado para esta pasta.', emailFailed: 'Não foi possível abrir a aplicação de e-mail',
    contactPrefix: 'Contacto', permissionScreenFailed: 'Não foi possível abrir o ecrã de permissões', permissionScreenFailedMessage: 'Não foi possível abrir o ecrã Android de acesso especial a ficheiros.',
    unknownError: 'Erro desconhecido', protectedErrorSuffix: 'O Android protege ao nível do sistema Android/data e Android/obb de outras aplicações.',
    permissionErrorSuffix: 'A página normal de permissões não basta. Ative o Simple File Manager em “Acesso a todos os ficheiros”.',
    later: 'Mais tarde', permissionPromptMessage: 'O Simple File Manager precisa da permissão especial Android “Acesso a todos os ficheiros”.',
    permissionScreenOpen: 'Abrir permissões', fileOpenFailed: 'Não foi possível abrir o ficheiro',
    storageWriteAccessMissing: 'O armazenamento pode ser legível, mas sem escrita. Ative “Acesso a todos os ficheiros”.',
    storageUnavailable: 'Armazenamento inacessível.', defaultNewFolderName: 'Nova pasta', defaultNewFileName: 'novo_ficheiro.txt',
    feedbackBug: 'Relatório de erro', feedbackFeature: 'Pedido de funcionalidade', feedbackEdit: 'Pedido de alteração', descriptionLabel: 'Descrição',
    deviceAndroidLabel: 'Dispositivo / versão Android (se conhecida)',
  },
  ru: {
    fileManager: 'Файловый менеджер', opening: 'Открытие…', decreaseView: 'Уменьшить вид', increaseView: 'Увеличить вид',
    switchLightTheme: 'Светлая тема', switchDarkTheme: 'Тёмная тема', about: 'О приложении', goUp: 'В родительскую папку',
    changeStorage: 'Сменить хранилище', sort: 'Сортировка', refresh: 'Обновить', toCopy: 'Копирование', toMove: 'Перемещение',
    clipboardHint: 'Перейдите в папку назначения и нажмите «Вставить».', paste: 'Вставить', filesLoading: 'Чтение файлов…',
    protectedFolder: 'Папка защищена Android', fileAccessRequired: 'Требуется доступ к файлам', folderOpenFailed: 'Не удалось открыть папку',
    protectedFolderMessage: 'Android дополнительно защищает данные других приложений в Android/data и Android/obb.',
    permissionScreenMessage: 'Обычных разрешений недостаточно. Включите Simple File Manager в разделе «Доступ ко всем файлам».',
    folderRestricted: 'Эта папка может быть ограничена устройством или Android.', openSpecialAccess: 'Открыть специальный доступ к файлам',
    goParent: 'В родительскую папку', tryAgain: 'Повторить', emptyFolder: 'Папка пуста.', folder: 'Папка',
    createFolder: 'Создать папку', createFile: 'Создать файл', sortTitle: 'Сортировка', sortNameAsc: 'Имя (А → Я)', sortNameDesc: 'Имя (Я → А)',
    sortSizeAsc: 'Размер (Меньше → Больше)', sortSizeDesc: 'Размер (Больше → Меньше)', sortDateDesc: 'Дата (Новые → Старые)', sortDateAsc: 'Дата (Старые → Новые)',
    foldersFirst: 'Папки всегда отображаются выше файлов.', close: 'Закрыть', storage: 'Хранилище', internalStorage: 'Внутреннее хранилище',
    externalStorage: 'Внешнее хранилище', genericStorage: 'Хранилище', phoneStorage: 'Общее хранилище телефона', externalStorageHint: 'SD-карта или USB-накопитель',
    extraStorage: 'Дополнительное хранилище', open: 'Открыть', copy: 'Копировать', move: 'Переместить', rename: 'Переименовать', delete: 'Удалить', cancel: 'Отмена',
    newFolder: 'Новая папка', newFile: 'Новый файл', save: 'Сохранить', version: 'Версия',
    aboutDescription: 'Простой офлайн-файловый менеджер Android для локальных операций.', contact: 'Контакт',
    openStorageSettings: 'Открыть настройку специального доступа', feedbackHint: 'Можно отправить по почте сообщение об ошибке, запрос функции или изменения.',
    reportBug: 'Сообщить об ошибке', requestFeature: 'Запросить функцию', requestEdit: 'Запросить изменение', language: 'Язык', chooseLanguage: 'Выберите язык',
    invalidNameTitle: 'Недопустимое имя', invalidNameMessage: 'Имена файлов и папок не могут содержать / или \\.',
    writeAccessUnverified: 'Не удалось подтвердить разрешение на запись.', itemExists: 'Файл или папка с таким именем уже существует.',
    operationFailed: 'Операция не выполнена', deleteConfirmTitle: 'Удалить?', deleteFolderConfirm: '«{name}» и всё содержимое будут удалены навсегда.',
    deleteFileConfirm: '«{name}» будет удалён навсегда.', deleteFailed: 'Не удалось удалить', invalidDestination: 'Недопустимое назначение',
    invalidDestinationMessage: 'Папку нельзя копировать или перемещать в неё саму или её подпапку.', sameFolder: 'Та же папка',
    sameFolderMessage: 'Источник и назначение совпадают.', sameNameTitle: 'Элемент с таким именем уже существует',
    overwriteMessage: '«{name}» уже существует в папке назначения. Заменить?', overwrite: 'Заменить',
    copiedTitle: 'Скопировано', copiedMessage: '«{name}» скопирован в эту папку.', emailFailed: 'Не удалось открыть почтовое приложение',
    contactPrefix: 'Контакт', permissionScreenFailed: 'Не удалось открыть экран разрешений', permissionScreenFailedMessage: 'Не удалось открыть специальный экран доступа Android.',
    unknownError: 'Неизвестная ошибка', protectedErrorSuffix: 'Android системно защищает Android/data и Android/obb других приложений.',
    permissionErrorSuffix: 'Обычной страницы разрешений недостаточно. Включите Simple File Manager в разделе «Доступ ко всем файлам».',
    later: 'Позже', permissionPromptMessage: 'Simple File Manager требуется специальное разрешение Android «Доступ ко всем файлам».',
    permissionScreenOpen: 'Открыть разрешения', fileOpenFailed: 'Не удалось открыть файл',
    storageWriteAccessMissing: 'Хранилище может читаться, но запись недоступна. Включите «Доступ ко всем файлам».',
    storageUnavailable: 'Хранилище недоступно.', defaultNewFolderName: 'Новая папка', defaultNewFileName: 'новый_файл.txt',
    feedbackBug: 'Сообщение об ошибке', feedbackFeature: 'Запрос функции', feedbackEdit: 'Запрос изменения', descriptionLabel: 'Описание',
    deviceAndroidLabel: 'Устройство / версия Android (если известна)',
  },
};

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && LANGUAGES.some(item => item.code === value);
}

export function languageName(language: Language) {
  return LANGUAGES.find(item => item.code === language)?.nativeName ?? 'English';
}

export function translate(language: Language, key: TranslationKey, vars?: Record<string, string | number>) {
  const template = translations[language][key] ?? en[key];
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (result, [name, value]) => result.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value)),
    template
  );
}
