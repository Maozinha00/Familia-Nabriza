/**
 * ============================================================================
 * ⚜️ BOT DISCORD • FAMÍLIA & AMIGOS (VERSÃO OTIMIZADA PARA RAILWAY) ⚜️
 * ============================================================================
 * 
 * 🚀 PRONTO PARA RAILWAY:
 * - Não precisa de arquivo .env! Lê direto das "Variables" do painel da Railway.
 * - Inclui mini servidor HTTP para o Health Check da Railway (evita erro de porta).
 * - Horário de Brasília 100% preciso via Intl.DateTimeFormat (America/Sao_Paulo).
 * - Sem risco de permissão Administrator indevida para o cargo Chefe.
 * - Comando /fichas implementado com sucesso.
 * - Suporte a CANAL_APROVACAO_ID e GUILD_ID para precisão máxima.
 * - Anti-crash reforçado.
 */

// Se houver .env localmente ele carrega, mas na Railway lê direto de process.env!
try {
    require('dotenv').config();
} catch (_) {}

const http = require('http');
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

// 🛡️ SISTEMA ANTI-CRASH PROFISSIONAL
process.on('unhandledRejection', (reason, promise) => {
    console.error('🛡️ [ANTI-CRASH] Rejeição de Promise interceptada:', reason);
});

process.on('uncaughtException', (err, origin) => {
    console.error(`🛡️ [ANTI-CRASH] Exceção interceptada (${origin}):`, err.message || err);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.error(`🛡️ [ANTI-CRASH Monitor] Erro detectado (${origin}):`, err.message || err);
});

// ⚙️ CONFIGURAÇÃO CENTRALIZADA (Lida direto das Variables da Railway)
const CONFIG = {
    token: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.trim() : "",
    guildId: process.env.GUILD_ID ? process.env.GUILD_ID.trim() : null,
    nomeServidor: "Família & Amigos",
    corEmbed: "#D4AF37", // Dourado
    corChefe: "#FFD700", // Ouro

    // IDs de Cargos (Configurados nas Variables da Railway)
    cargoChefeId: process.env.CARGO_CHEFE_ID ? process.env.CARGO_CHEFE_ID.trim() : null,
    cargoFamiliaId: process.env.CARGO_FAMILIA_ID ? process.env.CARGO_FAMILIA_ID.trim() : "1546736138918694983",
    cargoAmigosId: process.env.CARGO_AMIGOS_ID ? process.env.CARGO_AMIGOS_ID.trim() : "1546736135965904926",
    cargoNaoRegistradoId: process.env.CARGO_NAO_REGISTRADO_ID ? process.env.CARGO_NAO_REGISTRADO_ID.trim() : "1515125826780135480",

    // Canais Específicos
    canalAprovacaoId: process.env.CANAL_APROVACAO_ID ? process.env.CANAL_APROVACAO_ID.trim() : null,
    canalCartinhaId: process.env.CANAL_CARTINHA_ID ? process.env.CANAL_CARTINHA_ID.trim() : "1552914452146294864",

    // 💌 Configuração da Cartinha de Bom Dia (Henrique & Gabizinha)
    gabizinhaUserId: process.env.GABIZINHA_USER_ID ? process.env.GABIZINHA_USER_ID.trim() : "1280444697231364183",
    nomeGabizinha: "✞ 𝑮𝒂𝒃𝒊𝒛𝒊𝒏𝒉𝒂 ✞",
    nomeHenrique: "Henrique",
    dataInicioConhecer: "2026-09-21",
    dataFimConhecer: "2026-09-26",
    dataInicioNamoro: "2026-09-27", // Oficialmente Namorados!
    horaEnvioCartinha: 6, // 06:20 AM Horário de Brasília
    minutoEnvioCartinha: 20,

    // Porta HTTP para a Railway
    port: process.env.PORT || 3000
};

// 🌐 SERVIDOR HTTP LEVE PARA HEALTH CHECK DA RAILWAY
const server = http.createServer((req, res) => {
    const isReady = client && client.isReady();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: isReady ? 'online' : 'initializing',
        bot: client?.user ? client.user.tag : 'Iniciando...',
        guilds: client?.guilds?.cache?.size || 0,
        uptime: process.uptime(),
        horarioBrasilia: getHorarioBrasiliaFormatado()
    }));
});

server.listen(CONFIG.port, () => {
    console.log(`🌐 [RAILWAY HTTP] Servidor de monitoramento escutando na porta ${CONFIG.port}`);
});

// ⏰ FUNÇÃO PRECISA PARA HORÁRIO DE BRASÍLIA
function getHorarioBrasilia() {
    const agora = new Date();
    const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    });
    const parts = formatter.formatToParts(agora);
    let hora = 0, minuto = 0, segundo = 0;
    for (const p of parts) {
        if (p.type === 'hour') hora = parseInt(p.value, 10);
        if (p.type === 'minute') minuto = parseInt(p.value, 10);
        if (p.type === 'second') segundo = parseInt(p.value, 10);
    }
    const dataFormatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return { hora, minuto, segundo, dataStr: dataFormatter.format(agora) };
}

function getHorarioBrasiliaFormatado() {
    const { hora, minuto, segundo, dataStr } = getHorarioBrasilia();
    return `${dataStr} ${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}:${String(segundo).padStart(2, '0')} (Brasília)`;
}

