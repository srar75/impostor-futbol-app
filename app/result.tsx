import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const players = JSON.parse(params.players as string);
  const impostor = params.impostor as string;
  const futbolista = params.futbolista as string;
  const bandera = params.bandera as string;
  const votes = params.votes ? JSON.parse(params.votes as string) : {};

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Calcular votos
  const voteCounts: Record<string, number> = {};
  Object.values(votes).forEach((votedFor: any) => {
    voteCounts[votedFor] = (voteCounts[votedFor] || 0) + 1;
  });

  let maxVotes = 0;
  let mostVoted: string[] = [];
  
  Object.entries(voteCounts).forEach(([player, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      mostVoted = [player];
    } else if (count === maxVotes) {
      mostVoted.push(player);
    }
  });

  const impostorCaught = mostVoted.includes(impostor) && mostVoted.length === 1;

  useEffect(() => {
    Haptics.notificationAsync(
      impostorCaught ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
    );

    const playResultSound = async () => {
      try {
        const uri = impostorCaught 
          ? 'https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg'
          : 'https://actions.google.com/sounds/v1/crowds/crowd_boo_3.ogg';
        
        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        setSound(newSound);
        await newSound.playAsync();
      } catch (e) {}
    };

    playResultSound();

    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, []);

  const playAgain = () => {
    if (sound) sound.unloadAsync();
    router.push('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{impostorCaught ? '¡IMPOSTOR ATRAPADO!' : '¡EL IMPOSTOR ESCAPÓ!'}</Text>
      
      <View style={impostorCaught ? styles.winCard : styles.loseCard}>
        <Text style={styles.resultMainText}>
          {impostorCaught ? 'Los jugadores ganan 🏆' : 'El Impostor gana 🕵️‍♂️'}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>⚽ El futbolista era:</Text>
        <Text style={styles.flagText}>{bandera}</Text>
        <Text style={styles.footballerName}>{futbolista}</Text>
      </View>

      <View style={styles.impostorCard}>
        <Text style={styles.infoTitle}>🕵️ El impostor era:</Text>
        <Text style={styles.impostorName}>{impostor}</Text>
      </View>

      <View style={styles.votesCard}>
        <Text style={styles.votesTitle}>📊 Resultados de la Votación:</Text>
        {Object.entries(voteCounts).sort((a, b) => b[1] - a[1]).map(([player, count]) => (
          <View key={player} style={styles.voteRow}>
            <Text style={styles.votePlayer}>{player} {mostVoted.includes(player) ? '🎯' : ''}</Text>
            <Text style={styles.voteCount}>{count} voto(s)</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={playAgain}>
        <Text style={styles.buttonText}>Jugar de Nuevo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d2818' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 10, marginBottom: 20 },
  winCard: { backgroundColor: '#2d7a4a', padding: 20, borderRadius: 15, marginBottom: 20, alignItems: 'center' },
  loseCard: { backgroundColor: '#7a2d2d', padding: 20, borderRadius: 15, marginBottom: 20, alignItems: 'center' },
  resultMainText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  infoCard: { backgroundColor: '#1a472a', padding: 25, borderRadius: 15, marginBottom: 20, alignItems: 'center' },
  impostorCard: { backgroundColor: '#1a472a', padding: 25, borderRadius: 15, marginBottom: 20, alignItems: 'center', borderColor: '#7a2d2d', borderWidth: 2 },
  infoTitle: { fontSize: 18, color: '#a8d5ba', textAlign: 'center', marginBottom: 10 },
  flagText: { fontSize: 50, marginBottom: 5 },
  footballerName: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  impostorName: { fontSize: 28, fontWeight: 'bold', color: '#ff6b6b', textAlign: 'center' },
  votesCard: { backgroundColor: '#1a472a', padding: 20, borderRadius: 15, marginBottom: 30 },
  votesTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  voteRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2d7a4a' },
  votePlayer: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  voteCount: { color: '#a8d5ba', fontSize: 16 },
  button: { backgroundColor: '#4caf50', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});