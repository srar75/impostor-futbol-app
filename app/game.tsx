import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CATEGORIAS } from '../src/data';
import * as Haptics from 'expo-haptics';

export default function GameScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const players = JSON.parse(params.players as string);
  const category = params.category as string;
  const settings = JSON.parse(params.settings as string);
  const listaFutbolistas = CATEGORIAS[category as keyof typeof CATEGORIAS];
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  
  const [selectedPlayerObj] = useState(() => listaFutbolistas[Math.floor(Math.random() * listaFutbolistas.length)]);
  const [impostorIndex] = useState(() => Math.floor(Math.random() * players.length));
  
  // Asignar periodista aleatorio (que no sea el impostor)
  const [journalistIndex] = useState(() => {
    if (!settings.enableJournalist || players.length < 4) return -1;
    let j = Math.floor(Math.random() * players.length);
    while (j === impostorIndex) j = Math.floor(Math.random() * players.length);
    return j;
  });

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const revealRole = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch (e) {}

    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setRevealed(true); 
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const nextPlayer = () => {
    setRevealed(false);
    fadeAnim.setValue(1);

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      router.push({
        pathname: '/rounds',
        params: { 
          players: JSON.stringify(players),
          impostorIndex: impostorIndex.toString(),
          futbolista: selectedPlayerObj.nombre,
          bandera: selectedPlayerObj.bandera,
          settings: params.settings
        }
      });
    }
  };

  const isImpostor = currentPlayerIndex === impostorIndex;
  const isJournalist = currentPlayerIndex === journalistIndex;

  return (
    <View style={styles.container}>
      <Text style={styles.playerNumber}>Turno {currentPlayerIndex + 1} de {players.length}</Text>
      <Text style={styles.playerName}>{players[currentPlayerIndex]}</Text>

      <View style={styles.cardContainer}>
        <Animated.View style={[
          styles.card, 
          revealed ? (isImpostor ? styles.cardImpostor : isJournalist ? styles.cardJournalist : styles.cardNormal) : styles.cardFront,
          { opacity: fadeAnim }
        ]}>
          {!revealed ? (
            <View style={styles.roleContent}>
              <Text style={styles.instructions}>Es tu turno.</Text>
              <Text style={styles.instructionsSub}>Asegúrate de que nadie más vea tu pantalla.</Text>
              <TouchableOpacity style={styles.button} onPress={revealRole}>
                <Text style={styles.buttonText}>Tocar para Revelar Rol</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.roleContent}>
              {isImpostor ? (
                <>
                  <Text style={styles.roleTitle}>🕵️ ERES EL IMPOSTOR</Text>
                  <Text style={styles.roleDescription}>No sabes quién es el futbolista. Disimula y descubre quién es por las preguntas.</Text>
                </>
              ) : isJournalist ? (
                <>
                  <Text style={styles.roleTitle}>📰 ERES EL PERIODISTA</Text>
                  <Text style={styles.roleDescription}>Investigaste y descubriste la nacionalidad secreta:</Text>
                  <Text style={styles.flagText}>{selectedPlayerObj.bandera}</Text>
                  <Text style={styles.roleDescription}>Ayuda a atrapar al impostor sin delatar el nombre.</Text>
                </>
              ) : (
                <>
                  <Text style={styles.roleTitle}>⚽ EL FUTBOLISTA ES:</Text>
                  <Text style={styles.flagText}>{selectedPlayerObj.bandera}</Text>
                  <Text style={styles.footballerName}>{selectedPlayerObj.nombre}</Text>
                </>
              )}
              <TouchableOpacity style={styles.buttonSecondary} onPress={nextPlayer}>
                <Text style={styles.buttonTextSecondary}>
                  {currentPlayerIndex < players.length - 1 ? 'Pasar al siguiente jugador' : 'Comenzar Rondas'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d2818', padding: 20, alignItems: 'center', justifyContent: 'center' },
  playerNumber: { fontSize: 18, color: '#a8d5ba', marginBottom: 10 },
  playerName: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 40 },
  cardContainer: { width: '100%', height: 400, alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', height: '100%', borderRadius: 20, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  cardFront: { backgroundColor: '#1a472a' },
  cardImpostor: { backgroundColor: '#7a2d2d' },
  cardNormal: { backgroundColor: '#2d7a4a' },
  cardJournalist: { backgroundColor: '#2d5a7a' }, // Blueish for journalist
  roleContent: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  instructions: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  instructionsSub: { fontSize: 16, color: '#a8d5ba', textAlign: 'center', marginBottom: 40 },
  roleTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  flagText: { fontSize: 80, marginBottom: 10 },
  footballerName: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  roleDescription: { fontSize: 16, color: '#fff', textAlign: 'center', lineHeight: 24 },
  button: { backgroundColor: '#2d7a4a', padding: 20, borderRadius: 15, width: '100%', alignItems: 'center' },
  buttonSecondary: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  buttonTextSecondary: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});