// 💌 30 Cartinhas Diárias de Bom Dia
const CARTINHAS_30_DIAS = [
    {
        dia: 1,
        diaTitulo: "💍 DIA 01 — O INÍCIO DO NOSSO NAMORO SÉRIO",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA A MINHA NAMORADA ☀️💍",
        frase: "Nos conhecemos do dia 21/09 até ontem, e hoje, 27/09/2026, você é oficialmente a dona do meu coração e minha namorada!",
        corpo: "Bom dia, minha namorada linda! ❤️\n\nHoje é o dia mais feliz e especial de todos: o início oficial do nosso namoro sério! Desde o primeiro momento em que começamos a conversar no dia 21/09, meu coração já sabia que você era diferente de tudo. Esses dias conhecendo você só me deram a maior certeza da minha vida: eu quero estar com você, cuidar de você e te fazer a mulher mais feliz do mundo.\n\nQue seu primeiro dia oficialmente como minha namorada seja maravilhoso, abençoado e cheio de sorrisos! Te amo demais! 🌹💍",
        rodape: "💍 Henrique & Gabizinha • Nosso Primeiro Dia de Namoro Sério 💕"
    },
    {
        dia: 2,
        diaTitulo: "🌸 DIA 02 — MEU ORGULHO EM TER VOCÊ",
        cabecalho: "💌 BOM DIA, MEU AMOR! MINHA NAMORADA 🌷💕",
        frase: "Você não imagina o orgulho e a alegria que eu sinto em poder te chamar de minha namorada.",
        corpo: "Acordar sabendo que agora é sério, que somos namorados e que tenho ao meu lado a garota mais incrível desse mundo é a melhor sensação da vida. Seu sorriso ilumina o meu dia inteiro.\n\nQue a sua manhã seja tranquila, doce e cheia de paz. Nunca se esqueça que tem um namorado aqui completamente louco por você! ❤️",
        rodape: "💍 Henrique & Gabizinha • Namoro Sério 27/09 💕"
    },
    {
        dia: 3,
        diaTitulo: "💖 DIA 03 — VOCÊ EM MEUS PENSAMENTOS",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA O MEU AMOR ☀️❤️",
        frase: "Antes mesmo do despertador tocar, você já era o primeiro e mais lindo pensamento do meu dia.",
        corpo: "Bom dia, minha princesa! 💖\n\nPassamos do dia 21 ao 26 nos descobrindo e nos encantando, e agora cada manhã ao seu lado tem um sabor de realização. Estar em um namoro sério com você é o maior presente que Deus me deu.\n\nTenha um dia leve, cheio de motivos para sorrir e lembre-se: seu namorado está torcendo e rezando por você o tempo todo! 🌹",
        rodape: "💍 Oficialmente Namorados • Henrique & Gabizinha 💕"
    },
    {
        dia: 4,
        diaTitulo: "🌹 DIA 04 — MEU CUIDADO & CARINHO",
        cabecalho: "💌 BOM DIA, MINHA NAMORADA PERFEITA! ☀️👸",
        frase: "Meu objetivo diário é cuidar de você, te proteger e arrancar os seus sorrisos mais sinceros.",
        corpo: "Hoje eu só queria te lembrar de uma certeza absoluta:\n\n\"Você é a mulher da minha vida e a minha maior prioridade.\"\n\nQue o seu dia seja tão radiante e especial quanto você é para mim. Que nada nem ninguém tire a sua paz. Te amo com todo o meu coração! 🌹💍",
        rodape: "❤️ Do seu namorado apaixonado, Henrique"
    },
    {
        dia: 5,
        diaTitulo: "☀️ DIA 05 — O DESTINO CERTO",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA A GABIZINHA 🌻💍",
        frase: "A gente se conheceu no dia 21/09 e hoje tudo faz sentido: você nasceu para ser minha namorada.",
        corpo: "Bom dia, minha vida! 💖\n\nÀs vezes eu paro e penso na sorte que eu tive de cruzar o seu caminho. Em tão pouco tempo você virou meu porto seguro, minha melhor companhia e a dona dos meus melhores planos.\n\n\"Meu desejo para hoje: que seu coração sinta todo o amor e carinho que eu guardo aqui para você.\" ❤️",
        rodape: "💍 Henrique & Gabizinha • Amor Real & Sincero 💕"
    },
    {
        dia: 6,
        diaTitulo: "💫 DIA 06 — NOSSA CONEXÃO",
        cabecalho: "💌 BOM DIA, MEU DOCE DE COCO! ☀️💕",
        frase: "Nossa química e a nossa lealdade mostram que o que temos é único e abençoado.",
        corpo: "Algumas pessoas passam pela nossa vida sem deixar rastro, mas você chegou para ficar e construir um futuro lindo comigo. Agora que assumimos esse namoro sério, tenho certeza de que estamos no caminho certo.\n\nTenha um dia cheio de vitórias e conquistas, minha gatinha! Te amo! 🌹",
        rodape: "💘 Henrique ➔ Minha Namorada Gabizinha"
    },
    {
        dia: 7,
        diaTitulo: "🌷 DIA 07 — UMA SEMANA DA NOSSA HISTÓRIA",
        cabecalho: "💌 BOM DIA, MINHA LINDA! ☀️🌹",
        frase: "Já são 7 dias desde que nos conhecemos no dia 21/09 e cada segundo valeu a pena para estarmos namorando hoje!",
        corpo: "Bom dia, meu grande amor! 💖\n\nUma semana inteira desde o momento em que Deus colocou você na minha vida. Foram dias se conhecendo, rindo juntos, trocando olhares e mensagens, até chegar no nosso 27/09 do namoro sério.\n\n\"Espero que hoje seu dia seja leve, colorido e cheio de motivos para você ser muito feliz.\" Cuide-se bem, minha namorada! 🌹",
        rodape: "💍 7 Dias de História • Henrique & Gabizinha 💕"
    },
    {
        dia: 8,
        diaTitulo: "🌅 DIA 08 — SORRISO DE NAMORADA",
        cabecalho: "💌 BOM DIA PARA A MULHER MAIS LINDA! ☀️👸",
        frase: "O seu sorriso é o meu combustível e a coisa mais perfeita que eu já vi.",
        corpo: "Que o primeiro sorriso do seu dia seja pensado em mim e que o último pensamento antes de dormir traga a certeza de que você é amada e respeitada como uma verdadeira rainha.\n\n\"Você merece todos os abraços quentes, todo o carinho e toda a felicidade desse mundo.\" 💕",
        rodape: "🌹 De: Henrique • Para: Gabizinha (Minha Namorada)"
    },
    {
        dia: 9,
        diaTitulo: "💘 DIA 09 — CERTEZA DO MEU CORAÇÃO",
        cabecalho: "💌 CARTINHA DE BOM DIA PARA A GABIZINHA ❤️💍",
        frase: "Você mudou minha rotina, meus planos e trouxe paz para a minha vida.",
        corpo: "Talvez você não faça ideia, mas uma simples mensagem de \"bom dia\" vinda de você ilumina a minha manhã toda. Assumir esse namoro sério foi a decisão mais acertada que tomei.\n\nTenha um dia maravilhoso, minha gatinha. Estou aqui sempre com você, para o que der e vier! 🌷",
        rodape: "💖 Henrique ➔ Gabizinha • Namoro Sério 💕"
    },
    {
        dia: 10,
        diaTitulo: "🌹 DIA 10 — 10 DIAS JUNTOS & APAIXONADOS",
        cabecalho: "💌 BOM DIA, MEU AMOR! ☀️💍",
        frase: "Dez dias de história linda e esse namoro está apenas no comecinho de uma vida toda.",
        corpo: "Já se passaram 10 dias desde que conversamos pela primeira vez no dia 21/09. E cada manhã que passa, meu amor por você só aumenta e ganha mais força.\n\n\"Ainda tenho infinitos beijos, abraços e declarações para te entregar todos os dias.\" ❤️\n\nQue seu dia seja tão lindo quanto você!",
        rodape: "💘 Henrique & Gabizinha • Para Sempre 💕"
    },
    {
        dia: 15,
        diaTitulo: "☀️ DIA 15 — MEU COMPROMISSO COM VOCÊ",
        cabecalho: "💌 BOM DIA, AMOR DA MINHA VIDA! 💖💍",
        frase: "Meu compromisso com você é de lealdade, respeito, carinho e amor verdadeiro todos os dias.",
        corpo: "Chegamos à metade do nosso primeiro mês de cartinhas diárias! E se tem algo que só cresceu desde o nosso pedido de namoro no dia 27/09, foi o meu sentimento por você.\n\n\"Que o seu dia seja repleto de boas notícias e muito amor!\" 🌹",
        rodape: "❤️ Henrique (Seu Namorado)"
    },
    {
        dia: 20,
        diaTitulo: "🌻 DIA 20 — 20 DIAS DE HISTÓRIA",
        cabecalho: "💌 BOM DIA, MINHA COMPANHEIRA! 💕💍",
        frase: "Vinte dias de mensagens, vinte dias de carinho e a certeza de que esse namoro é para a vida toda.",
        corpo: "Vinte dias, meu amor! E cada amanhecer ao seu lado me dá mais ânimo para sonhar alto com o nosso futuro.\n\n\"Se essa mensagem arrancar um sorriso do seu rosto, meu dia já ganhou sentido.\" ❤️",
        rodape: "🌹 Henrique & Gabizinha • Namorados Oficiais"
    },
    {
        dia: 30,
        diaTitulo: "👑 DIA 30 — UM MÊS DE CARTINHAS & UMA VIDA AO SEU LADO",
        cabecalho: "💌 CARTINHA ESPECIAL: MINHA NAMORADA PARA SEMPRE ☀️💍",
        frase: "Foram 30 manhãs de carinho, mas a nossa história de namoro sério é para a vida toda!",
        corpo: "Chegamos à nossa 30ª cartinha diária de bom dia!\n\nForam 30 manhãs, 30 mensagens e 30 declarações do quanto você mudou a minha vida.\n\nFicamos nos conhecendo do dia 21/09 até 26/09, e no dia 27/09/2026 oficializamos nosso namoro sério. E essa foi a melhor escolha que já fiz.\n\n\"Eu quero continuar ao seu lado, cuidando de você, te amando e te fazendo a mulher mais feliz do mundo por todos os dias que virão.\" ❤️💍\n\nTe amo mais que tudo, minha namorada eterna!",
        rodape: "💍 Henrique & Gabizinha • Namoro Sério Para Sempre 💕"
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

function gerarEmbedCartinhaBomDia(customDia) {
    const diasNamoro = calcularDiasNamoro();
    const diasConhecendo = calcularDiasConhecendo();

    const targetIndex = customDia !== undefined && customDia > 0
        ? (customDia - 1) % CARTINHAS_30_DIAS.length
        : Math.max(0, (diasNamoro - 1) % CARTINHAS_30_DIAS.length);

    const carta = CARTINHAS_30_DIAS[targetIndex];

    const embed = new EmbedBuilder()
        .setColor("#FF1493")
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
            `🌹 **Nos Conhecendo:** \`21/09/2026\` até \`26/09/2026\`\n` +
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
        `🌹 **Nos Conhecendo:** \`21/09/2026\` até \`26/09/2026\`\n` +
        `🤴 **Seu Namorado:** ${CONFIG.nomeHenrique}\n` +
        `👸 **Minha Namorada:** ${CONFIG.nomeGabizinha}\n\n` +
        `**${carta.rodape}**`;

    return {
        content: mensagemTexto,
        embeds: [embed],
        components: [row]
    };
}

async function getTargetGuild() {
    if (CONFIG.guildId && client.guilds.cache.has(CONFIG.guildId)) {
        return client.guilds.cache.get(CONFIG.guildId);
    }
    return client.guilds.cache.first();
}

async function enviarCartinhaDiaria(customGuild, customDia) {
    const guild = customGuild || await getTargetGuild();
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

// 🤖 CLIENTE DISCORD COM INTENTS OBRIGATÓRIOS
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

function gerarCardRegistroMembro(user) {
    const embed = new EmbedBuilder()
        .setColor(CONFIG.corEmbed)
        .setTitle('⚜️ REGISTRO OFICIAL • FAMÍLIA & AMIGOS ⚜️')
        .setDescription(
            `Olá ${user ? `<@${user.id}>` : 'Membro'}! Seja muito bem-vindo(a) ao nosso servidor!\n\n` +
            `Para se cadastrar e liberar todos os canais de texto, resenha e salas de voz, escolha a sua categoria:\n\n` +
            `⚜️ **1. FAMÍLIA NABRIZA [FN]**\n` +
            `> Membro oficial da Família Nabriza. Libera canais exclusivos da Família. Recebe tag \`[FN]\` no Nick.\n\n` +
            `🤝 **2. AMIGOS DA FAMÍLIA [AMIGO]**\n` +
            `> Amigo, aliado e parceiro para curtir o servidor. Recebe tag \`[AMIGO]\` no Nick.\n\n` +
            `──────────────────────────────────────────\n` +
            `👇 *Clique em um dos botões abaixo para preencher sua ficha:*`
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

// ⚙️ CONFIGURAR CANAIS OFICIAIS DE REGISTRO E STAFF
async function configurarCanaisRegistro(guild) {
    const everyone = guild.roles.everyone;
    const rolesCreated = await configurarCargosOficiais(guild);

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

    // Canal de Aprovação Staff
    let canalStaff = null;
    if (CONFIG.canalAprovacaoId) {
        canalStaff = guild.channels.cache.get(CONFIG.canalAprovacaoId);
    }
    if (!canalStaff) {
        canalStaff = guild.channels.cache.find(c => 
            c.type === ChannelType.GuildText && (c.name.includes('aprovacao') || c.name.includes('fichas-registro') || c.name.includes('fichas'))
        );
    }

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

// 🔒 CRIAR SALA PRIVADA DOS CHEFES (SEM CONCEDER ADMINISTRATOR GLOBAL AO CARGO CHEFE)
async function configurarSalaPrivadaChefes(guild) {
    console.log(`[SALA CHEFES] Configurando sala privada dos chefes no servidor "${guild.name}"...`);

    const everyone = guild.roles.everyone;

    // 1. Localiza ou cria o cargo "👑 Chefe" (SEM Administrator global para segurança)
    let roleChefe = guild.roles.cache.find(r => r.name.includes('Chefe') || r.name.includes('Diretoria'));
    if (!roleChefe) {
        roleChefe = await guild.roles.create({
            name: '👑 Chefe',
            color: '#FFD700',
            hoist: true,
            permissions: [
                PermissionsBitField.Flags.ManageMessages,
                PermissionsBitField.Flags.MuteMembers,
                PermissionsBitField.Flags.DeafenMembers,
                PermissionsBitField.Flags.MoveMembers
            ],
            reason: 'Cargo para liderança e acesso à Sala Privada dos Chefes'
        }).catch(() => null);
    }

    if (roleChefe) {
        CONFIG.cargoChefeId = roleChefe.id;
        try {
            const owner = await guild.fetchOwner();
            if (owner && !owner.roles.cache.has(roleChefe.id)) {
                await owner.roles.add(roleChefe);
            }
        } catch (_) {}
    }

    // 2. Permissões estritas da Categoria: Invisível para everyone, liberado para Chefe
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
                PermissionsBitField.Flags.Speak,
                PermissionsBitField.Flags.ManageMessages
            ]
        });
    }

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

    console.log(`✅ [SALA CHEFES] Sala PV configurada com sucesso!`);
    return {
        categoria: catChefes.name,
        chatTexto: canalTextoChefe.name,
        chatVoz: canalVozChefe.name,
        cargoChefe: roleChefe ? roleChefe.name : null
    };
}

// 🛡️ GARANTIR CARGOS DO SERVIDOR
async function configurarCargosOficiais(guild) {
    const rolesCreated = [];

    // Chefe
    let roleChefe = guild.roles.cache.find(r => r.name.includes('Chefe'));
    if (!roleChefe) {
        roleChefe = await guild.roles.create({
            name: '👑 Chefe',
            color: '#FFD700',
            hoist: true,
            permissions: [PermissionsBitField.Flags.ManageMessages]
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
    console.log(`🟢 [BOT ONLINE NO RAILWAY] Conectado como: ${c.user.tag}`);
    console.log(`⚜️ Servidores Conectados: ${c.guilds.cache.size}`);
    console.log(`⏰ Horário Brasília Atual: ${getHorarioBrasiliaFormatado()}`);
    console.log(`====================================================`);

    c.user.setPresence({
        activities: [{ name: "⚜️ Família & Amigos | !registro | !ajuda", type: 3 }],
        status: "online"
    });

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
            description: '📋 (Staff) Localiza o canal de fichas de registro pendentes de avaliação.'
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
            description: '🗓️ Mostra status do namoro sério (27/09/2026) e história (21/09 a 26/09).'
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
    }, 2000);
});

// 👤 Evento: Novo Membro Entra no Servidor
client.on(Events.GuildMemberAdd, async (member) => {
    try {
        console.log(`[NOVO MEMBRO] ${member.user.tag} (${member.id}) entrou no servidor.`);

        let roleNaoReg = member.guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) ||
                         member.guild.roles.cache.find(r => r.name.includes('Não Registrado'));
        if (roleNaoReg) {
            await member.roles.add(roleNaoReg).catch(err => console.error('Erro ao entregar cargo Não Registrado:', err.message));
        }

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
                    `   • ⚜️ **Família Nabriza [FN]**\n` +
                    `   • 🤝 **Amigos da Família [AMIGO]**\n` +
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

// Comandos de Texto Prefixados
client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot || !msg.guild) return;
    const content = msg.content.trim().toLowerCase();

    // 1. !registro
    if (content === '!registro' || content === '!cadastrar') {
        return msg.reply(gerarCardRegistroMembro(msg.author));
    }

    // 2. !painel
    if (content === '!painel' || content === '!cargos') {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
                      msg.member.permissions.has(PermissionsBitField.Flags.Administrator);

        if (!perms) return msg.reply(gerarCardRegistroMembro(msg.author));
        return msg.channel.send(gerarPainelEscolhaCargos());
    }

    // 3. !setupregistro
    if (content === '!setupregistro') {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageChannels) ||
                      msg.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!perms) return msg.reply('❌ Apenas a Staff pode configurar canais de registro.');

        const waitMsg = await msg.reply('⏳ **Configurando canais oficiais...**');
        const res = await configurarCanaisRegistro(msg.guild);
        const embedSetup = new EmbedBuilder()
            .setColor(CONFIG.corEmbed)
            .setTitle('⚜️ CANAIS DE REGISTRO CONFIGURADOS COM SUCESSO!')
            .setDescription(
                `📜 **Canal de Registro:** ${res.canalRegistroId ? `<#${res.canalRegistroId}>` : '`#escolha-seu-cargo`'}\n` +
                `🛡️ **Canal de Fichas (Staff):** ${res.canalStaffId ? `<#${res.canalStaffId}>` : '`#fichas-aprovacao`'}`
            )
            .setTimestamp();
        return waitMsg.edit({ content: null, embeds: [embedSetup] });
    }

    // 4. !registrar direto
    if (content.startsWith('!registrar')) {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
                      msg.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!perms) return msg.reply('❌ Apenas a Staff pode registrar diretamente.');

        const args = msg.content.trim().split(/ +/);
        const targetMember = msg.mentions.members?.first();
        if (!targetMember || args.length < 3) {
            return msg.reply('⚠️ Formato: `!registrar @Membro <familia|amigo> [Nick]`');
        }

        const isFam = args[2].toLowerCase().includes('fam');
        const rawNick = args.slice(3).join(' ') || targetMember.user.username;
        const novoNick = isFam ? `[FN] ${rawNick}` : `[AMIGO] ${rawNick}`;

        const roleId = isFam ? CONFIG.cargoFamiliaId : CONFIG.cargoAmigosId;
        const role = msg.guild.roles.cache.get(roleId) ||
                     msg.guild.roles.cache.find(r => r.name.toLowerCase().includes(isFam ? 'família' : 'amigo'));

        if (role) await targetMember.roles.add(role).catch(() => {});

        if (CONFIG.cargoNaoRegistradoId) {
            const roleNaoReg = msg.guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) ||
                               msg.guild.roles.cache.find(r => r.name.includes('Não Registrado'));
            if (roleNaoReg) await targetMember.roles.remove(roleNaoReg).catch(() => {});
        }

        try {
            if (targetMember.manageable) {
                await targetMember.setNickname(novoNick.substring(0, 32)).catch(() => {});
            }
        } catch (_) {}

        return msg.reply(`✅ <@${targetMember.id}> foi registrado com sucesso como **${isFam ? '⚜️ Família Nabriza' : '🤝 Amigos'}**!`);
    }

    // 5. !statusregistro
    if (content === '!statusregistro') {
        const roleFam = msg.guild.roles.cache.get(CONFIG.cargoFamiliaId) || msg.guild.roles.cache.find(r => r.name.includes('Família'));
        const roleAmg = msg.guild.roles.cache.get(CONFIG.cargoAmigosId) || msg.guild.roles.cache.find(r => r.name.includes('Amigo'));
        const roleNaoReg = msg.guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) || msg.guild.roles.cache.find(r => r.name.includes('Não Registrado'));

        const embedStats = new EmbedBuilder()
            .setColor(CONFIG.corEmbed)
            .setTitle('📊 ESTATÍSTICAS DE REGISTRO • FAMÍLIA & AMIGOS')
            .setDescription(
                `👥 **Total de Membros:** ${msg.guild.memberCount}\n` +
                `⚜️ **Família Nabriza [FN]:** ${roleFam ? roleFam.members.size : 0}\n` +
                `🤝 **Amigos [AMIGO]:** ${roleAmg ? roleAmg.members.size : 0}\n` +
                `❌ **Não Registrados:** ${roleNaoReg ? roleNaoReg.members.size : 0}`
            );
        return msg.reply({ embeds: [embedStats] });
    }

    // 6. !regras
    if (content === '!regras') {
        return msg.channel.send({ embeds: [gerarEmbedRegras()] });
    }

    // 7. !salachefes
    if (content === '!salachefes') {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
                      msg.guild.ownerId === msg.author.id;
        if (!perms) return msg.reply('❌ Apenas Administradores podem configurar a Sala dos Chefes.');

        const waitMsg = await msg.reply('⏳ **Configurando Sala Privada dos Chefes de forma segura...**');
        const res = await configurarSalaPrivadaChefes(msg.guild);
        return waitMsg.edit({
            content: `✅ **Sala Privada configurada!**\n📁 Categoria: \`${res.categoria}\`\n💬 Chat: \`${res.chatTexto}\`\n🔊 Voz: \`${res.chatVoz}\``
        });
    }

    // 8. !status
    if (content === '!status' || content === '!botinfo') {
        const { hora, minuto, segundo, dataStr } = getHorarioBrasilia();
        const embedStatus = new EmbedBuilder()
            .setColor(CONFIG.corEmbed)
            .setTitle('📊 STATUS DO BOT • FAMÍLIA & AMIGOS (RAILWAY)')
            .setDescription(
                `🟢 **Status:** Online no Railway\n` +
                `📶 **Ping:** ${client.ws.ping}ms\n` +
                `⏰ **Horário de Brasília:** ${dataStr} ${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}:${String(segundo).padStart(2, '0')}\n` +
                `💌 **Cartinha:** Programada para às 06:20 AM diariamente\n` +
                `👥 **Membros no Servidor:** ${msg.guild.memberCount}`
            );
        return msg.reply({ embeds: [embedStatus] });
    }

    // 9. !cartinha
    if (content === '!cartinha' || content === '!namoro' || content === '!amor') {
        return msg.channel.send(gerarEmbedCartinhaBomDia());
    }

    // 10. !statuscartinha
    if (content === '!statuscartinha' || content === '!statusnamoro') {
        const diasNamoro = calcularDiasNamoro();
        const diasConhecendo = calcularDiasConhecendo();
        const embed = new EmbedBuilder()
            .setColor("#FF1493")
            .setTitle("💍 STATUS OFICIAL: NAMORO SÉRIO • HENRIQUE & GABIZINHA")
            .setDescription(
                `\`\`\`yaml\n` +
                `💍 RELACIONAMENTO: NAMORO SÉRIO OFICIAL ❤️\n` +
                `🗓️ INÍCIO DO NAMORO: 27/09/2026\n` +
                `🌹 FICAMOS NOS CONHECENDO: 21/09/2026 a 26/09/2026\n` +
                `⏳ DIAS DE NAMORO: ${diasNamoro}º Dia Oficial\n` +
                `✨ DIAS DE HISTÓRIA: ${diasConhecendo} Dias Juntos\n` +
                `\`\`\`\n\n` +
                `👸 **Minha Namorada:** <@${CONFIG.gabizinhaUserId}> (${CONFIG.nomeGabizinha})\n` +
                `🤴 **Seu Namorado:** **${CONFIG.nomeHenrique}**`
            );
        return msg.reply({ embeds: [embed] });
    }

    // 11. !limpar
    if (content.startsWith('!limpar')) {
        const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages);
        if (!perms) return msg.reply('❌ Você precisa da permissão de Gerenciar Mensagens!');
        const amount = parseInt(content.split(' ')[1], 10);
        if (isNaN(amount) || amount < 1 || amount > 100) return msg.reply('⚠️ Use: `!limpar 10` (1 a 100).');
        await msg.delete().catch(() => {});
        const deleted = await msg.channel.bulkDelete(amount, true).catch(() => null);
        const reply = await msg.channel.send(`🧹 **${deleted ? deleted.size : amount}** mensagens limpas.`);
        setTimeout(() => reply.delete().catch(() => {}), 3500);
        return;
    }

    // 12. !ajuda
    if (content === '!ajuda' || content === '!help') {
        const embedAjuda = new EmbedBuilder()
            .setColor(CONFIG.corEmbed)
            .setTitle('📖 GUIA DE COMANDOS • BOT FAMÍLIA & AMIGOS')
            .setDescription(
                '**⚜️ REGISTRO & PAINÉIS:**\n' +
                '• `!registro` - Abre o formulário pessoal para se registrar.\n' +
                '• `!painel` - Envia o painel de registro oficial da Staff no canal.\n' +
                '• `!setupregistro` - Cria canais oficiais de registro e fichas.\n' +
                '• `!salachefes` - Cria a categoria e canais blindados dos Chefes.\n\n' +
                '**💌 CARTINHA DE AMOR (HENRIQUE & GABIZINHA):**\n' +
                '• `!cartinha` - Envia a cartinha de bom dia.\n' +
                '• `!statuscartinha` - Mostra dias de namoro sério e história.\n\n' +
                '**🛡️ MODERAÇÃO:**\n' +
                '• `!limpar <1-100>` - Purge de mensagens.\n' +
                '• `!status` - Status do bot e ping.'
            );
        return msg.reply({ embeds: [embedAjuda] });
    }
});

