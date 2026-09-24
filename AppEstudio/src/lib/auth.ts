import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function loginConGoogle() {
  const redirectTo = Linking.createURL('auth/callback');
  console.log('redirectTo:', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error || !data?.url) throw error ?? new Error('Sin URL de OAuth');

  const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  console.log('tipo resultado:', res.type);
  if (res.type !== 'success') return null;

  const url = res.url;

  // Flujo PKCE: ?code=...
  const parsed = Linking.parse(url);
  const code = parsed.queryParams?.code as string | undefined;
  if (code) {
    const { data: s, error: e } = await supabase.auth.exchangeCodeForSession(code);
    if (e) throw e;
    console.log('Sesión por code:', s.session?.user?.email);
    return s.session;
  }

  // Flujo implícito: #access_token=...&refresh_token=...
  const hash = new URLSearchParams(url.split('#')[1] ?? '');
  const access_token = hash.get('access_token');
  const refresh_token = hash.get('refresh_token');
  if (access_token && refresh_token) {
    const { data: s, error: e } = await supabase.auth.setSession({ access_token, refresh_token });
    if (e) throw e;
    console.log('Sesión por token:', s.session?.user?.email);
    return s.session;
  }

  console.log('No llegó ni code ni token');
  return null;
}