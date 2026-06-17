import assert from 'node:assert/strict';
import { getAutomaticStatusTransition } from './monitor-domain.js';

const hoje = '2026-06-17';
const amanha = '2026-06-18';

assert.deepEqual(
  getAutomaticStatusTransition({ status: 'em_transito', nf: '' }, hoje, amanha),
  { from: 'em_transito', status: 'preparacao', reason: 'nf_obrigatoria' }
);

assert.deepEqual(
  getAutomaticStatusTransition({ status: 'agendado', data: amanha }, hoje, amanha),
  { from: 'agendado', status: 'preparacao', reason: 'vespera_cirurgia' }
);

assert.deepEqual(
  getAutomaticStatusTransition({ status: 'preparacao', retirada: hoje }, hoje, amanha),
  { from: 'preparacao', status: 'a_retirar', reason: 'retirada_hoje' }
);

assert.deepEqual(
  getAutomaticStatusTransition({ status: 'andamento', dataRetirar: hoje }, hoje, amanha),
  { from: 'andamento', status: 'a_retirar', reason: 'retirada_vencida' }
);

assert.equal(
  getAutomaticStatusTransition({ status: 'agendado', data: '2026-06-20' }, hoje, amanha),
  null
);

console.log('monitor-domain tests passed');
