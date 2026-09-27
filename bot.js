/**
 * ============================================================================
 * ⚜️ BOT DISCORD • FAMÍLIA & AMIGOS (100% FUNCIONAL & SEGURO) ⚜️
 * ============================================================================
 * 
 * 🛡️ MODO SEGURO: A parte de apagar e recriar canais foi totalmente REMOVIDA!
 * O bot opera no seu servidor existente de forma limpa, segura e sem nenhum risco
 * de perda de canais ou dados.
 * 
 * 🛠️ FUNCIONALIDADES DO BOT:
 * 1. ⚜️ SISTEMA DE REGISTRO & AUTO-ROLE (FAMÍLIA & AMIGOS):
 *    - Comando `!painel` ou `!cargos`: Envia o painel oficial dourado com botões.
 *    - Botão 1: "⚜️ Entrar na Família [FN]" -> Abre modal para formulário de entrada.
 *    - Botão 2: "🤝 Entrar como Amigo [AMIGO]" -> Abre modal para cadastro de amigo.
 *    - Fichas enviadas automaticamente para a Staff no canal #aprovacao-cargos.
 *    - Botões interativos para a Staff: [✅ Aprovar] e [❌ Reprovar].
 *    - Ao aprovar: Entrega o cargo, renomeia o apelido com a tag ([FN] ou [AMIGO]),
 *      remove o cargo "Não Registrado" e notifica o usuário!
 * 
 * 2. 👑 SALA PRIVADA DOS CHEFES (SEM APAGAR NADA):
 *    - Comando `!salachefes`: Cria ou configura com segurança a categoria
 *      "👑・CHEFIA & DIRETORIA (PV)" com canais de texto e voz blindados
 *      para o cargo 👑 Chefe e Administradores, mantendo todos os outros canais intactos!
 * 
 * 3. 📜 REGRAS DO SERVIDOR:
 *    - Comando `!regras`: Envia o painel com as diretrizes e boa convivência.
 * 
 * 4. 🧹 MODERAÇÃO & UTILIDADES:
 *    - Comando `!limpar <1-100>`: Purge seguro de mensagens recentes no chat.
 *    - Comando `!status`: Mostra dados de latência, uptime, membros e cargos.
 *    - Comando `!ajuda`: Manual completo e interativo de comandos.
 */

require('dotenv').config();

// 🛡️ SISTEMA ANTI-CRASH PROFISSIONAL (Impede que o bot trave ou encerre por erros)
process.on('unhandledRejection', (reason, promise) => {
    console.error('🛡️ [ANTI-CRASH] Rejeição de Promise não tratada interceptada (o bot continua ativo):', reason);
});

process.on('uncaughtException', (err, origin) => {
    console.error(`🛡️ [ANTI-CRASH] Exceção não capturada (${origin}) interceptada (o bot continua ativo):`, err.message || err);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.error(`🛡️ [ANTI-CRASH Monitor] Erro detectado (${origin}):`, err.message || err);
});

const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    Events,
    ChannelType,
    PermissionsBitField
} = require('discord.js');

const CONFIG = {
    token: process.env.DISCORD_TOKEN || "SEU_BOT_TOKEN_AQUI",
    nomeServidor: "Família & Amigos",
    corEmbed: "#D4AF37", // Dourado
    corChefe: "#FFD700", // Ouro

    // IDs de Cargos (Configuráveis no .env ou criados automaticamente)
    cargoChefeId: process.env.CARGO_CHEFE_ID || null,
    cargoFamiliaId: process.env.CARGO_FAMILIA_ID || "1546736138918694983",
    cargoAmigosId: process.env.CARGO_AMIGOS_ID || "1546736135965904926",
    cargoNaoRegistradoId: process.env.CARGO_NAO_REGISTRADO_ID || "1515125826780135480",

    // 💌 Configuração da Cartinha de Bom Dia (Henrique & Gabizinha • Namoro Sério)
    canalCartinhaId: process.env.CANAL_CARTINHA_ID || "1552914452146294864",
    gabizinhaUserId: process.env.GABIZINHA_USER_ID || "1280444697231364183",
    nomeGabizinha: "✞ 𝑮𝒂𝒃𝒊𝒛𝒊𝒏𝒉𝒂 ✞",
    nomeHenrique: "Henrique",
    dataInicioConhecer: "2026-09-21",
    dataFimConhecer: "2026-09-26",
    dataInicioNamoro: "2026-09-27", // Oficialmente Namorados!
    dataMarcoAmor: "2026-09-27",
    fraseMarcoAmor: "Ficamos nos conhecendo do dia 21/09 até 26/09 e hoje, 27/09/2026, é o início do nosso Namoro Sério Oficial!",
    horaEnvioCartinha: 6, // 06:20 AM (Horário de Brasília)
    minutoEnvioCartinha: 20
};

