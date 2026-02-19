import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = 'impostor_stats_v1';

export type PlayerStats = {
  games: number;
  crewWins: number;
  impostorWins: number;
  timesImpostor: number;
  caughtAsImpostor: number;
};

export type StatsMap = Record<string, PlayerStats>;

export async function loadStats(): Promise<StatsMap> {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function ensure(stats: StatsMap, name: string): PlayerStats {
  if (!stats[name]) {
    stats[name] = { games: 0, crewWins: 0, impostorWins: 0, timesImpostor: 0, caughtAsImpostor: 0 };
  }
  return stats[name];
}

export async function applyGameResult(players: string[], impostor: string, impostorCaught: boolean) {
  try {
    const stats = await loadStats();

    players.forEach(p => ensure(stats, p).games += 1);
    ensure(stats, impostor).timesImpostor += 1;

    if (impostorCaught) {
      players.forEach(p => {
        if (p !== impostor) ensure(stats, p).crewWins += 1;
      });
      ensure(stats, impostor).caughtAsImpostor += 1;
    } else {
      ensure(stats, impostor).impostorWins += 1;
    }

    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

export async function resetStats() {
  await AsyncStorage.removeItem(STATS_KEY);
}
