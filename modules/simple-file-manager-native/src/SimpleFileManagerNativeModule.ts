import { requireNativeModule } from 'expo';

export type NativeStorageRoot = {
  label: string;
  path: string;
  removable: boolean;
  primary: boolean;
};

export type NativeFileEntry = {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  lastModified: number;
};

type NativeSettings = {
  theme?: string | null;
  scale?: number | null;
};

type SimpleFileManagerNativeModule = {
  getRootPath(): string;
  hasAllFilesAccess(): boolean;
  openAllFilesAccessSettings(): boolean;
  getStorageRoots(): Promise<NativeStorageRoot[]>;
  list(path: string): Promise<NativeFileEntry[]>;
  exists(path: string): Promise<boolean>;
  mkdir(path: string): Promise<boolean>;
  createFile(path: string): Promise<boolean>;
  delete(path: string): Promise<boolean>;
  copy(source: string, destination: string, overwrite: boolean): Promise<boolean>;
  move(source: string, destination: string, overwrite: boolean): Promise<boolean>;
  openFile(path: string, mime: string): Promise<boolean>;
  getSettings(): Promise<NativeSettings>;
  saveSettings(theme: string, scale: number): Promise<boolean>;
};

export default requireNativeModule<SimpleFileManagerNativeModule>('SimpleFileManagerNative');