// 💌 30 Cartinhas Diárias de Bom Dia do Henrique para sua Namorada Gabizinha
const CARTINHAS_30_DIAS = [
    {
        dia: 1,
        diaTitulo: "💍 DIA 01 — O INÍCIO DO NOSSO NAMORO SÉRIO",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA A MINHA NAMORADA ☀️💍",
        frase: "Nos conhecemos do dia 21/09 até ontem, e hoje, 27/09/2026, você é oficialmente a dona do meu coração e minha namorada!",
        corpo: "Bom dia, minha namorada linda! ❤️\n\nHoje é o dia mais feliz e especial de todos: o início oficial do nosso namoro sério! Desde o primeiro momento em que começamos a conversar no dia 21/09, meu coração já sabia que você era diferente de tudo. Esses dias conhecendo você só me deram a maior certeza da minha vida: eu quero estar com você, cuidar de você e te fazer a mulher mais feliz do mundo.\n\nQue seu primeiro dia oficialmente como minha namorada seja maravilhoso, abençoado e cheio de sorrisos! Te amo demais! 🌹💍",
        rodape: "💍 Henrique & Gabizinha • Nosso Primeiro Dia de Namoro Sério 💕",
        emoji: "💍"
    },
    {
        dia: 2,
        diaTitulo: "🌸 DIA 02 — MEU ORGULHO EM TER VOCÊ",
        cabecalho: "💌 BOM DIA, MEU AMOR! MINHA NAMORADA 🌷💕",
        frase: "Você não imagina o orgulho e a alegria que eu sinto em poder te chamar de minha namorada.",
        corpo: "Acordar sabendo que agora é sério, que somos namorados e que tenho ao meu lado a garota mais incrível desse mundo é a melhor sensação da vida. Seu sorriso ilumina o meu dia inteiro.\n\nQue a sua manhã seja tranquila, doce e cheia de paz. Nunca se esqueça que tem um namorado aqui completamente louco por você! ❤️",
        rodape: "💍 Henrique & Gabizinha • Namoro Sério 27/09 💕",
        emoji: "🌸"
    },
    {
        dia: 3,
        diaTitulo: "💖 DIA 03 — VOCÊ EM MEUS PENSAMENTOS",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA O MEU AMOR ☀️❤️",
        frase: "Antes mesmo do despertador tocar, você já era o primeiro e mais lindo pensamento do meu dia.",
        corpo: "Bom dia, minha princesa! 💖\n\nPassamos do dia 21 ao 26 nos descobrindo e nos encantando, e agora cada manhã ao seu lado tem um sabor de realização. Estar em um namoro sério com você é o maior presente que Deus me deu.\n\nTenha um dia leve, cheio de motivos para sorrir e lembre-se: seu namorado está torcendo e rezando por você o tempo todo! 🌹",
        rodape: "💍 Oficialmente Namorados • Henrique & Gabizinha 💕",
        emoji: "💖"
    },
    {
        dia: 4,
        diaTitulo: "🌹 DIA 04 — MEU CUIDADO & CARINHO",
        cabecalho: "💌 BOM DIA, MINHA NAMORADA PERFEITA! ☀️👸",
        frase: "Meu objetivo diário é cuidar de você, te proteger e arrancar os seus sorrisos mais sinceros.",
        corpo: "Hoje eu só queria te lembrar de uma certeza absoluta:\n\n\"Você é a mulher da minha vida e a minha maior prioridade.\"\n\nQue o seu dia seja tão radiante e especial quanto você é para mim. Que nada nem ninguém tire a sua paz. Te amo com todo o meu coração! 🌹💍",
        rodape: "❤️ Do seu namorado apaixonado, Henrique",
        emoji: "🌹"
    },
    {
        dia: 5,
        diaTitulo: "☀️ DIA 05 — O DESTINO CERTO",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA A GABIZINHA 🌻💍",
        frase: "A gente se conheceu no dia 21/09 e hoje tudo faz sentido: você nasceu para ser minha namorada.",
        corpo: "Bom dia, minha vida! 💖\n\nÀs vezes eu paro e penso na sorte que eu tive de cruzar o seu caminho. Em tão pouco tempo você virou meu porto seguro, minha melhor companhia e a dona dos meus melhores planos.\n\n\"Meu desejo para hoje: que seu coração sinta todo o amor e carinho que eu guardo aqui para você.\" ❤️",
        rodape: "💍 Henrique & Gabizinha • Amor Real & Sincero 💕",
        emoji: "☀️"
    },
    {
        dia: 6,
        diaTitulo: "💫 DIA 06 — NOSSA CONEXÃO",
        cabecalho: "💌 BOM DIA, MEU DOCE DE COCO! ☀️💕",
        frase: "Nossa química e a nossa lealdade mostram que o que temos é único e abençoado.",
        corpo: "Algumas pessoas passam pela nossa vida sem deixar rastro, mas você chegou para ficar e construir um futuro lindo comigo. Agora que assumimos esse namoro sério, tenho certeza de que estamos no caminho certo.\n\nTenha um dia cheio de vitórias e conquistas, minha gatinha! Te amo! 🌹",
        rodape: "💘 Henrique ➔ Minha Namorada Gabizinha",
        emoji: "💫"
    },
    {
        dia: 7,
        diaTitulo: "🌷 DIA 07 — UMA SEMANA DA NOSSA HISTÓRIA",
        cabecalho: "💌 BOM DIA, MINHA LINDA! ☀️🌹",
        frase: "Já são 7 dias desde que nos conhecemos no dia 21/09 e cada segundo valeu a pena para estarmos namorando hoje!",
        corpo: "Bom dia, meu grande amor! 💖\n\nUma semana inteira desde o momento em que Deus colocou você na minha vida. Foram dias se conhecendo, rindo juntos, trocando olhares e mensagens, até chegar no nosso 27/09 do namoro sério.\n\n\"Espero que hoje seu dia seja leve, colorido e cheio de motivos para você ser muito feliz.\" Cuide-se bem, minha namorada! 🌹",
        rodape: "💍 7 Dias de História • Henrique & Gabizinha 💕",
        emoji: "🌷"
    },
    {
        dia: 8,
        diaTitulo: "🌅 DIA 08 — SORRISO DE NAMORADA",
        cabecalho: "💌 BOM DIA PARA A MULHER MAIS LINDA! ☀️👸",
        frase: "O seu sorriso é o meu combustível e a coisa mais perfeita que eu já vi.",
        corpo: "Que o primeiro sorriso do seu dia seja pensado em mim e que o último pensamento antes de dormir traga a certeza de que você é amada e respeitada como uma verdadeira rainha.\n\n\"Você merece todos os abraços quentes, todo o carinho e toda a felicidade desse mundo.\" 💕",
        rodape: "🌹 De: Henrique • Para: Gabizinha (Minha Namorada)",
        emoji: "🌅"
    },
    {
        dia: 9,
        diaTitulo: "💘 DIA 09 — CERTEZA DO MEU CORAÇÃO",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA A GABIZINHA ❤️💍",
        frase: "Você mudou minha rotina, meus planos e trouxe paz para a minha vida.",
        corpo: "Talvez você não faça ideia, mas uma simples mensagem de \"bom dia\" vinda de você ilumina a minha manhã toda. Assumir esse namoro sério foi a decisão mais acertada que tomei.\n\nTenha um dia maravilhoso, minha gatinha. Estou aqui sempre com você, para o que der e vier! 🌷",
        rodape: "💖 Henrique ➔ Gabizinha • Namoro Sério 💕",
        emoji: "💘"
    },
    {
        dia: 10,
        diaTitulo: "🌹 DIA 10 — 10 DIAS JUNTOS & APAIXONADOS",
        cabecalho: "💌 BOM DIA, MEU AMOR! ☀️💍",
        frase: "Dez dias de história linda e esse namoro está apenas no comecinho de uma vida toda.",
        corpo: "Já se passaram 10 dias desde que conversamos pela primeira vez no dia 21/09. E cada manhã que passa, meu amor por você só aumenta e ganha mais força.\n\n\"Ainda tenho infinitos beijos, abraços e declarações para te entregar todos os dias.\" ❤️\n\nQue seu dia seja tão lindo quanto você!",
        rodape: "💘 Henrique & Gabizinha • Para Sempre 💕",
        emoji: "🌹"
    },
    {
        dia: 11,
        diaTitulo: "✨ DIA 11 — A MULHER QUE ESCOLHI",
        cabecalho: "💌 CARTINHA ESPECIAL PARA MINHA NAMORADA ☀️💖",
        frase: "Entre tantas pessoas no mundo, foi em você que encontrei o meu lar.",
        corpo: "Bom dia, minha flor! 🌹\n\nNão preciso de data comemorativa para te dizer o quanto você é especial e o quanto eu sou apaixonado por você. Ter você como minha namorada séria é o meu maior orgulho.\n\nTenha um excelente dia de muito foco e paz! Te amo! ❤️",
        rodape: "💍 Henrique & Gabizinha • Namoro Sério 💕",
        emoji: "✨"
    },
    {
        dia: 12,
        diaTitulo: "🌻 DIA 12 — PAZ NO CORAÇÃO",
        cabecalho: "💌 BOM DIA, MEU BEM! ☀️🌷",
        frase: "Que o seu café seja quentinho, seu dia produtivo e que nada tire a sua tranquilidade.",
        corpo: "Gabizinha, meu amor, que a vida seja muito gentil com você hoje. Lembre-se de respirar fundo se algo parecer difícil, porque o seu namorado está aqui segurando a sua mão em qualquer momento.\n\n\"Você é a minha paz e o meu porto seguro.\" Te amo! 🌷",
        rodape: "💘 De: Henrique • Para: Minha Namorada Gabizinha",
        emoji: "🌻"
    },
    {
        dia: 13,
        diaTitulo: "💖 DIA 13 — O VALOR QUE VOCÊ TEM",
        cabecalho: "💌 BOM DIA, MINHA RAINHA! 🌅💍",
        frase: "Você é preciosa, única, linda por dentro e por fora, e tem todo o meu respeito e admiração.",
        corpo: "Passando aqui para deixar o lembrete diário do seu namorado:\n\n**Você é a namorada mais incrível do mundo. Nunca se diminua e nunca duvide do quanto você é especial.** ❤️\n\nEstou com você hoje, amanhã e em todos os próximos capítulos da nossa história!",
        rodape: "🌹 Henrique ➔ Gabizinha • Namorados Oficiais",
        emoji: "💖"
    },
    {
        dia: 14,
        diaTitulo: "🌹 DIA 14 — DUAS SEMANAS DE NÓS",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA A GABIZINHA ☀️💕",
        frase: "Duas semanas que você entrou na minha vida e transformou tudo para melhor.",
        corpo: "Bom dia, minha namorada linda! 💕\n\nDuas semanas desde aquele 21 de setembro. E hoje, em namoro sério, comemoramos cada momento com a certeza de que fomos feitos um para o outro.\n\nAproveite muito o seu dia, sorria bastante e sinta o meu abraço apertado! ❤️",
        rodape: "💍 Henrique & Gabizinha • Nosso Marco 27/09 💕",
        emoji: "🌹"
    },
    {
        dia: 15,
        diaTitulo: "☀️ DIA 15 — MEU COMPROMISSO COM VOCÊ",
        cabecalho: "💌 BOM DIA, AMOR DA MINHA VIDA! 💖💍",
        frase: "Meu compromisso com você é de lealdade, respeito, carinho e amor verdadeiro todos os dias.",
        corpo: "Chegamos à metade do nosso primeiro mês de cartinhas diárias! E se tem algo que só cresceu desde o nosso pedido de namoro no dia 27/09, foi o meu sentimento por você.\n\n\"Que o seu dia seja repleto de boas notícias e muito amor!\" 🌹",
        rodape: "❤️ Henrique (Seu Namorado)",
        emoji: "☀️"
    },
    {
        dia: 16,
        diaTitulo: "🌙 DIA 16 — SONHO QUE VIROU REALIDADE",
        cabecalho: "💌 BOM DIA, MINHA PRINCESA! ☀️👸",
        frase: "Você era tudo o que eu sempre pedi a Deus, e hoje posso te chamar de minha namorada.",
        corpo: "Sabe aquele primeiro pensamento gostoso que vem ao abrir os olhos pela manhã?\n\nHoje foi o seu rostinho e o seu abraço. 💕\n\n\"Espero que meu carinho chegue até você e te aqueça o dia inteiro.\" Te amo demais, meu amor!",
        rodape: "🌹 Henrique ➔ Minha Namorada Gabizinha",
        emoji: "🌙"
    },
    {
        dia: 17,
        diaTitulo: "🌸 DIA 17 — FLORES PARA VOCÊ",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA A GABIZINHA 🌷💐",
        frase: "Se eu pudesse, cobriria o seu caminho de flores todas as manhãs só para te ver sorrir.",
        corpo: "Bom dia, minha namorada tão querida! 🌹\n\nComo não posso te entregar um buquê pessoalmente agora, deixo essas palavras cheias de afeto sincero:\n\n\"Tenha um dia tão maravilhoso e brilhante quanto o seu coração.\" Você é tudo para mim! ❤️",
        rodape: "💍 Henrique & Gabizinha • Amor Puro & Real 💕",
        emoji: "🌸"
    },
    {
        dia: 18,
        diaTitulo: "💫 DIA 18 — NOSSAS DATAS ESPECIAIS",
        cabecalho: "💌 BOM DIA, GABIZINHA! ☀️💍",
        frase: "21/09 quando nos conhecemos e 27/09 quando nosso namoro sério começou: datas gravadas na alma.",
        corpo: "Existem números comuns e existem datas que mudam o rumo da nossa existência.\n\n**21/09/2026** abriu as portas e **27/09/2026** selou o nosso amor em namoro sério. ❤️\n\nQue hoje seja mais um dia abençoado na nossa caminhada juntos!",
        rodape: "🌹 Henrique ➔ Gabizinha",
        emoji: "💫"
    },
    {
        dia: 19,
        diaTitulo: "💖 DIA 19 — O BRILHO DO SEU OLHAR",
        cabecalho: "💌 CARTINHA DA MANHÃ PARA O MEU AMOR ☀️❤️",
        frase: "Seu olhar tem a doçura e a força que me inspiram a ser o melhor homem para você.",
        corpo: "Gabizinha, nunca deixe ninguém apagar a luz que você carrega dentro de si.\n\n\"Seu sorriso e sua risada combinam perfeitamente com os meus melhores dias.\" 🌹\n\nTenha uma manhã abençoada e um dia vitorioso, minha namorada!",
        rodape: "💘 Com todo o meu amor, Henrique",
        emoji: "💖"
    },
    {
        dia: 20,
        diaTitulo: "🌻 DIA 20 — 20 DIAS DE HISTÓRIA",
        cabecalho: "💌 BOM DIA, MINHA COMPANHEIRA! 💕💍",
        frase: "Vinte dias de mensagens, vinte dias de carinho e a certeza de que esse namoro é para a vida toda.",
        corpo: "Vinte dias, meu amor! E cada amanhecer ao seu lado me dá mais ânimo para sonhar alto com o nosso futuro.\n\n\"Se essa mensagem arrancar um sorriso do seu rosto, meu dia já ganhou sentido.\" ❤️",
        rodape: "🌹 Henrique & Gabizinha • Namorados Oficiais",
        emoji: "🌻"
    },
    {
        dia: 21,
        diaTitulo: "☀️ DIA 21 — RENOVAÇÃO DO MEU AMOR",
        cabecalho: "💌 BOM DIA, MINHA GABIZINHA! 🌅💍",
        frase: "Mais um dia nasce para eu ter o privilégio de te amar e te respeitar como minha namorada.",
        corpo: "Mais uma oportunidade de te desejar o melhor dia da sua vida.\n\nMais uma chance de sorrir sabendo que estamos juntos nessa.\n\nE mais uma certeza de que meu coração é todinho seu! ❤️",
        rodape: "🌹 Henrique ➔ Gabizinha • Para Sempre Juntos",
        emoji: "☀️"
    },
    {
        dia: 22,
        diaTitulo: "✨ DIA 22 — A ESCOLHA CERTA",
        cabecalho: "💌 CARTINHA ESPECIAL DE AMOR 💖💍",
        frase: "Todo dia eu escolho você, e em todos os dias eu escolheria de novo.",
        corpo: "Estar namorando com você de verdade, com planos e lealdade, é a maior conquista dos meus dias.\n\n\"Que venham milhares de outros dias para colecionarmos lembranças apaixonadas.\" 🌹\n\nTenha uma manhã espetacular, meu docinho!",
        rodape: "💍 Henrique & Gabizinha • Namoro Sério 💕",
        emoji: "✨"
    },
    {
        dia: 23,
        diaTitulo: "🌷 DIA 23 — AMOR EM CADA DETALHE",
        cabecalho: "💌 BOM DIA, MEU AMOR! ☀️❤️",
        frase: "O verdadeiro amor se prova nas pequenas atenções e em desejar o bem do outro todo dia.",
        corpo: "Não precisa de palavras rebuscadas para demonstrar o que sinto:\n\n**Bom dia, Gabizinha. Eu amo você, me importo com você e quero te ver bem e feliz hoje e sempre. ❤️**\n\nQue o seu dia seja maravilhoso!",
        rodape: "🌹 Henrique (Seu Namorado)",
        emoji: "🌷"
    },
    {
        dia: 24,
        diaTitulo: "💘 DIA 24 — MEU DESEJO PARA HOJE",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA A MINHA NAMORADA ☀️👸",
        frase: "Desejo que você sorria sem perceber, conquiste o que planejou e sinta orgulho de quem você é.",
        corpo: "Meu desejo para a minha namorada linda hoje?\n\nQue você se sinta confiante, linda e amada em cada momento. 💖\n\n\"Você merece todas as coisas boas desse mundo e muito mais.\" Te amo! 🌹",
        rodape: "👸 Para: Gabizinha • 💘 De: Henrique",
        emoji: "💘"
    },
    {
        dia: 25,
        diaTitulo: "🌅 DIA 25 — JUNTOS EM TUDO",
        cabecalho: "💌 BOM DIA, GABIZINHA! ❤️💍",
        frase: "Em dias bons ou em dias corridos, saiba que o meu ombro e o meu coração são seu refúgio.",
        corpo: "Mais uma manhã começou e eu jamais deixaria de vir aqui te dar aquele bom dia apaixonado.\n\nQue tudo dê certo nos seus planos hoje!\n\n\"E que nunca falte amor e carinho entre nós dois.\" ☀️💍",
        rodape: "🗓️ Namoro Sério 27/09 • Com todo amor, Henrique",
        emoji: "🌅"
    },
    {
        dia: 26,
        diaTitulo: "🌹 DIA 26 — VOCÊ MARCOU MINHA VIDA",
        cabecalho: "💌 CARTINHA PARA A DONA DO MEU CORAÇÃO 💕👑",
        frase: "Existem pessoas que passam, e existe você que chegou para ser o grande amor da minha história.",
        corpo: "Gabizinha, você transformou a minha vida para muito melhor.\n\n\"Você é a namorada que eu sempre sonhei e que eu tenho a honra de amar.\" ❤️\n\nTenha um ótimo e abençoado dia!",
        rodape: "🌹 Do seu namorado apaixonado, Henrique",
        emoji: "🌹"
    },
    {
        dia: 27,
        diaTitulo: "☀️ DIA 27 — O NOSSO DIA DE CADA MÊS",
        cabecalho: "💌 BOM DIA COM MUITO AMOR! 👸💍",
        frase: "Hoje é dia 27: o número que representa o início do nosso namoro sério!",
        corpo: "Cada dia 27 será para sempre um marco no meu calendário: o dia em que você aceitou ser minha namorada!\n\nQue seu dia seja repleto de alegrias, risadas gostosas e muita paz no coração. Te amo infinitamente! ❤️",
        rodape: "💘 Henrique ➔ Gabizinha • Nosso Namoro 27/09",
        emoji: "☀️"
    },
    {
        dia: 28,
        diaTitulo: "🌸 DIA 28 — PEQUENOS MOMENTOS, GRANDES SENTIMENTOS",
        cabecalho: "💌 CARTINHA DE BOM DIA 🌷💍",
        frase: "A vida ganha outro colorido quando divido meus dias com a minha namorada.",
        corpo: "Uma conversa nossa.\nUma risada sua na call.\nUm \"eu te amo\" sincero.\n\n\"São esses pequenos momentos ao seu lado que fazem tudo valer a pena.\" ❤️\n\nTenha um dia lindo, meu amor!",
        rodape: "🌹 Henrique & Gabizinha • Namorados Oficiais",
        emoji: "🌸"
    },
    {
        dia: 29,
        diaTitulo: "💖 DIA 29 — MEU AMOR POR VOCÊ É INFINITO",
        cabecalho: "💌 BOM DIA, MEU ANJO! ☀️💕",
        frase: "Mais um dia para te provar que o meu sentimento por você só sabe crescer.",
        corpo: "Mais uma cartinha matinal para o meu grande amor.\n\nMais uma manhã para te lembrar que você é preciosa demais para mim.\n\n\"Tenha um dia maravilhoso, minha namorada linda!\" ❤️",
        rodape: "Henrique ➔ Gabizinha",
        emoji: "💖"
    },
    {
        dia: 30,
        diaTitulo: "👑 DIA 30 — UM MÊS DE CARTINHAS & UMA VIDA AO SEU LADO",
        cabecalho: "💌 CARTINHA ESPECIAL: MINHA NAMORADA PARA SEMPRE ☀️💍",
        frase: "Foram 30 manhãs de carinho, mas a nossa história de namoro sério é para a vida toda!",
        corpo: "Chegamos à nossa 30ª cartinha diária de bom dia!\n\nForam 30 manhãs, 30 mensagens e 30 declarações do quanto você mudou a minha vida.\n\nFicamos nos conhecendo do dia 21/09 até 26/09, e no dia 27/09/2026 oficializamos nosso namoro sério. E essa foi a melhor escolha que já fiz.\n\n\"Eu quero continuar ao seu lado, cuidando de você, te amando e te fazendo a mulher mais feliz do mundo por todos os dias que virão.\" ❤️💍\n\nTe amo mais que tudo, minha namorada eterna!",
        rodape: "💍 Henrique & Gabizinha • Namoro Sério Para Sempre 💕",
        emoji: "👑"
    }
];

