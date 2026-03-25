const MODULE_LESSON_KEY = "completedModuleLessons";

const readCompletedLessons = (): string[] => {
  try {
    const raw = localStorage.getItem(MODULE_LESSON_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
};

export const getCompletedLessons = (): string[] => readCompletedLessons();

export const isLessonCompleted = (moduleId: string): boolean => {
  if (!moduleId) {
    return false;
  }
  return readCompletedLessons().includes(moduleId);
};

export const markLessonCompleted = (moduleId: string): void => {
  if (!moduleId) {
    return;
  }

  const current = readCompletedLessons();
  if (current.includes(moduleId)) {
    return;
  }

  const updated = [...current, moduleId];
  localStorage.setItem(MODULE_LESSON_KEY, JSON.stringify(updated));
};

export const resetCompletedLessons = (): void => {
  localStorage.removeItem(MODULE_LESSON_KEY);
};
