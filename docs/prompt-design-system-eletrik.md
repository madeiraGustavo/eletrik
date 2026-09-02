# Prompt de implementacao — Design System rigido Eletrik

Voce e um agente implementador. Execute este spec **a risca**, na ordem das fases.
Nao improvisar. Nao "melhorar alem do pedido". Nao criar paginas novas.
Se algo estiver ambiguo, use a opcao marcada como **DEFAULT** e documente no handoff.

## Objetivo

Deixar a landing Eletrik com:

1. design system solido (tokens + classes `ui-*`)
2. fotos 100% do tema eletrico (tecnico / quadro / disjuntores / fiacao)
3. botoes e caixas com **um unico padrao** em todas as secoes

## Contexto do projeto

- Stack: Astro + Tailwind
- Base path: `/eletrik`
- URL local: `http://127.0.0.1:4321/eletrik/`
- Estilos: `src/styles/global.css`
- Config: `src/lib/site.ts`
- Imagens: `src/assets/images/`
- Componentes: `src/components/*.astro`
- Pagina: `src/pages/index.astro`

## Problema atual (obrigatorio corrigir)

- Fotos fora do tema (nao sao eletrica)
- Botoes com raios/paddings/sombras inconsistentes
- Cards/caixas com estilos diferentes por secao
- Icones repetidos em servicos
- Possivel bloco de "area de atendimento" vazio parecendo incompleto
- Copy meta em "Como funciona" (ex.: "sem repetir o mesmo processo...")

## Fora de escopo (PROIBIDO)

- Reescrever analytics/SEO/tracking ja existentes
- Criar secoes novas (depoimentos, blog, pricing)
- Inventar cidade, telefone, reviews, CREA, "24h"
- Gradientes decorativos extras, glassmorphism exagerado, neon
- Alterar copy comercial alem do listado neste prompt
- Commit com secrets
- Pular fases

## Definition of Done (global)

- [ ] Design system com tokens + classes `ui-*`
- [ ] 100% dos botoes usam so `ui-btn-*`
- [ ] 100% dos cards/paineis usam so `ui-card*` / `ui-panel*`
- [ ] Nenhuma foto fora do tema eletrico
- [ ] Nenhuma ocorrencia de radius "solto" fora dos tokens
- [ ] Browser OK desktop + mobile
- [ ] Handoff final com checklists marcados

---

# FASE 0 — Inventario (bloqueante)

Antes de editar qualquer arquivo:

1. Listar `src/components/` e `src/assets/images/`
2. Contar padroes diferentes de botao/card/radius atuais
3. Confirmar quais imagens estao fora do tema
4. Responder em no maximo 12 linhas:
   - arquivos que serao tocados
   - imagens que serao trocadas
   - risco principal

**STOP/GO:** so avance para a Fase 1 apos o inventario.

---

# FASE 1 — Design tokens + classes (bloqueante)

## 1.1 `src/styles/global.css`

### Tokens EXATOS em `@theme`

```css
--radius-control: 0.75rem; /* 12px botoes/inputs/icon */
--radius-card: 1rem;       /* 16px cards */
--radius-panel: 1.25rem;   /* 20px paineis/midia */
--color-surface: #f7f6f3;
--color-ink: #18181b;
```

DEFAULT tipografia (manter se ja existir):

- `--font-sans`: Inter Variable
- `--font-display`: Inter Tight

### Classes obrigatorias (nomes EXATOS; criar todas)

**Layout/tipo**

- `ui-container`
- `ui-section` = `scroll-mt-24 py-16 md:py-20`
- `ui-eyebrow`
- `ui-eyebrow-on-dark`
- `ui-heading`
- `ui-heading-on-dark`
- `ui-lead`
- `ui-lead-on-dark`

**Superficies**

- `ui-card` = radius-card + border-zinc-200 + bg-white + p-6
- `ui-card-muted` = radius-card + border-zinc-200 + bg-surface + p-6
- `ui-card-interactive` = card + hover:border-amber-400/70 + transition 150ms
- `ui-panel` = radius-panel + border-zinc-200 + bg-surface + p-6 md:p-8
- `ui-panel-dark` = radius-panel + bg-zinc-950 + p-6 md:p-8 + text-white
- `ui-panel-glass` = radius-card + border-white/10 + bg-white/5 + p-5
- `ui-media` = overflow-hidden + radius-panel + border-white/10

**Botoes**

- `ui-btn-primary` = amber-500 / text-zinc-950 / hover amber-400
- `ui-btn-secondary` = border-zinc-300 bg-white
- `ui-btn-ghost` = border-zinc-600 text-white (fundos escuros)
- `ui-btn-dark` = bg-zinc-900 text-white
- `ui-btn-block` = w-full

Compartilhado por TODOS os botoes:

- `inline-flex items-center justify-center gap-2`
- `rounded-[var(--radius-control)]`
- `px-5 py-3.5`
- `text-sm font-semibold`
- `transition duration-150`