function calcularDiasNamoro(dataInicioStr = CONFIG.dataInicioNamoro) {
    const inicio = new Date(`${dataInicioStr}T00:00:00`);
    const hoje = new Date();
    const diffTime = Math.max(0, hoje.getTime() - inicio.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function calcularDiasConhecendo(dataInicioStr = CONFIG.dataInicioConhecer) {
    const inicio = new Date(`${dataInicioStr}T00:00:00`);
    const hoje = new Date();
    const diffTime = Math.max(0, hoje.getTime() - inicio.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function calcularDiasAmor(dataInicioStr = CONFIG.dataInicioNamoro) {
    return calcularDiasNamoro(dataInicioStr);
}

function gerarEmbedCartinhaBomDia(customDia) {
    const diasNamoro = calcularDiasNamoro();
    const diasConhecendo = calcularDiasConhecendo();

    const targetIndex = customDia !== undefined && customDia > 0
        ? (customDia - 1) % CARTINHAS_30_DIAS.length
        : Math.max(0, (diasNamoro - 1) % CARTINHAS_30_DIAS.length);

    const carta = CARTINHAS_30_DIAS[targetIndex];

    const embed = new EmbedBuilder()
        .setColor("#FF1493") // DeepPink Romântico Vibrante
        .setAuthor({ name: `${carta.diaTitulo} • NAMORO OFICIAL` })
        .setTitle(carta.cabecalho)
        .setDescription(
            `☀️ **Bom dia, minha namorada linda!** <@${CONFIG.gabizinhaUserId}> (${CONFIG.nomeGabizinha}) 💖\n\n` +
            `\`\`\`yaml\n` +
            `💍 STATUS: NAMORO SÉRIO OFICIAL ❤️\n` +
            `🗓️ INÍCIO DO NAMORO: 27/09/2026 (Para Sempre!)\n` +
            `🌹 FICAMOS NOS CONHECENDO: 21/09/2026 a 26/09/2026\n` +
            `⏳ TEMPO JUNTOS: ${diasNamoro}º Dia de Namoro Sério • ${diasConhecendo} Dias de História\n` +
            `💘 CASAL: Henrique ➔ Gabizinha\n` +
            `\`\`\`\n\n` +
            `>>> 💌 *\"${carta.frase}\"*\n\n` +
            `${carta.corpo}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `💍 **Nosso Namoro Sério:** \`27/09/2026\` *(Oficial & Para Sempre)*\n` +
            `🌹 **Nos Conhecendo:** \`21/09/2026\` até ontem \`26/09/2026\`\n` +
            `🤴 **Seu Namorado:** ${CONFIG.nomeHenrique}\n` +
            `👸 **Minha Namorada:** ${CONFIG.nomeGabizinha} (<@${CONFIG.gabizinhaUserId}>)`
        )
        .addFields(
            { name: "💍 Status:", value: "**Namoro Sério Oficial ❤️**", inline: true },
            { name: "🗓️ Nosso Namoro:", value: "`27/09/2026` 💍", inline: true },
            { name: "🌹 Nos Conhecendo:", value: "`21/09 a 26/09` 🌷", inline: true },
            { name: "🤴 Seu Namorado:", value: `**${CONFIG.nomeHenrique}**`, inline: true },
            { name: "👸 Minha Namorada:", value: `**${CONFIG.nomeGabizinha}**`, inline: true },
            { name: "⏳ Tempo de Namoro:", value: `**${diasNamoro}º Dia Oficial** ✨`, inline: true }
        )
        .setFooter({ text: carta.rodape })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("btn_cartinha_namoro")
            .setLabel("💍 Oficialmente Namorados!")
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId("btn_cartinha_amor")
            .setLabel("💖 Te Amo, Minha Namorada!")
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId("btn_cartinha_marco")
            .setLabel("🌹 Conhecer: 21/09 • Namoro: 27/09")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("btn_cartinha_mulher")
            .setLabel("👑 Dona do Meu Coração")
            .setStyle(ButtonStyle.Secondary)
    );

    const mensagemTexto = 
        `✨💍━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💍✨\n` +
        `💖 **${carta.diaTitulo}** 💖\n` +
        `✨💍━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💍✨\n\n` +
        `${carta.cabecalho}\n\n` +
        `☀️ **Bom dia, minha namorada linda!** <@${CONFIG.gabizinhaUserId}> 💕\n\n` +
        `\`\`\`yaml\n` +
        `💍 STATUS: NAMORO SÉRIO OFICIAL ❤️\n` +
        `🗓️ DATA DO INÍCIO DO NAMORO: 27/09/2026\n` +
        `🌹 FICAMOS NOS CONHECENDO: 21/09/2026 a 26/09/2026\n` +
        `⏳ TEMPO JUNTOS: ${diasNamoro}º Dia de Namoro Sério • ${diasConhecendo} Dias de História\n` +
        `💘 CASAL: Henrique ➔ Gabizinha\n` +
        `\`\`\`\n\n` +
        `>>> 💌 *\"${carta.frase}\"*\n\n` +
        `${carta.corpo}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💍 **Nosso Namoro Sério:** \`27/09/2026\` *(Oficial & Para Sempre)*\n` +
        `🌹 **Nos Conhecendo:** \`21/09/2026\` até ontem \`26/09/2026\`\n` +
        `🤴 **Seu Namorado:** ${CONFIG.nomeHenrique}\n` +
        `👸 **Minha Namorada:** ${CONFIG.nomeGabizinha}\n\n` +
        `**${carta.rodape}**`;

    return {
        content: mensagemTexto,
        embeds: [embed],
        components: [row]
    };
}

async function enviarCartinhaDiaria(guild, customDia) {
    if (!guild) return false;
    let canal = guild.channels.cache.get(CONFIG.canalCartinhaId);
    if (!canal) {
        canal = guild.channels.cache.find(c =>
            c.type === ChannelType.GuildText && (
                c.name.toLowerCase().includes("cartinha") ||
                c.name.toLowerCase().includes("amor") ||
                c.name.toLowerCase().includes("gabi")
            )
        );
    }
    if (!canal) {
        canal = guild.channels.cache.find(c =>
            c.type === ChannelType.GuildText &&
            c.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages)
        );
    }

    if (canal) {
        const payload = gerarEmbedCartinhaBomDia(customDia);
        await canal.send(payload);
        console.log(`💌 [CARTINHA] Bom dia enviado com sucesso para Gabizinha no canal #${canal.name}!`);
        return true;
    }
    return false;
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.GuildMember, Partials.User]
});

