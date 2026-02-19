import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CATEGORIAS } from './data';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Top Mundial');
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const addPlayer = () => {
    if (playerName.trim() === '') return;
    if (players.length >= 10) {
      Alert.alert('Límite alcanzado', 'Máximo 10 jugadores');
      return;
    }
    if (players.includes(playerName.trim())) {
      Alert.alert('Error', 'Este jugador ya está en la lista');
      return;
    }
    setPlayers([...players, playerName.trim()]);
    setPlayerName('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removePlayer = (player: string) => {
    setPlayers(players.filter(p => p !== player));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const startGame = async () => {
    if (players.length < 3) {
      Alert.alert('Error', 'Necesitas al menos 3 jugadores');
      return;
    }
    
    // Play Whistle Sound
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: 'https://actions.google.com/sounds/v1/sports/referee_whistle.ogg' }
      );
      setSound(newSound);
      await newSound.playAsync();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.log('Error playing sound', e);
    }

    router.push({
      pathname: '/game',
      params: { 
        players: JSON.stringify(players),
        category: selectedCategory
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>⚽ Impostor Futbol</Text>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Categoría:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {Object.keys(CATEGORIAS).map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.categoryBadge, selectedCategory === cat && styles.categoryBadgeActive]}
              onPress={() => {
                setSelectedCategory(cat);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del jugador"
          placeholderTextColor="#999"
          value={playerName}
          onChangeText={setPlayerName}
          onSubmitEditing={addPlayer}
        />
        <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.playersContainer}>
        <Text style={styles.playersTitle}>Jugadores ({players.length}/10)</Text>
        <FlatList
          data={players}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.playerItem}>
              <Text style={styles.playerName}>{item}</Text>
              <TouchableOpacity onPress={() => removePlayer(item)}>
                <Text style={styles.removeButton}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <TouchableOpacity 
        style={[styles.startButton, players.length < 3 && styles.disabledButton]} 
        onPress={startGame}
        disabled={players.length < 3}
      >
        <Text style={styles.startButtonText}>Iniciar Partida</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d2818', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 10, marginBottom: 20 },
  categoryContainer: { marginBottom: 15 },
  categoryTitle: { color: '#a8d5ba', fontSize: 16, marginBottom: 8 },
  categoryScroll: { flexDirection: 'row' },
  categoryBadge: { backgroundColor: '#1a472a', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#2d7a4a' },
  categoryBadgeActive: { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  categoryText: { color: '#a8d5ba', fontWeight: 'bold' },
  categoryTextActive: { color: '#fff' },
  inputContainer: { flexDirection: 'row', marginBottom: 15 },
  input: { flex: 1, backgroundColor: '#1a472a', color: '#fff', padding: 15, borderRadius: 10, fontSize: 16 },
  addButton: { backgroundColor: '#2d7a4a', width: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginLeft: 10 },
  buttonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  playersContainer: { flex: 1, backgroundColor: '#1a472a', borderRadius: 10, padding: 15, marginBottom: 20 },
  playersTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  playerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2d7a4a', padding: 12, borderRadius: 8, marginBottom: 8 },
  playerName: { color: '#fff', fontSize: 16 },
  removeButton: { color: '#ff6b6b', fontSize: 20, fontWeight: 'bold' },
  startButton: { backgroundColor: '#2d7a4a', padding: 18, borderRadius: 10, alignItems: 'center' },
  disabledButton: { backgroundColor: '#555' },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});