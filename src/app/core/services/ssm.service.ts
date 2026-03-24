import { Injectable, signal } from '@angular/core';
import {
  Contrato, Cargo, ToolsCat, Profissional, MatchResult,
  Compartilhamento, SolicitacaoForm, ProfSelected, StatusStyle, SlaInfo, Super
} from '../models';

const LS_KEY = 'ssm_compartilhamentos';
const LS_COUNTER_KEY = 'ssm_cod_counter';

const MOCK_INICIAL: Compartilhamento[] = [
  { cod:'C00',  dataInclusao:'2025-03-01', contratoNome:'CAESB - DF',
    sup:'Superintendência I', cargo:'APROC-04 - Analista de Processos - Master',
    vagaCritica:'SIM', criticidade:'Contrato com O.S. em aberto e prazo crítico',
    temOS:'sim', dOS:'2025-03-01', status:'Em tratativas na Superintendência',
    profs:[{nome:'', custo:null, adic:null}], solicitante:'Leandro' },
  { cod:'C00B', dataInclusao:'2025-03-05', contratoNome:'ANAC - DF',
    sup:'Superintendência I', cargo:'DESENV-03 - Desenvolvedor de Software - Sênior',
    vagaCritica:'NÃO', criticidade:'', temOS:'sim', dOS:'2025-03-10',
    status:'Definindo critérios de rateio',
    profs:[{nome:'Eduardo Almeida Pires', custo:14000, adic:5000}], solicitante:'Leandro' },
  { cod:'C00C', dataInclusao:'2025-02-20', contratoNome:'SEDUC - GO',
    sup:'Superintendência II', cargo:'APROC-03 - Analista de Processos - Sênior',
    vagaCritica:'SIM', criticidade:'Projeto em fase crítica de entrega',
    temOS:'não', dOS:'', status:'Em tratativas com o candidato e/ou cliente',
    profs:[{nome:'', custo:null, adic:null}], solicitante:'Rafaela' },
  { cod:'C00D', dataInclusao:'2025-03-08', contratoNome:'SES - GO',
    sup:'Superintendência II', cargo:'ABI-03 - Analista de BI - Sênior',
    vagaCritica:'NÃO', criticidade:'', temOS:'sim', dOS:'2025-03-12',
    status:'Em vigência',
    profs:[{nome:'Joao Victor Alves', custo:12000, adic:5000}], solicitante:'Aline' },
  { cod:'C00E', dataInclusao:'2025-02-15', contratoNome:'ANA - DF',
    sup:'Superintendência III', cargo:'ANR-03 - Analista de Negócios/Requisitos - Sênior',
    vagaCritica:'NÃO', criticidade:'', temOS:'sim', dOS:'2025-02-15', status:'Cancelado',
    profs:[{nome:'Karen Oliveira Neves', custo:10000, adic:4000}], solicitante:'Rafaela' },
];

function carregarDoStorage(): Compartilhamento[] {
  try {
    const salvo = localStorage.getItem(LS_KEY);
    if (salvo) return JSON.parse(salvo) as Compartilhamento[];
  } catch (e) { console.warn('Erro ao carregar localStorage:', e); }
  localStorage.setItem(LS_KEY, JSON.stringify(MOCK_INICIAL));
  return MOCK_INICIAL;
}

function carregarContador(): number {
  try {
    const salvo = localStorage.getItem(LS_COUNTER_KEY);
    if (salvo) return parseInt(salvo, 10);
  } catch (e) {}
  return 1;
}

@Injectable({ providedIn: 'root' })
export class SsmService {

  readonly supers: Record<string, Super> = {
    'Superintendência I':   { superintendente: 'Magally de Oliveira',               email: 'magally.oliveira@memora.com.br' },
    'Superintendência II':  { superintendente: 'Carmen Maria Lucambio Cepero',       email: 'carmen.cepero@memora.com.br' },
    'Superintendência III': { superintendente: 'Erica Pereira de Vasconcellos Dutra',email: 'erica.dutra@memora.com.br' },
  };

  readonly statusFlow = [
    'Em tratativas na Superintendência',
    'Em tratativas com o candidato e/ou cliente',
    'Definindo critérios de rateio',
    'Em aprovação pela Diretoria',
    'Cadastrando compartilhamento',
    'Em vigência',
    'Cancelado',
  ];

