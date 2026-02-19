import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function VotingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const players: string[] = JSON.parse(params.players as string);
  
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, string>>({});
  
  const currentVoter = players[currentVoterIndex];
  const candidates = players.filter(p => p !== currentVoter);

  const castVote = (candidate: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newVotes = { ...votes, [currentVoter]: candidate };
    setVotes(newVotes);

    if (currentVoterIndex < players.length - 1) {
      setCurrentVoterIndex(currentVoterIndex + 1);
    } else {
      router.push({
        pathname: '/result',
        params: { 
          ...params,
          votes: JSON.stringify(newVotes)
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fase de Votación</Text>
        <Text style={styles.subtitle}>Pasa el teléfono a</Text>
        <Text style={styles.voterName}>{currentVoter}</Text>
      </View>

      <Text style={styles.question}>¿Quién crees que es el Impostor?</Text>

      <ScrollView style={styles.candidatesList}>
        {candidates.map((candidate) => (
          <TouchableOpacity 
            key={candidate} 
            style={styles.candidateButton}
            onPress={() => castVote(candidate)}
          >
            <Text style={styles.candidateText}>{candidate}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d2818', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#a8d5ba' },
  voterName: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 5 },
  question: { fontSize: 20, color: '#fff', textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  candidatesList: { flex: 1 },
  candidateButton: { backgroundColor: '#1a472a', padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#2d7a4a' },
  candidateText: { color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: 'bold' }
});