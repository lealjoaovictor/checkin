import * as Location from 'expo-location';

export async function solicitarPermissao() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}
export async function observarPosicao(callback) {
  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 2000,
      distanceInterval: 2,
    },
    callback
  );
}

export function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (g) => (g * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