  readonly statusStyle: Record<string, StatusStyle> = {
    'Em tratativas na Superintendência':        { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
    'Em tratativas com o candidato e/ou cliente':{ bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    'Definindo critérios de rateio':            { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    'Em aprovação pela Diretoria':              { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
    'Cadastrando compartilhamento':             { bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
    'Em vigência':                              { bg: '#ecfdf5', color: '#059669', border: '#6ee7b7' },
    'Cancelado':                                { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  };

  readonly contratos: Contrato[] = [
    { id: 'C791', nome: 'CAESB - DF',      sup: 'Superintendência I',   superintendente: 'Magally de Oliveira' },
    { id: 'C911', nome: 'ANAC - DF',       sup: 'Superintendência I',   superintendente: 'Magally de Oliveira' },
    { id: 'C924', nome: 'ANTAQ - DF',      sup: 'Superintendência I',   superintendente: 'Magally de Oliveira' },
    { id: 'C716', nome: 'DETRAN-DF',       sup: 'Superintendência I',   superintendente: 'Magally de Oliveira' },
    { id: 'C728', nome: 'DPRF - DF',       sup: 'Superintendência I',   superintendente: 'Magally de Oliveira' },
    { id: 'C733', nome: 'MDHC - DF',       sup: 'Superintendência I',   superintendente: 'Magally de Oliveira' },
    { id: 'C745', nome: 'MINC - DF',       sup: 'Superintendência I',   superintendente: 'Magally de Oliveira' },
    { id: 'C752', nome: 'MIDR - DF',       sup: 'Superintendência I',   superintendente: 'Magally de Oliveira' },
    { id: 'C761', nome: 'PGE - GO I',      sup: 'Superintendência I',   superintendente: 'Magally de Oliveira' },
    { id: 'C769', nome: 'CAESB Suporte',   sup: 'Superintendência I',   superintendente: 'Magally de Oliveira' },
    { id: 'C804', nome: 'SES - GO',        sup: 'Superintendência II',  superintendente: 'Carmen Maria Lucambio Cepero' },
    { id: 'C812', nome: 'SGG - GO',        sup: 'Superintendência II',  superintendente: 'Carmen Maria Lucambio Cepero' },
    { id: 'C820', nome: 'SEDUC - GO',      sup: 'Superintendência II',  superintendente: 'Carmen Maria Lucambio Cepero' },
    { id: 'C831', nome: 'ECONOMIA - GO',   sup: 'Superintendência II',  superintendente: 'Carmen Maria Lucambio Cepero' },
    { id: 'C845', nome: 'SEMAD - GO',      sup: 'Superintendência II',  superintendente: 'Carmen Maria Lucambio Cepero' },
    { id: 'C857', nome: 'IPHAN - DF',      sup: 'Superintendência II',  superintendente: 'Carmen Maria Lucambio Cepero' },
    { id: 'C862', nome: 'ABIN - DF',       sup: 'Superintendência II',  superintendente: 'Carmen Maria Lucambio Cepero' },
    { id: 'C873', nome: 'IPEM - SP',       sup: 'Superintendência II',  superintendente: 'Carmen Maria Lucambio Cepero' },
    { id: 'C881', nome: 'TCM - SP',        sup: 'Superintendência II',  superintendente: 'Carmen Maria Lucambio Cepero' },
    { id: 'C892', nome: 'SES - SP',        sup: 'Superintendência II',  superintendente: 'Carmen Maria Lucambio Cepero' },
    { id: 'C904', nome: 'ANA - DF',        sup: 'Superintendência III', superintendente: 'Erica Pereira de Vasconcellos Dutra' },
    { id: 'C912', nome: 'INMETRO - RJ',    sup: 'Superintendência III', superintendente: 'Erica Pereira de Vasconcellos Dutra' },
    { id: 'C919', nome: 'IMESC - SP',      sup: 'Superintendência III', superintendente: 'Erica Pereira de Vasconcellos Dutra' },
    { id: 'C926', nome: 'IPEM - SP III',   sup: 'Superintendência III', superintendente: 'Erica Pereira de Vasconcellos Dutra' },
    { id: 'C933', nome: 'TCM - SP III',    sup: 'Superintendência III', superintendente: 'Erica Pereira de Vasconcellos Dutra' },
  ];

  getContratosBySup(sup: string): Contrato[] {
    return this.contratos.filter(c => c.sup === sup);
  }

  readonly cargos: Cargo[] = [
    { codigo: 'APROC-01', label: 'APROC-01 - Analista de Processos - Júnior' },
    { codigo: 'APROC-02', label: 'APROC-02 - Analista de Processos - Pleno' },
    { codigo: 'APROC-03', label: 'APROC-03 - Analista de Processos - Sênior' },
    { codigo: 'APROC-04', label: 'APROC-04 - Analista de Processos - Master' },
    { codigo: 'DESENV-01', label: 'DESENV-01 - Desenvolvedor de Software - Júnior' },
    { codigo: 'DESENV-02', label: 'DESENV-02 - Desenvolvedor de Software - Pleno' },
    { codigo: 'DESENV-03', label: 'DESENV-03 - Desenvolvedor de Software - Sênior' },
    { codigo: 'ARQSOF-01', label: 'ARQSOF-01 - Arquiteto de Softwares - Pleno' },
    { codigo: 'ARQSOF-02', label: 'ARQSOF-02 - Arquiteto de Softwares - Sênior' },
    { codigo: 'ANR-01', label: 'ANR-01 - Analista de Negócios/Requisitos - Júnior' },
    { codigo: 'ANR-02', label: 'ANR-02 - Analista de Negócios/Requisitos - Pleno' },
    { codigo: 'ANR-03', label: 'ANR-03 - Analista de Negócios/Requisitos - Sênior' },
    { codigo: 'GEPRO', label: 'GEPRO - Gerente de Projetos de TI' },
    { codigo: 'ABI-01', label: 'ABI-01 - Analista de BI - Júnior' },
    { codigo: 'ABI-02', label: 'ABI-02 - Analista de BI - Pleno' },
    { codigo: 'ABI-03', label: 'ABI-03 - Analista de BI - Sênior' },
    { codigo: 'ADADOS-01', label: 'ADADOS-01 - Administrador de Dados - Júnior' },
    { codigo: 'ADADOS-02', label: 'ADADOS-02 - Administrador de Dados - Pleno' },
    { codigo: 'ADADOS-03', label: 'ADADOS-03 - Administrador de Dados - Sênior' },
    { codigo: 'Gerente de Contrato', label: 'Gerente de Contrato' },
    { codigo: 'Técnico de Suporte Pleno', label: 'Técnico de Suporte Pleno' },
    { codigo: 'Técnico de Suporte - Sênior', label: 'Técnico de Suporte - Sênior' },
    { codigo: 'Supervisor de Atendimento', label: 'Supervisor de Atendimento' },
    { codigo: 'Analista de Infraestrutura de Rede - Pleno', label: 'Analista de Infraestrutura de Rede - Pleno' },
  ];

  readonly certsOpts = [
    'CBPP','PMP','ITIL Foundation','Scrum Master (CSM / PSM)',
    'Product Owner (CSPO)','COBIT','AWS Practitioner','Azure Fundamentals',
  ];
  readonly langsOpts = [
    'Java','Python','PHP','JavaScript','TypeScript','C#','PL/SQL','SQL',
    'PowerShell','Shell Script','C++','Kotlin','Dart','Go','Ruby','T-SQL',
  ];
  readonly toolsCats: ToolsCat[] = [
    { cat: 'Frontend',        items: ['Angular','React','Vue.js','HTML','CSS','AngularJS','Next.js'] },
    { cat: 'Backend',         items: ['Spring','Spring Boot','Node.js','Laravel','Django','NestJS'] },
    { cat: 'Mobile',          items: ['Flutter','Android','Ionic','React Native','Kotlin'] },
    { cat: 'Banco de Dados',  items: ['Oracle','PostgreSQL','MySQL','SQL Server','MongoDB','Redis'] },
    { cat: 'DevOps',          items: ['Docker','Kubernetes','Jenkins','GitLab','GitHub','Terraform'] },
    { cat: 'BI e Analytics',  items: ['Power BI','Tableau','Qlik Sense','Databricks'] },
    { cat: 'Gestão',          items: ['Jira','Confluence','MS Project','Trello','Redmine','SAP','4Biz'] },
    { cat: 'Modelagem',       items: ['BPMN','UML','Figma','Bizagi'] },
    { cat: 'Outros',          items: ['Oracle APEX','ServiceNow','Azure DevOps','VS Code'] },
  ];

  readonly profissionais: Profissional[] = [
    { mat:'MEM-1001',nome:'Adalgisio Alves Figueiredo',contrato:'MEMORA.MINC.DF.29/2024-001',
      sup:'Superintendência I',cargo:'DESENV-03 - Desenvolvedor de Software - Sênior',
      apto:false,motivo:'Demandas complexas no contrato de origem',certs:[],langs:['PHP'],tools:['Vue.js','Zend Framework'],
      custo:9000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-1002',nome:'Adeilton Alves Santos',contrato:'MEMORA.SGG.GO.044/2021',
      sup:'Superintendência II',cargo:'ARQSOF-02 - Arquiteto de Softwares - Sênior',
      apto:true,motivo:'',certs:[],langs:['PHP','TypeScript','JavaScript','PL/SQL'],tools:['Docker','GitLab','GitHub','Kubernetes'],
      custo:14000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-1008',nome:'Adriano Lima Santos',contrato:'MEMORA.MDHC.DF.17/2024-001',
      sup:'Superintendência I',cargo:'ARQSOF-01 - Arquiteto de Softwares - Pleno',
      apto:true,motivo:'',certs:[],langs:['Java','PHP'],tools:[],
      custo:14000,comp:1,c1:'MEMORA.SEDUC.GO.165/2022-001.03',c2:'',c3:'',c4:'',
      p1:'ARQSOF-01 - Sênior',p2:'',p3:'',p4:'',adic:5000,obs:'' },
    { mat:'MEM-1011',nome:'Adrienne Castanheira Mendes',contrato:'MEMORA.ECONOMIA.GO.048/2022-005.02',
      sup:'Superintendência II',cargo:'GEPRO - Gerente de Projetos de TI',
      apto:true,motivo:'',certs:[],langs:[],tools:['Jira','Confluence','MS Project','Trello','Redmine'],
      custo:12000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-1012',nome:'Airisandra Oliveira Carneiro',contrato:'MEMORA.SGG.GO.044/2021',
      sup:'Superintendência II',cargo:'GEPRO - Gerente de Projetos de TI',
      apto:true,motivo:'',certs:['PMP'],langs:['Java','SQL'],
      tools:['MS Project','Oracle','Planner','Redmine','SQL Server','Trello','UML'],
      custo:13000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-1013',nome:'Airton Silva de Almeida',contrato:'MEMORA.SGG.GO.044/2021',
      sup:'Superintendência II',cargo:'DESENV-03 - Desenvolvedor de Software - Sênior',
      apto:true,motivo:'',certs:[],langs:['Java','PL/SQL','SQL'],tools:['GitHub','GitLab','Spring'],
      custo:11000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-1019',nome:'Alex Araujo Vieira',contrato:'MEMORA.ANTAQ.DF.20/2024',
      sup:'Superintendência I',cargo:'ARQSOF-02 - Arquiteto de Softwares - Sênior',
      apto:true,motivo:'',certs:[],langs:['Java','JavaScript'],
      tools:['Angular','AngularJS','BPMN','HTML','Ionic','Node.js','Oracle'],
      custo:15000,comp:2,c1:'MEMORA.PGE.GO.17/2021-003.03',c2:'MEMORA.MIDR.DF.15/2025-001',
      c3:'',c4:'',p1:'ARQSOF-02 - Sênior',p2:'ARQSOF-02 - Júnior',p3:'',p4:'',adic:8000,obs:'' },
    { mat:'MEM-1020',nome:'Alex de Araujo Souza',contrato:'MEMORA.DPRF.DF.71/2024',
      sup:'Superintendência I',cargo:'DESENV-03 - Desenvolvedor de Software - Sênior',
      apto:true,motivo:'',certs:[],langs:['Java','JavaScript'],
      tools:['Angular','CSS','Docker','Git','GitLab','Hibernate','Jira','Kubernetes'],
      custo:9000,comp:1,c1:'MEMORA.MIDR.DF.15/2025-001',c2:'',c3:'',c4:'',
      p1:'DESENV-03 - Sênior',p2:'',p3:'',p4:'',adic:4000,obs:'' },
    { mat:'MEM-1025',nome:'Alexandre Jose Vieira Muniz',contrato:'MEMORA.MINC.DF.29/2024-001',
      sup:'Superintendência I',cargo:'ARQSOF-02 - Arquiteto de Softwares - Sênior',
      apto:true,motivo:'',certs:[],langs:['PHP'],
      tools:['Angular','Jenkins','Kubernetes','Laravel','PostgreSQL','Vue.js'],
      custo:14000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-2001',nome:'Bruno Henrique Cavalcante',contrato:'MEMORA.CAESB.DF.20/2024-001',
      sup:'Superintendência I',cargo:'APROC-04 - Analista de Processos - Master',
      apto:true,motivo:'',certs:['CBPP'],langs:[],tools:['BPMN','Jira','Confluence','MS Project','Power BI'],
      custo:16000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-2002',nome:'Carla Beatriz Machado',contrato:'MEMORA.DETRAN-DF.07/2023-001.01',
      sup:'Superintendência I',cargo:'APROC-03 - Analista de Processos - Sênior',
      apto:true,motivo:'',certs:['CBPP','PMP'],langs:[],tools:['BPMN','Jira','Power BI','UML','MS Project'],
      custo:13000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-2003',nome:'Diego Ferreira Nunes',contrato:'MEMORA.ANAC.DF.14/2024',
      sup:'Superintendência I',cargo:'APROC-02 - Analista de Processos - Pleno',
      apto:true,motivo:'',certs:[],langs:[],tools:['BPMN','Confluence','Jira','Bizagi'],
      custo:9000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-2004',nome:'Fernanda Lima Rocha',contrato:'MEMORA.SGG.GO.044/2021',
      sup:'Superintendência II',cargo:'APROC-03 - Analista de Processos - Sênior',
      apto:true,motivo:'',certs:['PMP','ITIL Foundation'],langs:[],tools:['BPMN','Jira','Confluence','MS Project','UML'],
      custo:12000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-2005',nome:'Gabriel Andrade Teixeira',contrato:'MEMORA.ECONOMIA.GO.013/2020-003.04',
      sup:'Superintendência II',cargo:'DESENV-03 - Desenvolvedor de Software - Sênior',
      apto:true,motivo:'',certs:['AWS Practitioner'],langs:['Java','Python','TypeScript'],
      tools:['Docker','Kubernetes','Spring Boot','PostgreSQL','GitHub'],
      custo:13000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-2006',nome:'Helena Cristina Barros',contrato:'MEMORA.MDHC.DF.17/2024-001',
      sup:'Superintendência I',cargo:'ANR-03 - Analista de Negócios/Requisitos - Sênior',
      apto:true,motivo:'',certs:['Scrum Master (CSM / PSM)','PMP'],langs:[],
      tools:['Jira','Confluence','UML','BPMN','MS Project'],
      custo:13000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-2008',nome:'Julia Martins Pereira',contrato:'MEMORA.SEDUC.GO.165/2022-001.01',
      sup:'Superintendência II',cargo:'APROC-02 - Analista de Processos - Pleno',
      apto:true,motivo:'',certs:['CBPP'],langs:[],tools:['BPMN','Bizagi','Confluence'],
      custo:9500,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-2014',nome:'Sandra Costa Martins',contrato:'MEMORA.SGG.GO.044/2021',
      sup:'Superintendência II',cargo:'APROC-03 - Analista de Processos - Sênior',
      apto:false,motivo:'Colaboradora em licença maternidade',
      certs:['CBPP','PMP','ITIL Foundation'],langs:[],
      tools:['BPMN','Power BI','Jira','Confluence','MS Project','UML'],
      custo:13000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-2018',nome:'Ana Luiza Costa Soares',contrato:'MEMORA.PGE.GO.17/2021-003.03',
      sup:'Superintendência II',cargo:'APROC-04 - Analista de Processos - Master',
      apto:true,motivo:'',certs:['CBPP','PMP'],langs:[],
      tools:['BPMN','Jira','Confluence','Power BI','MS Project','UML'],
      custo:16000,comp:0,c1:'',c2:'',c3:'',c4:'',p1:'',p2:'',p3:'',p4:'',adic:0,obs:'' },
    { mat:'MEM-3001',nome:'Giovanna Prates Mendes',contrato:'MEMORA.CAESB.DF.20/2024-001',
      sup:'Superintendência I',cargo:'APROC-04 - Analista de Processos - Master',
      apto:true,motivo:'',certs:['CBPP','PMP'],langs:[],
      tools:['BPMN','Jira','Confluence','Power BI','MS Project','UML'],
      custo:16000,comp:2,c1:'MEMORA.DETRAN-DF.07/2023-001.01',c2:'MEMORA.MDHC.DF.17/2024-001',
      c3:'',c4:'',p1:'APROC-04 - Master',p2:'APROC-04 - Master',p3:'',p4:'',adic:9000,obs:'' },
    { mat:'MEM-3002',nome:'Felipe Cardoso Lima',contrato:'MEMORA.ANAC.DF.14/2024',
      sup:'Superintendência I',cargo:'APROC-04 - Analista de Processos - Master',
      apto:true,motivo:'',certs:['CBPP','PMP','ITIL Foundation'],langs:[],
      tools:['BPMN','Jira','Confluence','Power BI','MS Project'],
      custo:17000,comp:2,c1:'MEMORA.DPRF.DF.71/2024',c2:'MEMORA.ANTAQ.DF.20/2024',
      c3:'',c4:'',p1:'APROC-04 - Master',p2:'APROC-03 - Sênior',p3:'',p4:'',adic:8000,obs:'' },
    { mat:'MEM-3003',nome:'Daniela Santos Rocha',contrato:'MEMORA.MINC.DF.29/2024-001',
      sup:'Superintendência I',cargo:'APROC-04 - Analista de Processos - Master',
      apto:true,motivo:'',certs:['CBPP','PMP'],langs:[],
      tools:['BPMN','Jira','Confluence','Power BI','UML','MS Project'],
      custo:16000,comp:2,c1:'MEMORA.MDHC.DF.17/2024-001',c2:'MEMORA.ABIN.DF.516/2025-001',
      c3:'',c4:'',p1:'APROC-04 - Master',p2:'APROC-03 - Sênior',p3:'',p4:'',adic:7000,obs:'' },
    { mat:'MEM-3004',nome:'Renata Oliveira Cruz',contrato:'MEMORA.PGE.GO.17/2021-003.03',
      sup:'Superintendência II',cargo:'APROC-03 - Analista de Processos - Sênior',
      apto:true,motivo:'',certs:['PMP','Scrum Master (CSM / PSM)'],langs:[],
      tools:['BPMN','Jira','Confluence','Bizagi','MS Project'],
      custo:13000,comp:1,c1:'MEMORA.SES.GO.83/2023-002.01',c2:'',c3:'',c4:'',
      p1:'APROC-03 - Sênior',p2:'',p3:'',p4:'',adic:5000,obs:'' },
    { mat:'MEM-3005',nome:'Marcos Henrique Silveira',contrato:'MEMORA.SGG.GO.044/2021',
      sup:'Superintendência II',cargo:'DESENV-03 - Desenvolvedor de Software - Sênior',
      apto:true,motivo:'',certs:[],langs:['Java','Python','TypeScript'],
      tools:['Spring Boot','Docker','Kubernetes','React','PostgreSQL'],
      custo:14000,comp:1,c1:'MEMORA.SEDUC.GO.165/2022-001.02',c2:'',c3:'',c4:'',
      p1:'DESENV-03 - Sênior',p2:'',p3:'',p4:'',adic:5000,obs:'' },
  ];

  private readonly _compartilhamentos = signal<Compartilhamento[]>(carregarDoStorage());
  readonly compartilhamentos = this._compartilhamentos.asReadonly();

  private _codCounter = signal<number>(carregarContador());
  readonly codCounter = this._codCounter.asReadonly();

  private _solicitacao = signal<SolicitacaoForm | null>(null);
  readonly solicitacao = this._solicitacao.asReadonly();

  private _resultado = signal<Profissional[]>([]);
  readonly resultado = this._resultado.asReadonly();

  private _selected = signal<ProfSelected[]>([]);
  readonly selected = this._selected.asReadonly();

  setSolicitacao(s: SolicitacaoForm): void { this._solicitacao.set(s); }
  setResultado(r: Profissional[]): void    { this._resultado.set(r); }
  setSelected(s: ProfSelected[]): void     { this._selected.set(s); }

  private salvarNoStorage(lista: Compartilhamento[]): void {
    try { localStorage.setItem(LS_KEY, JSON.stringify(lista)); }
    catch (e) { console.warn('Erro ao salvar no localStorage:', e); }
  }

  private salvarContador(n: number): void {
    try { localStorage.setItem(LS_COUNTER_KEY, String(n)); }
    catch (e) {}
  }

  buscar(cargo: string, certs: string[], langs: string[], tools: string[]): Profissional[] {
    const list = this.profissionais
      .map(p => ({ ...p, match: this.calcMatch(p, cargo, certs, langs, tools) }))
      .filter(p => p.match.pct > 0);
    return this.sortP(list);
  }

  private calcMatch(p: Profissional, cargo: string, certs: string[], langs: string[], tools: string[]): MatchResult {
    const cargoCode = cargo.split(' - ')[0];
    const profCode  = p.cargo.split(' - ')[0];
    if (profCode !== cargoCode) return { pct: 0, details: [] };
    const reqs = [...certs, ...langs, ...tools];
    if (reqs.length === 0) return { pct: 100, details: [] };
    const details = reqs.map(r => ({
      item: r,
      ok: p.certs.includes(r) || p.langs.includes(r) || p.tools.includes(r)
    }));
    const pct = Math.round(details.filter(d => d.ok).length / reqs.length * 100);
    return { pct, details };
  }

  private sortP(list: Profissional[]): Profissional[] {
    const rank = (p100: boolean, apto: boolean, noComp: boolean): number => {
      if (p100 && apto && noComp)   return 0;
      if (p100 && apto && !noComp)  return 1;
      if (!p100 && apto && noComp)  return 2;
      if (!p100 && apto && !noComp) return 3;
      if (p100 && !apto)            return 4;
      return 5;
    };
    return list.slice().sort((a, b) =>
      rank(a.match!.pct === 100, a.apto, a.comp === 0) -
      rank(b.match!.pct === 100, b.apto, b.comp === 0)
    );
  }

  iniciarTratativa(sol: SolicitacaoForm, selList: ProfSelected[], nomeUsuario: string): string {
    const cod = this._codCounter();
    const novoCodigo = cod + 1;
    this._codCounter.set(novoCodigo);
    this.salvarContador(novoCodigo);
    const codStr = 'C' + String(cod).padStart(2, '0');
    const novoComp: Compartilhamento = {
      cod: codStr,
      dataInclusao: new Date().toISOString().split('T')[0],
      contratoNome: sol.contratoObj?.nome ?? '',
      sup:          sol.contratoObj?.sup  ?? '',
      cargo:        sol.cargo,
      vagaCritica:  sol.vagaCritica,
      criticidade:  sol.criticidade,
      temOS:        sol.temOS,
      dOS:          sol.dOS,
      status:       'Em tratativas na Superintendência',
      profs: selList.map(s => ({ nome: s.prof.nome, custo: s.prof.custo, adic: s.propostaNum || null })),
      solicitante: nomeUsuario,
    };
    this._compartilhamentos.update(lista => {
      const novaLista = [novoComp, ...lista];
      this.salvarNoStorage(novaLista);
      return novaLista;
    });
    return codStr;
  }

  cancelarCompartilhamento(cod: string): void {
    this._compartilhamentos.update(lista => {
      const novaLista = lista.map(c => c.cod === cod ? { ...c, status: 'Cancelado' } : c);
      this.salvarNoStorage(novaLista);
      return novaLista;
    });
  }

  limparStorage(): void {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_COUNTER_KEY);
    this._compartilhamentos.set(MOCK_INICIAL);
    this._codCounter.set(1);
    this.salvarNoStorage(MOCK_INICIAL);
    this.salvarContador(1);
  }

  fmtR(v: number | null | undefined): string {
    if (v == null) return '—';
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  fmtD(s: string): string {
    return s ? new Date(s + 'T12:00:00').toLocaleDateString('pt-BR') : '—';
  }

  bizLeft(dOS: string): number | null {
    try {
      const base = new Date(dOS + 'T12:00:00');
      if (isNaN(base.getTime())) return null;
      const prazo = this.addBizDays(base, 15);
      const cur = new Date(); cur.setHours(0, 0, 0, 0);
      const praz = new Date(prazo); praz.setHours(0, 0, 0, 0);
      if (cur >= praz) return 0;
      let diff = 0;
      const tmp = new Date(cur);
      while (tmp < praz) {
        tmp.setDate(tmp.getDate() + 1);
        if (tmp.getDay() !== 0 && tmp.getDay() !== 6) diff++;
      }
      return diff;
    } catch { return null; }
  }

  private addBizDays(date: Date, n: number): Date {
    const d = new Date(date); let a = 0;
    while (a < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) a++; }
    return d;
  }

  slaInfo(temOS: string, dOS: string): SlaInfo {
    if (temOS !== 'sim' || !dOS) return { txt: 'Não se aplica', color: 'var(--g4)', bg: 'var(--g1)' };
    const d = this.bizLeft(dOS);
    if (d === null) return { txt: 'Não se aplica', color: 'var(--g4)', bg: 'var(--g1)' };
    if (d <= 0) return { txt: 'Encerrado',    color: 'var(--red)', bg: 'var(--rdbg)' };
    if (d <= 5) return { txt: d + 'd úteis',  color: 'var(--red)', bg: 'var(--rdbg)' };
    if (d <= 7) return { txt: d + 'd úteis',  color: 'var(--ora)', bg: 'var(--orbg)' };
    return             { txt: d + 'd úteis',  color: 'var(--grn)', bg: 'var(--grnbg)' };
  }

  getStatusStyle(status: string): StatusStyle {
    return this.statusStyle[status] ?? { bg: 'var(--g0)', color: 'var(--g6)', border: 'var(--g2)' };
  }

  getCompContratos(p: Profissional): { c: string; pp: string }[] {
    return [
      { c: p.c1, pp: p.p1 }, { c: p.c2, pp: p.p2 },
      { c: p.c3, pp: p.p3 }, { c: p.c4, pp: p.p4 },
    ].filter(x => !!x.c);
  }

  getSortedVisiveis(compartilhamentos: Compartilhamento[], cargo: string, nomeUsuario: string): Compartilhamento[] {
    const visiveis = compartilhamentos.filter(c => {
      if (cargo === 'Gerente de Contrato') return c.solicitante === nomeUsuario;
      if (cargo === 'Superintendente I')   return c.sup === 'Superintendência I';
      if (cargo === 'Superintendente II')  return c.sup === 'Superintendência II';
      if (cargo === 'Superintendente III') return c.sup === 'Superintendência III';
      if (cargo.includes('Gestor') && cargo.includes('I')) return c.sup === 'Superintendência I';
      return true;
    });
    return visiveis.slice().sort((a, b) => {
      const semNomeA = (!a.profs[0]?.nome) ? 0 : 1;
      const semNomeB = (!b.profs[0]?.nome) ? 0 : 1;
      if (semNomeA !== semNomeB) return semNomeA - semNomeB;
      const critA = a.vagaCritica === 'SIM' ? 0 : 1;
      const critB = b.vagaCritica === 'SIM' ? 0 : 1;
      if (critA !== critB) return critA - critB;
      const dA = a.temOS === 'sim' && a.dOS ? (this.bizLeft(a.dOS) ?? 999) : 999;
      const dB = b.temOS === 'sim' && b.dOS ? (this.bizLeft(b.dOS) ?? 999) : 999;
      return dA - dB;
    });
  }
}
