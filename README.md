# SSM – Sistema de Compartilhamento de Recursos
### Angular 17 | Standalone Components | Memora Processos Inovadores

---

## Estrutura de Pastas

```
src/
└── app/
    ├── core/
    │   ├── models/
    │   │   └── index.ts               ← Todas as interfaces TypeScript
    │   └── services/
    │       ├── auth.service.ts        ← Login / logout / usuario logado
    │       └── ssm.service.ts         ← Todos os dados mock + logica de negocio
    │
    ├── shared/
    │   └── components/
    │       ├── sidebar/               ← Menu lateral colapsavel
    │       └── topbar/                ← Header com usuario e logout
    │
    ├── features/
    │   ├── auth/
    │   │   └── login/                 ← Tela de login com seletor de perfil
    │   └── compartilhamento/
    │       ├── nova-solicitacao/      ← Bloco 1 (Natureza) + 2 (Identificacao) + 3 (Perfil)
    │       ├── resultado/             ← Lista de profissionais encontrados
    │       ├── tratativa/             ← Confirmacao + preview de e-mail
    │       ├── demandas/              ← Gerir compartilhamentos (tabela + modais)
    │       └── dev-screen/            ← Placeholder para modulos em breve
    │
    ├── app.component.ts / .html       ← Shell principal (sidebar + topbar + router-outlet)
    ├── app.routes.ts                  ← Rotas lazy-loaded com authGuard
    └── app.config.ts                  ← Bootstrap standalone
```

---

## Rotas

| Rota                                   | Componente          | Guard |
|----------------------------------------|---------------------|-------|
| `/`                                    | → redirect /login   |       |
| `/login`                               | LoginComponent      |       |
| `/compartilhamento/nova-solicitacao`   | NovaSolicitacaoComponent | auth |
| `/compartilhamento/resultado`          | ResultadoComponent  | auth  |
| `/compartilhamento/tratativa`          | TratativaComponent  | auth  |
| `/compartilhamento/demandas`           | DemandasComponent   | auth  |
| `/compartilhamento/dev/:label`         | DevScreenComponent  | auth  |

---

## Como rodar

```bash
# 1. Instalar dependencias
npm install

# 2. Subir o servidor de dev
ng serve

# 3. Abrir no browser
http://localhost:4200
```

---

## Usuarios de Teste (Piloto)

| Nome     | Cargo                        | Visibilidade nas Demandas          |
|----------|------------------------------|------------------------------------|
| Haylla   | Diretora                     | Vê tudo                            |
| Leandro  | Gerente de Contrato          | Só as próprias solicitações        |
| Magally  | Superintendente I            | Toda a Superintendência I          |
| Gabriela | Superintendente II           | Toda a Superintendência II         |
| Gustavo  | Gestor de Portfolio - Sup. I | Toda a Superintendência I          |
| Rafaela  | Gerente de Contrato          | Só as próprias solicitações        |
| Aline    | Gerente de Contrato          | Só as próprias solicitações        |

---

## Testando o Fluxo

### Buscar com resultado + compartilhamentos ativos
1. Login como **Leandro**
2. Clique em **Nova Solicitação**
3. Selecione "Buscar profissional na base"
4. Contrato: **CAESB - DF** | Cargo: **APROC-04 - Analista de Processos - Master** | Cert: **CBPP**
5. Resultado: Giovanna, Felipe, Daniela (todos com 2 compartilhamentos ativos)

### Buscar inapto com 100% aderência
1. Cargo: **APROC-03** | Certs: **CBPP + PMP + ITIL Foundation**
2. Resultado: Sandra Costa Martins (em licença maternidade, mas 100% aderente)

### Ver Demandas com perfis diferentes
- **Leandro** → vê só C00 e C00B
- **Gabriela** → vê C00C e C00D
- **Haylla** → vê todos os 5 registros mock

---

## Arquitetura de Estado

O estado é gerenciado com **Angular Signals** no `SsmService`:

```typescript
// Leitura
const compartilhamentos = ssm.compartilhamentos(); // Signal<Compartilhamento[]>
const usuario = auth.user();                        // Signal<Usuario | null>

// Estado entre telas (passado via service, não via URL params)
ssm.setSolicitacao(form);   // Nova Solicitacao → Resultado
ssm.setResultado(lista);    // Resultado
ssm.setSelected(profs);     // Resultado → Tratativa
ssm.iniciarTratativa(...)   // Tratativa: gera cod, salva na lista
```

---

## Proximos Passos

- [ ] Substituir mock por chamadas HTTP (`HttpClient` + interceptors)
- [ ] Adicionar `AuthGuard` com JWT
- [ ] Implementar módulo **Aprovação de Valores**
- [ ] Implementar módulo **Efetivação do Compartilhamento**
- [ ] Implementar módulo **Monitoramento** (dashboard)
- [ ] Implementar módulo **Cadastros e Parâmetros**
- [ ] Adicionar tela **Sem Resultado** (quando busca retorna vazio)
- [ ] Testes unitários com Jasmine/Jest
