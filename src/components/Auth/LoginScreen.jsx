import { useState } from 'react';
import { checkCredentials, setAuthenticated } from '../../lib/auth';

export default function LoginScreen({ onSuccess }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChecking(true);
    const ok = await checkCredentials(login, password);
    setChecking(false);
    if (ok) {
      setAuthenticated();
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl border border-[#EEF0F3] shadow-sm p-6"
      >
        <div className="w-10 h-10 rounded-xl bg-[#2D6BFF] text-white flex items-center justify-center font-heading font-semibold mb-4">O</div>
        <h1 className="font-heading text-lg font-semibold text-[#16181C] mb-1">Мои задачи</h1>
        <p className="text-sm text-[#9AA1AE] mb-5">Введите логин и пароль, чтобы открыть дашборд</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[#6B7280]">Логин</label>
            <input
              autoFocus
              value={login}
              onChange={(e) => { setLogin(e.target.value); setError(false); }}
              className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF]"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-[#DC2626] mt-3">Неверный логин или пароль.</p>
        )}

        <button
          type="submit"
          disabled={checking || !login || !password}
          className="mt-5 w-full px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#2D6BFF] hover:bg-[#1E54DB] disabled:opacity-40"
        >
          {checking ? 'Проверка…' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
