import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const players = JSON.parse(params.players as string);
  const impostor = params.impostor as string;
  const futbolista = params.futbolista as string;

  const playAgain = () => {
    router.push('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>¡A Jugar! 🎮</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>⚽ El futbolista era:</Text>
        <Text style={styles.footballerName}>{futbolista}</Text>
      </View>

      <View style={styles.impostorCard}>
        <Text style={styles.infoTitle}>🕵️ El impostor es:</Text>
        <Text style={styles.impostorName}>{impostor}</Text>
      </View>

      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>📋 Reglas del Juego:</Text>
        <Text style={styles.rulesText}>
          1. Por turnos, cada jugador hace una pregunta sobre el futbolista
          {"\n\n"}
          2. Todos responden la pregunta (incluido el impostor)
          {"\n\n"}
          3. El impostor debe intentar deducir quién es el futbolista sin ser descubierto
          {"\n\n"}
          4. Los demás deben descubrir al impostor sin revelar el nombre
          {"\n\n"}
          5. Al final, votan quién creen que es el impostor
          {"\n\n"}
          💡 Los jugadores ganan si descubren al impostor
          {"\n"}
          💡 El impostor gana si adivina el futbolista o no es descubierto
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={playAgain}>
        <Text style={styles.buttonText}>Jugar de Nuevo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2818',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#2d7a4a',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
  },
  impostorCard: {
    backgroundColor: '#7a2d2d',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  footballerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  impostorName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  rulesCard: {
    backgroundColor: '#1a472a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  rulesText: {
    fontSize: 15,
    color: '#a8d5ba',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#2d7a4a',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
