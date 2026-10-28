# Painel de atendentes e TikTok Pixel

## Publicação no Cloudflare Pages existente

Projeto: `santscredito`. Repositório: `appestoquebras-eng/SANTS-SCD---Solicita-o-de-Cr-dito`.

Domínio principal: `https://santscreditoltda.online/`. A troca de domínio usa o mesmo projeto Pages, banco D1 e pixel TikTok. O e-mail de contato existente permanece `contato@santscredito.online`; alterar o endereço do site não cria uma nova caixa de e-mail.

Na migração, conectar raiz e `www` no Pages, aguardar DNS/SSL e só então atualizar os destinos dos anúncios, preservando UTMs. Verificar PageView e Lead no Test Events. Cookies não podem ser compartilhados entre os dois domínios independentes; um visitante que muda de domínio pode receber um novo identificador.

1. Aplicar a migração no banco D1 **sants-atendimento** (ID já confirmado em `wrangler.jsonc`): `npm run db:remote`. Alternativamente, executar o conteúdo de `migrations/0001_atendimento.sql` no Console D1. Faça isso apenas uma vez num banco vazio. Não execute novamente sobre tabelas existentes.
2. Configurar no projeto Pages, em Settings → Variables and Secrets, um **Secret** chamado `ADMIN_PASSWORD`, com a senha escolhida pelo proprietário. Não usar prefixo VITE_, não colocar a senha no GitHub e não enviar como variável de build pública. Se a configuração de bindings no painel for usada, o nome do binding D1 deve ser **DB** apontando para **sants-atendimento**.
3. Publicar o código. Comando de build: `npm run build`; saída: `dist`. A pasta **functions** fica na raiz do repositório, fora de dist. Wrangler configura o binding DB no deploy. Production e Preview precisam de segredos próprios; evite conectar previews públicos ao banco de produção.
4. Abrir `/painel`, entrar e cadastrar o nome e telefone reais dos atendentes. Nenhum número de exemplo é inserido automaticamente. Salvar passa a valer imediatamente no servidor, sem novo build.
5. Verificar o domínio com e sem www, o painel após reload e o evento Lead em Test Events no TikTok. Não considerar o pixel validado em produção antes dessa etapa.

## Uso

O lote **1** alterna a cada cliente novo; **5** envia cinco novos clientes ao mesmo atendente, então passa ao próximo; **10** envia dez. A ordem é posição seguida do ID estável. Pausar/excluir pula o atendente. Editar preserva o ID e o histórico. Exclusão é lógica e pode ser revertida pelo administrador no banco. Mudança de lote aproveita o progresso atual: se já atingiu o novo limite, avança no próximo cliente.

O mesmo navegador mantém o atendente enquanto ativo. Um retorno não incrementa clientes únicos ou conversão. Ao pausar/excluir o atendente anterior, o visitante retorna à fila e gera outro encaminhamento, mas continua sendo um único cliente no total. O histórico por atendente distingue **clientes novos** de **encaminhamentos**. Nomes/telefones editados são exibidos com os valores atuais; o histórico numérico é preservado. Horário: America/Sao_Paulo; 7/15/30 dias incluem hoje e os dias anteriores do calendário. Total conta a primeira atribuição do navegador.

## Identificação e medição

- Cookie first-party `sants_visitor` HttpOnly, Secure em HTTPS, SameSite=Lax, validade de um ano; compartilhado entre raiz/www. Sem identificação por CPF, telefone, impressão digital ou IP do cliente. Outro navegador, cookie apagado ou dispositivo novo pode contar novamente.
- Alocação e avanço do lote acontecem numa única transação SQLite (trigger), com chave única de visitante e histórico. A autorização para tentar emitir Lead é reclamada uma única vez no servidor, inclusive entre abas. Duplo clique no frontend também fica bloqueado.
- Pixel **DBD3NDBC77U0QK5QBER0**, evento **Lead**, parâmetro genérico `content_name: chamar_no_whatsapp` e event_id estável. Não são enviados valor de crédito, parcelas, perfil PF/PJ, mensagem, nome ou telefone ao TikTok. Os eventos do simulador ficam locais. Configure **Automatic Advanced Matching** e **Enhanced Data Postback** desligados no Events Manager.
- Medição é carregada automaticamente na página principal. `/painel` não carrega o pixel. O SDK do TikTok pode receber dados técnicos próprios, como IP, URL e agente do navegador, ao acessar a página principal.
- Não há promessa de entrega exatamente uma vez a uma plataforma externa: bloqueadores, falta de rede ou fechamento imediato podem impedir a recepção. A trava privilegia não duplicar a tentativa. O encaminhamento não confirma conversa, mensagem enviada, recebimento ou aprovação de crédito.
- A navegação usa `location.assign` para **wa.me**, na mesma aba, sem popup e sem atraso artificial. A abertura do aplicativo depende do sistema, navegador e instalação do WhatsApp; pode aparecer uma confirmação do próprio celular.

## Desenvolvimento e testes

`npm ci` → `npm test` → `npm run lint` → `npm run build`.

Os testes usam o runtime Cloudflare/Miniflare com D1 local: concorrência, lotes 1/5/10, repetição, medição única, pausas/exclusão/edição, banco vazio, autenticação, origem, rate limit e datas. Nenhum teste envia mensagem ou evento real ao TikTok.

Para teste visual completo: `npm run db:local`, criar `.dev.vars` (ignorado pelo Git) contendo ADMIN_PASSWORD com uma senha exclusiva de teste e executar `npm run dev:full`. A senha de produção nunca deve estar nesse arquivo de teste. `npm run dev` serve só o Vite e não fornece a API Functions. O preview AI Studio também não deve ser usado para validar D1.

## Operação

As sessões duram 30 minutos e o token fica somente na memória da página, exigindo senha novamente ao recarregar ou abrir outra aba. API admin sempre verifica o token no servidor. Há limitação persistente de dez tentativas de login por 15 minutos, baseada em hash do IP técnico; o IP bruto não é salvo. Nunca há senha padrão de fallback.

Mantenha D1 com backups/Time Travel e controle de acesso da conta Cloudflare. O histórico de visitantes não tem remoção automática nesta versão para preservar totais e deduplicação; o responsável deve definir e aplicar uma política de retenção adequada. Remover dados de visitantes altera totais e pode permitir que um navegador seja contado de novo.
