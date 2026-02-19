import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loadStats, resetStats, StatsMap } from '../src/storage';
import { useRouter } from 'expo-router';

export default function StatsScreen() {
  const [stats, setStats] = useState<StatsMap>({});
  const router = useRouter();

  useEffect(() => {
    loadStats().then(setStats);
  }, []);

  const handleReset = () => {
    Alert.alert(
      "Borrar Estadísticas",
      "¿Estás seguro de que quieres borrar el historial de todos los jugadores? Esto no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Borrar", 
          style: "destructive", 
          onPress: async () => {
            await resetStats();
            setStats({});
          }
        }
      ]
    );
  };

  const players = Object.entries(stats).sort((a, b) => b[1].games - a[1].games);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salón de la Fama 🏆</Text>
      
      {players.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay partidas jugadas todavía.</Text>
          <Text style={styles.emptySub}>¡Juega una partida para empezar a registrar estadísticas!</Text>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {players.map(([name, data]) => {
            const winRate = data.games > 0 ? Math.round(((data.crewWins + data.impostorWins) / data.games) * 100) : 0;
            const impostorWinRate = data.timesImpostor > 0 ? Math.round((data.impostorWins / data.timesImpostor) * 100) : 0;

            return (
              <View key={name} style={styles.playerCard}>
                <Text style={styles.playerName}>{name}</Text>
                
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{data.games}</Text>
                    <Text style={styles.statLabel}>Jugadas</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{winRate}%</Text>
                    <Text style={styles.statLabel}>Win Rate</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{data.impostorWins}</Text>
                    <Text style={styles.statLabel}>Victorias Imp.</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{impostorWinRate}%</Text>
                    <Text style={styles.statLabel}>Eficiencia Imp.</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Cerrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.btnTextReset}>Reiniciar Historial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d2818', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20, marginTop: 10 },
  list: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptySub: { color: '#a8d5ba', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
  playerCard: { backgroundColor: '#1a472a', padding: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#2d7a4a' },
  playerName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 15, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { width: '48%', backgroundColor: '#0d2818', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#a8d5ba' },
  statLabel: { fontSize: 12, color: '#fff', marginTop: 5, textAlign: 'center' },
  bottomButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  closeBtn: { backgroundColor: '#4caf50', padding: 15, borderRadius: 10, flex: 0.48, alignItems: 'center' },
  resetBtn: { backgroundColor: '#7a2d2d', padding: 15, borderRadius: 10, flex: 0.48, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnTextReset: { color: '#ffb3b3', fontSize: 16, fontWeight: 'bold' }
});