import * as SecureStore from 'expo-secure-store';
const KEY = 'sb.session';
export async function saveSession(session: unknown){ await SecureStore.setItemAsync(KEY, JSON.stringify(session)); }
export async function getSession<T=any>(){ const raw = await SecureStore.getItemAsync(KEY); return raw ? JSON.parse(raw) as T : null; }
export async function clearSession(){ await SecureStore.deleteItemAsync(KEY); }