// Painel Oficial de Registro
function gerarPainelEscolhaCargos() {
    const embed = new EmbedBuilder()
        .setColor(CONFIG.corEmbed)
        .setTitle('╔══════════════════════════════════════════════╗\n║     ⚜️ REGISTRO OFICIAL DE CARGOS ⚜️         ║\n║             FAMÍLIA & AMIGOS                 ║\n╚══════════════════════════════════════════════╝')
        .setDescription(
            '👋 **Seja muito bem-vindo(a) ao servidor Família & Amigos!**\n\n' +
            'Para liberar o acesso aos canais de texto, jogos, bate-papo e salas de voz, escolha a sua categoria:\n\n' +
            '⚜️ **1. FAMÍLIA NABRIZA [FN]**\n' +
            '> Membro oficial da Família Nabriza. Libera canais exclusivos da Família, reuniões e eventos.\n\n' +
            '🤝 **2. AMIGOS DA FAMÍLIA [AMIGO]**\n' +
            '> Amigo, aliado e parceiro para jogar GTA RP, resenhar e curtir as calls abertas.\n\n' +
            '──────────────────────────────────────────\n' +
            '📌 **COMO FUNCIONA O CADASTRO:**\n' +
            '1️⃣ Clique no botão correspondente abaixo (**Família** ou **Amigo**).\n' +
            '2️⃣ Preencha o formulário rápido com seu Nick RP e respostas.\n' +
            '3️⃣ A Staff avaliará sua ficha no canal de aprovação.\n' +
            '4️⃣ Sendo aprovado, seu cargo é entregue na hora e seu nick é atualizado com a tag!\n\n' +
            '👇 *Clique no botão abaixo para iniciar seu cadastro:*'
        )
        .setFooter({ text: 'Família & Amigos • Lealdade, União e Respeito ⚜️' })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('btn_iniciar_familia')
            .setLabel('Entrar na Família [FN]')
            .setEmoji('⚜️')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('btn_iniciar_amigos')
            .setLabel('Entrar como Amigo [AMIGO]')
            .setEmoji('🤝')
            .setStyle(ButtonStyle.Success)
    );

    return { embeds: [embed], components: [row] };
}

// Card Interativo Direto para Membro (!registro ou /registro)
function gerarCardRegistroMembro(user) {
    const embed = new EmbedBuilder()
        .setColor(CONFIG.corEmbed)
        .setTitle('⚜️ REGISTRO OFICIAL • FAMÍLIA & AMIGOS ⚜️')
        .setDescription(
            `Olá ${user ? `<@${user.id}>` : 'Membro'}! Seja muito bem-vindo(a) ao nosso servidor!\n\n` +
            `Para se cadastrar e liberar todos os canais de texto, resenha e salas de voz, escolha a sua categoria:\n\n` +
            `⚜️ **1. FAMÍLIA NABRIZA [FN]**\n` +
            `> Membro oficial da Família Nabriza. Libera canais exclusivos da Família, reuniões e eventos. Recebe tag \`[FN]\` no Nick.\n\n` +
            `🤝 **2. AMIGOS DA FAMÍLIA [AMIGO]**\n` +
            `> Amigo, aliado e parceiro para jogar GTA RP, resenhar e curtir as calls abertas. Recebe tag \`[AMIGO]\` no Nick.\n\n` +
            `──────────────────────────────────────────\n` +
            `👇 *Clique em um dos botões abaixo para preencher sua ficha de cadastro:*`
        )
        .setFooter({ text: 'Família & Amigos • Lealdade, União e Respeito ⚜️' })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('btn_iniciar_familia')
            .setLabel('Entrar na Família [FN]')
            .setEmoji('⚜️')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('btn_iniciar_amigos')
            .setLabel('Entrar como Amigo [AMIGO]')
            .setEmoji('🤝')
            .setStyle(ButtonStyle.Success)
    );

    return { embeds: [embed], components: [row] };
}

// ⚙️ CONFIGURAR CANAIS OFICIAIS DE REGISTRO E STAFF AUTOMATICAMENTE
async function configurarCanaisRegistro(guild) {
    const everyone = guild.roles.everyone;
    const rolesCreated = await configurarCargosOficiais(guild);

    // 1. Canal #escolha-seu-cargo
    let canalRegistro = guild.channels.cache.find(c => 
        c.type === ChannelType.GuildText && (c.name.includes('escolha-seu-cargo') || c.name === 'registro' || c.name.includes('cargos'))
    );

    if (!canalRegistro) {
        canalRegistro = await guild.channels.create({
            name: '📜・escolha-seu-cargo',
            type: ChannelType.GuildText,
            topic: '⚜️ Registro Oficial de Membros: Família Nabriza [FN] ou Amigos [AMIGO].',
            permissionOverwrites: [
                {
                    id: everyone.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                    deny: [PermissionsBitField.Flags.SendMessages]
                }
            ]
        }).catch(() => null);
    }

    if (canalRegistro) {
        const painel = gerarPainelEscolhaCargos();
        const msgPainel = await canalRegistro.send(painel).catch(() => null);
        if (msgPainel) await msgPainel.pin().catch(() => {});
    }

    // 2. Canal de Aprovação da Staff
    let canalStaff = guild.channels.cache.find(c => 
        c.type === ChannelType.GuildText && (c.name.includes('aprovacao') || c.name.includes('fichas-registro') || c.name.includes('fichas'))
    );

    if (!canalStaff) {
        canalStaff = await guild.channels.create({
            name: '🛡️・fichas-aprovacao',
            type: ChannelType.GuildText,
            topic: '📥 Fichas de cadastro aguardando avaliação da Staff.',
            permissionOverwrites: [
                {
                    id: everyone.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        }).catch(() => null);
    }

    return {
        canalRegistro: canalRegistro ? canalRegistro.name : 'escolha-seu-cargo',
        canalRegistroId: canalRegistro ? canalRegistro.id : null,
        canalStaff: canalStaff ? canalStaff.name : 'fichas-aprovacao',
        canalStaffId: canalStaff ? canalStaff.id : null,
        roles: rolesCreated
    };
}

// Painel de Regras
function gerarEmbedRegras() {
    return new EmbedBuilder()
        .setColor(CONFIG.corEmbed)
        .setTitle('📜 REGRAS DO SERVIDOR • FAMÍLIA & AMIGOS')
        .setDescription(
            'Para mantermos nosso servidor agradável, unido e divertido para todos, respeite as seguintes regras:\n\n' +
            '1️⃣ **Respeito Mútuo:** Trate todos os membros com educação. Ofensas pesadas, discriminação e toxicidade são estritamente proibidas.\n\n' +
            '2️⃣ **Uso Correto dos Canais:** Utilize cada canal para sua devida finalidade: bate-papo para conversas normais, jogos para resenhas gamers.\n\n' +
            '3️⃣ **Microfone nas Calls:** Evite gritos excessivos, áudios estourados ou sons desagradáveis durante as conversas.\n\n' +
            '4️⃣ **Spam e Divulgação:** Proibido divulgar links não autorizados, servidores externos ou fazer spam nos chats.\n\n' +
            '5️⃣ **Bom Senso:** Divirta-se e ajude a fortalecer a união entre a Família Nabriza e todos os nossos amigos!\n\n' +
            '💡 *Dúvidas ou problemas? Procure a Chefia ou um membro da Staff.*'
        )
        .setFooter({ text: 'Família & Amigos • Convivência em Harmonia ⚜️' })
        .setTimestamp();
}

// 🔒 CRIAR SALA PRIVADA DOS CHEFES (SEM APAGAR NENHUM OUTRO CANAL!)
async function configurarSalaPrivadaChefes(guild) {
    console.log(`[SALA CHEFES] Configurando sala privada dos chefes no servidor "${guild.name}"...`);

    const everyone = guild.roles.everyone;

    // 1. Localiza ou cria o cargo "👑 Chefe"
    let roleChefe = guild.roles.cache.find(r => r.name.includes('Chefe') || r.name.includes('Diretoria'));
    if (!roleChefe) {
        roleChefe = await guild.roles.create({
            name: '👑 Chefe',
            color: '#FFD700',
            hoist: true,
            permissions: [PermissionsBitField.Flags.Administrator],
            reason: 'Cargo para a liderança e acesso à Sala Privada dos Chefes'
        }).catch(() => null);
    }

    if (roleChefe) {
        CONFIG.cargoChefeId = roleChefe.id;
        // Atribui ao dono do servidor caso não tenha
        try {
            const owner = await guild.fetchOwner();
            if (owner && !owner.roles.cache.has(roleChefe.id)) {
                await owner.roles.add(roleChefe);
            }
        } catch (_) {}
    }

    // 2. Permissões estritas: invisível para everyone, visível apenas para Chefes
    const overwritesChefes = [
        { id: everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] }
    ];

    if (roleChefe) {
        overwritesChefes.push({
            id: roleChefe.id,
            allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.Connect,
                PermissionsBitField.Flags.Speak
            ]
        });
    }

    // 3. Procura se a categoria já existe para não duplicar
    let catChefes = guild.channels.cache.find(c => 
        c.type === ChannelType.GuildCategory && (c.name.includes('CHEFIA') || c.name.includes('DIRETORIA'))
    );

    if (!catChefes) {
        catChefes = await guild.channels.create({
            name: '👑・CHEFIA & DIRETORIA (PV)',
            type: ChannelType.GuildCategory,
            permissionOverwrites: overwritesChefes
        });
    } else {
        await catChefes.permissionOverwrites.set(overwritesChefes).catch(() => {});
    }

    // 4. Cria ou localiza o canal de texto privado dos chefes
    let canalTextoChefe = guild.channels.cache.find(c => 
        c.type === ChannelType.GuildText && c.parentId === catChefes.id && c.name.includes('chat-dos-chefes')
    );

    if (!canalTextoChefe) {
        canalTextoChefe = await guild.channels.create({
            name: '🔒・chat-dos-chefes',
            type: ChannelType.GuildText,
            parent: catChefes.id,
            permissionOverwrites: overwritesChefes,
            topic: '🔒 Sala Privada dos Chefes e Donos da Família & Amigos.'
        });

        const embedPv = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('👑 SALA PRIVADA DOS CHEFES • CONFIDENCIAL')
            .setDescription(
                '👋 **Bem-vindos à Sala Privada dos Chefes!**\n\n' +
                '🔒 **Esta sala é 100% blindada e invisível para visitantes e amigos.**\n' +
                'Apenas quem possui o cargo **👑 Chefe** tem acesso a este canal.\n\n' +
                '⚜️ *Decisões estratégicas, alianças e assuntos da liderança acontecem aqui.*\n' +
                '🛡️ *Nenhum outro canal foi apagado do seu servidor.*'
            )
            .setTimestamp();

        await canalTextoChefe.send({ embeds: [embedPv] }).catch(() => {});
    }

    // 5. Cria ou localiza o canal de voz privado
    let canalVozChefe = guild.channels.cache.find(c => 
        c.type === ChannelType.GuildVoice && c.parentId === catChefes.id && c.name.includes('Chefes')
    );

    if (!canalVozChefe) {
        canalVozChefe = await guild.channels.create({
            name: '🔒・Voz dos Chefes (PV)',
            type: ChannelType.GuildVoice,
            parent: catChefes.id,
            permissionOverwrites: overwritesChefes
        });
    }

    console.log(`✅ [SALA CHEFES] Sala PV dos Chefes criada com sucesso no servidor!`);
    return {
        categoria: catChefes.name,
        chatTexto: canalTextoChefe.name,
        chatVoz: canalVozChefe.name,
        cargoChefe: roleChefe ? roleChefe.name : null
    };
}

