interface SessionRecord {
  shownIds: Set<number>;
  lastSeenAt: number;
}

const SESSION_TTL_MS = 6 * 60 * 60 * 1000;
const sessions = new Map<string, SessionRecord>();

function pruneExpiredSessions(): void {
  const now = Date.now();
  for (const [sessionId, record] of sessions) {
    if (now - record.lastSeenAt > SESSION_TTL_MS) {
      sessions.delete(sessionId);
    }
  }
}

export function getShownMovieIds(sessionId: string | undefined): Set<number> {
  if (!sessionId) {
    return new Set();
  }
  pruneExpiredSessions();
  return sessions.get(sessionId)?.shownIds ?? new Set();
}

export function recordShownMovieIds(
  sessionId: string | undefined,
  movieIds: number[],
): void {
  if (!sessionId || movieIds.length === 0) {
    return;
  }
  pruneExpiredSessions();
  const record = sessions.get(sessionId) ?? {
    shownIds: new Set<number>(),
    lastSeenAt: Date.now(),
  };
  movieIds.forEach((id) => record.shownIds.add(id));
  record.lastSeenAt = Date.now();
  sessions.set(sessionId, record);
}
