import { useState, useEffect, useCallback } from 'react';
import { getHandle, saveHandle } from '../utils/idb';

const HANDLE_KEY = 'backup-file-handle';

export function useLocalBackup() {
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
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
          if (permission === 'granted') {
            setFileHandle(handle);
          } else {
             // If not granted, we still keep the handle but need to request permission later
             // For now, let's just keep it and handle re-request on save/connect
             setFileHandle(handle);
          }
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

  const saveToBackup = useCallback(async (data: unknown) => {
    if (!fileHandle) return;

    try {
      setIsSaving(true);
      setError(null);

      // Check permission
      const permission = await fileHandle.queryPermission({ mode: 'readwrite' });
      
      if (permission !== 'granted') {
        const request = await fileHandle.requestPermission({ mode: 'readwrite' });
        if (request !== 'granted') {
          throw new Error('Permission denied');
        }
      }

      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      
      setLastSaved(new Date());
    } catch (err) {
      console.error('Auto-save failed:', err);
      setError('Failed to auto-save. Please reconnect backup file.');
      // If permission error, might want to clear handle?
      // For now, keep it so user can retry
    } finally {
      setIsSaving(false);
    }
  }, [fileHandle]);

  return {
    fileHandle,
    lastSaved,
    error,
    isSaving,
    connectBackupFile,
    saveToBackup
  };
}
