'use server';

// Wrapper pour ré-exporter initializeApp défini dans app/api/init.js
// Le fichier original utilise CommonJS (module.exports). Ici on exige et on ré-exporte
// pour que les imports ESM (`import { initializeApp } from './init'`) fonctionnent.

const init = require('./api/init');

export const initializeApp = async () => {
  if (init && init.initializeApp) {
    return await init.initializeApp();
  }
  return Promise.resolve();
};
