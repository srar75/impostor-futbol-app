import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CATEGORIAS } from '../src/data';
import * as Haptics from 'expo-haptics';
import { loadSettings, saveSettings, Settings, defaultSettings } from '../src/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Top Mundial');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const updateSetting = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const addPlayer = () => {
    if (playerName.trim() === '') return;
    if (players.length >= 10) {
      alert('Límite alcanzado (Máx 10)');
      return;
    }
    if (players.includes(playerName.trim())) {
      alert('El jugador ya existe');
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
      alert('Necesitas al menos 3 jugadores');
      return;
    }
    try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch (e) {}
    
    router.push({
      pathname: '/game',
      params: { 
        players: JSON.stringify(players),
        category: selectedCategory,
        settings: JSON.stringify(settings)
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>⚽ Impostor Futbol</Text>

      {showSettings ? (
        <View style={styles.settingsPanel}>
          <Text style={styles.settingsTitle}>Ajustes de Partida</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Rondas de preguntas:</Text>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => updateSetting('rounds', Math.max(1, settings.rounds - 1))} style={styles.stepBtn}><Text style={styles.stepText}>-</Text></TouchableOpacity>
              <Text style={styles.settingValue}>{settings.rounds}</Text>
              <TouchableOpacity onPress={() => updateSetting('rounds', Math.min(5, settings.rounds + 1))} style={styles.stepBtn}><Text style={styles.stepText}>+</Text></TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Segundos por turno:</Text>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => updateSetting('secondsPerTurn', Math.max(10, settings.secondsPerTurn - 5))} style={styles.stepBtn}><Text style={styles.stepText}>-</Text></TouchableOpacity>
              <Text style={styles.settingValue}>{settings.secondsPerTurn}s</Text>
              <TouchableOpacity onPress={() => updateSetting('secondsPerTurn', Math.min(120, settings.secondsPerTurn + 5))} style={styles.stepBtn}><Text style={styles.stepText}>+</Text></TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Rol: Periodista 📰</Text>
            <Switch 
              value={settings.enableJournalist} 
              onValueChange={(val) => updateSetting('enableJournalist', val)}
              trackColor={{ false: '#7a2d2d', true: '#4caf50' }}
            />
          </View>

          <TouchableOpacity style={styles.closeSettingsBtn} onPress={() => setShowSettings(false)}>
            <Text style={styles.closeSettingsText}>Cerrar Ajustes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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

          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSettings(true)}>
              <Text style={styles.iconBtnText}>⚙️ Ajustes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/stats')}>
              <Text style={styles.iconBtnText}>📊 Stats</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.startButton, players.length < 3 && styles.disabledButton]} 
            onPress={startGame}
            disabled={players.length < 3}
          >
            <Text style={styles.startButtonText}>Iniciar Partida</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d2818', padding: 20, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
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
  playersContainer: { flex: 1, backgroundColor: '#1a472a', borderRadius: 10, padding: 15, marginBottom: 15 },
  playersTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  playerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2d7a4a', padding: 12, borderRadius: 8, marginBottom: 8 },
  playerName: { color: '#fff', fontSize: 16 },
  removeButton: { color: '#ff6b6b', fontSize: 20, fontWeight: 'bold' },
  bottomButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  iconBtn: { backgroundColor: '#1a472a', padding: 12, borderRadius: 10, flex: 0.48, alignItems: 'center' },
  iconBtnText: { color: '#a8d5ba', fontWeight: 'bold' },
  startButton: { backgroundColor: '#4caf50', padding: 18, borderRadius: 10, alignItems: 'center' },
  disabledButton: { backgroundColor: '#2d7a4a', opacity: 0.5 },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  settingsPanel: { flex: 1, backgroundColor: '#1a472a', borderRadius: 15, padding: 20 },
  settingsTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#2d7a4a', paddingBottom: 15 },
  settingLabel: { color: '#fff', fontSize: 16, flex: 1 },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: { backgroundColor: '#2d7a4a', width: 35, height: 35, borderRadius: 17.5, alignItems: 'center', justifyContent: 'center' },
  stepText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  settingValue: { color: '#fff', fontSize: 16, width: 40, textAlign: 'center', fontWeight: 'bold' },
  closeSettingsBtn: { backgroundColor: '#0d2818', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 'auto' },
  closeSettingsText: { color: '#a8d5ba', fontSize: 16, fontWeight: 'bold' }
});
