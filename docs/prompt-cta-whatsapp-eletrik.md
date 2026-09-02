# Prompt de implementacao — Reduzir CTAs de WhatsApp (Eletrik)

Voce e um agente implementador. Execute este spec **a risca**, na ordem das fases.
Nao improvisar. Nao "melhorar alem do pedido". Nao redesenhar a landing.
Se algo estiver ambiguo, use a opcao marcada como **DEFAULT** e documente no handoff.

## Objetivo

Reduzir a densidade de saidas para WhatsApp na home de **~13 para 6**, para o case de portfolio
continuar demonstrando funil de conversao **sem parecer pagina agressiva de ads**.

Arquitetura-alvo da home (EXATA):

1. Header — botao `CtaButton` (`cta="header"`)
2. Hero — botao primario `CtaButton` (`cta="hero_primary"`)
3. Servicos — **um** botao `CtaButton` abaixo da grade (`cta="services"`)
4. Contato — **um** botao `CtaButton` (`cta="contact"`)
5. CTA Final — **um** botao `CtaButton` (`cta="cta_final"`)
6. FAB mobile — `FabWhatsApp` (`cta="fab"`), visivel so em `md:hidden`

Nada alem disso na home aponta para `wa.me` / `site.whatsappUrl`.

## Contexto

- Stack: Astro + Tailwind
- Base path: `/eletrik`
- URL local: `http://127.0.0.1:4321/eletrik/`
- Config: `src/lib/site.ts` (`CtaLocation`, `whatsappUrl`)
- Tracking: `src/scripts/tracking.ts` escuta `a[data-cta]` — **nao quebrar**
- Este site e **case de portfolio / demo**. Nao ha numero real. Nao inventar.

## Problema atual (obrigatorio corrigir)

Inventario da home hoje (~13 saidas WhatsApp):

| Local | Arquivo | Acao |
|---|---|---|
| Header botao | `src/components/Header.astro` | MANTER |
| Hero botao primario | `src/components/Hero.astro` | MANTER |
| Hero "Ver servicos" | `src/components/Hero.astro` | MANTER (ancora `#servicos`, nao WhatsApp) |
| Beneficios link "Falar no WhatsApp →" | `src/components/Benefits.astro` | REMOVER |
| Servicos 4x "Orcar {servico} →" | `src/components/Services.astro` | REMOVER |
| Servicos botao "Pedir orcamento" | `src/components/Services.astro` | MANTER |
| Contato botao | `src/components/Contact.astro` | MANTER |
| FAQ link "Fale no WhatsApp" | `src/components/Faq.astro` | REMOVER |
| CTA Final botao | `src/components/CtaFinal.astro` | MANTER |
| Footer link WhatsApp | `src/components/Footer.astro` | TROCAR por ancora `#contato` |
| FAB | `src/components/FabWhatsApp.astro` | MANTER (mobile only) |

Pagina `/obrigado`: MANTER **um** `CtaButton` WhatsApp. DEFAULT: mudar `cta` de `cta_final` para `obrigado` (localizacao propria).

Copy que **menciona** WhatsApp em texto corrido (Hero, Solution, FAQ answers, Contato, rodape de portfolio) **NAO e botao**. Deixar.

## Fora de escopo (PROIBIDO)

- Redesign, novos tokens, novas secoes, novas paginas
- Alterar fotos, tipografia, cores, radius, `ui-*` alem do necessario para remover/trocar links
- Inventar telefone, cidade, reviews, CREA, "24h"
- Adicionar CTAs novos para compensar os removidos
- Transformar cards de servico em botoes WhatsApp de outro jeito
- Mostrar FAB no desktop
- Reescrever analytics/SEO/GTM
- Commit com secrets
- Pular fases

## Definition of Done (global)

- [ ] Home tem **exatamente 6** âncoras `a[href*="wa.me"]` ou `a[data-cta]` apontando para WhatsApp: header, hero_primary, services (1), contact, cta_final, fab
- [ ] Zero links WhatsApp em Benefits, FAQ, Footer e nos 4 cards de Servicos
- [ ] Cards de Servicos continuam informativos (titulo + descricao + icone), sem link de saida
- [ ] Footer tem ancora interna para `#contato` no lugar do wa.me
- [ ] `/obrigado` ainda tem 1 CTA WhatsApp
- [ ] Tracking `whatsapp_click` continua funcionando nos CTAs restantes
- [ ] Tipo `CtaLocation` atualizado (sem unions mortas; incluir `obrigado` se usado)
- [ ] Browser OK desktop + mobile
- [ ] Handoff com checklist marcado

---

# FASE 0 — Inventario (bloqueante)

Antes de editar:

1. Grep em `src/` por `whatsappUrl`, `wa.me`, `data-cta`, `CtaButton`
2. Listar cada ocorrencia com arquivo + linha + acao (MANTER / REMOVER / TROCAR)
3. Confirmar que Hero "Ver servicos" NAO e WhatsApp
4. Responder em no maximo 10 linhas: arquivos tocados + contagem atual vs alvo

**STOP/GO:** so avance apos o inventario.

---

# FASE 1 — Remover CTAs extras (bloqueante)

## 1.1 `src/components/Benefits.astro`

