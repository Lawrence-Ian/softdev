import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface UserProgress {
  id?: number;
  userId: number;
  steps: number;
  xp: number;
  level: number;
  studyFocus: string | null;
  profilePic: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompletedChallenge {
  id?: number;
  userId: number;
  challengeId: string;
  completedAt: Date;
}

class SkillUpDatabase extends Dexie {
  users!: Table<User>;
  userProgress!: Table<UserProgress>;
  completedChallenges!: Table<CompletedChallenge>;

  constructor() {
    super('SkillUpDB');
    this.version(1).stores({
      users: '++id, username, email',
      userProgress: '++id, userId',
      completedChallenges: '++id, userId, challengeId',
    });
  }
}

export const db = new SkillUpDatabase();

// Database helper functions
export const database = {
  // User operations
  async createUser(username: string, email: string, password: string): Promise<number> {
    const userId = await db.users.add({
      username,
      email,
      password,
      createdAt: new Date(),
    });

    // Create default progress for new user
    await db.userProgress.add({
      userId: userId as number,
      steps: 0,
      xp: 0,
      level: 1,
      studyFocus: null,
      profilePic: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return userId as number;
  },

  async getUser(id: number): Promise<User | undefined> {
    return db.users.get(id);
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    return db.users.where('email').equals(email).first();
  },

  async validateUser(email: string, password: string): Promise<User | undefined> {
    return db.users.where({ email, password }).first();
  },

  // Progress operations
  async getProgress(userId: number): Promise<UserProgress | undefined> {
    return db.userProgress.where('userId').equals(userId).first();
  },

  async updateProgress(userId: number, updates: Partial<UserProgress>): Promise<void> {
    const progress = await db.userProgress.where('userId').equals(userId).first();
    if (progress && progress.id) {
      await db.userProgress.update(progress.id, {
        ...updates,
        updatedAt: new Date(),
      });
    }
  },

  async addSteps(userId: number, count: number): Promise<number> {
    const progress = await db.userProgress.where('userId').equals(userId).first();
    if (progress && progress.id) {
      const newXp = progress.xp + (count * 2);
      const newLevel = Math.floor(newXp / 1000) + 1;
      await db.userProgress.update(progress.id, {
        steps: progress.steps + count,
        xp: newXp,
        level: newLevel,
        updatedAt: new Date(),
      });
      return newLevel;
    }
    return 1;
  },

  // Completed challenges
  async getCompletedChallenges(userId: number): Promise<CompletedChallenge[]> {
    return db.completedChallenges.where('userId').equals(userId).toArray();
  },

  async markChallengeCompleted(userId: number, challengeId: string, xpReward: number): Promise<void> {
    // Check if already completed
    const existing = await db.completedChallenges
      .where({ userId, challengeId })
      .first();
    
    if (!existing) {
      await db.completedChallenges.add({
        userId,
        challengeId,
        completedAt: new Date(),
      });

      // Add XP reward
      const progress = await db.userProgress.where('userId').equals(userId).first();
      if (progress && progress.id) {
        const newXp = progress.xp + xpReward;
        const newLevel = Math.floor(newXp / 1000) + 1;
        await db.userProgress.update(progress.id, {
          xp: newXp,
          level: newLevel,
          updatedAt: new Date(),
        });
      }
    }
  },

  async isChallengeCompleted(userId: number, challengeId: string): Promise<boolean> {
    const existing = await db.completedChallenges
      .where({ userId, challengeId })
      .first();
    return !!existing;
  },

  async resetUserProgress(userId: number): Promise<void> {
    await db.transaction('rw', db.userProgress, db.completedChallenges, async () => {
      const progress = await db.userProgress.where('userId').equals(userId).first();
      if (progress && progress.id) {
        await db.userProgress.update(progress.id, {
          steps: 0,
          xp: 0,
          level: 1,
          studyFocus: null,
          profilePic: null,
          updatedAt: new Date(),
        });
      }

      await db.completedChallenges.where('userId').equals(userId).delete();
    });
  },

  // Get all data for a user (for loading state)
  async getAllUserData(userId: number) {
    const user = await db.users.get(userId);
    const progress = await db.userProgress.where('userId').equals(userId).first();
    const completedChallenges = await this.getCompletedChallenges(userId);

    return {
      user,
      progress,
      completedChallenges: completedChallenges.map(c => c.challengeId),
    };
  },
};

