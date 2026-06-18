export const STATUS_LABELS = {
  a_agendar: 'Autorizado',
  agendado: 'Agendado',
  preparacao: 'Em Separacao',
  em_transito: 'Em Transito',
  andamento: 'Em Procedimento',
  a_retirar: 'Aguardando Retirada',
  concluido: 'Concluido',
  cancelado: 'Cancelado',
  reagendado: 'Reagendado',
  urgencia: 'Urgencia',
  coleta_urgente: 'Coleta Prioritaria'
};

const STATUS_SEM_RETIRADA_AUTOMATICA = [
  'a_retirar',
  'concluido',
  'cancelado',
  'andamento',
  'urgencia',
  'coleta_urgente'
];

function texto(value) {
  return value == null ? '' : String(value).trim();
}

export function getAutomaticStatusTransition(proc, hoje, amanha) {
  if (!proc || !proc.status) return null;

  if (proc.status === 'em_transito' && !texto(proc.nf)) {
    return {
      from: 'em_transito',
      status: 'preparacao',
      reason: 'nf_obrigatoria'
    };
  }

  if (proc.status === 'agendado' && proc.data && proc.data === amanha) {
    return {
      from: 'agendado',
      status: 'preparacao',
      reason: 'vespera_cirurgia'
    };
  }

  const retirada = proc.retirada || proc.dataRetirar || '';
  if (!STATUS_SEM_RETIRADA_AUTOMATICA.includes(proc.status) && retirada === hoje) {
    return {
      from: proc.status,
      status: 'a_retirar',
      reason: 'retirada_hoje'
    };
  }

  if (proc.status === 'andamento' && retirada && retirada <= hoje) {
    return {
      from: 'andamento',
      status: 'a_retirar',
      reason: 'retirada_vencida'
    };
  }

  return null;
}
