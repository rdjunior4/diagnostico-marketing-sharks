import { Question } from '@/types/quiz';

export const questions: Question[] = [
  // BLOCO 1 — Identificação e Contexto do Negócio
  { id:'b1q3', blockId:1, type:'open', question:'Principal produto, serviço ou experiência vendida', placeholder:'Descreva seu principal produto ou serviço...', maxLength:200, maxScore:1 },
  { id:'b1q4', blockId:1, type:'single', question:'Qual é o principal objetivo da empresa hoje?', maxScore:1, options:[
    {id:'faturamento',label:'Aumentar faturamento',score:1},{id:'leads',label:'Gerar mais leads',score:1},
    {id:'online',label:'Vender mais online',score:1},{id:'posicionamento',label:'Melhorar posicionamento',score:1},
    {id:'qualificados',label:'Atrair clientes mais qualificados',score:1},{id:'organizar',label:'Organizar marketing e vendas',score:1},
    {id:'expandir',label:'Expandir para novas regiões',score:1},{id:'marca',label:'Fortalecer a marca',score:1},
    {id:'outro',label:'Outro',score:1}
  ]},
  // BLOCO 2 — Presença Digital e Canais
  { id:'b2q1', blockId:2, type:'compound', question:'Possui site institucional?', maxScore:2, hasLink:true, linkLabel:'Link do site', options:[
    {id:'sim',label:'Sim',score:1},{id:'nao',label:'Não',score:0}
  ]},
  { id:'b2q2', blockId:2, type:'compound', question:'Possui Instagram ativo?', maxScore:2, hasLink:true, linkLabel:'Link do Instagram', options:[
    {id:'sim',label:'Sim',score:1},{id:'nao',label:'Não',score:0}
  ]},
  { id:'b2q3', blockId:2, type:'compound', question:'Possui WhatsApp comercial?', maxScore:2, hasLink:true, linkLabel:'Número ou link', options:[
    {id:'sim',label:'Sim',score:1},{id:'nao',label:'Não',score:0}
  ]},
  { id:'b2q4', blockId:2, type:'compound', question:'Possui Google Maps / Perfil da Empresa no Google?', maxScore:2, hasLink:true, linkLabel:'Link do perfil', options:[
    {id:'sim',label:'Sim',score:1},{id:'nao',label:'Não',score:0}
  ]},
  { id:'b2q5', blockId:2, type:'multiple', question:'Quais outros canais a empresa utiliza atualmente?', maxScore:1, maxSelections:8, options:[
    {id:'facebook',label:'Facebook',score:1},{id:'tiktok',label:'TikTok',score:1},{id:'youtube',label:'YouTube',score:1},
    {id:'linkedin',label:'LinkedIn',score:1},{id:'pinterest',label:'Pinterest',score:1},{id:'marketplace',label:'Marketplace',score:1},
    {id:'email',label:'E-mail marketing',score:1},{id:'nenhum',label:'Nenhum outro canal',score:0}
  ]},
  { id:'b2q6', blockId:2, type:'single', question:'Qual canal mais gera clientes hoje?', maxScore:1, options:[
    {id:'instagram',label:'Instagram',score:1},{id:'indicacao',label:'Indicação',score:0.5},{id:'whatsapp',label:'WhatsApp',score:1},
    {id:'google',label:'Google',score:1},{id:'trafego',label:'Tráfego pago',score:1},{id:'loja',label:'Loja física',score:0.5},
    {id:'marketplace',label:'Marketplace',score:0.5},{id:'naosei',label:'Não sei',score:0}
  ]},
  // BLOCO 3 — Marca, Identidade e Posicionamento
  { id:'b3q1', blockId:3, type:'compound', question:'A empresa possui logomarca?', maxScore:2, hasFile:true, fileLabel:'Anexar logomarca', options:[
    {id:'sim',label:'Sim',score:1},{id:'nao',label:'Não',score:0}
  ]},
  { id:'b3q2', blockId:3, type:'single', question:'Como está a identidade visual da empresa hoje?', maxScore:1, options:[
    {id:'padrao',label:'Sim, com padrão claro',score:1},{id:'logo_artes',label:'Tenho logo e algumas artes',score:0.5},
    {id:'basico',label:'Tenho algo básico',score:0.25},{id:'nao',label:'Não tenho identidade definida',score:0}
  ]},
  { id:'b3q3', blockId:3, type:'compound', question:'Possui manual de marca ou brandbook?', maxScore:2, hasFile:true, fileLabel:'Anexar manual de marca', options:[
    {id:'sim',label:'Sim',score:1},{id:'nao',label:'Não',score:0},{id:'naosei',label:'Não sei',score:0}
  ]},
  { id:'b3q4', blockId:3, type:'single', question:'A empresa sabe explicar por que existe além de vender?', maxScore:1, options:[
    {id:'sim',label:'Sim, temos isso muito claro',score:1},{id:'ideia',label:'Temos uma ideia, mas não documentada',score:0.5},
    {id:'nunca',label:'Nunca paramos para definir isso',score:0},{id:'naosei',label:'Não sei responder',score:0}
  ]},
  { id:'b3q5', blockId:3, type:'single', question:'A empresa possui diferenciais competitivos claros?', maxScore:1, options:[
    {id:'sim',label:'Sim, bem definidos',score:1},{id:'pouco',label:'Temos alguns, mas pouco comunicados',score:0.5},
    {id:'nao',label:'Não estão claros',score:0},{id:'naosei',label:'Não sei',score:0}
  ]},
  { id:'b3q6', blockId:3, type:'open', question:'Cite os principais diferenciais, se houver:', placeholder:'Ex: Atendimento personalizado, método exclusivo...', maxLength:200, maxScore:1 },
  { id:'b3q7', blockId:3, type:'single', question:'Como você acredita que o mercado enxerga sua empresa hoje?', maxScore:1, options:[
    {id:'referencia',label:'Como uma referência',score:1},{id:'opcao',label:'Como uma opção entre várias',score:0.5},
    {id:'desconhecida',label:'Como uma empresa ainda pouco conhecida',score:0.25},{id:'naosei',label:'Não sei',score:0}
  ]},
  { id:'b3q8', blockId:3, type:'single', question:'O posicionamento da empresa está claro nos canais digitais?', maxScore:1, options:[
    {id:'sim',label:'Sim, muito claro',score:1},{id:'parcial',label:'Parcialmente',score:0.5},
    {id:'pouco',label:'Pouco claro',score:0.25},{id:'naosei',label:'Não sei',score:0}
  ]},
  // BLOCO 4 — Público, Mercado e Concorrência
  { id:'b4q1', blockId:4, type:'single', question:'A empresa possui público-alvo definido?', maxScore:1, options:[
    {id:'sim',label:'Sim, com clareza',score:1},{id:'ideia',label:'Tenho uma ideia geral',score:0.5},{id:'nao',label:'Não tenho definido',score:0}
  ]},
  { id:'b4q2', blockId:4, type:'single', question:'Possui persona definida?', maxScore:1, options:[
    {id:'sim',label:'Sim, documentada',score:1},{id:'nocao',label:'Tenho uma noção',score:0.5},{id:'nao',label:'Não tenho',score:0}
  ]},
  { id:'b4q3', blockId:4, type:'open', question:'Quem é o cliente ideal hoje?', placeholder:'Descreva o perfil do seu cliente ideal...', maxLength:200, maxScore:1 },
  { id:'b4q4', blockId:4, type:'single', question:'A localização influencia diretamente o negócio?', maxScore:1, options:[
    {id:'sim',label:'Sim, muito',score:1},{id:'parcial',label:'Parcialmente',score:0.5},
    {id:'naosei',label:'Não sei',score:0},{id:'online',label:'Atendo online/nacionalmente',score:1}
  ]},
  { id:'b4q5', blockId:4, type:'open', question:'Qual raio, bairro, cidade ou região deseja atingir?', placeholder:'Ex: Grande São Paulo, Zona Sul...', maxLength:150, maxScore:1 },
  { id:'b4q6', blockId:4, type:'open', question:'Liste de 3 a 5 concorrentes principais', placeholder:'Ex: Empresa A, Empresa B, Empresa C...', maxLength:200, maxScore:1 },
  // BLOCO 5 — Marketing na Prática
  { id:'b5q1', blockId:5, type:'single', question:'A empresa faz ações de marketing atualmente?', maxScore:1, options:[
    {id:'planejamento',label:'Sim, com planejamento',score:1},{id:'semconstancia',label:'Sim, mas sem constância',score:0.5},
    {id:'asvezes',label:'Às vezes',score:0.25},{id:'nao',label:'Não faço',score:0}
  ]},
  { id:'b5q2', blockId:5, type:'multiple', question:'Quais ações são feitas hoje?', maxScore:1, maxSelections:9, options:[
    {id:'organicas',label:'Postagens orgânicas',score:1},{id:'anuncios',label:'Anúncios pagos',score:1},
    {id:'promocoes',label:'Promoções',score:1},{id:'sazonais',label:'Campanhas sazonais',score:1},
    {id:'influenciadores',label:'Influenciadores',score:1},{id:'email',label:'E-mail marketing',score:1},
    {id:'whatsapp',label:'WhatsApp',score:1},{id:'eventos',label:'Eventos',score:1},{id:'nenhuma',label:'Nenhuma',score:0}
  ]},
  { id:'b5q3', blockId:5, type:'single', question:'Existe calendário de conteúdo?', maxScore:1, options:[
    {id:'mensal',label:'Sim, mensal',score:1},{id:'semanal',label:'Sim, semanal',score:1},
    {id:'ideias',label:'Tenho ideias soltas',score:0.25},{id:'nao',label:'Não tenho',score:0}
  ]},
  { id:'b5q4', blockId:5, type:'single', question:'A empresa investe em anúncios?', maxScore:1, options:[
    {id:'sim',label:'Sim, continuamente',score:1},{id:'asvezes',label:'Sim, às vezes',score:0.5},
    {id:'parei',label:'Já investi, mas parei',score:0.25},{id:'nunca',label:'Nunca investi',score:0}
  ]},
  { id:'b5q5', blockId:5, type:'multiple', question:'Quais canais de anúncio já foram utilizados?', maxScore:1, maxSelections:7, options:[
    {id:'meta',label:'Meta Ads',score:1},{id:'google',label:'Google Ads',score:1},{id:'tiktok',label:'TikTok Ads',score:1},
    {id:'linkedin',label:'LinkedIn Ads',score:1},{id:'influenciadores',label:'Influenciadores',score:1},
    {id:'marketplace',label:'Marketplace',score:1},{id:'nenhum',label:'Nenhum',score:0}
  ]},
  { id:'b5q6', blockId:5, type:'single', question:'A empresa acompanha os resultados das ações de marketing?', maxScore:1, options:[
    {id:'indicadores',label:'Sim, com indicadores claros',score:1},{id:'parcial',label:'Acompanho parcialmente',score:0.5},
    {id:'curtidas',label:'Vejo apenas curtidas/mensagens',score:0.25},{id:'nao',label:'Não acompanho',score:0}
  ]},
  // BLOCO 6 — Vendas, Comercial e Conversão
  { id:'b6q1', blockId:6, type:'single', question:'Existe processo comercial definido?', maxScore:1, options:[
    {id:'documentado',label:'Sim, documentado',score:1},{id:'pratica',label:'Existe na prática, mas não documentado',score:0.5},
    {id:'improvisado',label:'É feito de forma improvisada',score:0.25},{id:'nao',label:'Não existe',score:0}
  ]},
  { id:'b6q2', blockId:6, type:'multiple', question:'Como os clientes entram em contato hoje?', maxScore:1, maxSelections:7, options:[
    {id:'whatsapp',label:'WhatsApp',score:1},{id:'instagram',label:'Instagram Direct',score:1},{id:'site',label:'Site',score:1},
    {id:'telefone',label:'Telefone',score:1},{id:'loja',label:'Loja física',score:1},{id:'indicacao',label:'Indicação',score:1},
    {id:'marketplace',label:'Marketplace',score:1}
  ]},
  { id:'b6q3', blockId:6, type:'single', question:'Existe script ou padrão de atendimento comercial?', maxScore:1, options:[
    {id:'sim',label:'Sim, padronizado',score:1},{id:'parcial',label:'Parcialmente',score:0.5},
    {id:'cada_um',label:'Cada pessoa atende de um jeito',score:0.25},{id:'nao',label:'Não',score:0}
  ]},
  { id:'b6q4', blockId:6, type:'single', question:'A empresa sabe sua taxa de conversão de leads em clientes?', maxScore:1, options:[
    {id:'sim',label:'Sim',score:1},{id:'nocao',label:'Tenho uma noção',score:0.5},{id:'nao',label:'Não sei',score:0}
  ]},
  { id:'b6q5', blockId:6, type:'compound', question:'Possui proposta comercial estruturada?', maxScore:2, hasFile:true, fileLabel:'Anexar proposta comercial', options:[
    {id:'sim',label:'Sim',score:1},{id:'nao',label:'Não',score:0}
  ]},
  // BLOCO 7 — Relacionamento, CRM e Retenção
  { id:'b7q1', blockId:7, type:'single', question:'Possui CRM ou controle de leads/clientes?', maxScore:1, options:[
    {id:'crm',label:'Sim, uso CRM',score:1},{id:'planilha',label:'Uso planilha',score:0.5},
    {id:'whatsapp',label:'Controlo pelo WhatsApp',score:0.25},{id:'nao',label:'Não controlo',score:0}
  ]},
  { id:'b7q2', blockId:7, type:'single', question:'Faz follow-up com oportunidades?', maxScore:1, options:[
    {id:'sim',label:'Sim, com processo claro',score:1},{id:'asvezes',label:'Às vezes',score:0.5},
    {id:'raramente',label:'Raramente',score:0.25},{id:'naosei',label:'Não sei',score:0}
  ]},
  { id:'b7q3', blockId:7, type:'single', question:'Possui ações para clientes comprarem novamente?', maxScore:1, options:[
    {id:'sim',label:'Sim, estruturadas',score:1},{id:'pontuais',label:'Ações pontuais',score:0.5},
    {id:'lembro',label:'Apenas quando lembro',score:0.25},{id:'nao',label:'Não',score:0}
  ]},
  { id:'b7q4', blockId:7, type:'multiple', question:'Como mantém relacionamento com clientes?', maxScore:1, maxSelections:7, options:[
    {id:'whatsapp',label:'WhatsApp',score:1},{id:'email',label:'E-mail',score:1},{id:'instagram',label:'Instagram',score:1},
    {id:'comunidade',label:'Comunidade',score:1},{id:'crm',label:'CRM',score:1},{id:'pessoal',label:'Atendimento pessoal',score:1},
    {id:'nao',label:'Não faço relacionamento ativo',score:0}
  ]},
  { id:'b7q5', blockId:7, type:'single', question:'Mede satisfação ou feedback dos clientes?', maxScore:1, options:[
    {id:'sim',label:'Sim, com frequência',score:1},{id:'asvezes',label:'Às vezes',score:0.5},
    {id:'raramente',label:'Raramente',score:0.25},{id:'nao',label:'Não',score:0}
  ]},
  // BLOCO 8 — Gestão, Metas e Indicadores
  { id:'b8q1', blockId:8, type:'single', question:'Possui metas de marketing ou vendas definidas?', maxScore:1, options:[
    {id:'sim',label:'Sim, claras e mensuráveis',score:1},{id:'gerais',label:'Tenho metas gerais',score:0.5},
    {id:'desejos',label:'Tenho desejos, mas não metas',score:0.25},{id:'nao',label:'Não tenho',score:0}
  ]},
  { id:'b8q2', blockId:8, type:'open', question:'Qual meta principal deseja alcançar nos próximos 90 dias?', placeholder:'Ex: Faturar R$50k/mês, gerar 100 leads...', maxLength:200, maxScore:1 },
  { id:'b8q3', blockId:8, type:'single', question:'Possui plano de ação de marketing?', maxScore:1, options:[
    {id:'sim',label:'Sim, documentado',score:1},{id:'parcial',label:'Parcialmente',score:0.5},
    {id:'ideias',label:'Apenas ideias soltas',score:0.25},{id:'nao',label:'Não',score:0}
  ]},
  { id:'b8q4', blockId:8, type:'single', question:'Possui orçamento definido para marketing?', maxScore:1, options:[
    {id:'mensal',label:'Sim, mensal',score:1},{id:'variavel',label:'Sim, mas variável',score:0.5},
    {id:'sobra',label:'Invisto quando sobra',score:0.25},{id:'nao',label:'Não tenho orçamento',score:0}
  ]},
  { id:'b8q5', blockId:8, type:'multiple', question:'Quais indicadores acompanha?', maxScore:1, maxSelections:9, options:[
    {id:'faturamento',label:'Faturamento',score:1},{id:'leads',label:'Leads',score:1},{id:'cpl',label:'Custo por lead',score:1},
    {id:'conversao',label:'Conversão',score:1},{id:'ticket',label:'Ticket médio',score:1},{id:'retencao',label:'Retenção',score:1},
    {id:'roi',label:'ROI',score:1},{id:'alcance',label:'Alcance / engajamento',score:1},{id:'nenhum',label:'Nenhum',score:0}
  ]},
  // BLOCO 9 — Tecnologia, Materiais e Ativos
  { id:'b9q1', blockId:9, type:'single', question:'Possui landing page (página de vendas ou captura)?', maxScore:1, options:[
    {id:'vendas',label:'Sim, página de vendas',score:1},{id:'captura',label:'Sim, página de captura',score:1},
    {id:'ambos',label:'Sim, ambos',score:1},{id:'nao',label:'Não',score:0}
  ]},
  { id:'b9q2', blockId:9, type:'single', question:'Usa ferramentas de marketing, automação ou gestão?', maxScore:1, options:[
    {id:'varias',label:'Sim, várias ferramentas',score:1},{id:'poucas',label:'Sim, poucas ferramentas',score:0.5},
    {id:'basicas',label:'Uso ferramentas básicas',score:0.25},{id:'nao',label:'Não uso',score:0}
  ]},
  { id:'b9q3', blockId:9, type:'open', question:'Quais ferramentas utiliza?', placeholder:'Ex: RD Station, Mailchimp, Google Analytics...', maxLength:200, maxScore:1 },
  { id:'b9q5', blockId:9, type:'multiple', question:'Possui documentos internos relevantes?', maxScore:1, maxSelections:6, options:[
    {id:'historico',label:'Histórico da empresa',score:1},{id:'cultura',label:'Cultura',score:1},
    {id:'onboarding',label:'Onboarding',score:1},{id:'planejamento',label:'Planejamento',score:1},
    {id:'treinamento',label:'Materiais de treinamento',score:1},{id:'nenhum',label:'Nenhum',score:0}
  ]},
  // BLOCO 10 — Dor, Prioridade e Urgência
  { id:'b10q1', blockId:10, type:'multiple', question:'Qual é o maior desafio atual no marketing?', maxScore:1, maxSelections:8, options:[
    {id:'posicionamento',label:'Falta de posicionamento',score:1},{id:'leads',label:'Falta de leads',score:1},
    {id:'conversao',label:'Baixa conversão',score:1},{id:'presenca',label:'Pouca presença digital',score:1},
    {id:'planejamento',label:'Falta de planejamento',score:1},{id:'investimento',label:'Baixo investimento',score:1},
    {id:'equipe',label:'Falta de equipe',score:1},{id:'naosei',label:'Não sei exatamente',score:0}
  ]},
  { id:'b10q2', blockId:10, type:'multiple', question:'Qual é a maior trava para crescer?', maxScore:1, maxSelections:8, options:[
    {id:'clareza',label:'Falta de clareza estratégica',score:1},{id:'orcamento',label:'Falta de orçamento',score:1},
    {id:'execucao',label:'Falta de execução',score:1},{id:'gestao',label:'Falta de gestão',score:1},
    {id:'concorrencia',label:'Concorrência forte',score:1},{id:'reconhecimento',label:'Baixo reconhecimento da marca',score:1},
    {id:'comercial',label:'Processo comercial fraco',score:1},{id:'outro',label:'Outro',score:1}
  ]},
  { id:'b10q3', blockId:10, type:'multiple', question:'O que você considera mais urgente resolver agora?', maxScore:1, maxSelections:8, options:[
    {id:'vender',label:'Vender mais',score:1},{id:'organizar',label:'Organizar marketing',score:1},
    {id:'posicionamento',label:'Melhorar posicionamento',score:1},{id:'campanhas',label:'Criar campanhas',score:1},
    {id:'atendimento',label:'Melhorar atendimento comercial',score:1},{id:'crm',label:'Estruturar CRM',score:1},
    {id:'presenca',label:'Melhorar presença digital',score:1},{id:'plano',label:'Criar plano de marketing',score:1}
  ]},
];
