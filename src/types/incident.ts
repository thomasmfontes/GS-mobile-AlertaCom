export type TipoRisco = 'Alagamento' | 'BueiroObstruido' | 'QuedaArvore' | 'Deslizamento' | 'RachaduraVia' | 'Outro';
export type NivelSeveridade = 'Baixa' | 'Media' | 'Alta' | 'Critica';
export type StatusOcorrencia = 'Aberta' | 'EmAnalise' | 'EmAtendimento' | 'Resolvida' | 'Cancelada';

export interface Ocorrencia {
  id: number;
  protocolo: string;
  titulo: string;
  descricao: string;
  tipoRisco: TipoRisco;
  severidade: NivelSeveridade;
  status: StatusOcorrencia;
  latitude: number;
  longitude: number;
  endereco: string;
  bairro: string;
  fotoUrl?: string;
  parecerTecnico?: string;
  userId: number;
  nomeCidadao?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface OcorrenciaFormData {
  titulo: string;
  descricao: string;
  tipoRisco: TipoRisco;
  severidade: NivelSeveridade;
  latitude: number;
  longitude: number;
  endereco: string;
  bairro: string;
  fotoUrl?: string;
}

export interface AlertaClimatico {
  id: number;
  titulo: string;
  mensagem: string;
  tipoRisco: TipoRisco;
  nivel: NivelSeveridade;
  regiaoAfetada: string;
  bairro: string;
  dataEmissao: string;
  dataExpiracao: string;
  ativo: boolean;
}
