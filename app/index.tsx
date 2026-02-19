import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);

  const addPlayer = () => {
    if (playerName.trim() === '') {
      Alert.alert('Error', 'Ingresa un nombre válido');
      return;
    }
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
  };

  const removePlayer = (player: string) => {
    setPlayers(players.filter(p => p !== player));
  };

  const startGame = () => {
    if (players.length < 3) {
      Alert.alert('Error', 'Necesitas al menos 3 jugadores');
      return;
    }
    router.push({
      pathname: '/game',
      params: { players: JSON.stringify(players) }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>⚽ Impostor Futbol</Text>
      <Text style={styles.subtitle}>Todos conocen el futbolista menos uno</Text>

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
          ListEmptyComponent={
            <Text style={styles.emptyText}>Agrega jugadores para comenzar</Text>
          }
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
  container: {
    flex: 1,
    backgroundColor: '#0d2818',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#a8d5ba',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a472a',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2d7a4a',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  playersContainer: {
    flex: 1,
    backgroundColor: '#1a472a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  playersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d7a4a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
  },
  removeButton: {
    color: '#ff6b6b',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#2d7a4a',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
