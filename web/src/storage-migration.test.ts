import { describe, expect, it } from 'vitest';
import { migrateStorage } from './storage-migration';

function memoryStorage(entries: Record<string, string>): Storage {
  const map = new Map(Object.entries(entries));
  return {
    get length() {
      return map.size;
    },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
    clear: () => map.clear(),
  };
}

function entries(storage: Storage): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i)!;
    out[k] = storage.getItem(k)!;
  }
  return out;
}

describe('migrateStorage', () => {
  it('moves old keys to the new name and leaves unrelated keys alone', () => {
    const s = memoryStorage({
      'arachne:hidden:demo': '["fn:a"]',
      'arachne.panelCollapsed': '1',
      'arachne.hiddenListCollapsed': '0',
      other: 'x',
    });
    migrateStorage(s);
    expect(entries(s)).toEqual({
      'lightweb:hidden:demo': '["fn:a"]',
      'lightweb.panelCollapsed': '1',
      'lightweb.hiddenListCollapsed': '0',
      other: 'x',
    });
  });

  it('keeps a value already saved under the new name', () => {
    const s = memoryStorage({ 'arachne.panelCollapsed': '1', 'lightweb.panelCollapsed': '0' });
    migrateStorage(s);
    expect(entries(s)).toEqual({ 'lightweb.panelCollapsed': '0' });
  });
});
