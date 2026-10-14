// The project was renamed from arachne to lightweb. Moves saved settings to the new keys
// so hidden nodes and collapsed panels survive; a key already set under the new name wins.
export function migrateStorage(storage: Storage): void {
  const old: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key?.startsWith('arachne:') || key?.startsWith('arachne.')) old.push(key);
  }
  for (const key of old) {
    const renamed = `lightweb${key.slice('arachne'.length)}`;
    const value = storage.getItem(key);
    if (value !== null && storage.getItem(renamed) === null) storage.setItem(renamed, value);
    storage.removeItem(key);
  }
}
