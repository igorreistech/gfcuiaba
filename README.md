# Portfólio de Desenvolvimento

Site estático para apresentar serviços, stack e cases de desenvolvimento de software de forma genérica.

O projeto deixou de ser uma vitrine exclusiva do Monitor Cirúrgico. Esse sistema agora aparece apenas como
um case de solução operacional em tempo real, ao lado de outras possibilidades como dashboards, portais
internos, automações e landing pages.

## Estrutura

| Arquivo | Descrição |
|---|---|
| `index.html` | Conteúdo principal do portfólio |
| `styles.css` | Identidade visual, layout responsivo e animações |
| `app.js` | Menu mobile, navegação ativa, reveal on scroll e cópia de e-mail |
| `sw.js` | Service Worker para cache offline básico |
| `manifest.json` | Configuração PWA do portfólio |
| `icon.svg` | Ícone vetorial da aplicação |

## Personalização rápida

1. Troque `contato@exemplo.com` no `index.html` pelo e-mail definitivo.
2. Ajuste os textos de serviços e projetos para refletir os cases reais.
3. Adicione links de demonstração, GitHub ou WhatsApp nos cards de projeto, se necessário.
4. Atualize nome, marca e cores em `styles.css` caso exista uma identidade visual própria.

## Publicação

O Firebase Hosting continua configurado para publicar a raiz do repositório. Para outros provedores,
basta hospedar os arquivos estáticos principais (`index.html`, `styles.css`, `app.js`, `manifest.json`,
`sw.js` e `icon.svg`).
