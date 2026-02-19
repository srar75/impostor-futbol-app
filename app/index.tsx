import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActionSheetIOS, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CATEGORIAS } from '../src/data';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Top Mundial');

  const addPlayer = () => {
    if (playerName.trim() === '') return;
    if (players.length >= 10) {
      alert('Límite alcanzado: Máximo 10 jugadores');
      return;
    }
    if (players.includes(playerName.trim())) {
      alert('Error: Este jugador ya está en la lista');
      return;
    }
    setPlayers([...players, playerName.trim()]);
    setPlayerName('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removePlayer = (player: string) => {
    setPlayers(players.filter(p => p !== player));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const showCategoryActionSheet = () => {
    if (Platform.OS !== 'ios') return;
    
    const options = Object.keys(CATEGORIAS);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancelar', ...options],
        cancelButtonIndex: 0,
        title: 'Selecciona una categoría',
      },
      (buttonIndex) => {
        if (buttonIndex !== 0) {
          setSelectedCategory(options[buttonIndex - 1]);
          Haptics.selectionAsync();
        }
      }
    );
  };

  const startGame = async () => {
    if (players.length < 3) {
      alert('Necesitas al menos 3 jugadores');
      return;
    }

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}

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
      <StatusBar style="dark" />
      
      {/* Settings-like grouping for Category */}
      <Text style={styles.sectionHeader}>CONFIGURACIÓN</Text>
      <View style={styles.iosGroup}>
        <TouchableOpacity style={styles.iosRow} onPress={showCategoryActionSheet}>
          <Text style={styles.iosRowLabel}>Categoría</Text>
          <View style={styles.iosRowValueContainer}>
            <Text style={styles.iosRowValue}>{selectedCategory}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Input Group */}
      <Text style={styles.sectionHeader}>AGREGAR JUGADOR</Text>
      <View style={styles.iosGroup}>
        <View style={[styles.iosRow, { borderBottomWidth: 0 }]}>
          <TextInput
            style={styles.input}
            placeholder="Ej. Juan"
            placeholderTextColor="#c7c7cc"
            value={playerName}
            onChangeText={setPlayerName}
            onSubmitEditing={addPlayer}
            returnKeyType="done"
            clearButtonMode="while-editing"
          />
          <TouchableOpacity onPress={addPlayer} disabled={!playerName.trim()}>
            <Text style={[styles.addTextBtn, !playerName.trim() && { color: '#c7c7cc' }]}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Players List Group */}
      <Text style={styles.sectionHeader}>JUGADORES ({players.length}/10)</Text>
      {players.length > 0 ? (
        <View style={styles.iosGroup}>
          {players.map((player, index) => (
            <View key={player} style={[styles.iosRow, index === players.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.iosRowLabel}>{player}</Text>
              <TouchableOpacity onPress={() => removePlayer(player)}>
                <Text style={styles.deleteTextBtn}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>Agrega al menos 3 jugadores para comenzar.</Text>
      )}

      {/* Primary Action Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.primaryButton, players.length < 3 && styles.primaryButtonDisabled]} 
          onPress={startGame}
          disabled={players.length < 3}
        >
          <Text style={styles.primaryButtonText}>Iniciar Partida</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  sectionHeader: { fontSize: 13, color: '#8e8e93', marginTop: 24, marginBottom: 8, marginLeft: 16, textTransform: 'uppercase' },
  iosGroup: { backgroundColor: '#ffffff', borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#c6c6c8' },
  iosRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingRight: 16, marginLeft: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#c6c6c8' },
  iosRowLabel: { fontSize: 17, color: '#000000' },
  iosRowValueContainer: { flexDirection: 'row', alignItems: 'center' },
  iosRowValue: { fontSize: 17, color: '#8e8e93', marginRight: 8 },
  chevron: { fontSize: 20, color: '#c7c7cc', fontFamily: 'Courier', fontWeight: 'bold' },
  input: { flex: 1, fontSize: 17, paddingVertical: 4 },
  addTextBtn: { fontSize: 17, color: '#007aff', fontWeight: '600' },
  deleteTextBtn: { fontSize: 17, color: '#ff3b30' },
  emptyText: { textAlign: 'center', color: '#8e8e93', marginTop: 10, fontSize: 15 },
  buttonContainer: { padding: 16, marginTop: 20 },
  primaryButton: { backgroundColor: '#007aff', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  primaryButtonDisabled: { backgroundColor: '#b0d4ff' },
  primaryButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '600' }
});