**Outros**

- `ui-link`
- `ui-chip`
- `ui-chip-on-dark`
- `ui-icon-box` (size-11, bg-zinc-950, text-amber-400, radius-control)
- `ui-icon-box-soft` (size-10, bg-amber-500/10, text-amber-600, radius-control)
- `ui-field` (mesmo radius-control dos botoes)
- `ui-step-badge` (size-10 rounded-full bg-zinc-950 text-amber-400)

### Regras rigidas

- PROIBIDO criar classes alternativas (`btn-primary`, `card-soft`, etc.)
- PROIBIDO `shadow-amber-*` em botoes
- Se `@apply` de uma `ui-*` dentro de outra quebrar o build: duplicar utilitarios (nao inventar outro sistema)

## 1.2 `src/components/CtaButton.astro`

- Variants permitidas APENAS: `primary | secondary | ghost | dark`
- Mapear estritamente para `ui-btn-*`
- `fullWidth` => `ui-btn-block`
- Manter `data-cta` / `data-service`
- Remover classes Tailwind soltas de botao (rounded/padding/cores manuais)

### Aceite Fase 1

- [ ] Tokens exatamente como especificado
- [ ] Todas as classes `ui-*` listadas existem
- [ ] `CtaButton` so usa `ui-btn-*`
- [ ] `npm run build` passa

**Se falhar: NAO seguir.**

---

# FASE 2 — Fotos do tema (bloqueante)

## 2.1 Substituir conteudo (manter nomes de arquivo)

| Arquivo | Conteudo OBRIGATORIO | PROIBIDO |
|---|---|---|
| `src/assets/images/hero-eletrica.jpg` | Quadro/disjuntores/fiacao ou tecnico eletrico em close tecnico | Cafe, solda, obra civil, TI/rede, pintura |
| `src/assets/images/sobre-trabalho.jpg` | Tecnico eletricista em atendimento (pessoa + contexto eletrico) | Soldador, pedreiro, barista, stock sem eletrica |
| `src/assets/images/cta-eletrica.jpg` | Tecnico eletrico (trabalho ou retrato no oficio) | Qualquer oficio nao eletrico |
| `public/og.jpg` | Derivado de hero ou sobre (tema eletrico) | Imagem antiga/errada |

DEFAULT:

- Se `cta-eletrica.jpg` nao existir, criar e apontar `CtaFinal.astro` para ele.
- Fontes aceitas: Unsplash/Pexels **somente** se for claramente eletrica. Validar visualmente antes de usar.

## 2.2 Validacao visual obrigatoria

- [ ] Cada JPG e claramente eletrica
- [ ] Nao ha solda/cafe/construcao nao-eletrica
- [ ] `alt` de cada `<Image>` descreve a imagem REAL

## 2.3 Enquadramento

- Hero: `object-cover` + `object-position` preservando o sujeito
- Remover glow/blur amber decorativo do hero (DEFAULT: sem blur)
- Wrapper de imagem: `ui-media`

### Aceite Fase 2

- [ ] hero + sobre + cta + og no tema eletrico
- [ ] Alts corretos
- [ ] Sem glow decorativo no hero

**Se falhar: NAO seguir.**

---

# FASE 3 — Aplicacao arquivo por arquivo (bloqueante)

### Regra geral para cada componente

1. Usar `ui-container` + `ui-section` (quando for secao)
2. Usar `ui-eyebrow*`, `ui-heading*`, `ui-lead*`
3. Usar so `ui-card*` / `ui-panel*` / `ui-btn*` / `ui-field` / `ui-link` / `ui-chip*`
4. Remover radius/padding/shadow fora do sistema
5. Nao alterar IDs de secao nem `data-section` / `data-cta`

## 3.1 `Header.astro`

- [ ] CTA via `<CtaButton>`
- [ ] Logo: mark (raio em caixa amber `radius-control`) + wordmark — DEFAULT: implementar
- [ ] Menu mobile com radius do sistema
- [ ] `ui-container`

## 3.2 `Hero.astro`

- [ ] Eyebrow/heading/lead no padrao
- [ ] CTA primary via `CtaButton`
- [ ] "Ver servicos" = `ui-btn-ghost`
- [ ] Chips = `ui-chip-on-dark`
- [ ] Chip "Orcamento claro" com icone de **check** (NAO relogio)
- [ ] Imagem em `ui-media`, sem blur amber
- [ ] Foto eletrica

## 3.3 `Problem.astro`

- [ ] Cards = `ui-card-muted` apenas
- [ ] Sem `rounded-3xl` / shadow custom

## 3.4 `Solution.astro`

- [ ] Cards = `ui-card`
- [ ] Step = `ui-step-badge`
- [ ] Remover copy meta ("sem repetir o mesmo processo...")
- [ ] DEFAULT lead: "Um caminho objetivo do primeiro contato ate a conclusao do servico."
- [ ] Linha conectora simples zinc-300 (sem gradient chamativo)

