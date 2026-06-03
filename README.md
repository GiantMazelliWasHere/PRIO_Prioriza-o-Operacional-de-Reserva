# PRIO — Priorização Operacional de Reserva | Localiza

## Sobre o Projeto
O **PRIO** é uma proposta de **Central de Governança de Carro Reserva Corporativo**. O objetivo do projeto é equilibrar os contratos B2B (Gestão de Frotas / Corporativo) com a capacidade real da frota de RAC (Aluguel Diário / Varejo), protegendo a receita do varejo e resolvendo os atuais conflitos operacionais.

O projeto atua como um "termômetro" na interseção exclusiva entre GTF (Gestão de Frotas) e RAC, substituindo processos informais (como WhatsApp e acordos verbais) por automação, rastreabilidade e regras de negócio claras.

## Pilares da Solução
1. **Automação de Disponibilidade:** Consulta em tempo real com cálculo de impacto no varejo.
2. **Matriz de Equivalência:** Bloqueio de downgrade para o cliente B2B.
3. **Monitor de Impacto:** Alerta sobre reservas futuras para Pessoa Física (app).
4. **Alçada Inteligente:** Liberação automática para cenários seguros; exigência de aprovação gerencial apenas em conflitos críticos.
5. **Auditoria Compulsória:** Logs obrigatórios para todas as exceções (motivo, substituto e assinatura).
6. **Dashboard de Gestão:** Visibilidade total sobre volume de trocas, SLAs e escassez de categorias.

## Tecnologias Utilizadas
A apresentação é construída com tecnologias web padrão, sem dependência de frameworks complexos, garantindo alta performance e portabilidade:
- **HTML5** semântico
- **CSS3** moderno (CSS Variables, Flexbox, CSS Grid, Scroll Snapping para o formato "deck")
- **Vanilla JavaScript** (Interatividade de slides, navegação, indicadores de progresso)

## Estrutura do Projeto
```text
.
├── index.html           # Arquivo principal da apresentação
├── css/
│   └── prio-style.css   # Estilos, variáveis de tema e layout responsivo/deck
└── js/
    └── prio-deck.js     # Lógica de controle de slides e navegação pelo teclado
```

## Como Executar
Sendo um projeto puramente estático, você tem diversas formas de rodá-arlo:

1. **Localmente:** Basta dar um duplo clique no arquivo `index.html` para abri-lo diretamente no seu navegador.
2. **Extensões (VS Code / Cursor):** Utilize extensões como *Live Server* para subir um servidor local rapidamente.
3. **Deploy:** O projeto está pronto para ser hospedado gratuitamente e de forma imediata em plataformas como [Vercel](https://vercel.com), [Netlify](https://netlify.com) ou [GitHub Pages](https://pages.github.com/).

---
*Projeto conceitual/apresentação — Não representa sistema em produção.*