// 🛡️ GARANTIR CARGOS DO SERVIDOR (SEM APAGAR NENHUM)
async function configurarCargosOficiais(guild) {
    const rolesCreated = [];

    // Chefe
    let roleChefe = guild.roles.cache.find(r => r.name.includes('Chefe'));
    if (!roleChefe) {
        roleChefe = await guild.roles.create({
            name: '👑 Chefe',
            color: '#FFD700',
            hoist: true,
            permissions: [PermissionsBitField.Flags.Administrator]
        }).catch(() => null);
        if (roleChefe) rolesCreated.push('👑 Chefe');
    }

    // Família
    let roleFamilia = guild.roles.cache.get(CONFIG.cargoFamiliaId) || guild.roles.cache.find(r => r.name.includes('Família') || r.name.includes('Familia'));
    if (!roleFamilia) {
        roleFamilia = await guild.roles.create({
            name: '⚜️ Família',
            color: '#D4AF37',
            hoist: true
        }).catch(() => null);
        if (roleFamilia) rolesCreated.push('⚜️ Família');
    }

    // Amigos
    let roleAmigos = guild.roles.cache.get(CONFIG.cargoAmigosId) || guild.roles.cache.find(r => r.name.includes('Amigo'));
    if (!roleAmigos) {
        roleAmigos = await guild.roles.create({
            name: '🤝 Amigos',
            color: '#2ECC71',
            hoist: true
        }).catch(() => null);
        if (roleAmigos) rolesCreated.push('🤝 Amigos');
    }

    // Não Registrado
    let roleNaoReg = guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) || guild.roles.cache.find(r => r.name.includes('Não Registrado'));
    if (!roleNaoReg) {
        roleNaoReg = await guild.roles.create({
            name: '❌ Não Registrado',
            color: '#95A5A6',
            hoist: false
        }).catch(() => null);
        if (roleNaoReg) rolesCreated.push('❌ Não Registrado');
    }

    return rolesCreated;
}

// ============================================================================
// 🤖 EVENTOS DO DISCORD BOT
// ============================================================================

client.once(Events.ClientReady, async (c) => {
    console.log(`====================================================`);
    console.log(`🟢 [BOT ONLINE & FUNCIONAL] Conectado como: ${c.user.tag}`);
    console.log(`⚜️ Servidor Alvo: Família & Amigos`);
    console.log(`🛡️ Modo Seguro: Exclusão de canais DESATIVADA`);
    console.log(`📋 Servidores Conectados: ${c.guilds.cache.size}`);
    console.log(`Comandos de Registro: !registro, !painel, !setupregistro, !registrar, !statusregistro`);
    console.log(`Comandos de Cartinha: !cartinha, !statuscartinha (Envio diário às 06:20)`);
    console.log(`====================================================`);

    c.user.setPresence({
        activities: [{ name: "⚜️ Família & Amigos | !registro | !ajuda", type: 3 }],
        status: "online"
    });

    // Registra Slash Commands de forma segura e assíncrona (não trava a inicialização)
    const slashCommands = [
        {
            name: 'registro',
            description: '⚜️ Abra seu formulário de registro para entrar na Família Nabriza [FN] ou Amigos [AMIGO].'
        },
        {
            name: 'painel',
            description: '⚜️ (Staff) Envia o Painel Oficial de Registro com botões no canal atual.'
        },
        {
            name: 'setupregistro',
            description: '⚙️ (Staff) Cria e configura os canais #escolha-seu-cargo e #fichas-aprovacao.'
        },
        {
            name: 'statusregistro',
            description: '📊 Mostra as estatísticas de membros registrados no servidor.'
        },
        {
            name: 'fichas',
            description: '📋 (Staff) Lista fichas de registro pendentes de avaliação.'
        },
        {
            name: 'cartinha',
            description: '💌 Envia a cartinha romântica de bom dia para a Gabizinha no canal #cartinha.'
        },
        {
            name: 'namoro',
            description: '💍 Exibe o status oficial de namoro sério de Henrique & Gabizinha!'
        },
        {
            name: 'statuscartinha',
            description: '🗓️ Mostra status do namoro sério (27/09/2026) e período em que se conheceram (21/09 a 26/09).'
        },
        {
            name: 'regras',
            description: '📜 Envia as regras oficiais de convivência do servidor.'
        }
    ];

    setTimeout(async () => {
        try {
            if (c.application) {
                await c.application.commands.set(slashCommands).catch(err => {
                    console.log('ℹ️ Registro global de slash commands:', err.message);
                });
            }
            for (const guild of c.guilds.cache.values()) {
                await guild.commands.set(slashCommands).catch(err => {
                    console.log(`ℹ️ Slash commands no servidor "${guild.name}":`, err.message);
                });
            }
        } catch (err) {
            console.error('Aviso ao registrar slash commands:', err.message);
        }
    }, 2500);
});

// 👤 Evento: Novo Membro Entra no Servidor (Auto-Role de Não Registrado & Boas-Vindas com Botões)
client.on(Events.GuildMemberAdd, async (member) => {
    try {
        console.log(`[NOVO MEMBRO] ${member.user.tag} (${member.id}) entrou no servidor.`);

        // 1. Atribui automaticamente o cargo "❌ Não Registrado"
        let roleNaoReg = member.guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) ||
                         member.guild.roles.cache.find(r => r.name.includes('Não Registrado'));
        if (roleNaoReg) {
            await member.roles.add(roleNaoReg).catch(err => console.error('Erro ao entregar cargo de Não Registrado:', err.message));
        }

        // 2. Notifica no canal de avisos / boas-vindas com BOTÕES DIRETOS DE REGISTRO
        const canalAvisos = member.guild.channels.cache.find(c =>
            c.type === ChannelType.GuildText && (
                c.name.includes('avisos') || c.name.includes('geral') || c.name.includes('boas-vindas') || c.name.includes('chat')
            )
        );

        if (canalAvisos) {
            const canalPainel = member.guild.channels.cache.find(c =>
                c.type === ChannelType.GuildText && (c.name.includes('cargo') || c.name.includes('registro'))
            );

            const embedWelcome = new EmbedBuilder()
                .setColor(CONFIG.corEmbed)
                .setTitle(`👋 BEM-VINDO(A) À FAMÍLIA & AMIGOS! ⚜️`)
                .setDescription(
                    `Olá <@${member.id}>! Seja muito bem-vindo(a) ao nosso servidor!\n\n` +
                    `📌 **SISTEMA DE REGISTRO OFICIAL:**\n` +
                    `1️⃣ Você recebeu o cargo inicial **❌ Não Registrado**.\n` +
                    `2️⃣ Escolha sua categoria abaixo ou acesse ${canalPainel ? `<#${canalPainel.id}>` : '`#escolha-seu-cargo`'}:\n` +
                    `   • ⚜️ **Família Nabriza [FN]** (Membros oficiais com canais exclusivos)\n` +
                    `   • 🤝 **Amigos da Família [AMIGO]** (GTA RP, resenha e calls abertas)\n` +
                    `3️⃣ Clique em um dos botões abaixo para preencher sua ficha na hora!`
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setFooter({ text: 'Família & Amigos • Lealdade, União e Respeito ⚜️' })
                .setTimestamp();

            const rowWelcome = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('btn_iniciar_familia')
                    .setLabel('Entrar na Família [FN]')
                    .setEmoji('⚜️')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('btn_iniciar_amigos')
                    .setLabel('Entrar como Amigo [AMIGO]')
                    .setEmoji('🤝')
                    .setStyle(ButtonStyle.Success)
            );

            await canalAvisos.send({ content: `🎉 Olá <@${member.id}>!`, embeds: [embedWelcome], components: [rowWelcome] }).catch(() => {});
        }
    } catch (err) {
        console.error('Erro no guildMemberAdd:', err.message);
    }
});

