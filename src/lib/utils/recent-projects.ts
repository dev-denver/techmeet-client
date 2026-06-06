export interface RecentProject {
  id: string;
  title: string;
  viewedAt: number;
}

const STORAGE_KEY = "techmeet:recent-projects";
const CHANGE_EVENT = "techmeet:recent-projects-changed";
const MAX_ITEMS = 10;
const EMPTY: RecentProject[] = [];

// useSyncExternalStore 스냅샷 캐시: 동일 raw 문자열이면 동일 참조를 반환해 무한 렌더를 방지
let snapshotRaw: string | null = null;
let snapshotValue: RecentProject[] = EMPTY;

function parse(raw: string | null): RecentProject[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return EMPTY;
    const valid = parsed.filter(
      (p): p is RecentProject =>
        !!p && typeof p.id === "string" && typeof p.title === "string" && typeof p.viewedAt === "number"
    );
    return valid.length ? valid : EMPTY;
  } catch {
    return EMPTY;
  }
}

/** 최근 본 프로젝트 스냅샷 (최신순). 캐시 적용 — useSyncExternalStore의 getSnapshot으로 사용 */
export function getRecentProjects(): RecentProject[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === snapshotRaw) return snapshotValue;
  snapshotRaw = raw;
  snapshotValue = parse(raw);
  return snapshotValue;
}

/** SSR/서버 스냅샷 — 항상 안정적인 빈 배열 (하이드레이션 불일치 방지) */
export function getRecentProjectsServerSnapshot(): RecentProject[] {
  return EMPTY;
}

/** storage(다른 탭) + 커스텀 이벤트(같은 탭) 구독 — useSyncExternalStore의 subscribe로 사용 */
export function subscribeRecentProjects(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

/** 최근 본 프로젝트를 맨 앞에 추가한다 (중복 제거, 최대 10개 유지). */
export function addRecentProject(project: { id: string; title: string }): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentProjects().filter((p) => p.id !== project.id);
    const next: RecentProject[] = [
      { id: project.id, title: project.title, viewedAt: Date.now() },
      ...existing,
    ].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // 같은 탭의 구독자에게 변경 알림 (storage 이벤트는 다른 탭에서만 발생)
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // localStorage 비활성/용량초과 시 무시 (조용히 실패)
  }
}