REMOVER o bloco inteiro:

```astro
<p class="mt-10">
  <a href={site.whatsappUrl} data-cta="benefits" class="ui-link">
    Falar no WhatsApp →
  </a>
</p>
```

- Se `site` ficar unused apos a remocao, remover o import.
- NAO substituir por outro CTA. A secao termina na grade de beneficios.

## 1.2 `src/components/Faq.astro`

REMOVER o link inline no lead. O paragrafo deve ficar so:

```
Duvidas frequentes sobre atendimento e orcamento.
```

- Sem ancora WhatsApp.
- Se `site` ficar unused, remover o import.
- NAO alterar `src/lib/faq.ts` (respostas podem continuar citando WhatsApp como canal).

## 1.3 `src/components/Services.astro`

REMOVER o `<a>` "Orcar {service.name} →" de **cada card** (`data-cta="services"` + `data-service`).

DEFAULT: o card fica so icone + titulo + descricao. Sem link. Sem "saiba mais".

MANTER o `CtaButton` abaixo da grade:

```astro
<CtaButton label="Pedir orçamento" cta="services" />
```

Ajustar o lead se ficar contraditorio. DEFAULT — trocar para:

```
Instalação, manutenção, quadro e iluminação. Descreva o chamado no botão abaixo — montamos o orçamento a partir da sua necessidade.
```

NAO colocar `CtaButton` dentro de cada card.

## 1.4 `src/components/Footer.astro`

TROCAR o link WhatsApp (`href={site.whatsappUrl}` / `data-cta="footer"`) por ancora interna:

```astro
<a href={`${base}#contato`}>Contato</a>
```

- Mesmas classes visuais do link atual (nao vira botao).
- NAO usar `wa.me`.
- Se a coluna de contato ficar so com "Contato" + email/cidade, ok.
- Se `site.whatsappUrl` / `site.whatsappLabel` ficarem unused neste arquivo, nao deixar import morto de coisas nao usadas. `site` ainda e usado para nome/areas.

---

# FASE 2 — Manter CTAs oficiais (nao mexer no visual)

Nao alterar markup/estilo destes, salvo o tipo em `CtaLocation`:

- `Header.astro` — `CtaButton label="WhatsApp" cta="header"`
- `Hero.astro` — `CtaButton cta="hero_primary"` + ancora "Ver servicos"
- `Contact.astro` — `CtaButton label="Abrir WhatsApp" cta="contact"`
- `CtaFinal.astro` — `CtaButton cta="cta_final"`
- `FabWhatsApp.astro` — `data-cta="fab"` + `md:hidden` (nao mostrar no desktop)

## 2.1 `src/pages/obrigado.astro`

MANTER o botao WhatsApp (pagina diferente, recuperacao pos-formulario).

DEFAULT: `cta="obrigado"` em vez de reusar `cta_final`.

---

# FASE 3 — Tipos e tracking

## 3.1 `src/lib/site.ts` — `CtaLocation`

Atualizar para **somente** os locais que ainda existem:

```ts
export type CtaLocation =
  | 'header'
  | 'hero_primary'
  | 'services'
  | 'contact'
  | 'cta_final'
  | 'fab'
  | 'obrigado';
```

REMOVER do union: `benefits`, `faq`, `footer`.

NAO alterar `whatsappNumber`, mensagem, GTM, SEO.

## 3.2 `src/scripts/tracking.ts`

NAO reescrever. Confirmar que continua disparando `whatsapp_click` + `cta_location` em qualquer `a[data-cta]`.
Se houver lista hardcoded de locations, atualizar para o union novo. Se for generico (`dataset.cta`), nao mexer.

---

# FASE 4 — QA (bloqueante)

Grep final em `src/`:

```
whatsappUrl
wa.me
data-cta
CtaButton
```

Checklist:

- [ ] Home: exatamente 6 saidas WhatsApp (header, hero, services botao unico, contact, cta_final, fab)
- [ ] Benefits: 0 links wa.me
- [ ] FAQ lead: 0 links wa.me
- [ ] Services cards: 0 links; 1 botao abaixo da grade
- [ ] Footer: ancora `#contato`, 0 wa.me
- [ ] `/obrigado`: 1 WhatsApp com `data-cta="obrigado"`
- [ ] Nenhum `CtaLocation` unused / nenhum `data-cta` orfao
- [ ] Desktop: FAB oculto; Header + Hero + Servicos + Contato + CTA Final visiveis
- [ ] Mobile: FAB aparece; nao ha dois botoes grudados competindo no mesmo viewport alem do previsto
- [ ] Clique nos 6 CTAs restantes ainda tem `data-cta` valido

Verificar no browser:

- `http://127.0.0.1:4321/eletrik/` desktop e ~390px
- `http://127.0.0.1:4321/eletrik/obrigado/`

---

# FASE 5 — Handoff (obrigatorio)

Responder ao usuario:

1. Contagem antes → depois (home)
2. Arquivos alterados (lista)
3. O que foi removido vs o que permaneceu
4. Checklist da Definition of Done, item a item
5. Qualquer DEFAULT usado

Fim. Nao sugerir proximos redesenhos. Nao abrir PRs. Nao commitar a menos que o usuario peca.
