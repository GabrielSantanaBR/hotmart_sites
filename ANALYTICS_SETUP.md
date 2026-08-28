# Analytics e atribuição — NexoPlan

O site já possui a camada de eventos, preservação de UTMs e suporte opcional a mapas de calor. Para ativar a coleta, edite `analytics-config.js`.

## 1. Ativar Google Analytics 4

1. Crie uma propriedade GA4 e um fluxo de dados Web para o domínio da NexoPlan.
2. Copie o ID de medição no formato `G-XXXXXXXXXX`.
3. Cole o ID em `ga4Id` dentro de `analytics-config.js`.
4. Publique a alteração.
5. Aceite a análise no aviso de privacidade e confira o DebugView/Tempo real do GA4.

Enquanto `ga4Id` estiver vazio, nenhuma requisição é enviada ao Google.

## 2. Mapas de calor e gravações

O arquivo também aceita um ID do Microsoft Clarity em `clarityId`. Quando preenchido e autorizado pelo visitante, o site passa a carregar mapas de calor e gravações de sessão.

Enquanto `clarityId` estiver vazio, nenhuma requisição é enviada ao Clarity.

## 3. Eventos implementados

| Evento | Momento registrado |
|---|---|
| `view_item` | Abriu a página de uma solução |
| `select_item` | Escolheu um produto no seletor, vitrine ou comparativo |
| `view_promotion` | Visualizou a campanha de lançamento |
| `select_promotion` | Clicou em uma oferta promocional |
| `begin_checkout` | Saiu do site em direção ao checkout Hotmart |
| `cta_click` | Clicou em um CTA importante |
| `scroll_75` | Chegou a 75% da página |
| `purchase` | Disponível para a integração de confirmação de venda |

Os eventos de comércio eletrônico incluem identificador, nome e categoria do produto, sem inventar valores que não foram informados.

## 4. Evento de compra

O site não consegue confirmar sozinho uma venda ocorrida dentro da Hotmart. Para registrar `purchase` com precisão, use uma página de obrigado, webhook ou integração server-side da Hotmart e chame:

```js
window.nexoTrackPurchase({
  transactionId: "ID_REAL_DA_COMPRA",
  value: 0,
  currency: "BRL",
  productKey: "precifica"
});
```

Chaves válidas: `precifica`, `financeiro`, `negocio` e `conjunto`.

Nunca gere o evento apenas pelo clique no checkout: isso confundiria intenção de compra com venda confirmada.

## 5. Padrão de UTMs

Todos os links divulgados devem apontar para a página específica e carregar UTMs. Exemplos:

```text
/precifica/?utm_source=tiktok&utm_medium=organic&utm_campaign=lancamento_setembro&utm_content=video_01
/gestao-financeira/?utm_source=instagram&utm_medium=organic&utm_campaign=lancamento_setembro&utm_content=reels_02
/negocio/?utm_source=youtube&utm_medium=organic&utm_campaign=lancamento_setembro&utm_content=shorts_03
/conjunto/?utm_source=tiktok&utm_medium=paid&utm_campaign=lancamento_setembro&utm_content=anuncio_conjunto_01
```

Use:

- `utm_source`: plataforma, como `tiktok`, `instagram` ou `youtube`;
- `utm_medium`: `organic`, `paid`, `bio` ou `affiliate`;
- `utm_campaign`: campanha ou período;
- `utm_content`: vídeo, anúncio ou criativo específico;
- `utm_term`: opcional para segmentação/palavra-chave.

As UTMs recebidas são preservadas durante a sessão e adicionadas ao link da Hotmart no momento do clique.

## 6. Privacidade

Quando algum provedor é configurado, o site exibe uma escolha entre permitir ou recusar a análise. Google Analytics e Clarity só são carregados após a autorização do visitante.
