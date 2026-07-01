const SESSION_KEY = 'dashboard.auth.v1';

// Не настоящая защита данных — это отгораживает дашборд от случайных
// посетителей на публичном GitHub Pages. Хеш логина+пароля лежит в
// открытом виде в коде, при желании его можно подобрать.
const CREDENTIALS_HASH = '6488a75276c7640214941a0ad85db53652af1663dc072092fcabc70c343afd16';

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function checkCredentials(login, password) {
  const hash = await sha256(`${login.trim()}:${password}`);
  return hash === CREDENTIALS_HASH;
}

export function isAuthenticated() {
  return localStorage.getItem(SESSION_KEY) === '1';
}

export function setAuthenticated() {
  localStorage.setItem(SESSION_KEY, '1');
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
