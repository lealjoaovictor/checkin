import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Appbar, Text, Button } from 'react-native-paper';

import {
  solicitarPermissao,
  observarPosicao,
  calcularDistancia,
} from '../services/localizacaoService';
import {
  popularPontosSeVazio,
  ouvirPontos,
  registrarCheckIn,
} from '../services/firebaseService';
import { CENTRO_CAMPUS } from '../config/pontos';

const RAIO_PROXIMIDADE = 30;
const INTERVALO_CHECKIN_MS = 5 * 60 * 1000;

export default function MapaScreen({ navigation }) {
  const [pontos, setPontos] = useState([]);
  const [posicao, setPosicao] = useState(null);
  const [pontosProximos, setPontosProximos] = useState(new Set());

  const ultimoCheckInRef = useRef({});
  const subscriptionRef = useRef(null);

  useEffect(() => {
    let unsubPontos = null;

    (async () => {
      try {
        await popularPontosSeVazio();
      } catch (e) {
        console.warn('Falha ao popular pontos:', e);
      }

      unsubPontos = ouvirPontos(setPontos);

      // Permissão e watch de localização.
      const ok = await solicitarPermissao();
      if (!ok) {
        Alert.alert(
          'Permissão negada',
          'Não foi possível acessar sua localização.'
        );
        return;
      }

      subscriptionRef.current = await observarPosicao((loc) => {
        setPosicao(loc.coords);
      });
    })();

    return () => {
      if (unsubPontos) unsubPontos();
      if (subscriptionRef.current) subscriptionRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!posicao || pontos.length === 0) return;

    const novosProximos = new Set();

    pontos.forEach((ponto) => {
      const dist = calcularDistancia(
        posicao.latitude,
        posicao.longitude,
        ponto.latitude,
        ponto.longitude
      );

      if (dist <= RAIO_PROXIMIDADE) {
        novosProximos.add(ponto.id);

        const ultimo = ultimoCheckInRef.current[ponto.id] || 0;
        const agora = Date.now();
        if (agora - ultimo > INTERVALO_CHECKIN_MS) {
          ultimoCheckInRef.current[ponto.id] = agora;
          registrarCheckIn(ponto)
            .then(() => {
              Alert.alert('Check-in registrado!', `Você está em ${ponto.nome}.`);
            })
            .catch((e) => console.warn('Erro no check-in:', e));
        }
      }
    });

    setPontosProximos(novosProximos);
  }, [posicao, pontos]);

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#3F51B5' }}>
        <Appbar.Content
          title="UniAcademia"
          subtitle="Pontos de Interesse"
          color="#fff"
        />
        <Appbar.Action
          icon="history"
          color="#fff"
          onPress={() => navigation.navigate('Historico')}
        />
      </Appbar.Header>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={CENTRO_CAMPUS}
        showsUserLocation
        showsMyLocationButton
      >
        {pontos.map((ponto) => {
          const proximo = pontosProximos.has(ponto.id);
          return (
            <Marker
              key={ponto.id}
              coordinate={{
                latitude: ponto.latitude,
                longitude: ponto.longitude,
              }}
              title={ponto.nome}
              description={proximo ? 'Você está aqui!' : 'Ponto de interesse'}
              pinColor={proximo ? 'red' : 'blue'}
            />
          );
        })}
      </MapView>

      <View style={styles.barraInferior}>
        {posicao ? (
          <Text style={styles.textoBarra}>
            Posição: {posicao.latitude.toFixed(5)}, {posicao.longitude.toFixed(5)}
            {'  '}• Próximos: {pontosProximos.size}
          </Text>
        ) : (
          <Text style={styles.textoBarra}>Obtendo localização...</Text>
        )}
        <Button
          mode="contained"
          buttonColor="#3F51B5"
          onPress={() => navigation.navigate('Historico')}
          style={{ marginTop: 6 }}
        >
          Ver histórico
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  barraInferior: {
    backgroundColor: '#E8EAF6',
    padding: 12,
  },
  textoBarra: { fontSize: 13, textAlign: 'center' },
});
