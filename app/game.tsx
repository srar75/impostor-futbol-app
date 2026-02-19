import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CATEGORIAS } from '../src/data';
import * as Haptics from 'expo-haptics';

export default function GameScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const players = JSON.parse(params.players as string);
  const category = params.category as string;
  const listaFutbolistas = CATEGORIAS[category as keyof typeof CATEGORIAS];
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  
  const [selectedPlayerObj] = useState(() => listaFutbolistas[Math.floor(Math.random() * listaFutbolistas.length)]);
  const [impostorIndex] = useState(() => Math.floor(Math.random() * players.length));

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const confirmReveal = () => {
    Alert.alert(
      '¿Estás solo?',
      'Asegúrate de que nadie esté mirando tu pantalla antes de revelar el rol.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Revelar', style: 'destructive', onPress: revealRole }
      ]
    );
  };

  const revealRole = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {}

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setRevealed(true); 
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const nextPlayer = () => {
    setRevealed(false);
    fadeAnim.setValue(1);

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      router.push({
        pathname: '/voting',
        params: { 
          players: JSON.stringify(players),
          impostor: players[impostorIndex],
          futbolista: selectedPlayerObj.nombre,
          bandera: selectedPlayerObj.bandera
        }
      });
    }
  };

  const isImpostor = currentPlayerIndex === impostorIndex;

  return (
    <View style={styles.container}>
      
      <View style={styles.headerArea}>
        <Text style={styles.turnLabel}>Turno {currentPlayerIndex + 1} de {players.length}</Text>
        <Text style={styles.playerName}>{players[currentPlayerIndex]}</Text>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View style={[
          styles.iosCard, 
          revealed ? (isImpostor ? styles.cardImpostor : styles.cardNormal) : styles.cardFront,
          { opacity: fadeAnim }
        ]}>
          {!revealed ? (
            <View style={styles.roleContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconFace}>👤</Text>
              </View>
              <Text style={styles.instructions}>Identidad Oculta</Text>
              <Text style={styles.instructionsSub}>Toca revelar para ver tu rol</Text>
              
              <TouchableOpacity style={styles.primaryBtn} onPress={confirmReveal}>
                <Text style={styles.primaryBtnText}>Revelar Rol</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.roleContent}>
              {isImpostor ? (
                <>
                  <Text style={styles.impostorEmoji}>🕵️‍♂️</Text>
                  <Text style={styles.roleTitleImpostor}>ERES EL IMPOSTOR</Text>
                  <Text style={styles.roleDescription}>No conoces al futbolista. Intenta deducir quién es mediante las preguntas de los demás.</Text>
                </>
              ) : (
                <>
                  <Text style={styles.flagText}>{selectedPlayerObj.bandera}</Text>
                  <Text style={styles.roleTitlePlayer}>EL FUTBOLISTA ES</Text>
                  <Text style={styles.footballerName}>{selectedPlayerObj.nombre}</Text>
                </>
              )}
              <TouchableOpacity style={styles.secondaryBtn} onPress={nextPlayer}>
                <Text style={[styles.secondaryBtnText, isImpostor ? {color: '#ff3b30'} : {color: '#007aff'}]}>
                  {currentPlayerIndex < players.length - 1 ? 'Siguiente Jugador' : 'Comenzar a Votar'}
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
  container: { flex: 1, backgroundColor: '#f2f2f7', padding: 20 },
  headerArea: { marginTop: 40, marginBottom: 20, alignItems: 'center' },
  turnLabel: { fontSize: 15, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  playerName: { fontSize: 34, fontWeight: '700', color: '#000' },
  cardContainer: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  iosCard: { width: '100%', height: 450, borderRadius: 24, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  cardFront: { backgroundColor: '#ffffff' },
  cardImpostor: { backgroundColor: '#ffeaea' }, // Light red for iOS
  cardNormal: { backgroundColor: '#eef7fe' }, // Light blue for iOS
  roleContent: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f2f2f7', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  iconFace: { fontSize: 40 },
  instructions: { fontSize: 22, fontWeight: '600', color: '#000', textAlign: 'center', marginBottom: 8 },
  instructionsSub: { fontSize: 16, color: '#8e8e93', textAlign: 'center', marginBottom: 40 },
  
  impostorEmoji: { fontSize: 80, marginBottom: 20 },
  roleTitleImpostor: { fontSize: 20, fontWeight: '700', color: '#ff3b30', textAlign: 'center', marginBottom: 16, letterSpacing: 1 },
  roleDescription: { fontSize: 17, color: '#333333', textAlign: 'center', lineHeight: 24 },
  
  flagText: { fontSize: 100, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  roleTitlePlayer: { fontSize: 15, fontWeight: '600', color: '#8e8e93', textAlign: 'center', marginBottom: 8, letterSpacing: 1 },
  footballerName: { fontSize: 34, fontWeight: '800', color: '#000', textAlign: 'center', marginBottom: 20 },
  
  primaryBtn: { backgroundColor: '#007aff', borderRadius: 14, paddingVertical: 16, width: '100%', alignItems: 'center' },
  primaryBtnText: { color: '#ffffff', fontSize: 17, fontWeight: '600' },
  secondaryBtn: { backgroundColor: '#ffffff', borderRadius: 14, paddingVertical: 16, width: '100%', alignItems: 'center', marginTop: 'auto', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  secondaryBtnText: { fontSize: 17, fontWeight: '600' }
});