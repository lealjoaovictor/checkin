# Check-in UniAcademia

Sistema de check-in automático em pontos de interesse do campus
da UniAcademia, desenvolvido em React Native com Expo.

## O que o app faz

**Parte 1 — Mapa e proximidade**
- Exibe um mapa centrado no campus da UniAcademia.
- Mostra 5 pontos de interesse (Cantina, Biblioteca, Teatro,
  Anfiteatro, Campo) com pins **azuis**.
- Quando o usuário se aproxima (≤ 30 m) de um ponto, o pin
  daquele local muda para **vermelho**.

**Parte 2 — Firebase**
- Os pontos ficam armazenados na coleção `pontos_interesse` do
  Firestore (criada automaticamente na primeira execução).
- A cada aproximação, é criado um registro na coleção `checkins`
  contendo `localId`, `localNome` e `dataHora`.
- Há uma tela de histórico que lista todos os check-ins, do mais
  recente para o mais antigo.

## Tecnologias

- **Expo** + **React Native** (JavaScript)
- **react-native-maps** — exibição do mapa e markers
- **expo-location** — GPS em tempo real (`watchPositionAsync`)
- **firebase v10** (SDK modular) — Firestore para persistência
- **react-native-paper** — componentes Material Design
- **@react-navigation/stack** — navegação entre telas

## Como executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento

```bash
npx expo start
```

Será exibido um QR Code no terminal e uma página no navegador.

## Como testar a mudança de cor sem ir ao campus

Como as coordenadas dos pontos são reais (campus da UniAcademia em
Juiz de Fora), é necessário simular a localização para testar.

**Android Studio Emulator:**
1. Com o emulador aberto, clique nos três pontos `...` da barra
   lateral do emulador.
2. Vá em **Location**.
3. Cole as coordenadas de um dos pontos (exemplo abaixo) e clique
   em **Set Location**.

**Coordenadas para teste (uma para cada ponto):**

| Local      | Latitude  | Longitude  |
|------------|-----------|------------|
| Cantina    | -21.76263 | -43.35340  |
| Biblioteca | -21.76319 | -43.35240  |
| Teatro     | -21.76289 | -43.35273  |
| Anfiteatro | -21.76305 | -43.35296  |
| Campo      | -21.76264 | -43.35410  |

**Resultado esperado:**
1. O pin do local correspondente muda de azul para vermelho.
2. Aparece um alerta no app: "Check-in registrado!".
3. No Firebase Console (Firestore Database), a coleção `checkins`
   recebe um novo documento.
4. Tocando no botão "Ver histórico" no app, o registro aparece na
   lista com data e hora.

**iOS Simulator (Mac):** menu **Features → Location → Custom
Location...** e preencher latitude/longitude.