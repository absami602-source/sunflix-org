
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

function showErrorOverlay(message: string) {
  try {
    const existing = document.getElementById('dev-error-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'dev-error-overlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.zIndex = '999999';
    overlay.style.background = 'rgba(0,0,0,0.85)';
    overlay.style.color = 'white';
    overlay.style.padding = '20px';
    overlay.style.overflow = 'auto';
    overlay.style.fontFamily = 'monospace';
    overlay.innerText = message;
    document.body.appendChild(overlay);
  } catch (e) {
    // ignore overlay failures
    // eslint-disable-next-line no-console
    console.error('Failed to show error overlay', e);
  }
}

window.addEventListener('error', (ev) => {
  // show overlay with basic info
  const msg = ev?.error ? String(ev.error) : `${ev.message} (${ev.filename}:${ev.lineno}:${ev.colno})`;
  showErrorOverlay('Uncaught error:\n\n' + msg);
  // eslint-disable-next-line no-console
  console.error('window.error', ev.error || ev.message, ev);
});

window.addEventListener('unhandledrejection', (ev) => {
  const reason = (ev && (ev as any).reason) ? (ev as any).reason : ev;
  showErrorOverlay('Unhandled Promise Rejection:\n\n' + String(reason));
  // eslint-disable-next-line no-console
  console.error('unhandledrejection', reason, ev);
});

try {
  createRoot(document.getElementById('root')!).render(<App />);
} catch (err) {
  showErrorOverlay('Render error:\n\n' + String(err));
  // eslint-disable-next-line no-console
  console.error('Render error', err);
}
  