/**
 * 💌 CARTINHAS DE AMOR • HENRIQUE & NALA
 * Início do namoro: 01/11/2026
 * Envio diário: 06:00 — Brasília
 */

try {
  require("dotenv").config();
} catch (_) {}

const http = require("http");
const fs = require("fs");
const path = require("path");

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require("discord.js");

const STATE_FILE = path.join(
  __dirname,
  "bot_state_nala_2026-11-01.json"
);

// Configurações
const CONFIG = {
  token: (process.env.DISCORD_TOKEN || "").trim(),
  guildId: (process.env.GUILD_ID || "").trim(),
  canalCartinhaId:
    process.env.CANAL_CARTINHA_ID || "1560337299470946344",
  nalaUserId:
    process.env.NALA_USER_ID || "1536514317841866873",
  bannerUrl:
    process.env.BANNER_URL || "https://i.imgur.com/AEJX7gL.jpeg",
  dataInicioNamoro: "2026-11-01",
  horaEnvio: 6,
  minutoEnvio: 0,
  fusoEnvio: "America/Sao_Paulo",
  port: process.env.PORT || 3000
};

process.on("unhandledRejection", (reason) => {
  console.error("🛡️ Rejeição não tratada:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🛡️ Exceção:", err);
});

// Estado das cartinhas
function salvarEstado(estado) {
  try {
    fs.writeFileSync(
      STATE_FILE,
      JSON.stringify(estado, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("Erro ao salvar estado:", err.message);
  }
}

function carregarEstado() {
  const padrao = {
    ultimoDiaEnviado: 0,
    proximaCarta: 1,
    ultimaDataEnvio: null,
    historico: []
  };

  try {
    if (fs.existsSync(STATE_FILE)) {
      return {
        ...padrao,
        ...JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"))
      };
    }
  } catch (err) {
    console.error("Erro ao ler estado:", err.message);
  }

  salvarEstado(padrao);
  return padrao;
}

let estadoAtual = carregarEstado();

function getHorario(timeZone = CONFIG.fusoEnvio) {
  const agora = new Date();

  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(agora);

  const valores = {};

  for (const parte of partes) {
    if (parte.type !== "literal") {
      valores[parte.type] = parte.value;
    }
  }

  return {
    hora: Number(valores.hour),
    minuto: Number(valores.minute),
    segundo: Number(valores.second),
    horaStr: `${valores.hour}:${valores.minute}`,
    dataStr: `${valores.day}/${valores.month}/${valores.year}`,
    dataIso: `${valores.year}-${valores.month}-${valores.day}`
  };
}

function getDiaNamoro() {
  const hoje = getHorario().dataIso;

  const inicio = Date.parse(
    `${CONFIG.dataInicioNamoro}T00:00:00Z`
  );

  const atual = Date.parse(`${hoje}T00:00:00Z`);

  // 01/11 é o Dia 01 do namoro.
  return Math.floor((atual - inicio) / 86400000) + 1;
}

// Cartinhas dos primeiros dias
const CARTINHAS_LISTA = [
  {
    dia: 1,
    diaTitulo: "✨ DIA 01 — O COMEÇO DO NOSSO NAMORO",
    frase:
      "No dia 01/11/2026 começou a nossa história juntos, Nala.",
    corpo:
      "Bom dia, Nala! 🌸\n\n" +
      "Hoje começa uma nova página da nossa história, e eu " +
      "estou muito feliz por ter você ao meu lado. Quero " +
      "construir com você um namoro cheio de carinho, " +
      "respeito, companheirismo e momentos especiais.\n\n" +
      "Que este seja o primeiro de muitos bons dias que " +
      "vamos compartilhar. Estou feliz por estarmos " +
      "juntos, meu amor! ❤️🌹",
    rodape: "🌹 Henrique & Nala • 01/11/2026 • Dia 01"
  },
  {
    dia: 2,
    diaTitulo: "🌸 DIA 02 — FELIZ POR TER VOCÊ",
    frase:
      "Você tem um brilho único que deixa meus dias mais bonitos.",
    corpo:
      "Bom dia, minha princesa! 💖\n\n" +
      "Acordar e lembrar que estamos juntos já deixa " +
      "minha manhã mais leve. Quero aproveitar cada " +
      "conversa, cada risada e cada momento com você.\n\n" +
      "Que seu dia seja tranquilo e cheio de coisas boas. " +
      "Receba meu carinho, Nala! 🌸❤️",
    rodape: "💖 Henrique & Nala • Dia 02"
  },
  {
    dia: 3,
    diaTitulo: "💖 DIA 03 — MEU PRIMEIRO PENSAMENTO",
    frase:
      "Antes mesmo de começar o dia, meu primeiro pensamento bom foi você.",
    corpo:
      "Bom dia, Nala! 💖\n\n" +
      "Você chegou e trouxe novos motivos para eu sorrir. " +
      "É muito bom saber que agora podemos viver essa " +
      "história juntos, um dia de cada vez.\n\n" +
      "Estou torcendo pelas suas conquistas e quero " +
      "estar por perto nos dias bons e nos difíceis " +
      "também. Tenha uma manhã linda! 🌹",
    rodape: "✨ Ao lado do meu amor • Henrique & Nala • Dia 03"
  },
  {
    dia: 4,
    diaTitulo: "🌹 DIA 04 — MEU CUIDADO E CARINHO",
    frase:
      "Meu desejo é que você se sinta querida e respeitada ao meu lado.",
    corpo:
      "Bom dia, meu amor! 🌹\n\n" +
      "Quero te ouvir, conhecer cada vez mais seu jeito " +
      "e cuidar do que estamos construindo. Que nosso " +
      "namoro tenha espaço para carinho, conversa " +
      "e muitos momentos felizes.\n\n" +
      "Um abraço apertado para começar seu dia, Nala! ❤️",
    rodape: "❤️ De Henrique para Nala • Dia 04"
  },
  {
    dia: 5,
    diaTitulo: "☀️ DIA 05 — NOSSA HISTÓRIA CONTINUA",
    frase:
      "Estamos juntos desde 01/11 e quero construir uma história linda com você.",
    corpo:
      "Bom dia, coisa linda! 💖\n\n" +
      "Chegamos ao nosso quinto dia de namoro, e eu " +
      "quero continuar descobrindo tudo que faz você " +
      "ser tão especial. Suas conversas e seu jeito " +
      "já fazem parte dos meus melhores momentos.\n\n" +
      "Que hoje não faltem motivos para sorrir. " +
      "Você tem meu carinho, minha princesa! ☀️🌹",
    rodape: "💍 Nosso namoro • Henrique & Nala • Dia 05"
  }
];

function getCartaPorDia(dia) {
  const carta = CARTINHAS_LISTA.find(
    (item) => item.dia === dia
  );

  if (carta) return carta;

  return {
    dia,
    diaTitulo:
      `✨ DIA ${String(dia).padStart(2, "0")} — MAIS UM DIA JUNTOS`,
    frase:
      `Nala, é bom viver mais um dia dessa história com você!`,
    corpo:
      "Bom dia, minha princesa! 💖\n\n" +
      `Hoje é o dia ${dia} do nosso namoro, que começou ` +
      "em 01/11/2026. Quero continuar construindo com " +
      "você uma relação de carinho, respeito e parceria.\n\n" +
      "Que seu dia seja leve e cheio de boas notícias. " +
      "Estou aqui torcendo por você, Nala! 🌹❤️",
    rodape: `💍 Henrique & Nala • Dia ${dia}`
  };
}

function gerarPayloadCartinha(dia) {
  const carta = getCartaPorDia(dia);
  const horario = getHorario();

  const embed = new EmbedBuilder()
    .setColor(0xff4f9a)
    .setImage(CONFIG.bannerUrl)
    .setAuthor({
      name: "💌 CARTINHAS DE AMOR • HENRIQUE & NALA"
    })
    .setTitle(carta.diaTitulo)
    .setDescription(
      "# 💖 Bom dia, minha princesa!\n\n" +
      `<@${CONFIG.nalaUserId}>\n\n` +
      `> 💌 **${carta.frase}**\n\n` +
      `${carta.corpo}\n\n` +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
      "## 🌹 Nossa história\n\n" +
      "✨ **Estamos juntos desde**\n" +
      "`01/11/2026`\n\n" +
      "⏳ **Nosso dia de namoro**\n" +
      `**Dia ${dia}** de carinho e companheirismo!\n\n` +
      "💍 **Status do Henrique**\n" +
      "*Namorando a Nala desde 01/11/2026!* ❤️\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
      `📅 **Data de envio:** ${horario.dataStr}\n` +
      `🕐 **Horário:** ${horario.horaStr} (Brasília)\n\n` +
      "💖 **Henrique & Nala**\n" +
      "*Nossa história sendo escrita um dia de cada vez.*"
    )
    .setFooter({ text: carta.rodape })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("btn_cartinha_conhecendo")
      .setLabel("🌹 Você é especial!")
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId("btn_cartinha_amor")
      .setLabel("💖 Feliz por namorar você!")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("btn_cartinha_marco")
      .setLabel("✨ Juntos desde 01/11/2026")
      .setStyle(ButtonStyle.Primary)
  );

  return {
    content:
      "╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\n" +
      "        💌 **UMA CARTINHA PARA VOCÊ** 💌\n" +
      "╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n" +
      `<@${CONFIG.nalaUserId}> ❤️`,
    embeds: [embed],
    components: [row],
    allowedMentions: {
      parse: [],
      users: [CONFIG.nalaUserId]
    }
  };
}

// Servidor HTTP
const server = http.createServer((req, res) => {
  const horario = getHorario();

  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(
    JSON.stringify(
      {
        status: "ONLINE",
        casal: "Henrique & Nala",
        inicioNamoro: "01/11/2026",
        diaNamoro: getDiaNamoro(),
        ultimaCartaEnviada: estadoAtual.ultimoDiaEnviado,
        proximaCarta: estadoAtual.proximaCarta,
        agendamento: "06:00 — Brasília",
        relogioBrasilia:
          `${horario.dataStr} às ${horario.horaStr}`
      },
      null,
      2
    )
  );
});

server.listen(CONFIG.port, () => {
  console.log(
    `🌐 Servidor HTTP escutando na porta ${CONFIG.port}`
  );
});

// Cliente Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.User
  ]
});