// Comandos de Texto (Prefixados)
client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot || !msg.guild) return;
    const content = msg.content.trim().toLowerCase();

    // 1. Comando de Registro para o Membro (Qualquer um pode usar para se cadastrar!)
    if (content === '!registro' || content === '!cadastrar' || content === '!candidatar') {
        const payload = gerarCardRegistroMembro(msg.author);
        await msg.reply(payload).catch(() => {});
        return;
    }

    // 1.1 Painel Oficial de Registro (Staff)
    if (content === '!painel' || content === '!cargos' || content === '!painelregistro') {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
                      msg.member.permissions.has(PermissionsBitField.Flags.Administrator);

        if (!perms) {
            // Se for membro normal, oferece o card para ele se registrar!
            return msg.reply(gerarCardRegistroMembro(msg.author));
        }

        await msg.channel.send(gerarPainelEscolhaCargos()).catch(() => {});
        return;
    }

    // 1.2 Configurar Canais Oficiais de Registro Automaticamente (Staff)
    if (content === '!setupregistro' || content === '!criarregistro') {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageChannels) ||
                      msg.member.permissions.has(PermissionsBitField.Flags.Administrator);

        if (!perms) {
            return msg.reply('❌ Apenas a Staff pode configurar os canais oficiais de registro.');
        }

        const waitMsg = await msg.reply('⏳ **Configurando canais oficiais de registro (#escolha-seu-cargo e #fichas-aprovacao)...**');
        const res = await configurarCanaisRegistro(msg.guild);

        const embedSetup = new EmbedBuilder()
            .setColor(CONFIG.corEmbed)
            .setTitle('⚜️ CANAIS DE REGISTRO CONFIGURADOS COM SUCESSO!')
            .setDescription(
                `✅ **O sistema oficial de registro está pronto e ativo!**\n\n` +
                `📜 **Canal de Registro:** ${res.canalRegistroId ? `<#${res.canalRegistroId}>` : '`#escolha-seu-cargo`'}\n` +
                `🛡️ **Canal de Fichas (Staff):** ${res.canalStaffId ? `<#${res.canalStaffId}>` : '`#fichas-aprovacao`'}\n\n` +
                `📌 **Fluxo Ativado:**\n` +
                `1. Novos membros recebem **❌ Não Registrado** ao entrar.\n` +
                `2. Escolhem o cargo no painel com botões interativos dourados.\n` +
                `3. A ficha chega no canal da Staff com botões para aprovar ou reprovar na hora!`
            )
            .setFooter({ text: 'Família & Amigos • Sistema de Registro ⚜️' })
            .setTimestamp();

        await waitMsg.edit({ content: null, embeds: [embedSetup] }).catch(() => {});
        return;
    }

    // 1.3 Registrar Membro Diretamente pela Staff
    // Exemplo: !registrar @membro familia Henrique Nabriza
    if (content.startsWith('!registrar')) {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
                      msg.member.permissions.has(PermissionsBitField.Flags.Administrator);

        if (!perms) {
            return msg.reply('❌ Apenas membros da Staff podem registrar membros diretamente.');
        }

        const args = msg.content.trim().split(/ +/);
        const targetMember = msg.mentions.members?.first();

        if (!targetMember || args.length < 3) {
            return msg.reply(
                '⚠️ **Formato correto:** `!registrar @Membro <familia|amigo> [Nick RP]`\n' +
                'Exemplo: `!registrar @Lucas familia Lucas Nabriza`'
            );
        }

        const tipo = args[2].toLowerCase().includes('fam') ? 'familia' : 'amigos';
        const isFam = tipo === 'familia';
        const rawNick = args.slice(3).join(' ') || targetMember.user.username;
        const novoNick = isFam ? `[FN] ${rawNick}` : `[AMIGO] ${rawNick}`;

        // 1. Cargo
        const roleId = isFam ? CONFIG.cargoFamiliaId : CONFIG.cargoAmigosId;
        const role = msg.guild.roles.cache.get(roleId) ||
                     msg.guild.roles.cache.find(r => r.name.toLowerCase().includes(tipo));

        if (role) {
            await targetMember.roles.add(role).catch(err => console.error('Erro ao dar cargo:', err.message));
        }

        // 2. Remover Não Registrado
        if (CONFIG.cargoNaoRegistradoId) {
            const roleNaoReg = msg.guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) ||
                               msg.guild.roles.cache.find(r => r.name.includes('Não Registrado'));
            if (roleNaoReg) await targetMember.roles.remove(roleNaoReg).catch(() => {});
        }

        // 3. Nickname
        try {
            if (msg.guild.members.me?.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
                await targetMember.setNickname(novoNick.substring(0, 32)).catch(() => {});
            }
        } catch (_) {}

        const embedRegSucesso = new EmbedBuilder()
            .setColor(isFam ? CONFIG.corEmbed : '#2ECC71')
            .setTitle(`✅ REGISTRO CONCLUÍDO • ${isFam ? '⚜️ FAMÍLIA NABRIZA [FN]' : '🤝 AMIGOS [AMIGO]'}`)
            .setDescription(
                `O membro <@${targetMember.id}> foi registrado com sucesso!\n\n` +
                `👤 **Membro:** <@${targetMember.id}>\n` +
                `🏷️ **Cargo Entregue:** **${isFam ? '⚜️ Família Nabriza' : '🤝 Amigos da Família'}**\n` +
                `📝 **Apelido Formatado:** \`${novoNick}\`\n` +
                `👮 **Registrado por:** <@${msg.author.id}>\n\n` +
                `*Todos os canais da categoria foram liberados!*`
            )
            .setThumbnail(targetMember.user.displayAvatarURL())
            .setFooter({ text: 'Família & Amigos • Registro de Cargos ⚜️' })
            .setTimestamp();

        return msg.reply({ embeds: [embedRegSucesso] });
    }

    // 1.4 Desregistrar Membro
    if (content.startsWith('!desregistrar')) {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
                      msg.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!perms) return msg.reply('❌ Apenas a Staff pode desregistrar membros.');

        const targetMember = msg.mentions.members?.first();
        if (!targetMember) return msg.reply('⚠️ Mencione o membro: `!desregistrar @Membro`');

        // Remove cargos
        const roleFam = msg.guild.roles.cache.get(CONFIG.cargoFamiliaId) || msg.guild.roles.cache.find(r => r.name.includes('Família'));
        const roleAmg = msg.guild.roles.cache.get(CONFIG.cargoAmigosId) || msg.guild.roles.cache.find(r => r.name.includes('Amigo'));
        if (roleFam) await targetMember.roles.remove(roleFam).catch(() => {});
        if (roleAmg) await targetMember.roles.remove(roleAmg).catch(() => {});

        // Atribui Não Registrado
        const roleNaoReg = msg.guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) || msg.guild.roles.cache.find(r => r.name.includes('Não Registrado'));
        if (roleNaoReg) await targetMember.roles.add(roleNaoReg).catch(() => {});

        return msg.reply(`✅ O membro <@${targetMember.id}> foi desregistrado e recebeu novamente o cargo **Não Registrado**.`);
    }

    // 1.5 Status do Registro
    if (content === '!statusregistro') {
        const roleFam = msg.guild.roles.cache.get(CONFIG.cargoFamiliaId) || msg.guild.roles.cache.find(r => r.name.includes('Família'));
        const roleAmg = msg.guild.roles.cache.get(CONFIG.cargoAmigosId) || msg.guild.roles.cache.find(r => r.name.includes('Amigo'));
        const roleNaoReg = msg.guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) || msg.guild.roles.cache.find(r => r.name.includes('Não Registrado'));

        const countFam = roleFam ? roleFam.members.size : 0;
        const countAmg = roleAmg ? roleAmg.members.size : 0;
        const countNaoReg = roleNaoReg ? roleNaoReg.members.size : 0;
        const total = msg.guild.memberCount;

        const embedStats = new EmbedBuilder()
            .setColor(CONFIG.corEmbed)
            .setTitle('📊 ESTATÍSTICAS DE REGISTRO • FAMÍLIA & AMIGOS')
            .setDescription(
                `👥 **Total de Membros no Servidor:** ${total}\n\n` +
                `⚜️ **Família Nabriza [FN]:** ${countFam} membros\n` +
                `🤝 **Amigos da Família [AMIGO]:** ${countAmg} membros\n` +
                `❌ **Não Registrados:** ${countNaoReg} membros\n` +
                `✅ **Taxa de Membros Registrados:** ${total > 0 ? Math.round(((countFam + countAmg) / total) * 100) : 0}%\n\n` +
                `💡 *Use \`!registro\` para abrir seu formulário ou \`!registrar @Membro <familia|amigo> [Nick]\` para cadastrar direto.*`
            )
            .setFooter({ text: 'Família & Amigos • Registro de Cargos ⚜️' })
            .setTimestamp();

        return msg.reply({ embeds: [embedStats] });
    }

    // 2. Regras Oficiais
    if (content === '!regras') {
        await msg.channel.send({ embeds: [gerarEmbedRegras()] }).catch(() => {});
        return;
    }

    // 3. Sala Privada dos Chefes (Segura, sem apagar nenhum canal!)
    if (content === '!salachefes' || content === '!criarsalachefes') {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
                      msg.guild.ownerId === msg.author.id;

        if (!perms) {
            return msg.reply('❌ Apenas o Dono ou Administrador pode configurar a Sala Privada dos Chefes.');
        }

        const waitMsg = await msg.reply('⏳ **Configurando Sala Privada dos Chefes com segurança (sem alterar nenhum outro canal)...**');
        const resultado = await configurarSalaPrivadaChefes(msg.guild);

        const embedOk = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('👑 SALA PRIVADA DOS CHEFES CONFIGURADA!')
            .setDescription(
                `✅ **A Sala PV dos Chefes foi criada/atualizada com sucesso!**\n\n` +
                `📁 **Categoria:** \`${resultado.categoria}\`\n` +
                `💬 **Chat de Texto:** \`${resultado.chatTexto}\`\n` +
                `🔊 **Canal de Voz:** \`${resultado.chatVoz}\`\n` +
                `🏷️ **Cargo com Acesso:** \`${resultado.cargoChefe || '👑 Chefe'}\`\n\n` +
                `🛡️ *Todos os seus outros canais e cargos permaneceram intactos!*`
            );

        await waitMsg.edit({ content: null, embeds: [embedOk] }).catch(() => {});
        return;
    }

    // 4. Configurar Cargos Oficiais
    if (content === '!setupcargos' || content === '!configurarcargos') {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
                      msg.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!perms) return msg.reply('❌ Você precisa da permissão de Gerenciar Cargos!');

        const criados = await configurarCargosOficiais(msg.guild);
        return msg.reply(`✅ Cargos verificados com sucesso! Novos criados: ${criados.length > 0 ? criados.join(', ') : 'Todos já existiam no servidor.'}`);
    }

    // 5. Status do Bot
    if (content === '!status' || content === '!botinfo') {
        const embedStatus = new EmbedBuilder()
            .setColor(CONFIG.corEmbed)
            .setTitle('📊 STATUS DO BOT • FAMÍLIA & AMIGOS')
            .setDescription(
                `🟢 **Status:** Online e Operacional\n` +
                `🏰 **Servidor:** ${msg.guild.name}\n` +
                `👥 **Total de Membros:** ${msg.guild.memberCount}\n` +
                `📶 **Ping da API:** ${client.ws.ping}ms\n` +
                `🏷️ **Cargo Família:** <@&${CONFIG.cargoFamiliaId}>\n` +
                `🤝 **Cargo Amigos:** <@&${CONFIG.cargoAmigosId}>\n` +
                `🛡️ **Proteção:** Modo seguro ativo. Canais protegidos contra exclusão.`
            )
            .setFooter({ text: 'Família & Amigos ⚜️' });
        return msg.reply({ embeds: [embedStatus] });
    }

    // 6. Ajuda
    if (content === '!ajuda' || content === '!help') {
        const embedAjuda = new EmbedBuilder()
            .setColor(CONFIG.corEmbed)
            .setTitle('📖 GUIA DE COMANDOS • BOT FAMÍLIA & AMIGOS')
            .setDescription(
                '**⚜️ REGISTRO & PAINÉIS:**\n' +
                '• `!painel` ou `!cargos` - Envia o painel de registro oficial dourado com botões.\n' +
                '• `!regras` - Envia as regras oficiais de convivência do servidor.\n' +
                '• `!salachefes` - Cria a Sala Privada dos Chefes (categoria e chats blindados, sem apagar nada!).\n' +
                '• `!setupcargos` - Cria os cargos oficiais (👑 Chefe, ⚜️ Família, 🤝 Amigos) caso não existam.\n\n' +
                '**💌 CARTINHA DE BOM DIA (HENRIQUE & GABIZINHA • NAMORO SÉRIO):**\n' +
                '• `!cartinha` ou `!bomdia` ou `!amor` ou `!namoro` - Envia a cartinha romântica de bom dia para a Gabizinha no canal #cartinha!\n' +
                '• `!namoro` ou `!statusnamoro` ou `!statuscartinha` - Exibe os dias de namoro sério (desde 27/09/2026) e história (desde 21/09/2026).\n\n' +
                '**🛡️ MODERAÇÃO & SISTEMA:**\n' +
                '• `!limpar <1-100>` - Apaga de 1 a 100 mensagens recentes do canal (Staff).\n' +
                '• `!status` - Exibe dados de conexão, latência e estatísticas do servidor.\n' +
                '• `!ajuda` - Exibe este guia de suporte.'
            )
            .setFooter({ text: 'Bot 100% Funcional e Seguro ⚜️' });
        return msg.reply({ embeds: [embedAjuda] });
    }

    // 💌 Comandos da Cartinha de Amor (Henrique & Gabizinha • Namorados Oficiais)
    if (
        content === '!cartinha' ||
        content === '!bomdia' ||
        content === '!amor' ||
        content === '!namoro' ||
        content === '!namorados' ||
        content === '!cartinhagabi' ||
        content === '!gabizinha'
    ) {
        const payload = gerarEmbedCartinhaBomDia();
        await msg.channel.send(payload).catch(() => {});
        return;
    }

    // 💍 Status Oficial do Relacionamento / Namoro Sério
    if (content === '!statuscartinha' || content === '!statusnamoro' || content === '!relacionamento') {
        const diasNamoro = calcularDiasNamoro();
        const diasConhecendo = calcularDiasConhecendo();
        const embedCartinhaStatus = new EmbedBuilder()
            .setColor("#FF1493")
            .setTitle("💍 STATUS OFICIAL: NAMORO SÉRIO • HENRIQUE & GABIZINHA")
            .setDescription(
                `\`\`\`yaml\n` +
                `💍 RELACIONAMENTO: NAMORO SÉRIO OFICIAL ❤️\n` +
                `🗓️ INÍCIO DO NAMORO: 27/09/2026 (Para Sempre!)\n` +
                `🌹 FICAMOS NOS CONHECENDO: 21/09/2026 a 26/09/2026\n` +
                `⏳ DIAS DE NAMORO: ${diasNamoro}º Dia Oficial\n` +
                `✨ DIAS DE HISTÓRIA: ${diasConhecendo} Dias Juntos\n` +
                `\`\`\`\n\n` +
                `👸 **Minha Namorada:** <@${CONFIG.gabizinhaUserId}> (${CONFIG.nomeGabizinha})\n` +
                `🤴 **Seu Namorado:** **${CONFIG.nomeHenrique}**\n` +
                `📍 **Canal Alvo:** <#${CONFIG.canalCartinhaId}> (\`${CONFIG.canalCartinhaId}\`)\n` +
                `⏰ **Envio Automático Matinal:** Diariamente às **${String(CONFIG.horaEnvioCartinha).padStart(2, '0')}:${String(CONFIG.minutoEnvioCartinha).padStart(2, '0')}** (Horário de Brasília)\n\n` +
                `> *"Ficamos nos conhecendo do dia 21/09 até 26/09 e hoje, 27/09/2026, é o início do nosso Namoro Sério Oficial!"* 🌹💍`
            )
            .setFooter({ text: "Henrique & Gabizinha • Namoro Sério, Leal e Eterno 💕" })
            .setTimestamp();
        return msg.reply({ embeds: [embedCartinhaStatus] });
    }

    // 7. Limpar mensagens (Purge seguro)
    if (content.startsWith('!limpar')) {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages) ||
                      msg.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!perms) return msg.reply('❌ Você precisa da permissão de Gerenciar Mensagens!');

        const args = content.split(' ');
        const amount = parseInt(args[1], 10);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return msg.reply('⚠️ Informe uma quantidade entre 1 e 100. Exemplo: `!limpar 10`');
        }

        if (msg.channel.type === ChannelType.GuildText) {
            await msg.delete().catch(() => {});
            const deleted = await msg.channel.bulkDelete(amount, true).catch(() => null);
            const reply = await msg.channel.send(`🧹 **${deleted ? deleted.size : amount}** mensagens limpas com sucesso!`);
            setTimeout(() => reply.delete().catch(() => {}), 4000);
        }
        return;
    }

    // 8. Aviso se alguém tentar comandos antigos de recriar
    if (content === '!recriar' || content === '!resetar' || content === '!recriar --confirmar') {
        return msg.reply(
            '🛡️ **Aviso de Proteção:** A função de apagar e recriar canais foi permanentemente removida!\n' +
            'O bot agora é 100% seguro para uso diário. Se deseja configurar a Sala Privada dos Chefes sem apagar nada, digite **`!salachefes`**!'
        );
    }
});

