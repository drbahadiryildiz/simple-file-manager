import { StatusBar } from 'expo-status-bar';
import { Directory, File } from 'expo-file-system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  FlatList,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type FsItem = File | Directory;
type ClipboardMode = 'copy' | 'move';

type ClipboardState = {
  mode: ClipboardMode;
  item: FsItem;
  isDirectory: boolean;
} | null;

const ROOT_URI = 'file:///storage/emulated/0/';
const ROOT = new Directory(ROOT_URI);

function isDirectory(item: FsItem): item is Directory {
  return item instanceof Directory;
}

function normalizeUri(uri: string) {
  return uri.endsWith('/') ? uri : `${uri}/`;
}

function cleanName(name: string) {
  return name.trim();
}

function isValidName(name: string) {
  const value = cleanName(name);
  return value.length > 0 && value !== '.' && value !== '..' && !value.includes('/') && !value.includes('\0');
}

function formatSize(bytes?: number | null) {
  if (bytes == null || Number.isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

function getPathLabel(stack: Directory[]) {
  if (stack.length === 1) return 'Dahili Depolama';
  return stack[stack.length - 1].name || 'Klasör';
}

function cloneDestination(item: FsItem, destinationDir: Directory) {
  return isDirectory(item)
    ? new Directory(destinationDir, item.name)
    : new File(destinationDir, item.name);
}

export default function App() {
  const [stack, setStack] = useState<Directory[]>([ROOT]);
  const currentDir = stack[stack.length - 1];
  const [items, setItems] = useState<FsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [selected, setSelected] = useState<FsItem | null>(null);
  const [clipboard, setClipboard] = useState<ClipboardState>(null);
  const [editorMode, setEditorMode] = useState<'rename' | 'folder' | 'file' | null>(null);
  const [editorValue, setEditorValue] = useState('');

  const title = useMemo(() => getPathLabel(stack), [stack]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const listed = currentDir.list();
      listed.sort((a, b) => {
        const aDir = isDirectory(a);
        const bDir = isDirectory(b);
        if (aDir !== bDir) return aDir ? -1 : 1;
        return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
      });
      setItems([...listed]);
      setAccessError(null);
    } catch (error) {
      setItems([]);
      setAccessError(error instanceof Error ? error.message : 'Depolamaya erişilemiyor.');
    } finally {
      setLoading(false);
    }
  }, [currentDir]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') void refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
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
  }, [selected, stack.length]);

  const requestStorageAccess = async () => {
    if (Platform.OS !== 'android') return;

    const api = Number(Platform.Version);
    try {
      if (api >= 30) {
        await Linking.sendIntent('android.settings.MANAGE_ALL_FILES_ACCESS_PERMISSION');
      } else {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        await refresh();
      }
    } catch {
      await Linking.openSettings();
    }
  };

  const enterDirectory = (dir: Directory) => {
    setStack(previous => [...previous, dir]);
  };

  const goUp = () => {
    if (stack.length > 1) setStack(previous => previous.slice(0, -1));
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
    const name = cleanName(editorValue);
    if (!isValidName(name)) {
      Alert.alert('Geçersiz ad', 'Dosya veya klasör adında / karakteri kullanılamaz.');
      return;
    }

    try {
      if (editorMode === 'rename' && selected) {
        selected.rename(name);
        setSelected(null);
      } else if (editorMode === 'folder') {
        const dir = new Directory(currentDir, name);
        if (dir.exists) throw new Error('Bu isimde bir klasör zaten var.');
        dir.create();
      } else if (editorMode === 'file') {
        const file = new File(currentDir, name);
        if (file.exists) throw new Error('Bu isimde bir dosya zaten var.');
        file.create();
      }
      setEditorMode(null);
      setEditorValue('');
      await refresh();
    } catch (error) {
      Alert.alert('İşlem başarısız', error instanceof Error ? error.message : 'Bilinmeyen hata');
    }
  };

  const removeSelected = () => {
    if (!selected) return;
    const item = selected;
    Alert.alert(
      'Silinsin mi?',
      isDirectory(item)
        ? `“${item.name}” klasörü ve içindekiler kalıcı olarak silinecek.`
        : `“${item.name}” kalıcı olarak silinecek.`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              item.delete();
              setSelected(null);
              await refresh();
            } catch (error) {
              Alert.alert('Silinemedi', error instanceof Error ? error.message : 'Bilinmeyen hata');
            }
          },
        },
      ]
    );
  };

  const setClipboardFromSelected = (mode: ClipboardMode) => {
    if (!selected) return;
    setClipboard({ mode, item: selected, isDirectory: isDirectory(selected) });
    setSelected(null);
  };

  const paste = async () => {
    if (!clipboard) return;

    const source = clipboard.item;
    const sourceUri = normalizeUri(source.uri);
    const destinationFolderUri = normalizeUri(currentDir.uri);

    if (clipboard.isDirectory && destinationFolderUri.startsWith(sourceUri)) {
      Alert.alert('Geçersiz hedef', 'Bir klasör kendi içine veya alt klasörlerinden birine kopyalanamaz/taşınamaz.');
      return;
    }

    const destination = cloneDestination(source, currentDir);
    if (destination.uri === source.uri) {
      Alert.alert('Aynı klasör', 'Kaynak ve hedef aynı.');
      return;
    }
    if (destination.exists) {
      Alert.alert('İsim çakışması', `Hedefte “${source.name}” isminde bir öğe zaten var.`);
      return;
    }

    try {
      if (clipboard.mode === 'copy') {
        await source.copy(destination);
      } else {
        await source.move(destination);
        setClipboard(null);
      }
      await refresh();
      if (clipboard.mode === 'copy') {
        Alert.alert('Kopyalandı', `“${source.name}” bu klasöre kopyalandı.`);
      }
    } catch (error) {
      Alert.alert('İşlem başarısız', error instanceof Error ? error.message : 'Bilinmeyen hata');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Üst klasöre çık"
          onPress={goUp}
          disabled={stack.length === 1}
          style={[styles.headerButton, stack.length === 1 && styles.headerButtonDisabled]}
        >
          <Text style={styles.headerButtonText}>‹</Text>
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.headerPath} numberOfLines={1}>{currentDir.uri.replace('file://', '')}</Text>
        </View>

        <Pressable onPress={() => void refresh()} style={styles.smallHeaderButton}>
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

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.muted}>Dosyalar okunuyor…</Text>
        </View>
      ) : accessError ? (
        <View style={styles.center}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.accessTitle}>Depolama erişimi gerekli</Text>
          <Text style={styles.accessText}>
            Android ayarlarından “Tüm dosyalara erişim” iznini Dosya Yöneticisi için aç.
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => void requestStorageAccess()}>
            <Text style={styles.primaryButtonText}>Erişim Ayarını Aç</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => void refresh()}>
            <Text style={styles.secondaryButtonText}>Tekrar Dene</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.uri}
          contentContainerStyle={items.length === 0 ? styles.emptyList : styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.muted}>Bu klasör boş.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const dir = isDirectory(item);
            return (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => dir ? enterDirectory(item) : setSelected(item)}
                onLongPress={() => setSelected(item)}
              >
                <Text style={styles.icon}>{dir ? '📁' : '📄'}</Text>
                <View style={styles.rowText}>
                  <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.metaText}>{dir ? 'Klasör' : formatSize(item.size)}</Text>
                </View>
                <Pressable hitSlop={10} onPress={() => setSelected(item)} style={styles.moreButton}>
                  <Text style={styles.moreText}>⋮</Text>
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}

      {!accessError && !loading && (
        <View style={styles.bottomBar}>
          <Pressable style={styles.bottomAction} onPress={() => startCreate('folder')}>
            <Text style={styles.bottomActionIcon}>📁＋</Text>
            <Text style={styles.bottomActionText}>Klasör</Text>
          </Pressable>
          <Pressable style={styles.bottomAction} onPress={() => startCreate('file')}>
            <Text style={styles.bottomActionIcon}>📄＋</Text>
            <Text style={styles.bottomActionText}>Dosya</Text>
          </Pressable>
        </View>
      )}

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.overlay} onPress={() => setSelected(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle} numberOfLines={2}>{selected?.name}</Text>
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
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>
              {editorMode === 'rename' ? 'Yeniden adlandır' : editorMode === 'folder' ? 'Yeni klasör' : 'Yeni dosya'}
            </Text>
            <TextInput
              autoFocus
              value={editorValue}
              onChangeText={setEditorValue}
              style={styles.input}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f7f8' },
  header: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d8d8dc',
    backgroundColor: '#ffffff',
  },
  headerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerButtonDisabled: { opacity: 0.25 },
  headerButtonText: { fontSize: 38, lineHeight: 40, color: '#111114' },
  smallHeaderButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  smallHeaderButtonText: { fontSize: 26, color: '#111114' },
  headerTitleWrap: { flex: 1, minWidth: 0 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111114' },
  headerPath: { marginTop: 2, fontSize: 11, color: '#77777d' },
  clipboardBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#eef3ff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccd8f3',
  },
  clipboardTextWrap: { flex: 1 },
  clipboardTitle: { fontSize: 13, fontWeight: '700', color: '#1d2b4d' },
  clipboardHint: { marginTop: 1, fontSize: 11, color: '#56617a' },
  pasteButton: { backgroundColor: '#1f5eff', paddingHorizontal: 13, paddingVertical: 9, borderRadius: 9 },
  pasteButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cancelClipboardButton: { padding: 5 },
  cancelClipboardText: { fontSize: 24, color: '#56617a' },
  listContent: { paddingBottom: 88 },
  emptyList: { flexGrow: 1, paddingBottom: 88 },
  row: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 6,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e2e5',
  },
  rowPressed: { backgroundColor: '#f0f0f2' },
  icon: { width: 42, fontSize: 27 },
  rowText: { flex: 1, minWidth: 0 },
  fileName: { fontSize: 15.5, fontWeight: '600', color: '#18181b' },
  metaText: { marginTop: 4, fontSize: 12, color: '#7a7a80' },
  moreButton: { width: 46, height: 54, alignItems: 'center', justifyContent: 'center' },
  moreText: { fontSize: 25, color: '#6a6a70' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  muted: { marginTop: 12, color: '#73737a', textAlign: 'center' },
  lockIcon: { fontSize: 42, marginBottom: 12 },
  accessTitle: { fontSize: 20, fontWeight: '800', color: '#17171a', textAlign: 'center' },
  accessText: { marginTop: 10, maxWidth: 350, color: '#65656c', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  primaryButton: { marginTop: 22, backgroundColor: '#1f5eff', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  primaryButtonText: { color: '#fff', fontWeight: '800' },
  secondaryButton: { marginTop: 10, paddingHorizontal: 18, paddingVertical: 11 },
  secondaryButtonText: { color: '#1f5eff', fontWeight: '700' },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d7d7da',
  },
  bottomAction: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomActionIcon: { fontSize: 22 },
  bottomActionText: { marginTop: 4, fontSize: 12, fontWeight: '700', color: '#303035' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'flex-end' },
  sheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 28,
  },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: '#18181b', paddingHorizontal: 4, paddingBottom: 10 },
  sheetAction: { minHeight: 50, justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ececef' },
  sheetActionText: { fontSize: 16, color: '#222226' },
  dangerText: { color: '#c62828', fontWeight: '700' },
  sheetCancel: { marginTop: 8, minHeight: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#f1f1f3' },
  sheetCancelText: { fontSize: 15, fontWeight: '700', color: '#333338' },
  dialog: { width: '88%', maxWidth: 420, alignSelf: 'center', marginBottom: '55%', backgroundColor: '#fff', borderRadius: 16, padding: 18 },
  dialogTitle: { fontSize: 18, fontWeight: '800', color: '#17171a' },
  input: { marginTop: 16, borderWidth: 1, borderColor: '#c9c9ce', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 16, color: '#17171a' },
  dialogActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 18 },
  dialogButton: { minWidth: 84, paddingHorizontal: 14, paddingVertical: 11, alignItems: 'center', borderRadius: 9 },
  dialogSaveButton: { backgroundColor: '#1f5eff' },
  dialogCancelText: { color: '#5c5c63', fontWeight: '700' },
  dialogSaveText: { color: '#fff', fontWeight: '800' },
});
