import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NativeStorage from './modules/simple-file-manager-native';
import {
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  FlatList,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type ThemeMode = 'light' | 'dark';
type ClipboardMode = 'copy' | 'move';
type AccessIssueKind = 'permission' | 'protected' | 'folder' | null;

type StorageRoot = {
  label: string;
  path: string;
  removable: boolean;
  primary: boolean;
};

type FileEntry = {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
};

type ClipboardState = {
  mode: ClipboardMode;
  item: FileEntry;
} | null;

type AppSettings = {
  theme: ThemeMode;
  scale: number;
};

type Palette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  pressed: string;
  primary: string;
  primarySoft: string;
  primaryText: string;
  danger: string;
  overlay: string;
  input: string;
  success: string;
};

const PACKAGE_NAME = 'com.local.simplefilemanager';
const APP_NAME = 'Simple File Manager';
const APP_VERSION = '1.3.4';
const CONTACT_EMAIL = 'bahadir@bahadiryildiz.net';
const ROOT_PATH = Platform.OS === 'android' ? NativeStorage.getRootPath() : '';
const MIN_SCALE = 0.8;
const MAX_SCALE = 1.4;
const SCALE_STEP = 0.1;

const LIGHT: Palette = {
  background: '#f4f5f7',
  surface: '#ffffff',
  surfaceAlt: '#f0f2f5',
  text: '#16171a',
  textMuted: '#6d7078',
  border: '#d9dce2',
  pressed: '#eceef2',
  primary: '#2563eb',
  primarySoft: '#eaf0ff',
  primaryText: '#ffffff',
  danger: '#c62828',
  overlay: 'rgba(0,0,0,0.48)',
  input: '#ffffff',
  success: '#16803a',
};

const DARK: Palette = {
  background: '#111318',
  surface: '#1a1d24',
  surfaceAlt: '#242832',
  text: '#f4f5f7',
  textMuted: '#a8adb8',
  border: '#353a46',
  pressed: '#292e38',
  primary: '#6d91ff',
  primarySoft: '#202d53',
  primaryText: '#0d1220',
  danger: '#ff7676',
  overlay: 'rgba(0,0,0,0.70)',
  input: '#22262f',
  success: '#58d47c',
};

function cleanName(name: string) {
  return name.trim();
}

function isValidName(name: string) {
  const value = cleanName(name);
  return value.length > 0 && value !== '.' && value !== '..' && !value.includes('/') && !value.includes('\\') && !value.includes('\0');
}

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(value * 10) / 10));
}

function joinPath(parent: string, name: string) {
  return `${parent.replace(/\/+$/, '')}/${name.replace(/^\/+/, '')}`;
}

function normalizePath(path: string) {
  return path.replace(/\/+$/, '');
}

function baseName(path: string) {
  const clean = normalizePath(path);
  return clean.split('/').pop() || 'Dahili Depolama';
}

function formatSize(bytes?: number | null) {
  if (bytes == null || Number.isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

function mimeTypeForName(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    txt: 'text/plain', md: 'text/markdown', json: 'application/json', csv: 'text/csv',
    pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml', mp3: 'audio/mpeg',
    wav: 'audio/wav', m4a: 'audio/mp4', mp4: 'video/mp4', mkv: 'video/x-matroska',
    avi: 'video/x-msvideo', zip: 'application/zip', rar: 'application/vnd.rar',
    '7z': 'application/x-7z-compressed', doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    apk: 'application/vnd.android.package-archive',
  };
  return ext ? types[ext] ?? '*/*' : '*/*';
}

function isProtectedAndroidPath(path: string) {
  const value = `/${normalizePath(path).toLowerCase().replace(/^\/+/, '')}/`;
  return value.includes('/android/data/') || value.includes('/android/obb/');
}

function looksLikePermissionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /permission|denied|eacces|eperm|not permitted|read permission|write permission/i.test(message);
}

async function loadSettings(fallbackTheme: ThemeMode): Promise<AppSettings> {
  try {
    const parsed = await NativeStorage.getSettings();
    return {
      theme: parsed.theme === 'dark' || parsed.theme === 'light' ? parsed.theme : fallbackTheme,
      scale: typeof parsed.scale === 'number' ? clampScale(parsed.scale) : 1,
    };
  } catch {
    return { theme: fallbackTheme, scale: 1 };
  }
}

async function saveSettings(settings: AppSettings) {
  try {
    await NativeStorage.saveSettings(settings.theme, settings.scale);
  } catch {
    // Görünüm ayarları dosya işlemlerini engellememeli.
  }
}

async function verifyStorageAccess() {
  if (Platform.OS !== 'android') return true;
  try {
    return NativeStorage.hasAllFilesAccess();
  } catch {
    return false;
  }
}

async function readDirectory(path: string): Promise<FileEntry[]> {
  const result = await NativeStorage.list(path);
  return result
    .map(item => ({
      name: item.name,
      path: item.path,
      isDirectory: item.isDirectory,
      size: Number(item.size || 0),
    }))
    .sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
    });
}

