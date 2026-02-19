# ⚽ Impostor Futbol App

Juego social estilo "impostor" con temática de fútbol desarrollado con React Native y Expo.

## 🎮 Cómo Jugar

1. **Todos conocen el futbolista menos uno**: Un jugador será el impostor y no sabrá quién es el futbolista secreto
2. Los demás jugadores verán el nombre del futbolista en su pantalla
3. Por turnos, hacen preguntas sobre el futbolista para descubrir al impostor
4. El impostor debe intentar deducir quién es el futbolista sin ser descubierto

### Victorias
- **Jugadores normales ganan**: Si descubren quién es el impostor
- **Impostor gana**: Si adivina el futbolista o no es descubierto

## 🚀 Instalación

### Requisitos Previos
- Node.js (v16 o superior)
- npm o yarn
- Expo CLI

### Pasos

1. Clona el repositorio:
```bash
git clone https://github.com/srar75/impostor-futbol-app.git
cd impostor-futbol-app
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Inicia la aplicación:
```bash
npm start
# o
xpn start
```

4. Escanea el código QR con:
   - **iOS**: Expo Go app desde la App Store
   - **Android**: Expo Go app desde Google Play

## 📱 Ejecución en Emuladores

### Android
```bash
npm run android
```

### iOS (solo macOS)
```bash
npm run ios
```

## 🛠️ Tecnologías

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma para desarrollo rápido
- **Expo Router**: Navegación basada en archivos
- **TypeScript**: Tipado estático

## 🎯 Características

- ✅ Interfaz intuitiva y fácil de usar
- ✅ Soporte para 3-10 jugadores
- ✅ Más de 50 futbolistas famosos incluidos
- ✅ Revelación de roles individual (pasar dispositivo)
- ✅ Diseño temático de fútbol
- ✅ Sistema de turnos automático

## 📝 Estructura del Proyecto

```
impostor-futbol-app/
├── app/
│   ├── _layout.tsx      # Layout principal con navegación
│   ├── index.tsx        # Pantalla de inicio (agregar jugadores)
│   ├── game.tsx         # Pantalla del juego (revelación de roles)
│   └── result.tsx       # Pantalla de resultados y reglas
├── app.json             # Configuración de Expo
├── package.json         # Dependencias del proyecto
└── README.md            # Este archivo
```

## 🎮 Flujo de la App

1. **Pantalla Principal**: Agrega nombres de jugadores (mínimo 3, máximo 10)
2. **Pantalla de Juego**: Cada jugador ve su rol de forma privada
   - Impostor: Ve que es el impostor
   - Jugadores normales: Ven el nombre del futbolista
3. **Pantalla de Resultado**: Muestra el impostor y el futbolista, con las reglas del juego

## 👥 Futbolistas Incluidos

La app incluye más de 50 futbolistas famosos como:
- Lionel Messi
- Cristiano Ronaldo
- Kylian Mbappé
- Erling Haaland
- Vinicius Jr
- Y muchos más...

## 🔧 Personalización

Puedes agregar más futbolistas editando el array `FUTBOLISTAS` en `app/game.tsx`:

```typescript
const FUTBOLISTAS = [
  'Lionel Messi',
  'Cristiano Ronaldo',
  // Agrega más futbolistas aquí
];
```

## 📝 Licencia

MIT

## 👤 Autor

[@srar75](https://github.com/srar75)

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el juego:

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 🐛 Reportar Problemas

Si encuentras algún bug o tienes sugerencias, por favor abre un [issue](https://github.com/srar75/impostor-futbol-app/issues).

---

¡Diviértete jugando! ⚽🎮