// Interações (Modais e Botões de Aprovação)
client.on(Events.InteractionCreate, async (interaction) => {
    try {
        // 0. Slash Commands (Comandos com Barra /)
        if (interaction.isChatInputCommand()) {
            const { commandName } = interaction;

            if (commandName === 'registro') {
                return interaction.reply({ ...gerarCardRegistroMembro(interaction.user), ephemeral: true });
            }

            if (commandName === 'painel') {
                const perms = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) ||
                              interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);
                if (!perms) {
                    return interaction.reply({ content: '❌ Apenas a Staff pode enviar o painel oficial de cargos.', ephemeral: true });
                }
                await interaction.channel?.send(gerarPainelEscolhaCargos());
                return interaction.reply({ content: '✅ Painel Oficial de Registro enviado no canal!', ephemeral: true });
            }

            if (commandName === 'setupregistro') {
                const perms = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels) ||
                              interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);
                if (!perms) {
                    return interaction.reply({ content: '❌ Apenas a Staff pode configurar canais de registro.', ephemeral: true });
                }
                await interaction.deferReply({ ephemeral: true });
                const res = await configurarCanaisRegistro(interaction.guild);
                return interaction.editReply({
                    content: `✅ **Canais de registro configurados!**\n📜 Registro: ${res.canalRegistroId ? `<#${res.canalRegistroId}>` : '`#escolha-seu-cargo`'}\n🛡️ Staff: ${res.canalStaffId ? `<#${res.canalStaffId}>` : '`#fichas-aprovacao`'}`
                });
            }

            if (commandName === 'statusregistro') {
                const roleFam = interaction.guild?.roles.cache.get(CONFIG.cargoFamiliaId) || interaction.guild?.roles.cache.find(r => r.name.includes('Família'));
                const roleAmg = interaction.guild?.roles.cache.get(CONFIG.cargoAmigosId) || interaction.guild?.roles.cache.find(r => r.name.includes('Amigo'));
                const roleNaoReg = interaction.guild?.roles.cache.get(CONFIG.cargoNaoRegistradoId) || interaction.guild?.roles.cache.find(r => r.name.includes('Não Registrado'));

                const countFam = roleFam ? roleFam.members.size : 0;
                const countAmg = roleAmg ? roleAmg.members.size : 0;
                const countNaoReg = roleNaoReg ? roleNaoReg.members.size : 0;
                const total = interaction.guild?.memberCount || 0;

                const embedStats = new EmbedBuilder()
                    .setColor(CONFIG.corEmbed)
                    .setTitle('📊 ESTATÍSTICAS DE REGISTRO • FAMÍLIA & AMIGOS')
                    .setDescription(
                        `👥 **Total de Membros:** ${total}\n\n` +
                        `⚜️ **Família Nabriza [FN]:** ${countFam}\n` +
                        `🤝 **Amigos [AMIGO]:** ${countAmg}\n` +
                        `❌ **Não Registrados:** ${countNaoReg}`
                    )
                    .setFooter({ text: 'Família & Amigos ⚜️' });
                return interaction.reply({ embeds: [embedStats], ephemeral: true });
            }

            if (commandName === 'cartinha') {
                const payload = gerarEmbedCartinhaBomDia();
                return interaction.reply(payload);
            }

            if (commandName === 'statuscartinha' || commandName === 'namoro') {
                const diasNamoro = calcularDiasNamoro();
                const diasConhecendo = calcularDiasConhecendo();
                return interaction.reply({
                    content: `💍 **Status Oficial: Namoro Sério (Henrique & Gabizinha)**\n` +
                        `• **Início do Namoro Sério:** 27/09/2026 (Hoje! ${diasNamoro}º dia oficial ❤️)\n` +
                        `• **Nos Conhecendo:** 21/09/2026 até ontem 26/09/2026 (${diasConhecendo} dias de história 🌹)\n` +
                        `• **Canal:** <#${CONFIG.canalCartinhaId}> (Envio diário às 06:20 AM)`,
                    ephemeral: true
                });
            }

            if (commandName === 'regras') {
                return interaction.reply({ embeds: [gerarEmbedRegras()] });
            }
        }

        // Botão: Iniciar Família
        if (interaction.isButton() && interaction.customId === 'btn_iniciar_familia') {
            const modal = new ModalBuilder()
                .setCustomId('modal_familia')
                .setTitle('Ficha: Família Nabriza [FN]');

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('nome').setLabel('Seu Nome / Nick RP:').setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('idade').setLabel('Sua Idade:').setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('p1').setLabel('Quem te convidou para a Família?').setStyle(TextInputStyle.Paragraph).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('p2').setLabel('Concorda em honrar a tag [FN]?').setStyle(TextInputStyle.Paragraph).setRequired(true)
                )
            );
            return await interaction.showModal(modal);
        }

        // Botão: Iniciar Amigos
        if (interaction.isButton() && interaction.customId === 'btn_iniciar_amigos') {
            const modal = new ModalBuilder()
                .setCustomId('modal_amigos')
                .setTitle('Ficha: Amigos da Família [AMIGO]');

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('nome').setLabel('Seu Nome / Nick RP:').setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('idade').setLabel('Sua Idade:').setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('p1').setLabel('De quem você é amigo na Família?').setStyle(TextInputStyle.Paragraph).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('p2').setLabel('Quais jogos costuma jogar?').setStyle(TextInputStyle.Paragraph).setRequired(true)
                )
            );
            return await interaction.showModal(modal);
        }

        // Submissão do Modal (Formulário preenchido)
        if (interaction.isModalSubmit() && (interaction.customId === 'modal_familia' || interaction.customId === 'modal_amigos')) {
            // Evita o limite de 3 segundos do Discord (que fazia o bot travar com "pensando...")
            await interaction.deferReply({ ephemeral: true }).catch(() => {});

            const isFam = interaction.customId === 'modal_familia';
            const nome = interaction.fields.getTextInputValue('nome');
            const idade = interaction.fields.getTextInputValue('idade');
            const p1 = interaction.fields.getTextInputValue('p1');
            const p2 = interaction.fields.getTextInputValue('p2');

            // Encontra canal de aprovação da Staff
            const canalStaff = interaction.guild?.channels.cache.find(c => 
                c.type === ChannelType.GuildText && (
                    c.name.includes('aprovacao') || c.name.includes('staff') || c.name.includes('registro') || c.name.includes('fichas')
                )
            );

            if (canalStaff) {
                const embedStaff = new EmbedBuilder()
                    .setColor(isFam ? 0xD4AF37 : 0x2ECC71)
                    .setTitle(`📥 NOVA FICHA DE REGISTRO • ${isFam ? '⚜️ FAMÍLIA NABRIZA [FN]' : '🤝 AMIGOS [AMIGO]'}`)
                    .setDescription(
                        `👤 **Membro:** <@${interaction.user.id}> (${interaction.user.tag})\n` +
                        `🆔 **ID:** \`${interaction.user.id}\`\n` +
                        `🏷️ **Cargo Solicitado:** ${isFam ? 'Família Nabriza' : 'Amigo da Família'}\n` +
                        `📝 **Nick Solicitado:** **${nome}**\n` +
                        `🎂 **Idade:** ${idade}\n\n` +
                        `📋 **Respostas do Candidato:**\n` +
                        `> **1.** ${p1}\n` +
                        `> **2.** ${p2}`
                    )
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp();

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`aprovar_${interaction.user.id}_${isFam ? 'familia' : 'amigos'}_${encodeURIComponent(nome)}`)
                        .setLabel(`Aprovar ${isFam ? '[FN]' : '[AMIGO]'}`)
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('✅'),
                    new ButtonBuilder()
                        .setCustomId(`reprovar_${interaction.user.id}`)
                        .setLabel('Reprovar')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('❌')
                );

                await canalStaff.send({ embeds: [embedStaff], components: [row] }).catch(err => {
                    console.error('Erro ao enviar ficha para canal da staff:', err.message);
                });
            }

            return await interaction.editReply({
                content: `✅ **Sua ficha foi enviada com sucesso para a moderação!**\nVocê escolheu: **${isFam ? '⚜️ Família Nabriza [FN]' : '🤝 Amigos [AMIGO]'}**. Aguarde a Staff aprovar para liberar seus canais.`
            }).catch(() => {});
        }

        // Ação: Staff clica em APROVAR
        if (interaction.isButton() && interaction.customId.startsWith('aprovar_')) {
            const temPerm = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) ||
                            interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);

            if (!temPerm) {
                return interaction.reply({ content: '❌ Apenas membros da Staff podem aprovar cadastros!', ephemeral: true });
            }

            // Responde imediatamente para não dar timeout de 3s no Discord
            await interaction.deferUpdate().catch(() => {});

            const [, userId, tipo, rawNick] = interaction.customId.split('_');
            const nick = decodeURIComponent(rawNick);
            const isFam = tipo === 'familia';
            const member = await interaction.guild?.members.fetch(userId).catch(() => null);

            if (!member) {
                return interaction.followUp({ content: '⚠️ Membro não encontrado no servidor!', ephemeral: true }).catch(() => {});
            }

            // 1. Conceder Cargo com verificação de hierarquia
            const roleId = isFam ? CONFIG.cargoFamiliaId : CONFIG.cargoAmigosId;
            const role = interaction.guild?.roles.cache.get(roleId) ||
                         interaction.guild?.roles.cache.find(r => r.name.toLowerCase().includes(tipo));

            if (role) {
                await member.roles.add(role).catch(err => console.error('Erro ao adicionar cargo (verifique hierarquia de cargos do bot):', err.message));
            }

            // 2. Remover cargo Não Registrado
            if (CONFIG.cargoNaoRegistradoId) {
                const roleNaoReg = interaction.guild?.roles.cache.get(CONFIG.cargoNaoRegistradoId) ||
                                   interaction.guild?.roles.cache.find(r => r.name.includes('Não Registrado'));
                if (roleNaoReg) await member.roles.remove(roleNaoReg).catch(() => {});
            }

            // 3. Formatar Nickname (somente se member for gerenciável)
            const novoNick = isFam ? `[FN] ${nick}` : `[AMIGO] ${nick}`;
            try {
                if (member.manageable && interaction.guild?.members.me?.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
                    await member.setNickname(novoNick.substring(0, 32)).catch(err => {
                        console.log('Não foi possível alterar apelido (hierarquia ou dono do servidor):', err.message);
                    });
                }
            } catch (_) {}

            // 4. Atualizar Mensagem na Staff
            await interaction.editReply({
                content: `✅ **Aprovado por <@${interaction.user.id}>!**\nO cargo **${isFam ? '⚜️ Família Nabriza' : '🤝 Amigos'}** foi entregue e o apelido foi formatado para \`${novoNick}\`.`,
                embeds: [],
                components: []
            }).catch(() => {});

            // 5. Notificar no canal de avisos
            const canalAvisos = interaction.guild?.channels.cache.find(c => 
                c.type === ChannelType.GuildText && (c.name.includes('avisos') || c.name.includes('geral') || c.name.includes('chat'))
            );

            if (canalAvisos) {
                await canalAvisos.send(
                    `🎉 Seja muito bem-vindo(a) <@${userId}> à **Família & Amigos**! Seu cargo foi aprovado por <@${interaction.user.id}>! ⚜️`
                ).catch(() => {});
            }

            // 6. Mensagem privada para o usuário
            await member.send(
                `🎉 **Parabéns, ${nick}!**\nSua ficha para **${isFam ? '⚜️ Família Nabriza' : '🤝 Amigos da Família'}** foi **APROVADA** pela Staff!\nSeus canais foram liberados. Bom jogo e aproveite as calls! ⚜️`
            ).catch(() => {});

            return;
        }

        // Ação: Staff clica em REPROVAR
        if (interaction.isButton() && interaction.customId.startsWith('reprovar_')) {
            const temPerm = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) ||
                            interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);

            if (!temPerm) {
                return interaction.reply({ content: '❌ Apenas a Staff pode recusar cadastros!', ephemeral: true });
            }

            await interaction.update({
                content: `❌ **Registro Reprovado por <@${interaction.user.id}>.**`,
                embeds: [],
                components: []
            }).catch(() => {});
            return;
        }

        // 💌 Interações dos Botões da Cartinha de Amor (Namoro Sério Oficial)
        if (interaction.isButton() && interaction.customId === 'btn_cartinha_namoro') {
            const diasNamoro = calcularDiasNamoro();
            return interaction.reply({
                content: `💍 **OFICIALMENTE NAMORADOS!** ❤️\nGabizinha, hoje dia **27/09/2026** começou o nosso namoro sério! Estamos no nosso **${diasNamoro}º dia oficial de namoro**, e o Henrique promete te amar, respeitar e cuidar de você todos os dias da vida dele! ✨🌹`,
                ephemeral: true
            });
        }

        if (interaction.isButton() && interaction.customId === 'btn_cartinha_amor') {
            return interaction.reply({
                content: '💖 **O Henrique é completamente apaixonado pela Gabizinha!**\nFicamos nos conhecendo do dia 21/09 até 26/09 e hoje, dia 27/09/2026, você é oficialmente a namorada dele! 🌹💍',
                ephemeral: true
            });
        }

        if (interaction.isButton() && interaction.customId === 'btn_cartinha_marco') {
            const diasNamoro = calcularDiasNamoro();
            const diasConhecendo = calcularDiasConhecendo();
            return interaction.reply({
                content: `🌹 **LINHA DO TEMPO DO NOSSO AMOR:**\n• **21/09/2026 a 26/09/2026:** Ficamos nos conhecendo e nos apaixonando dia após dia.\n• **27/09/2026 (Hoje!):** O grande dia do início oficial do nosso **NAMORO SÉRIO**! 💍\n• **Total:** ${diasNamoro}º dia de namoro • ${diasConhecendo} dias de história linda! ✨`,
                ephemeral: true
            });
        }

        if (interaction.isButton() && interaction.customId === 'btn_cartinha_mulher') {
            return interaction.reply({
                content: '👑 **Gabizinha, você é a mulher da vida do Henrique e a dona do coração dele!**\nO objetivo dele é te fazer a namorada mais feliz e valorizada desse mundo! 💍❤️',
                ephemeral: true
            });
        }
    } catch (err) {
        console.error('Erro na interação:', err);
    }
});

