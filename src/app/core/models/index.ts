export interface Usuario {
  id: number;
  nome: string;
  cargo: string;
}

export interface Super {
  superintendente: string;
  email: string;
}

export interface Contrato {
  id: string;
  nome: string;
  sup: string;
  superintendente: string;
}

export interface Cargo {
  codigo: string;
  label: string;
}

export interface ToolsCat {
  cat: string;
  items: string[];
}

export interface MatchDetail {
  item: string;
  ok: boolean;
}

export interface MatchResult {
  pct: number;
  details: MatchDetail[];
}

export interface Profissional {
  mat: string;
  nome: string;
  contrato: string;
  sup: string;
  cargo: string;
  apto: boolean;
  motivo: string;
  certs: string[];
  langs: string[];
  tools: string[];
  custo: number;
  comp: number;
  c1: string; c2: string; c3: string; c4: string;
  p1: string; p2: string; p3: string; p4: string;
  adic: number;
  obs: string;
  match?: MatchResult;
}

export interface ProfSelected {
  prof: Profissional;
  proposta: string;
  propostaNum: number;
}

export interface SolicitacaoForm {
  contratoObj: Contrato | null;
  temOS: string;
  dOS: string;
  cargo: string;
  vagaCritica: string;
  criticidade: string;
  certs: string[];
  langs: string[];
  tools: string[];
  natureza: string;
}

export interface ProfComp {
  nome: string;
  custo: number | null;
  adic: number | null;
}

export interface Compartilhamento {
  cod: string;
  dataInclusao: string;
  contratoNome: string;
  sup: string;
  cargo: string;
  vagaCritica: string;
  criticidade: string;
  temOS: string;
  dOS: string;
  status: string;
  profs: ProfComp[];
  solicitante: string;
}

export interface StatusStyle {
  bg: string;
  color: string;
  border: string;
}

export interface SlaInfo {
  txt: string;
  color: string;
  bg: string;
}
