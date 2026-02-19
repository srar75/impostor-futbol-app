import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const FUTBOLISTAS = [
  'Lionel Messi', 'Cristiano Ronaldo', 'Neymar Jr', 'Kylian Mbappé',
  'Erling Haaland', 'Kevin De Bruyne', 'Vinicius Jr', 'Luka Modrić',
  'Robert Lewandowski', 'Mohamed Salah', 'Harry Kane', 'Karim Benzema',
  'Sergio Ramos', 'Virgil van Dijk', 'Thibaut Courtois', 'Manuel Neuer',
  'Bruno Fernandes', 'Son Heung-min', 'Pedri', 'Gavi', 'Jude Bellingham',
  'Rodri', 'Casemiro', 'Frenkie de Jong', 'Toni Kroos', 'Joshua Kimmich',
  'Sadio Mané', 'Riyad Mahrez', 'Bernardo Silva', 'Phil Foden',
  'Jamal Musiala', 'Florian Wirtz', 'Rafael Leão', 'Victor Osimhen',
  'Vinícius Júnior', 'Eduardo Camavinga', 'Aurélien Tchouaméni',
  'Enzo Fernández', 'Declan Rice', 'Bukayo Saka', 'Martin Ødegaard',
  'Darwin Núñez', 'Julián Álvarez', 'Lautaro Martínez', 'Paulo Dybala',
  'Luis Suárez', 'Sergio Busquets', 'Marcelo Brozović', 'Nicoló Barella',
  'Federico Valverde', 'Alexis Mac Allister'
];

export default function GameScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const players = JSON.parse(params.players as string);
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Seleccionar un futbolista aleatorio y un impostor
  const [selectedPlayer] = useState(() => {
    return FUTBOLISTAS[Math.floor(Math.random() * FUTBOLISTAS.length)];
  });
  
  const [impostorIndex] = useState(() => {
    return Math.floor(Math.random() * players.length);
  });

  const startReveal = () => {
    setGameStarted(true);
    setRevealed(true);
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setRevealed(false);
    } else {
      router.push({
        pathname: '/result',
        params: { 
          players: JSON.stringify(players),
          impostor: players[impostorIndex],
          futbolista: selectedPlayer
        }
      });
    }
  };

  const isImpostor = currentPlayerIndex === impostorIndex;

  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>¡Listos para jugar!</Text>
        <Text style={styles.instructions}>
          Cada jugador verá su rol en pantalla.
          {"\n\n"}
          • Un jugador será el IMPOSTOR (no sabrá el futbolista)
          {"\n"}
          • Los demás verán el nombre del futbolista
          {"\n\n"}
          El objetivo es descubrir quién es el impostor mediante preguntas.
        </Text>
        <TouchableOpacity style={styles.button} onPress={startReveal}>
          <Text style={styles.buttonText}>Comenzar Revelación</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.playerNumber}>Jugador {currentPlayerIndex + 1} de {players.length}</Text>
      <Text style={styles.playerName}>{players[currentPlayerIndex]}</Text>

      {!revealed ? (
        <View style={styles.revealContainer}>
          <Text style={styles.instructions}>Pasa el teléfono a {players[currentPlayerIndex]}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setRevealed(true)}>
            <Text style={styles.buttonText}>Ver mi rol</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.roleContainer}>
          {isImpostor ? (
            <View style={styles.impostorCard}>
              <Text style={styles.roleTitle}>🕵️ ERES EL IMPOSTOR</Text>
              <Text style={styles.roleDescription}>
                No sabes quién es el futbolista.
                {"\n\n"}
                Intenta descubrirlo haciendo preguntas sin que te descubran.
              </Text>
            </View>
          ) : (
            <View style={styles.playerCard}>
              <Text style={styles.roleTitle}>⚽ EL FUTBOLISTA ES:</Text>
              <Text style={styles.footballerName}>{selectedPlayer}</Text>
              <Text style={styles.roleDescription}>
                Haz preguntas para descubrir al impostor sin revelar el nombre.
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={nextPlayer}>
            <Text style={styles.buttonText}>
              {currentPlayerIndex < players.length - 1 ? 'Siguiente Jugador' : 'Comenzar Juego'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2818',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: '#a8d5ba',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  playerNumber: {
    fontSize: 16,
    color: '#a8d5ba',
    textAlign: 'center',
    marginBottom: 10,
  },
  playerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  revealContainer: {
    alignItems: 'center',
  },
  roleContainer: {
    alignItems: 'center',
  },
  impostorCard: {
    backgroundColor: '#7a2d2d',
    padding: 30,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
  },
  playerCard: {
    backgroundColor: '#2d7a4a',
    padding: 30,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  footballerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  roleDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#2d7a4a',
    padding: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