let envioEmAndamento = false;

async function dispararEnvioCarta() {
  if (envioEmAndamento) return false;

  envioEmAndamento = true;

  try {
    const horario = getHorario();
    const dia = getDiaNamoro();

    if (dia < 1) return false;

    if (estadoAtual.ultimaDataEnvio === horario.dataIso) {
      return false;
    }

    const canal = await client.channels.fetch(
      CONFIG.canalCartinhaId
    );

    if (
      !canal ||
      !canal.isTextBased() ||
      typeof canal.send !== "function"
    ) {
      console.error(
        "❌ Canal de cartinhas não encontrado ou incompatível."
      );
      return false;
    }

    if (
      CONFIG.guildId &&
      canal.guildId !== CONFIG.guildId
    ) {
      console.error(
        "❌ O canal não pertence ao servidor configurado."
      );
      return false;
    }

    await canal.send(gerarPayloadCartinha(dia));

    estadoAtual.ultimoDiaEnviado = dia;
    estadoAtual.proximaCarta = dia + 1;
    estadoAtual.ultimaDataEnvio = horario.dataIso;

    salvarEstado(estadoAtual);

    console.log(
      `✅ Carta do dia ${dia} enviada para Nala ` +
      `às ${horario.horaStr} de ${horario.dataStr}.`
    );

    return true;
  } finally {
    envioEmAndamento = false;
  }
}

