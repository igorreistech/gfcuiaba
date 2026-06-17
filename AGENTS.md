# AGENTS.md

## Cursor Cloud specific instructions

### Visão geral
Este repositório é um **site estático** (HTML/CSS/JS vanilla, ES modules), sem
gerenciador de pacotes, sem etapa de build e sem testes/lint configurados. O
backend é **Firebase em nuvem** (projeto `gfcuiaba-53b8d`) acessado diretamente
do navegador via SDK por CDN. **Não há emuladores** configurados — Auth,
Firestore e Storage são os serviços de produção reais.

Há dois frontends que compartilham o mesmo Firebase:

| Página | URL local | Descrição |
|---|---|---|
| `index.html` (+ `app.js`, `styles.css`) | `http://localhost:8080/index.html` | Monitor Cirúrgico (app principal) |
| `fichas-opme.html` | `http://localhost:8080/fichas-opme.html` | Módulo Fichas OPME (standalone) |

### Como rodar (desenvolvimento)
Basta servir os arquivos estáticos a partir da raiz do repositório:

```bash
python3 -m http.server 8080
```

(Alternativa: `npx --yes serve -l 8080`.) Não use `firebase deploy` em
desenvolvimento. Não existe comando de build/lint/test neste projeto.

### Caveats importantes
- **Internet obrigatória:** o SDK do Firebase e bibliotecas (XLSX, PDF.js,
  Google Fonts) vêm de CDNs remotos, e Auth/Firestore/Storage são em nuvem.
- **Erro `permission-denied` antes do login é esperado** — o listener do
  Firestore roda na carga da página, mas as regras exigem `request.auth != null`.
  Não é um problema de ambiente.
- **Coleção `usuarios` não está em `firestore.rules`** (só `procedimentos_cba` e
  `fichas_opme`). A escrita do perfil falha silenciosamente; o app trata isso e
  faz fallback do usuário para o papel `agendador`.
- **Papéis:** novos cadastros viram `agendador` (veem apenas seus próprios
  registros). O código de acesso (`config/acesso`, padrão `140424`) concede
  `admin`. Os e-mails `comercial@gfmedical.net` e `comercialmt@gfmedical.net`
  são sempre `admin`.
- **Quirk do agendador:** após salvar uma nova cirurgia, a lista "Minhas
  cirurgias cadastradas" pode só atualizar após um refresh (F5) da página.
- No formulário de nova cirurgia, Hospital e Médico precisam ser escolhidos nos
  **dropdowns principais** (os campos "não cadastrado" exigem preencher o nome
  correspondente, senão a validação bloqueia o salvamento).