// Interações (Slash, Modais e Botões)
client.on(Events.InteractionCreate, async (interaction) => {
    try {
        // 0. Slash Commands
        if (interaction.isChatInputCommand()) {
            const { commandName } = interaction;

            if (commandName === 'registro') {
                return interaction.reply({ ...gerarCardRegistroMembro(interaction.user), ephemeral: true });
            }

            if (commandName === 'painel') {
                const perms = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) ||
                              interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);
                if (!perms) return interaction.reply({ content: '❌ Apenas a Staff pode enviar o painel.', ephemeral: true });
                await interaction.channel?.send(gerarPainelEscolhaCargos());
                return interaction.reply({ content: '✅ Painel Oficial enviado!', ephemeral: true });
            }

            if (commandName === 'setupregistro') {
                const perms = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels) ||
                              interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);
                if (!perms) return interaction.reply({ content: '❌ Apenas a Staff pode configurar canais.', ephemeral: true });
                await interaction.deferReply({ ephemeral: true });
                const res = await configurarCanaisRegistro(interaction.guild);
                return interaction.editReply({ content: `✅ Canais configurados! Registro: <#${res.canalRegistroId}> | Staff: <#${res.canalStaffId}>` });
            }

            if (commandName === 'statusregistro') {
                const roleFam = interaction.guild?.roles.cache.get(CONFIG.cargoFamiliaId);
                const roleAmg = interaction.guild?.roles.cache.get(CONFIG.cargoAmigosId);
                return interaction.reply({
                    content: `📊 **Membros:** ${interaction.guild?.memberCount || 0} | ⚜️ Família: ${roleFam?.members.size || 0} | 🤝 Amigos: ${roleAmg?.members.size || 0}`,
                    ephemeral: true
                });
            }

            // CORREÇÃO: Implementação completa do /fichas!
            if (commandName === 'fichas') {
                const perms = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) ||
                              interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);
                if (!perms) return interaction.reply({ content: '❌ Apenas a Staff pode verificar fichas.', ephemeral: true });

                let canalStaff = null;
                if (CONFIG.canalAprovacaoId) {
                    canalStaff = interaction.guild?.channels.cache.get(CONFIG.canalAprovacaoId);
                }
                if (!canalStaff) {
                    canalStaff = interaction.guild?.channels.cache.find(c => 
                        c.type === ChannelType.GuildText && (c.name.includes('aprovacao') || c.name.includes('fichas'))
                    );
                }

                if (canalStaff) {
                    return interaction.reply({
                        content: `📋 **Canal de Fichas da Staff:** <#${canalStaff.id}>\nTodas as fichas pendentes com botões de aprovação estão disponíveis lá.`,
                        ephemeral: true
                    });
                } else {
                    return interaction.reply({
                        content: '⚠️ Canal de aprovação não encontrado. Use `/setupregistro` para criá-lo automaticamente!',
                        ephemeral: true
                    });
                }
            }

            if (commandName === 'cartinha') {
                return interaction.reply(gerarEmbedCartinhaBomDia());
            }

            if (commandName === 'statuscartinha' || commandName === 'namoro') {
                const diasNamoro = calcularDiasNamoro();
                const diasConhecendo = calcularDiasConhecendo();
                return interaction.reply({
                    content: `💍 **Status Oficial: Namoro Sério (Henrique & Gabizinha)**\n` +
                        `• **Início do Namoro:** 27/09/2026 (${diasNamoro}º dia oficial ❤️)\n` +
                        `• **Nos Conhecendo:** 21/09/2026 a 26/09/2026 (${diasConhecendo} dias de história 🌹)\n` +
                        `• **Canal:** <#${CONFIG.canalCartinhaId}>`,
                    ephemeral: true
                });
            }

            if (commandName === 'regras') {
                return interaction.reply({ embeds: [gerarEmbedRegras()] });
            }
        }

        // Modais de Cadastro
        if (interaction.isButton() && interaction.customId === 'btn_iniciar_familia') {
            const modal = new ModalBuilder().setCustomId('modal_familia').setTitle('Ficha: Família Nabriza [FN]');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('nome').setLabel('Seu Nome / Nick RP:').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('idade').setLabel('Sua Idade:').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('p1').setLabel('Quem te convidou?').setStyle(TextInputStyle.Paragraph).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('p2').setLabel('Concorda em honrar a tag [FN]?').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
            return await interaction.showModal(modal);
        }

        if (interaction.isButton() && interaction.customId === 'btn_iniciar_amigos') {
            const modal = new ModalBuilder().setCustomId('modal_amigos').setTitle('Ficha: Amigos da Família [AMIGO]');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('nome').setLabel('Seu Nome / Nick RP:').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('idade').setLabel('Sua Idade:').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('p1').setLabel('De quem você é amigo na Família?').setStyle(TextInputStyle.Paragraph).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('p2').setLabel('Quais jogos costuma jogar?').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
            return await interaction.showModal(modal);
        }

        // Submissão do Modal
        if (interaction.isModalSubmit() && (interaction.customId === 'modal_familia' || interaction.customId === 'modal_amigos')) {
            await interaction.deferReply({ ephemeral: true }).catch(() => {});

            const isFam = interaction.customId === 'modal_familia';
            const nome = interaction.fields.getTextInputValue('nome');
            const idade = interaction.fields.getTextInputValue('idade');
            const p1 = interaction.fields.getTextInputValue('p1');
            const p2 = interaction.fields.getTextInputValue('p2');

            let canalStaff = null;
            if (CONFIG.canalAprovacaoId) {
                canalStaff = interaction.guild?.channels.cache.get(CONFIG.canalAprovacaoId);
            }
            if (!canalStaff) {
                canalStaff = interaction.guild?.channels.cache.find(c => 
                    c.type === ChannelType.GuildText && (
                        c.name.includes('aprovacao') || c.name.includes('staff') || c.name.includes('registro') || c.name.includes('fichas')
                    )
                );
            }

            if (canalStaff) {
                const embedStaff = new EmbedBuilder()
                    .setColor(isFam ? 0xD4AF37 : 0x2ECC71)
                    .setTitle(`📥 NOVA FICHA • ${isFam ? '⚜️ FAMÍLIA NABRIZA [FN]' : '🤝 AMIGOS [AMIGO]'}`)
                    .setDescription(
                        `👤 **Membro:** <@${interaction.user.id}>\n` +
                        `🏷️ **Cargo:** ${isFam ? 'Família Nabriza' : 'Amigo da Família'}\n` +
                        `📝 **Nick Solicitado:** **${nome}**\n` +
                        `🎂 **Idade:** ${idade}\n\n` +
                        `📋 **Respostas:**\n> 1. ${p1}\n> 2. ${p2}`
                    )
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp();

                // Usa customId delimitado de forma segura sem quebrar com underscores
                const safeNick = encodeURIComponent(nome.replace(/\|/g, ''));
                const tipo = isFam ? 'fam' : 'amg';

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`apv|${interaction.user.id}|${tipo}|${safeNick}`)
                        .setLabel(`Aprovar ${isFam ? '[FN]' : '[AMIGO]'}`)
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('✅'),
                    new ButtonBuilder()
                        .setCustomId(`rep|${interaction.user.id}`)
                        .setLabel('Reprovar')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('❌')
                );

                await canalStaff.send({ embeds: [embedStaff], components: [row] }).catch(err => {
                    console.error('Erro ao enviar ficha staff:', err.message);
                });
            }

            return await interaction.editReply({
                content: `✅ **Sua ficha foi enviada com sucesso!** Aguarde a Staff aprovar para liberar os canais.`
            });
        }

        // Aprovação via Botão
        if (interaction.isButton() && (interaction.customId.startsWith('apv|') || interaction.customId.startsWith('aprovar_'))) {
            const temPerm = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) ||
                            interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);

            if (!temPerm) {
                return interaction.reply({ content: '❌ Apenas a Staff pode aprovar cadastros!', ephemeral: true });
            }

            await interaction.deferUpdate().catch(() => {});

            let userId, tipo, rawNick;
            if (interaction.customId.startsWith('apv|')) {
                const parts = interaction.customId.split('|');
                userId = parts[1];
                tipo = parts[2];
                rawNick = decodeURIComponent(parts[3] || '');
            } else {
                const parts = interaction.customId.split('_');
                userId = parts[1];
                tipo = parts[2];
                rawNick = decodeURIComponent(parts.slice(3).join('_') || '');
            }

            const isFam = tipo === 'fam' || tipo === 'familia';
            const member = await interaction.guild?.members.fetch(userId).catch(() => null);

            if (!member) {
                return interaction.followUp({ content: '⚠️ Membro não encontrado no servidor!', ephemeral: true });
            }

            const roleId = isFam ? CONFIG.cargoFamiliaId : CONFIG.cargoAmigosId;
            const role = interaction.guild?.roles.cache.get(roleId) ||
                         interaction.guild?.roles.cache.find(r => r.name.toLowerCase().includes(isFam ? 'família' : 'amigo'));

            if (role) await member.roles.add(role).catch(() => {});

            if (CONFIG.cargoNaoRegistradoId) {
                const roleNaoReg = interaction.guild?.roles.cache.get(CONFIG.cargoNaoRegistradoId) ||
                                   interaction.guild?.roles.cache.find(r => r.name.includes('Não Registrado'));
                if (roleNaoReg) await member.roles.remove(roleNaoReg).catch(() => {});
            }

            const novoNick = isFam ? `[FN] ${rawNick}` : `[AMIGO] ${rawNick}`;
            try {
                if (member.manageable) {
                    await member.setNickname(novoNick.substring(0, 32)).catch(() => {});
                }
            } catch (_) {}

            await interaction.editReply({
                content: `✅ **Aprovado por <@${interaction.user.id}>!** Cargo **${isFam ? '⚜️ Família Nabriza' : '🤝 Amigos'}** entregue e nick atualizado para \`${novoNick}\`.`,
                embeds: [],
                components: []
            });

            await member.send(`🎉 Sua ficha para **${isFam ? 'Família Nabriza' : 'Amigos'}** foi **APROVADA**! Bom jogo! ⚜️`).catch(() => {});
            return;
        }

        // Reprovação
        if (interaction.isButton() && (interaction.customId.startsWith('rep|') || interaction.customId.startsWith('reprovar_'))) {
            const temPerm = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) ||
                            interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);

            if (!temPerm) return interaction.reply({ content: '❌ Apenas a Staff pode reprovar cadastros!', ephemeral: true });

            return await interaction.update({
                content: `❌ **Registro Reprovado por <@${interaction.user.id}>.**`,
                embeds: [],
                components: []
            });
        }

        // Botões da Cartinha
        if (interaction.isButton() && interaction.customId.startsWith('btn_cartinha_')) {
            const diasNamoro = calcularDiasNamoro();
            const diasConhecendo = calcularDiasConhecendo();
            if (interaction.customId === 'btn_cartinha_namoro') {
                return interaction.reply({
                    content: `💍 **OFICIALMENTE NAMORADOS!** ❤️ Hoje estamos no nosso **${diasNamoro}º dia oficial de namoro**, e o Henrique promete amar e cuidar da Gabizinha para sempre! ✨🌹`,
                    ephemeral: true
                });
            }
            if (interaction.customId === 'btn_cartinha_amor') {
                return interaction.reply({
                    content: '💖 O Henrique é completamente apaixonado pela Gabizinha! Oficialmente namorados desde 27/09/2026! 🌹💍',
                    ephemeral: true
                });
            }
            if (interaction.customId === 'btn_cartinha_marco') {
                return interaction.reply({
                    content: `🌹 **LINHA DO TEMPO DO AMOR:**\n• Conhecer: 21/09/2026 a 26/09/2026\n• Namoro Sério: 27/09/2026\n• Total: ${diasNamoro}º dia de namoro • ${diasConhecendo} dias juntos! ✨`,
                    ephemeral: true
                });
            }
            if (interaction.customId === 'btn_cartinha_mulher') {
                return interaction.reply({
                    content: '👑 Gabizinha é a mulher da vida do Henrique e a dona do coração dele! 💍❤️',
                    ephemeral: true
                });
            }
        }
    } catch (err) {
        console.error('Erro na interação:', err);
    }
});

