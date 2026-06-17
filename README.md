# Mapa Cirúrgico Hospitalar · GF Medical — Cuiabá, MT

Mapa em tempo real de procedimentos cirúrgicos da unidade de Cuiabá, conectado ao Firebase (`gfcuiaba-53b8d`).

## Estrutura

| Arquivo | Descrição |
|---|---|
| `index.html` | Estrutura HTML, autenticação e assinatura em tempo real |
| `styles.css` | Estilos principais da aplicação |
| `app.js` | Lógica principal (renderização, filtros, modais, export) |
| `firebase-config.js` | Configuração Firebase compartilhada entre as telas |
| `monitor-domain.js` | Regras puras de domínio testáveis |
| `pwa-register.js` | Registro do Service Worker |
| `sw.js` | Service Worker — cache offline |
| `manifest.json` | Configuração PWA |
| `icon.svg` | Ícone da aplicação |
| `fichas-opme.html` | Tela satélite de fichas OPME |

## Funcionalidades

- Autenticação via e-mail/senha (Firebase Auth)
- CRUD de procedimentos em tempo real (Firestore)
- Notificações push de mudança de status
- Visualização em cards, tabela e timeline
- Exportação para Excel (XLSX)
- Curva ABC por vendedor e hospital
- Modo offline via Service Worker
- Upload de anexos (Firebase Storage)

## Perfis de acesso

- **Admin:** visualiza e altera todos os procedimentos, gerencia usuários e executa automações de status.
- **Agendador:** assina somente os procedimentos cujo `cadastradoPor` é o próprio UID e pode cadastrar/editar seus próprios registros.

Novos cadastros entram como `agendador`. A promoção para `admin` deve ser feita por um administrador no painel de usuários; a promoção automática por código foi desativada por segurança.

## Fluxo de status automático

As automações de status ficam centralizadas em `monitor-domain.js` e rodam apenas na sessão de administradores:

- `em_transito` sem NF volta para `preparacao`
- `agendado` na véspera da cirurgia vai para `preparacao`
- retirada marcada para hoje vai para `a_retirar`
- `andamento` com retirada vencida vai para `a_retirar`

## Testes

```bash
npm test
```

## Firebase

- **Projeto:** `gfcuiaba-53b8d`
- **Coleção:** `procedimentos_cba`

As regras em `firestore.rules` usam o documento de `usuarios` por UID ou e-mail para validar permissões. As regras em `storage.rules` limitam anexos de `opme/` e `coletas/` a imagens/PDFs de até 20 MB.