// ⏰ AGENDADOR DIÁRIO DE BOM DIA PARA A GABIZINHA
let ultimaDataEnvioCartinha = null;
setInterval(async () => {
    try {
        if (!client.isReady()) return;
        const agora = new Date();
        const horaBrasilia = (agora.getUTCHours() - 3 + 24) % 24;
        const minutoBrasilia = agora.getUTCMinutes();
        const hojeStr = agora.toISOString().slice(0, 10);

        if (
            horaBrasilia === CONFIG.horaEnvioCartinha &&
            minutoBrasilia === CONFIG.minutoEnvioCartinha &&
            ultimaDataEnvioCartinha !== hojeStr
        ) {
            const guild = client.guilds.cache.first();
            if (guild) {
                console.log(`⏰ [AGENDADOR BOT] Enviando Bom Dia programado para Gabizinha no canal #${CONFIG.canalCartinhaId}...`);
                const enviado = await enviarCartinhaDiaria(guild).catch(() => false);
                if (enviado) ultimaDataEnvioCartinha = hojeStr;
            }
        }
    } catch (e) {
        console.error('Erro no agendador da cartinha diária:', e.message || e);
    }
}, 60 * 1000);

// Login Seguro do Bot Discord com Diagnóstico Completo
if (!CONFIG.token || CONFIG.token === 'SEU_BOT_TOKEN_AQUI' || CONFIG.token.length < 25) {
    console.log('====================================================');
    console.log('ℹ️ [MODO AGUARDANDO CONFIGURAÇÃO] DISCORD_TOKEN não informado.');
    console.log('👉 Para conectar o bot ao Discord:');
    console.log('   1. Abra o arquivo .env');
    console.log('   2. Adicione: DISCORD_TOKEN=seu_token_aqui');
    console.log('   3. Inicie o bot com: node bot.js');
    console.log('====================================================');
} else {
    client.login(CONFIG.token).catch(err => {
        console.error('====================================================');
        console.error('❌ [ERRO AO LOGAR BOT DISCORD]:', err.message);
        if (err.message.includes('disallowed intents') || err.code === 'DisallowedIntents') {
            console.error('📌 COMO CORRIGIR DISALLOWED INTENTS (O bot não pode travar por isso):');
            console.error('1. Acesse: https://discord.com/developers/applications');
            console.error('2. Clique no seu Bot -> aba "Bot" no menu esquerdo');
            console.error('3. Ative as três caixas sob "Privileged Gateway Intents":');
            console.error('   [✔] PRESENCE INTENT');
            console.error('   [✔] SERVER MEMBERS INTENT');
            console.error('   [✔] MESSAGE CONTENT INTENT');
            console.error('4. Clique em "Save Changes" e reinicie o bot!');
        } else if (err.message.includes('invalid token') || err.code === 'TokenInvalid') {
            console.error('📌 COMO CORRIGIR TOKEN INVÁLIDO:');
            console.error('Acesse o portal do Discord Developer -> Bot -> Reset Token -> Copie e cole no .env');
        }
        console.error('====================================================');
    });
}
