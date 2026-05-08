import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Appbar, List, ActivityIndicator, Text } from 'react-native-paper';

import { ouvirCheckIns } from '../services/firebaseService';

function formatarData(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function HistoricoScreen({ navigation }) {
  const [checkins, setCheckins] = useState(null);

  useEffect(() => {
    const unsub = ouvirCheckIns(setCheckins);
    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#3F51B5' }}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Histórico de Check-ins" color="#fff" />
      </Appbar.Header>

      {checkins === null ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : checkins.length === 0 ? (
        <View style={styles.centro}>
          <Text style={styles.textoVazio}>
            Nenhum check-in registrado ainda.{'\n'}
            Aproxime-se de um ponto de interesse!
          </Text>
        </View>
      ) : (
        <FlatList
          data={checkins}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.localNome}
              description={formatarData(item.dataHora)}
              left={(props) => <List.Icon {...props} icon="map-marker" color="#3F51B5" />}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separador} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  textoVazio: { textAlign: 'center', color: '#666', fontSize: 16 },
  separador: { height: 1, backgroundColor: '#eee' },
});
