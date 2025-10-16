const KEY = "auth_lockout_v1";
const LOCK_WINDOW_MS = 15 * 60 * 1000;

export type Lockout = {
  count: number;
  firstAttemptAt: number | null;
  lockedAt: number | null;
};

const now = () => Date.now();

export function readLock(): Lockout {
  try { 
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Lockout; 
  } catch { 
    return { count: 0, firstAttemptAt: null, lockedAt: null }; 
  }
}

export function writeLock(l: Lockout) { 
  localStorage.setItem(KEY, JSON.stringify(l)); 
}

export function clearLock() { 
  localStorage.removeItem(KEY); 
}

export function isLocked(l = readLock()): boolean {
  return !!l.lockedAt && (now() - l.lockedAt) < LOCK_WINDOW_MS;
}

export function remainingMs(l = readLock()): number {
  if (!l.lockedAt) return 0;
  const ms = LOCK_WINDOW_MS - (now() - l.lockedAt);
  return ms > 0 ? ms : 0;
}

export function registerFailedAttempt(): Lockout {
  const l = readLock();
  const base: Lockout = {
    count: l.count || 0,
    firstAttemptAt: l.firstAttemptAt ?? now(),
    lockedAt: l.lockedAt ?? null,
  };
  
  // auto-reset if 15 min passed since firstAttemptAt
  if (base.firstAttemptAt && (now() - base.firstAttemptAt) >= LOCK_WINDOW_MS) {
    base.count = 0; 
    base.firstAttemptAt = now(); 
    base.lockedAt = null;
  }
  
  base.count += 1;
  if (base.count >= 3 && !base.lockedAt) {
    base.lockedAt = now();
  }
  
  writeLock(base); 
  return base;
}

export function registerSuccess() {
  clearLock(); // reset on successful authentication
}

export function formatTimeRemaining(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function shouldIncrementAttempt(error: any): boolean {
  // Only increment on 4xx errors (client errors), not 5xx (server errors)
  const status = error?.status || error?.response?.status;
  return status >= 400 && status < 500;
}