function AppContent() {
  const systemScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const initialTheme: ThemeMode = systemScheme === 'dark' ? 'dark' : 'light';

  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [uiScale, setUiScale] = useState(1);
  const [booting, setBooting] = useState(true);
  const [storageReady, setStorageReady] = useState(false);
  const [storageRoots, setStorageRoots] = useState<StorageRoot[]>([{ label: 'Dahili Depolama', path: ROOT_PATH, removable: false, primary: true }]);
  const [storagePickerVisible, setStoragePickerVisible] = useState(false);
  const [stack, setStack] = useState<string[]>([ROOT_PATH]);
  const [items, setItems] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [accessIssueKind, setAccessIssueKind] = useState<AccessIssueKind>(null);
  const [selected, setSelected] = useState<FileEntry | null>(null);
  const [clipboard, setClipboard] = useState<ClipboardState>(null);
  const [editorMode, setEditorMode] = useState<'rename' | 'folder' | 'file' | null>(null);
  const [editorValue, setEditorValue] = useState('');
  const [aboutVisible, setAboutVisible] = useState(false);
  const permissionAlertShown = useRef(false);
  const operationLock = useRef(false);

  const currentPath = stack[stack.length - 1];
  const colors = theme === 'dark' ? DARK : LIGHT;
  const styles = useMemo(() => createStyles(colors, uiScale, insets.bottom, isLandscape), [colors, uiScale, insets.bottom, isLandscape]);
  const currentStorage = storageRoots.find(root => normalizePath(currentPath).startsWith(normalizePath(root.path))) ?? storageRoots[0];
  const title = stack.length === 1 ? (currentStorage?.label || 'Depolama') : baseName(currentPath);

  const persistSettings = useCallback((nextTheme: ThemeMode, nextScale: number) => {
    void saveSettings({ theme: nextTheme, scale: nextScale });
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    persistSettings(next, uiScale);
  };

  const changeScale = (delta: number) => {
    const next = clampScale(uiScale + delta);
    setUiScale(next);
    persistSettings(theme, next);
  };

  const loadStorageRoots = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    try {
      const roots = await NativeStorage.getStorageRoots();
      const normalized = roots
        .filter(root => !!root.path)
        .map(root => ({
          label: root.primary ? 'Dahili Depolama' : root.removable ? 'Harici Depolama' : (root.label || 'Depolama'),
          path: normalizePath(root.path),
          removable: !!root.removable,
          primary: !!root.primary,
        }));
      if (normalized.length > 0) setStorageRoots(normalized);
    } catch {
      // Dahili depolama geri dönüşü zaten mevcut.
    }
  }, []);

  const refreshPath = useCallback(async (path: string) => {
    setLoading(true);
    try {
      const listed = await readDirectory(path);
      setItems(listed);
      setAccessError(null);
      setAccessIssueKind(null);
      const usable = await verifyStorageAccess();
      setStorageReady(usable);
      if (!usable) {
        setItems([]);
        setAccessIssueKind('permission');
        setAccessError('Depolama okunabiliyor olabilir ancak dosya yazma yetkisi yok. “Tüm dosyalara erişim” özel iznini açın.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error ?? 'Depolamaya erişilemiyor.');
      setItems([]);
      setAccessError(message);
      if (isProtectedAndroidPath(path)) {
        setAccessIssueKind('protected');
      } else {
        const usable = await verifyStorageAccess();
        setStorageReady(usable);
        setAccessIssueKind(usable ? 'folder' : 'permission');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await refreshPath(currentPath);
  }, [currentPath, refreshPath]);

  const requestStorageAccess = useCallback(async () => {
    if (Platform.OS !== 'android') return;

    try {
      const api = Number(Platform.Version);
      if (api >= 30) {
        await NativeStorage.openAllFilesAccessSettings();
      } else {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        await refreshPath(currentPath);
      }
    } catch (error) {
      Alert.alert(
        'İzin ekranı açılamadı',
        error instanceof Error ? error.message : 'Android özel dosya erişimi ekranı açılamadı.'
      );
    }
  }, [currentPath, refreshPath]);

  const showFsError = useCallback((heading: string, error: unknown, targetPath?: string) => {
    const message = error instanceof Error ? error.message : String(error ?? 'Bilinmeyen hata');
    const path = targetPath || currentPath;

    if (isProtectedAndroidPath(path)) {
      Alert.alert(
        heading,
        `${message}\n\nAndroid, diğer uygulamalara ait Android/data ve Android/obb içeriklerini sistem düzeyinde korur. Bu özel klasörlerde işlem yapılamaz.`
      );
      return;
    }

    if (looksLikePermissionError(error) || !storageReady) {
      Alert.alert(
        heading,
        `${message}\n\n“Uygulama izinleri” sayfası yeterli değildir. Açılan özel “Tüm dosyalara erişim” ekranında Simple File Manager anahtarının açık olduğundan emin olun.`,
        [
          { text: 'Vazgeç', style: 'cancel' },
          { text: 'Özel İzin Ekranını Aç', onPress: () => void requestStorageAccess() },
        ]
      );
      return;
    }

    Alert.alert(heading, message);
  }, [currentPath, requestStorageAccess, storageReady]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const settings = await loadSettings(initialTheme);
      if (!mounted) return;
      setTheme(settings.theme);
      setUiScale(settings.scale);
      await loadStorageRoots();
      await refreshPath(ROOT_PATH);
      if (mounted) setBooting(false);
    })();
    return () => { mounted = false; };
  }, [initialTheme, loadStorageRoots, refreshPath]);

  useEffect(() => {
    if (booting || storageReady || permissionAlertShown.current || Platform.OS !== 'android') return;
    permissionAlertShown.current = true;
    const timer = setTimeout(() => {
      Alert.alert(
        'Dosya erişimi gerekli',
        'Simple File Manager için Android’in özel “Tüm dosyalara erişim” yetkisini açmanız gerekiyor. Normal uygulama izinleri ekranından farklıdır.',
        [
          { text: 'Sonra', style: 'cancel' },
          { text: 'İzin Ekranını Aç', onPress: () => void requestStorageAccess() },
        ]
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [booting, requestStorageAccess, storageReady]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active' && !booting) {
        void loadStorageRoots();
        void refreshPath(currentPath);
      }
    });
    return () => subscription.remove();
  }, [booting, currentPath, loadStorageRoots, refreshPath]);

  useEffect(() => {
    if (!booting) void refreshPath(currentPath);
  }, [currentPath]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (storagePickerVisible) {
        setStoragePickerVisible(false);
        return true;
      }
      if (aboutVisible) {
        setAboutVisible(false);
        return true;
      }
      if (editorMode) {
        setEditorMode(null);
        return true;
      }
      if (selected) {
        setSelected(null);
        return true;
      }
      if (stack.length > 1) {
        setStack(previous => previous.slice(0, -1));
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [aboutVisible, editorMode, selected, stack.length, storagePickerVisible]);

  const switchStorage = (root: StorageRoot) => {
    setStoragePickerVisible(false);
    setSelected(null);
    setAccessError(null);
    setAccessIssueKind(null);
    setStack([root.path]);
  };

  const enterDirectory = (item: FileEntry) => {
    setSelected(null);
    setStack(previous => [...previous, item.path]);
  };

  const goUp = () => {
    setSelected(null);
    if (stack.length > 1) setStack(previous => previous.slice(0, -1));
  };

  const openFile = async (item: FileEntry) => {
    if (Platform.OS !== 'android') return;
    try {
      await NativeStorage.openFile(item.path, mimeTypeForName(item.name));
    } catch (error) {
      showFsError('Dosya açılamadı', error, item.path);
    }
  };

  const startRename = () => {
    if (!selected) return;
    setEditorValue(selected.name);
    setEditorMode('rename');
  };

  const startCreate = (mode: 'folder' | 'file') => {
    setSelected(null);
    setEditorValue(mode === 'folder' ? 'Yeni klasör' : 'yeni_dosya.txt');
    setEditorMode(mode);
  };

  const saveEditor = async () => {
    if (operationLock.current) return;

    const name = cleanName(editorValue);
    if (!isValidName(name)) {
      Alert.alert('Geçersiz ad', 'Dosya veya klasör adında / veya \\ karakteri kullanılamaz.');
      return;
    }

    operationLock.current = true;
    try {
      if (!storageReady) throw new Error('Dosya yazma yetkisi doğrulanamadı.');
      const destination = joinPath(currentPath, name);

      if (editorMode === 'rename' && selected && normalizePath(selected.path) === normalizePath(destination)) {
        setSelected(null);
        setEditorMode(null);
        setEditorValue('');
        return;
      }

      if (await NativeStorage.exists(destination)) throw new Error('Bu isimde bir dosya veya klasör zaten var.');

      if (editorMode === 'rename' && selected) {
        await NativeStorage.move(selected.path, destination, false);
        setSelected(null);
      } else if (editorMode === 'folder') {
        await NativeStorage.mkdir(destination);
      } else if (editorMode === 'file') {
        await NativeStorage.createFile(destination);
      }

      setEditorMode(null);
      setEditorValue('');
      await refresh();
    } catch (error) {
      showFsError('İşlem başarısız', error, currentPath);
    } finally {
      operationLock.current = false;
    }
  };

  const removeSelected = () => {
    if (!selected) return;
    const item = selected;
    Alert.alert(
      'Silinsin mi?',
      item.isDirectory
        ? `“${item.name}” klasörü ve içindekiler kalıcı olarak silinecek.`
        : `“${item.name}” kalıcı olarak silinecek.`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            if (operationLock.current) return;
            operationLock.current = true;
            try {
              if (!storageReady) throw new Error('Dosya yazma yetkisi doğrulanamadı.');
              await NativeStorage.delete(item.path);
              setSelected(null);
              await refresh();
            } catch (error) {
              showFsError('Silinemedi', error, item.path);
            } finally {
              operationLock.current = false;
            }
          },
        },
      ]
    );
  };

  const setClipboardFromSelected = (mode: ClipboardMode) => {
    if (!selected) return;
    setClipboard({ mode, item: selected });
    setSelected(null);
  };

  const paste = async (overwrite = false) => {
    if (!clipboard || operationLock.current) return;
    const source = clipboard.item;
    const destination = joinPath(currentPath, source.name);
    const sourceNormalized = normalizePath(source.path);
    const destinationNormalized = normalizePath(destination);

    if (source.isDirectory && `${normalizePath(currentPath)}/`.startsWith(`${sourceNormalized}/`)) {
      Alert.alert('Geçersiz hedef', 'Bir klasör kendi içine veya alt klasörlerinden birine kopyalanamaz/taşınamaz.');
      return;
    }
    if (destinationNormalized === sourceNormalized) {
      Alert.alert('Aynı klasör', 'Kaynak ve hedef aynı.');
      return;
    }

    operationLock.current = true;
    try {
      if (!storageReady) throw new Error('Dosya yazma yetkisi doğrulanamadı.');

      const destinationExists = await NativeStorage.exists(destination);
      if (destinationExists && !overwrite) {
        operationLock.current = false;
        Alert.alert(
          'Aynı isimde öğe var',
          `Hedef klasörde “${source.name}” zaten var. Mevcut öğenin üzerine yazılsın mı?`,
          [
            { text: 'Vazgeç', style: 'cancel' },
            { text: 'Üzerine Yaz', style: 'destructive', onPress: () => void paste(true) },
          ]
        );
        return;
      }

      if (clipboard.mode === 'copy') {
        await NativeStorage.copy(source.path, destination, overwrite);
        Alert.alert('Kopyalandı', `“${source.name}” bu klasöre kopyalandı.`);
      } else {
        await NativeStorage.move(source.path, destination, overwrite);
        setClipboard(null);
      }
      await refresh();
    } catch (error) {
      showFsError('İşlem başarısız', error, currentPath);
    } finally {
      operationLock.current = false;
    }
  };

  const sendFeedback = async (kind: 'Hata Bildirimi' | 'Özellik Talebi' | 'Düzenleme Talebi') => {
    const subject = `[${APP_NAME}] ${kind}`;
    const body = `${kind}\n\nAçıklama:\n\nCihaz / Android sürümü (varsa):\n`;
    const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('E-posta açılamadı', `İletişim: ${CONTACT_EMAIL}`);
    }
  };

  if (booting) {
    return (
      <SafeAreaView style={styles.bootSafe} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar style="light" />
        <View style={styles.bootContent}>
          <Image source={require('./assets/icon.png')} style={styles.bootLogo} resizeMode="contain" />
          <Text style={styles.bootTitle}>{APP_NAME}</Text>
          <ActivityIndicator size="large" color="#6d91ff" style={styles.bootSpinner} />
          <Text style={styles.bootText}>Açılıyor…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.brandBar}>
        <Image source={require('./assets/icon.png')} style={styles.logoImage} resizeMode="contain" />
        <View style={styles.brandTextWrap}>
          <Text style={styles.brandTitle} numberOfLines={1}>{APP_NAME}</Text>
          {!isLandscape && <Text style={styles.brandSubtitle} numberOfLines={1}>Dosya Yöneticisi</Text>}
        </View>
        <Pressable
          accessibilityLabel="Görünümü küçült"
          onPress={() => changeScale(-SCALE_STEP)}
          disabled={uiScale <= MIN_SCALE}
          style={({ pressed }) => [styles.brandButton, pressed && styles.brandButtonPressed, uiScale <= MIN_SCALE && styles.disabled]}
        >
          <Text style={styles.scaleButtonText}>A−</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Görünümü büyüt"
          onPress={() => changeScale(SCALE_STEP)}
          disabled={uiScale >= MAX_SCALE}
          style={({ pressed }) => [styles.brandButton, pressed && styles.brandButtonPressed, uiScale >= MAX_SCALE && styles.disabled]}
        >
          <Text style={styles.scaleButtonText}>A+</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={theme === 'dark' ? 'Açık temaya geç' : 'Karanlık temaya geç'}
          onPress={toggleTheme}
          style={({ pressed }) => [styles.brandButton, pressed && styles.brandButtonPressed]}
        >
          <Text style={styles.brandButtonText}>{theme === 'dark' ? '☀' : '☾'}</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Hakkında"
          onPress={() => setAboutVisible(true)}
          style={({ pressed }) => [styles.brandButton, pressed && styles.brandButtonPressed]}
        >
          <Text style={styles.brandButtonText}>ⓘ</Text>
        </Pressable>
      </View>

      <View style={styles.navHeader}>
        <Pressable
          accessibilityLabel="Üst klasöre çık"
          onPress={goUp}
          disabled={stack.length === 1}
          style={[styles.headerButton, stack.length === 1 && styles.disabled]}
        >
          <Text style={styles.headerButtonText}>‹</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.headerTitleWrap, pressed && styles.headerTitlePressed]}
          onPress={() => { void loadStorageRoots(); setStoragePickerVisible(true); }}
          accessibilityLabel="Depolama birimini değiştir"
        >
          <Text style={styles.headerTitle} numberOfLines={1}>{title} <Text style={styles.storageChevron}>⌄</Text></Text>
          <Text style={styles.headerPath} numberOfLines={1} ellipsizeMode="middle">{currentPath}</Text>
        </Pressable>
        <View style={[styles.accessDot, { backgroundColor: storageReady ? colors.success : colors.danger }]} />
        <Pressable onPress={() => void refresh()} style={styles.smallHeaderButton} accessibilityLabel="Yenile">
          <Text style={styles.smallHeaderButtonText}>↻</Text>
        </Pressable>
      </View>

      {clipboard && (
        <View style={styles.clipboardBar}>
          <View style={styles.clipboardTextWrap}>
            <Text style={styles.clipboardTitle} numberOfLines={1}>
              {clipboard.mode === 'copy' ? 'Kopyalanacak' : 'Taşınacak'}: {clipboard.item.name}
            </Text>
            <Text style={styles.clipboardHint}>Hedef klasöre gidip Yapıştır'a bas.</Text>
          </View>
          <Pressable onPress={() => void paste()} style={styles.pasteButton}>
            <Text style={styles.pasteButtonText}>Yapıştır</Text>
          </Pressable>
          <Pressable onPress={() => setClipboard(null)} style={styles.cancelClipboardButton}>
            <Text style={styles.cancelClipboardText}>×</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.content}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.muted}>Dosyalar okunuyor…</Text>
          </View>
        ) : accessError ? (
          <View style={styles.center}>
            <Text style={styles.lockIcon}>{accessIssueKind === 'protected' ? '🛡️' : '🔒'}</Text>
            <Text style={styles.accessTitle}>
              {accessIssueKind === 'protected' ? 'Android tarafından korunan klasör' : accessIssueKind === 'permission' ? 'Dosya erişimi gerekli' : 'Klasör açılamadı'}
            </Text>
            <Text style={styles.accessText}>
              {accessIssueKind === 'protected'
                ? 'Android/data ve Android/obb içindeki diğer uygulama verileri Android tarafından ayrıca korunur.'
                : accessIssueKind === 'permission'
                  ? 'Normal “Uygulama izinleri” ekranı yeterli değildir. Android’in özel “Tüm dosyalara erişim” ekranında Simple File Manager anahtarını açın.'
                  : 'Bu klasör cihaz veya sistem tarafından kısıtlanıyor olabilir.'}
            </Text>
            {accessIssueKind === 'permission' && (
              <Pressable style={styles.primaryButton} onPress={() => void requestStorageAccess()}>
                <Text style={styles.primaryButtonText}>Özel Dosya Erişimi İznini Aç</Text>
              </Pressable>
            )}
            {stack.length > 1 && (
              <Pressable style={styles.secondaryButton} onPress={goUp}>
                <Text style={styles.secondaryButtonText}>Üst Klasöre Dön</Text>
              </Pressable>
            )}
            <Pressable style={styles.secondaryButton} onPress={() => void refresh()}>
              <Text style={styles.secondaryButtonText}>Tekrar Dene</Text>
            </Pressable>
            <Text style={styles.errorDetail} numberOfLines={4}>{accessError}</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => item.path}
            contentContainerStyle={items.length === 0 ? styles.emptyList : styles.listContent}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.muted}>Bu klasör boş.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => item.isDirectory ? enterDirectory(item) : void openFile(item)}
                onLongPress={() => setSelected(item)}
              >
                <Text style={styles.icon}>{item.isDirectory ? '📁' : '📄'}</Text>
                <View style={styles.rowText}>
                  <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">{item.name}</Text>
                  <Text style={styles.metaText}>{item.isDirectory ? 'Klasör' : formatSize(item.size)}</Text>
                </View>
                <Pressable hitSlop={10} onPress={() => setSelected(item)} style={styles.moreButton}>
                  <Text style={styles.moreText}>⋮</Text>
                </Pressable>
              </Pressable>
            )}
          />
        )}
      </View>

      {!accessError && !loading && (
        <View style={styles.bottomBar}>
          <Pressable style={({ pressed }) => [styles.bottomAction, pressed && styles.bottomActionPressed]} onPress={() => startCreate('folder')}>
            <View style={styles.addIconWrap}>
              <Text style={styles.bottomActionIcon}>📁</Text>
              <View style={styles.addIconBadge}><Text style={styles.addIconPlus}>+</Text></View>
            </View>
            <Text style={styles.bottomActionText}>Klasör oluştur</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.bottomAction, pressed && styles.bottomActionPressed]} onPress={() => startCreate('file')}>
            <View style={styles.addIconWrap}>
              <Text style={styles.bottomActionIcon}>📄</Text>
              <View style={styles.addIconBadge}><Text style={styles.addIconPlus}>+</Text></View>
            </View>
            <Text style={styles.bottomActionText}>Dosya oluştur</Text>
          </Pressable>
        </View>
      )}

      <Modal visible={storagePickerVisible} transparent animationType="fade" onRequestClose={() => setStoragePickerVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setStoragePickerVisible(false)}>
          <Pressable style={styles.storageSheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Depolama</Text>
            {storageRoots.map(root => {
              const active = currentStorage && normalizePath(root.path) === normalizePath(currentStorage.path);
              return (
                <Pressable
                  key={root.path}
                  style={({ pressed }) => [styles.storageRow, pressed && styles.rowPressed]}
                  onPress={() => switchStorage(root)}
                >
                  <Text style={styles.storageIcon}>{root.removable ? '💾' : '📱'}</Text>
                  <View style={styles.storageTextWrap}>
                    <Text style={styles.storageName} numberOfLines={1}>{root.label}</Text>
                    <Text style={styles.storageType} numberOfLines={1}>
                      {root.primary ? 'Telefonun ortak depolama alanı' : root.removable ? 'SD kart veya USB depolama' : 'Ek depolama alanı'}
                    </Text>
                    <Text style={styles.storagePath} numberOfLines={1} ellipsizeMode="middle">{root.path}</Text>
                  </View>
                  {active && <Text style={styles.storageActive}>✓</Text>}
                </Pressable>
              );
            })}
            <Pressable style={styles.sheetCancel} onPress={() => setStoragePickerVisible(false)}>
              <Text style={styles.sheetCancelText}>Kapat</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.overlay} onPress={() => setSelected(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle} numberOfLines={2}>{selected?.name}</Text>
            {selected && !selected.isDirectory && (
              <Pressable
                style={styles.sheetAction}
                onPress={() => {
                  const item = selected;
                  setSelected(null);
                  void openFile(item);
                }}
              >
                <Text style={styles.sheetActionText}>Aç</Text>
              </Pressable>
            )}
            <Pressable style={styles.sheetAction} onPress={() => setClipboardFromSelected('copy')}>
              <Text style={styles.sheetActionText}>Kopyala</Text>
            </Pressable>
            <Pressable style={styles.sheetAction} onPress={() => setClipboardFromSelected('move')}>
              <Text style={styles.sheetActionText}>Taşı</Text>
            </Pressable>
            <Pressable style={styles.sheetAction} onPress={startRename}>
              <Text style={styles.sheetActionText}>Yeniden adlandır</Text>
            </Pressable>
            <Pressable style={styles.sheetAction} onPress={removeSelected}>
              <Text style={[styles.sheetActionText, styles.dangerText]}>Sil</Text>
            </Pressable>
            <Pressable style={styles.sheetCancel} onPress={() => setSelected(null)}>
              <Text style={styles.sheetCancelText}>Vazgeç</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={editorMode !== null} transparent animationType="fade" onRequestClose={() => setEditorMode(null)}>
        <View style={styles.dialogOverlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>
              {editorMode === 'rename' ? 'Yeniden adlandır' : editorMode === 'folder' ? 'Yeni klasör' : 'Yeni dosya'}
            </Text>
            <TextInput
              autoFocus
              value={editorValue}
              onChangeText={setEditorValue}
              style={styles.input}
              placeholderTextColor={colors.textMuted}
              selectTextOnFocus={editorMode === 'rename'}
              onSubmitEditing={() => void saveEditor()}
            />
            <View style={styles.dialogActions}>
              <Pressable style={styles.dialogButton} onPress={() => setEditorMode(null)}>
                <Text style={styles.dialogCancelText}>Vazgeç</Text>
              </Pressable>
              <Pressable style={[styles.dialogButton, styles.dialogSaveButton]} onPress={() => void saveEditor()}>
                <Text style={styles.dialogSaveText}>Kaydet</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={aboutVisible} transparent animationType="fade" onRequestClose={() => setAboutVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setAboutVisible(false)}>
          <Pressable style={styles.aboutSheet} onPress={() => {}}>
            <ScrollView contentContainerStyle={styles.aboutScrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.aboutBrandRow}>
              <Image source={require('./assets/icon.png')} style={styles.aboutLogo} resizeMode="contain" />
              <View style={styles.aboutBrandText}>
                <Text style={styles.aboutTitle}>{APP_NAME}</Text>
                <Text style={styles.aboutVersion}>Sürüm {APP_VERSION}</Text>
              </View>
            </View>
            <Text style={styles.aboutText}>Basit, çevrimdışı ve kişisel kullanım odaklı Android dosya yöneticisi.</Text>
            <Text style={styles.aboutSectionTitle}>İletişim</Text>
            <Pressable onPress={() => void Linking.openURL(`mailto:${CONTACT_EMAIL}`)}>
              <Text style={styles.emailText}>{CONTACT_EMAIL}</Text>
            </Pressable>
            {Platform.OS === 'android' && (
              <Pressable style={styles.storageSettingsButton} onPress={() => void requestStorageAccess()}>
                <Text style={styles.storageSettingsButtonText}>Özel dosya erişimi ayarını aç</Text>
              </Pressable>
            )}
            <Text style={styles.aboutHint}>Hata, özellik veya düzenleme talebinizi e-posta ile iletebilirsiniz.</Text>
            <View style={styles.feedbackButtons}>
              <Pressable style={styles.feedbackButton} onPress={() => void sendFeedback('Hata Bildirimi')}>
                <Text style={styles.feedbackButtonText}>Hata bildir</Text>
              </Pressable>
              <Pressable style={styles.feedbackButton} onPress={() => void sendFeedback('Özellik Talebi')}>
                <Text style={styles.feedbackButtonText}>Özellik iste</Text>
              </Pressable>
              <Pressable style={styles.feedbackButton} onPress={() => void sendFeedback('Düzenleme Talebi')}>
                <Text style={styles.feedbackButtonText}>Düzenleme iste</Text>
              </Pressable>
            </View>
            <Pressable style={styles.sheetCancel} onPress={() => setAboutVisible(false)}>
              <Text style={styles.sheetCancelText}>Kapat</Text>
            </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppContent />
    </SafeAreaProvider>
  );
}

