export interface FitnessGateState {
  completed: boolean;
  date: string;
  score: number;
}

export const FITNESS_STORAGE_KEY = "fitnessCompleted";
export const FITNESS_SCORE_REWARD = 10;
const FITNESS_GLOBAL_SCOPE = "global";

const getTodayKey = () => new Date().toISOString().slice(0, 10);
const getScopeKey = (scope?: string) => (scope && scope.trim() ? scope.trim() : FITNESS_GLOBAL_SCOPE);
const getStorageKey = (scope?: string) => `${FITNESS_STORAGE_KEY}:${getScopeKey(scope)}`;

const getDefaultState = (): FitnessGateState => ({
  completed: false,
  date: getTodayKey(),
  score: 0,
});

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const getFitnessGateState = (scope?: string): FitnessGateState => {
  const fallback = getDefaultState();

  try {
    const storageKey = getStorageKey(scope);
    const raw = localStorage.getItem(storageKey);

    if (!raw) {
      // Backward compatibility for earlier app versions that used one shared key.
      if (getScopeKey(scope) === FITNESS_GLOBAL_SCOPE) {
        const legacyRaw = localStorage.getItem(FITNESS_STORAGE_KEY);
        if (legacyRaw) {
          localStorage.setItem(storageKey, legacyRaw);
          localStorage.removeItem(FITNESS_STORAGE_KEY);
          return getFitnessGateState(scope);
        }
      }

      return fallback;
    }

    // Backward compatibility if an older build stored a plain boolean.
    if (raw === "true" || raw === "false") {
      const legacyState: FitnessGateState = {
        completed: raw === "true",
        date: getTodayKey(),
        score: raw === "true" ? FITNESS_SCORE_REWARD : 0,
      };
      localStorage.setItem(storageKey, JSON.stringify(legacyState));
      return legacyState;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isObject(parsed)) {
      localStorage.removeItem(storageKey);
      return fallback;
    }

    const date = typeof parsed.date === "string" ? parsed.date : "";
    const completed = Boolean(parsed.completed);
    const score = typeof parsed.score === "number" ? parsed.score : 0;

    // Daily reset: if stored date is not today, require fitness again.
    if (date !== getTodayKey()) {
      localStorage.setItem(storageKey, JSON.stringify(fallback));
      return fallback;
    }

    return {
      completed,
      date,
      score,
    };
  } catch {
    return fallback;
  }
};

export const isFitnessCompletedToday = (scope?: string): boolean => {
  const state = getFitnessGateState(scope);
  return state.completed;
};

export const completeFitnessForToday = (
  scoreReward: number = FITNESS_SCORE_REWARD,
  scope?: string,
): FitnessGateState => {
  const completedState: FitnessGateState = {
    completed: true,
    date: getTodayKey(),
    score: scoreReward,
  };

  localStorage.setItem(getStorageKey(scope), JSON.stringify(completedState));
  return completedState;
};

export const resetAllFitnessGateState = (): void => {
  const keysToDelete: string[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key) {
      continue;
    }

    if (key === FITNESS_STORAGE_KEY || key.startsWith(`${FITNESS_STORAGE_KEY}:`)) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => localStorage.removeItem(key));
};

export const resetFitnessGate = (scope?: string): void => {
  const storageKey = getStorageKey(scope);
  const fallback = getDefaultState();
  localStorage.setItem(storageKey, JSON.stringify(fallback));
};