client.once(Events.ClientReady, (bot) => {
  console.log(`🟢 Bot conectado: ${bot.user.tag}`);
  console.log("💖 Henrique & Nala • 01/11/2026");
  console.log("⏰ Envio diário: 06:00 — Brasília");
  console.log(`📅 Dia do namoro: ${getDiaNamoro()}`);
});

// Respostas dos botões
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const respostas = {
    btn_cartinha_conhecendo:
      "🌹 Nala, você é muito especial para mim! — Henrique",
    btn_cartinha_amor:
      "💖 Estou feliz por estarmos juntos, minha princesa! — Henrique",
    btn_cartinha_marco:
      `💍 Henrique & Nala: juntos desde 01/11/2026. ` +
      `Hoje é o dia ${getDiaNamoro()} do nosso namoro!`
  };

  const resposta = respostas[interaction.customId];
  if (!resposta) return;

  try {
    await interaction.reply({
      content: resposta,
      flags: 64
    });
  } catch (err) {
    console.error(
      "Erro ao responder botão:",
      err.message
    );
  }
});

// Verifica o horário a cada 20 segundos.
setInterval(async () => {
  try {
    if (!client.isReady()) return;

    const horario = getHorario();

    if (
      horario.hora === CONFIG.horaEnvio &&
      horario.minuto === CONFIG.minutoEnvio &&
      estadoAtual.ultimaDataEnvio !== horario.dataIso
    ) {
      await dispararEnvioCarta();
    }
  } catch (err) {
    console.error("Erro ao enviar cartinha:", err);
  }
}, 20 * 1000);

if (CONFIG.token) {
  client.login(CONFIG.token).catch((err) => {
    console.error("❌ Erro ao conectar ao Discord:", err.message);
  });
} else {
  console.log(
    "⚠️ Configure DISCORD_TOKEN no .env ou nas variáveis da hospedagem."
  );
}