## 3.5 `Benefits.astro`

- [ ] `ui-icon-box-soft`
- [ ] 6 icones semanticos DIFERENTES (shield, calendar, building, chat, wrench, path etc.)
- [ ] Link WA = `ui-link` + `data-cta="benefits"`

## 3.6 `About.astro`

- [ ] Imagem eletrica em `ui-media`
- [ ] Badges em `ui-panel-glass`
- [ ] Bloco "Area de atendimento":
  - SE `city` OU `areaServed.length` OU `openingHours` => mostrar
  - SENAO => **nao renderizar**
- [ ] Sem placeholder fragil de area

## 3.7 `Services.astro`

- [ ] Cards = `ui-card-interactive`
- [ ] Icones por slug (proibido raio repetido):
  - `instalacao` => tomada/outlet
  - `manutencao` => ferramenta
  - `quadro` => painel/disjuntores
  - `iluminacao` => lampada
- [ ] CTA strategy DEFAULT = **A**:
  - link `ui-link` "Orcar {servico} ->" em cada card (`data-cta="services"` + `data-service`)
  - + 1 `CtaButton` geral "Pedir orcamento"
- [ ] Pills = `ui-chip`

## 3.8 `Contact.astro`

- [ ] WhatsApp = `ui-panel-dark`
- [ ] Form = `ui-panel`
- [ ] Inputs = `ui-field`
- [ ] Submit = `ui-btn-dark ui-btn-block`
- [ ] CTA WA = `CtaButton`
- [ ] Placeholder telefone DEFAULT: `(43) 99999-9999`
- [ ] Proibido `(00) 00000-0000`

## 3.9 `Faq.astro`

- [ ] `ui-container` + `ui-section` + eyebrow/heading/lead
- [ ] Link WA = `ui-link`
- [ ] Manter `<details>` (nao reinventar)

## 3.10 `CtaFinal.astro`

- [ ] Usar `cta-eletrica.jpg`
- [ ] Overlay escuro simples (`bg-zinc-950/85` a `/90`)
- [ ] Heading/lead/eyebrow on-dark
- [ ] CTA via `CtaButton`

## 3.11 `Footer.astro`

- [ ] Mesmo logo mark do header
- [ ] `ui-container`
- [ ] Sem blocos novos

## 3.12 `FabWhatsApp.astro`

- [ ] Manter FAB mobile
- [ ] Amber do sistema
- [ ] Sem `shadow-amber-*` (DEFAULT)

## 3.13 `src/pages/obrigado.astro` (se existir)

- [ ] Botoes/links no sistema (`CtaButton` / `ui-btn-secondary`)

### Aceite Fase 3 (varredura)

Zerar no codigo da landing:

- [ ] `rounded-3xl` em cards/botoes
- [ ] `rounded-[1.75rem]` / `rounded-[2rem]`
- [ ] `shadow-amber-` em botoes
- [ ] Classes manuais duplicando botao amber fora do sistema
- [ ] `npm run build` passa

**Se falhar: corrigir antes da Fase 4.**

---

# FASE 4 — QA browser (bloqueante)

## Desktop

- [ ] Hero com foto eletrica legivel
- [ ] Sobre com tecnico eletrico
- [ ] CTA final com foto eletrica
- [ ] Botoes com mesma altura/raio (header, hero, contact, final)
- [ ] Cards com mesmo raio/borda (Problem/Solution/Services)
- [ ] Sem bloco de area vazio no Sobre

## Mobile (~390px)

- [ ] Hero legivel
- [ ] Botoes full-width onde previsto
- [ ] Menu hamburger funciona
- [ ] FAB aparece apos scroll (comportamento atual)
- [ ] Form usavel, sem overflow horizontal

## Criterios de rejeicao (qualquer um = falha)

- Foto fora do tema
- Botao com radius/padding fora do sistema
- Card com estilo unico fora de `ui-card*` / `ui-panel*`
- Placeholder `(00) 00000-0000`
- Bloco de area renderizado sem dados

---

# FASE 5 — Handoff (obrigatorio)

Entregar neste formato:

## Resumo

- bullets do que foi feito

## Arquivos alterados

- lista

## Checklist DoD

- checklists das fases 1-4 marcados

## Pendencias de conteudo (nao inventar)

- cidade / area / horario / WhatsApp real / reviews

## Decisoes DEFAULT tomadas

- lista

## Como validar

- URL local + passos de smoke test

---

# Ordem final (nao negociavel)

0. Inventario
1. Design system
2. Fotos eletricas
3. Aplicacao por arquivo
4. QA browser
5. Handoff

**Comece agora na Fase 0.**
Ao fim de cada fase, imprima o checklist de aceite.
Se um aceite falhar, pare e corrija ate passar. Nao pule fase.
