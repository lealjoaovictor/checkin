import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { PONTOS_PADRAO } from '../config/pontos';

export async function popularPontosSeVazio() {
  const snap = await getDocs(query(collection(db, 'pontos_interesse'), limit(1)));
  if (!snap.empty) return;

  const batch = writeBatch(db);
  PONTOS_PADRAO.forEach((p) => {
    const ref = doc(db, 'pontos_interesse', p.id);
    batch.set(ref, {
      nome: p.nome,
      latitude: p.latitude,
      longitude: p.longitude,
    });
  });
  await batch.commit();
}

export function ouvirPontos(callback) {
  return onSnapshot(collection(db, 'pontos_interesse'), (snap) => {
    const pontos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(pontos);
  });
}

export async function registrarCheckIn(ponto) {
  await addDoc(collection(db, 'checkins'), {
    localId: ponto.id,
    localNome: ponto.nome,
    dataHora: new Date().toISOString(),
  });
}

export function ouvirCheckIns(callback) {
  const q = query(collection(db, 'checkins'), orderBy('dataHora', 'desc'));
  return onSnapshot(q, (snap) => {
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(lista);
  });
}