function createStyles(colors: Palette, scale: number, bottomInset: number, isLandscape: boolean) {
  const font = (value: number) => Math.round(value * scale * 10) / 10;
  const rowHeight = Math.max(58, Math.round(66 * scale));
  const iconSize = font(27);

  return StyleSheet.create({
    bootSafe: { flex: 1, backgroundColor: '#0F172A' },
    bootContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: isLandscape ? 18 : 30 },
    bootLogo: { width: isLandscape ? 86 : 136, height: isLandscape ? 86 : 136, borderRadius: isLandscape ? 20 : 30 },
    bootTitle: { marginTop: isLandscape ? 12 : 22, color: '#ffffff', fontSize: isLandscape ? 20 : 24, fontWeight: '900' },
    bootSpinner: { marginTop: isLandscape ? 14 : 28 },
    bootText: { marginTop: isLandscape ? 7 : 13, color: '#cbd5e1', fontSize: 15, fontWeight: '600' },
    safeArea: { flex: 1, backgroundColor: colors.surface },
    content: { flex: 1, backgroundColor: colors.background },
    brandBar: {
      minHeight: isLandscape ? 48 : 60,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 9,
      gap: 3,
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    logoImage: { width: isLandscape ? 34 : 40, height: isLandscape ? 34 : 40, borderRadius: 10, marginRight: 5 },
    brandTextWrap: { flex: 1, minWidth: 0 },
    brandTitle: { color: colors.text, fontSize: 15.5, fontWeight: '800' },
    brandSubtitle: { marginTop: 1, color: colors.textMuted, fontSize: 10.5, fontWeight: '600' },
    brandButton: { minWidth: 35, height: 38, paddingHorizontal: 5, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    brandButtonPressed: { backgroundColor: colors.pressed },
    brandButtonText: { color: colors.text, fontSize: 20, fontWeight: '700' },
    scaleButtonText: { color: colors.text, fontSize: 13, fontWeight: '800' },
    disabled: { opacity: 0.28 },
    navHeader: {
      minHeight: isLandscape ? 50 : 62,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    headerButton: { width: 44, height: isLandscape ? 40 : 44, alignItems: 'center', justifyContent: 'center' },
    headerButtonText: { fontSize: 38, lineHeight: 40, color: colors.text },
    smallHeaderButton: { width: 44, height: isLandscape ? 40 : 44, alignItems: 'center', justifyContent: 'center' },
    smallHeaderButtonText: { fontSize: 26, color: colors.text },
    headerTitleWrap: { flex: 1, minWidth: 0, paddingVertical: 4, borderRadius: 8 },
    headerTitlePressed: { backgroundColor: colors.pressed },
    headerTitle: { fontSize: font(17), fontWeight: '700', color: colors.text },
    storageChevron: { color: colors.textMuted, fontSize: font(13), fontWeight: '900' },
    headerPath: { marginTop: 2, fontSize: font(10.5), color: colors.textMuted },
    accessDot: { width: 9, height: 9, borderRadius: 5, marginHorizontal: 4 },
    clipboardBar: {
      flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 9,
      backgroundColor: colors.primarySoft, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
    },
    clipboardTextWrap: { flex: 1 },
    clipboardTitle: { fontSize: font(13), fontWeight: '700', color: colors.text },
    clipboardHint: { marginTop: 1, fontSize: font(10.5), color: colors.textMuted },
    pasteButton: { backgroundColor: colors.primary, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 9 },
    pasteButtonText: { color: colors.primaryText, fontWeight: '800', fontSize: font(12.5) },
    cancelClipboardButton: { padding: 5 },
    cancelClipboardText: { fontSize: 24, color: colors.textMuted },
    listContent: { paddingBottom: 8 },
    emptyList: { flexGrow: 1 },
    row: {
      minHeight: rowHeight, flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 6,
      backgroundColor: colors.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
    },
    rowPressed: { backgroundColor: colors.pressed },
    icon: { width: Math.max(42, Math.round(44 * scale)), fontSize: iconSize },
    rowText: { flex: 1, minWidth: 0 },
    fileName: { fontSize: font(15.5), fontWeight: '600', color: colors.text },
    metaText: { marginTop: 4, fontSize: font(11.5), color: colors.textMuted },
    moreButton: { width: 46, minHeight: rowHeight - 8, alignItems: 'center', justifyContent: 'center' },
    moreText: { fontSize: font(24), color: colors.textMuted },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
    muted: { marginTop: 12, color: colors.textMuted, textAlign: 'center', fontSize: font(14) },
    lockIcon: { fontSize: 42, marginBottom: 12 },
    accessTitle: { fontSize: font(20), fontWeight: '800', color: colors.text, textAlign: 'center' },
    accessText: { marginTop: 10, maxWidth: 390, color: colors.textMuted, fontSize: font(13.5), lineHeight: font(20), textAlign: 'center' },
    primaryButton: { marginTop: 22, backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
    primaryButtonText: { color: colors.primaryText, fontWeight: '800', fontSize: font(14), textAlign: 'center' },
    secondaryButton: { marginTop: 9, paddingHorizontal: 18, paddingVertical: 10 },
    secondaryButtonText: { color: colors.primary, fontWeight: '700', fontSize: font(14) },
    errorDetail: { marginTop: 12, color: colors.textMuted, fontSize: 10, textAlign: 'center', opacity: 0.8 },
    bottomBar: {
      minHeight: (isLandscape ? Math.max(54, Math.round(58 * scale)) : Math.max(70, Math.round(74 * scale))) + bottomInset,
      flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border, paddingBottom: Math.max(bottomInset, isLandscape ? 4 : 8), paddingTop: isLandscape ? 1 : 3,
    },
    bottomAction: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginHorizontal: 4 },
    bottomActionPressed: { backgroundColor: colors.pressed },
    addIconWrap: { width: font(31), height: font(28), alignItems: 'center', justifyContent: 'center', position: 'relative' },
    bottomActionIcon: { fontSize: font(23), lineHeight: font(27) },
    addIconBadge: {
      position: 'absolute', right: -1, bottom: 0, width: font(14), height: font(14), borderRadius: font(7),
      alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderWidth: 1.5, borderColor: colors.surface,
    },
    addIconPlus: { color: colors.primaryText, fontSize: font(11), lineHeight: font(12), fontWeight: '900' },
    bottomActionText: { marginTop: isLandscape ? 1 : 4, fontSize: font(isLandscape ? 10.5 : 11.5), fontWeight: '700', color: colors.text },
    overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'flex-end' },
    dialogOverlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 20 },
    sheet: { width: isLandscape ? '68%' : '100%', maxHeight: '92%', backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: 20 + bottomInset },
    storageSheet: { width: isLandscape ? '68%' : '100%', maxHeight: '92%', backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: 20 + bottomInset },
    storageRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, paddingHorizontal: 4 },
    storageIcon: { width: 44, fontSize: font(25) },
    storageTextWrap: { flex: 1, minWidth: 0 },
    storageName: { color: colors.text, fontSize: font(15), fontWeight: '800' },
    storageType: { marginTop: 2, color: colors.textMuted, fontSize: font(11.5), fontWeight: '600' },
    storagePath: { marginTop: 2, color: colors.textMuted, fontSize: font(9.8) },
    storageActive: { color: colors.success, fontSize: font(20), fontWeight: '900', paddingHorizontal: 8 },
    sheetTitle: { fontSize: font(17), fontWeight: '800', color: colors.text, paddingHorizontal: 4, paddingBottom: 10 },
    sheetAction: { minHeight: 50, justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
    sheetActionText: { fontSize: font(15.5), color: colors.text },
    dangerText: { color: colors.danger, fontWeight: '700' },
    sheetCancel: { marginTop: 10, minHeight: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: colors.surfaceAlt },
    sheetCancelText: { fontSize: font(14.5), fontWeight: '700', color: colors.text },
    dialog: { width: '100%', maxWidth: isLandscape ? 520 : 420, backgroundColor: colors.surface, borderRadius: 16, padding: 18 },
    dialogTitle: { fontSize: font(18), fontWeight: '800', color: colors.text },
    input: { marginTop: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.input, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: font(16), color: colors.text },
    dialogActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 18 },
    dialogButton: { minWidth: 84, paddingHorizontal: 14, paddingVertical: 11, alignItems: 'center', borderRadius: 9 },
    dialogSaveButton: { backgroundColor: colors.primary },
    dialogCancelText: { color: colors.textMuted, fontWeight: '700', fontSize: font(14) },
    dialogSaveText: { color: colors.primaryText, fontWeight: '800', fontSize: font(14) },
    aboutSheet: { width: isLandscape ? '78%' : '100%', maxHeight: isLandscape ? '94%' : '90%', backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    aboutScrollContent: { padding: 18, paddingBottom: 20 + bottomInset },
    aboutBrandRow: { flexDirection: 'row', alignItems: 'center' },
    aboutLogo: { width: 52, height: 52, borderRadius: 13, marginRight: 12 },
    aboutBrandText: { flex: 1 },
    aboutTitle: { color: colors.text, fontSize: font(20), fontWeight: '900' },
    aboutVersion: { marginTop: 3, color: colors.textMuted, fontSize: font(12) },
    aboutText: { marginTop: 18, color: colors.textMuted, fontSize: font(13.5), lineHeight: font(20) },
    aboutSectionTitle: { marginTop: 18, color: colors.text, fontSize: font(14), fontWeight: '800' },
    emailText: { marginTop: 6, color: colors.primary, fontSize: font(14.5), fontWeight: '700' },
    storageSettingsButton: { marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 9, backgroundColor: colors.primarySoft },
    storageSettingsButtonText: { color: colors.primary, fontSize: font(12.5), fontWeight: '800' },
    aboutHint: { marginTop: 10, color: colors.textMuted, fontSize: font(12.5), lineHeight: font(18) },
    feedbackButtons: { flexDirection: 'row', gap: 7, marginTop: 14 },
    feedbackButton: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, borderRadius: 9, backgroundColor: colors.primarySoft },
    feedbackButtonText: { color: colors.primary, fontSize: font(11.5), fontWeight: '800', textAlign: 'center' },
  });
}