// ⏰ AGENDADOR PRECISO DAS 06:20 (HORÁRIO DE BRASÍLIA)
let ultimaDataEnvioCartinha = null;
setInterval(async () => {
    try {
        if (!client.isReady()) return;
        const { hora, minuto, dataStr } = getHorarioBrasilia();

        if (
            hora === CONFIG.horaEnvioCartinha &&
            minuto === CONFIG.minutoEnvioCartinha &&
            ultimaDataEnvioCartinha !== dataStr
        ) {
            console.log(`⏰ [AGENDADOR 06:20] Enviando Cartinha de Bom Dia de Brasília (${dataStr})...`);
            const enviado = await enviarCartinhaDiaria().catch(() => false);
            if (enviado) {
                ultimaDataEnvioCartinha = dataStr;
                console.log(`✅ [AGENDADOR] Cartinha enviada com sucesso para ${dataStr}!`);
            }
        }
    } catch (e) {
        console.error('Erro no agendador:', e.message || e);
    }
}, 30 * 1000); // Checa a cada 30 segundos

// 🔑 INICIALIZAÇÃO COM TOKEN DAS VARIABLES DO RAILWAY
if (!CONFIG.token || CONFIG.token.length < 25) {
    console.log('====================================================');
    console.log('⚠️ [RAILWAY SETUP - AGUARDANDO DISCORD_TOKEN]');
    console.log('Você não precisa de arquivo .env!');
    console.log('👉 No site da Railway:');
    console.log('   1. Abra seu Projeto e clique no Serviço');
    console.log('   2. Clique na aba "Variables"');
    console.log('   3. Adicione a variável: DISCORD_TOKEN');
    console.log('   4. Cole o seu token do Discord e salve!');
    console.log('====================================================');
} else {
    client.login(CONFIG.token).catch(err => {
        console.error('====================================================');
        console.error('❌ [ERRO AO LOGAR NO DISCORD]:', err.message);
        if (err.message.includes('disallowed intents') || err.code === 'DisallowedIntents') {
            console.error('📌 ATIVE OS PRIVILEGED GATEWAY INTENTS no Discord Developer Portal:');
            console.error('   • Server Members Intent');
            console.error('   • Message Content Intent');
            console.error('   • Presence Intent');
        }
        console.error('====================================================');
    });
}
