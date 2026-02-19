import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function RoundsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const players = JSON.parse(params.players as string);
  const settings = JSON.parse(params.settings as string);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.secondsPerTurn);

  useEffect(() => {
    if (timeLeft <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const nextTurn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setTimeLeft(settings.secondsPerTurn);
    } else if (currentRound < settings.rounds) {
      setCurrentRound(currentRound + 1);
      setCurrentPlayerIndex(0);
      setTimeLeft(settings.secondsPerTurn);
    } else {
      // Finished all rounds
      router.push({
        pathname: '/voting',
        params: {
          players: params.players,
          impostor: players[parseInt(params.impostorIndex as string)],
          futbolista: params.futbolista,
          bandera: params.bandera
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.roundText}>Ronda {currentRound} de {settings.rounds}</Text>
      
      <View style={styles.card}>
        <Text style={styles.subtitle}>Turno de preguntar para:</Text>
        <Text style={styles.playerName}>{players[currentPlayerIndex]}</Text>
        
        <View style={styles.timerCircle}>
          <Text style={[styles.timerText, timeLeft <= 10 && styles.timerWarning]}>{timeLeft}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={nextTurn}>
        <Text style={styles.buttonText}>Siguiente Jugador</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d2818', padding: 20, alignItems: 'center', justifyContent: 'center' },
  roundText: { fontSize: 24, fontWeight: 'bold', color: '#a8d5ba', marginBottom: 30 },
  card: { backgroundColor: '#1a472a', padding: 30, borderRadius: 20, width: '100%', alignItems: 'center', marginBottom: 40 },
  subtitle: { fontSize: 18, color: '#a8d5ba', marginBottom: 10 },
  playerName: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 40, textAlign: 'center' },
  timerCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0d2818', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#2d7a4a' },
  timerText: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
  timerWarning: { color: '#ff6b6b' },
  button: { backgroundColor: '#4caf50', padding: 20, borderRadius: 15, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});