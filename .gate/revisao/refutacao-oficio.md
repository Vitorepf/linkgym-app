# Refutação — eixo 1 (ofício visual) — veredito "empatou"

Checagem no pixel, alegação por alegação. Artefatos em `tools/out/design/0/`, barra em
`docs/barra/eixo1-oficio-visual/`, regras em `NOTAS.md` do eixo.

## (b) As alegações do crítico são verdadeiras?

1. **"herói 84 com baseline dupla"** — CONFERE. Hoje.png tem `▲ 7 acima de 77 no dia
   anterior` sob o 84 E a escala 0–100 com tick rotulado `72 / MÉDIA ATÉ ONTEM`.
2. **"causa em prosa que cita os números"** — CONFERE. "Energia 4, sono 4 e dor 2 põem a
   prontidão em 84." Cita os três componentes e o resultado, exatamente a regra 7.
3. **"decomposição em três pares de mesmo peso"** — CONFERE. ENERGIA 4/5 · DOR 2/5 ·
   SONO 4/5, mesmo corpo, `/5` como nível de unidade (regras 2 e 4).
4. **"ação nomeada"** — CONFERE. `Começar · 52 MIN →` e `Ajustar` sob rótulo de seção.
5. **"referência mostra o que ele diz"** — CONFERE. whoop-frame-03-recovery.png tem o anel
   preenchido em 85%, 4 métricas com seta, baseline "Today vs. prior 30 days", prosa causal
   citando HRV/RHR e ação `BREAK DOWN MY RECOVERY →`.
6. **"quebra da regra 3 (dígito sem forma)"** — CONFERE NO PIXEL. Amostrei a linha da
   escala em Hoje.png (y=852–853): RGB (35,33,32) uniforme de x=150 a x=700. Não há
   preenchimento até 84 nem marcador na posição 84; o único marcador é o da média 72.
   O Whoop codifica o herói duas vezes (anel + dígito); o LinkGym só uma. Defeito real.
7. **"Ofensiva 214 sem baseline nem alvo"** — CONFERE. Feito.png (`214 sessões de
   ofensiva`, nada contra o que comparar), Progresso.png (prosa "Sessões seguidas com
   Fred." não cita alvo) e Perfil.png (card OFENSIVA 214) — nenhum carrega baseline/alvo.

Nenhuma alegação do crítico é falsa ou inflada. O "empatou" não está apoiado em fato
inexistente.

## (a) O empate é inflado? Defeitos que o crítico não viu

- **Recorde.png**: prosa "O corpo lembra. Este recorde é seu — ele não fica para trás." é
  motivacional genérica, não cita número — padrão que a regra 7 proíbe. PORÉM: a regra 7
  do NOTAS.md endereça explicitamente "Prontidão, Ofensiva e Progresso", e o número do
  Recorde já carrega baseline concreta no nível acima (`ANTES: 120 KG` / `+7,5 kg` / ▲).
  A camada "contra o quê" existe; só a prosa é decorativa. Defeito menor, não grave.
- **Perfil.png**: SELOS como quadrados com "1", "4", "PR", "R" cinza têm cara de
  placeholder, mas não existe arquivo da barra sobre badges (marketing do Whoop não mostra
  isso). Regra sem arquivo é palpite — não derruba.
- **Estreia.png**: rótulo "8 · 8" no topo é críptico, mas é par do stepper de 8 traços;
  sem arquivo da barra que o condene. Não derruba.
- **Feito/Descanso/Estreia**: unidade como nível próprio (kg, min, s, XP, MIN), baseline no
  PR do dia ("Levantamento terra, antes 120 kg"), prosa citando número ("O Fred pediu 180s
  entre as séries") — sustentam o lado positivo do empate, como o crítico alegou.

Não encontrei defeito GRAVE de ofício, coberto por regra com arquivo da barra, que o
crítico não tenha contado. Os dois defeitos que impedem a vitória (dígito sem forma no
herói; Ofensiva sem baseline) já estão no veredito e são exatamente o que separa "empatou"
de "venceu".

## Conclusão

As sete alegações verificadas são verdadeiras no pixel; os defeitos adicionais encontrados
são menores ou dependeriam de critério inventado. O empate não está inflado nem subestimado.

VEREDITO: SUSTENTADO
