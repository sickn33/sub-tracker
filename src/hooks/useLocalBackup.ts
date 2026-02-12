import { useState, useEffect, useCallback } from 'react';
import { getHandle, saveHandle } from '../utils/idb';

const HANDLE_KEY = 'backup-file-handle';

export type PermissionStatus = 'granted' | 'denied' | 'prompt';

export function useLocalBackup() {
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Restore handle on mount
  useEffect(() => {
    const restoreHandle = async () => {
      try {
        const handle = await getHandle(HANDLE_KEY);
        if (handle) {
          // Verify permission
          const permission = await handle.queryPermission({ mode: 'readwrite' });
          setPermissionStatus(permission);
          setFileHandle(handle);
        }
      } catch (err) {
        console.error('Failed to restore handle:', err);
      }
    };
    restoreHandle();
  }, []);

  const connectBackupFile = useCallback(async () => {
    try {
      setError(null);
      const handle = await window.showSaveFilePicker({
        suggestedName: 'sub-tracker-backup.json',
        types: [{
          description: 'JSON Backup File',
          accept: { 'application/json': ['.json'] },
        }],
      });

      setFileHandle(handle);
      setPermissionStatus('granted');
      await saveHandle(HANDLE_KEY, handle);
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('Failed to connect backup file.');
        console.error(err);
      }
      return false;
    }
  }, []);

  const requestBackupPermission = useCallback(async () => {
    if (!fileHandle) return false;
    
    try {
      const status = await fileHandle.requestPermission({ mode: 'readwrite' });
      setPermissionStatus(status);
      return status === 'granted';
    } catch (err) {
      console.error('Failed to request permission:', err);
      return false;
    }
  }, [fileHandle]);

  const saveToBackup = useCallback(async (data: unknown) => {
    if (!fileHandle || permissionStatus !== 'granted') return;

    try {
      setIsSaving(true);
      setError(null);

      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      
      setLastSaved(new Date());
    } catch (err) {
      console.error('Auto-save failed:', err);
      // Check if it's a permission error that happened during write
      if ((err as Error).name === 'NotAllowedError') {
        setPermissionStatus('denied');
      }
      setError('Failed to auto-save. Please reconnect or grant permission.');
    } finally {
      setIsSaving(false);
    }
  }, [fileHandle, permissionStatus]);

  return {
    fileHandle,
    permissionStatus,
    lastSaved,
    error,
    isSaving,
    connectBackupFile,
    requestBackupPermission,
    saveToBackup
  };
}
