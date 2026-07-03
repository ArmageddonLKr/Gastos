# Gastos

App instalável (PWA) de controle de gastos pessoais, feito para celular.

🔗 **App publicado:** https://armageddonlkr.github.io/Gastos/

- Perfil local (nome, moeda, meta de renda) — sem necessidade de servidor ou conta.
- Receitas e despesas por categoria, com orçamento mensal por categoria.
- Dashboard com saldo do mês, gráfico de gastos por categoria e histórico.
- Estatísticas com tendência de 6 meses e distribuição de gastos.
- Tema totalmente customizável: fonte, cor da fonte, cor dos painéis, cor de destaque, cores dos toasts, modo claro/escuro e arredondamento dos cantos.
- Exportação/importação de backup em JSON.
- PWA instalável, funciona offline e atualiza sozinho (sem precisar reinstalar).

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

Os dados ficam salvos no dispositivo via IndexedDB.
