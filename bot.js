/**
 * ============================================================================
 * ⚜️ BOT DISCORD OFICIAL • FAMÍLIA SOUZA & CARTINHAS DE AMOR HENRIQUE & LUÍSA 💌
 * ============================================================================
 * 
 * 🚀 VERSÃO ATUALIZADA & CORRIGIDA (SEM RESETAR OS DIAS E DISPARO ÀS 06:00)
 * - Persistência em bot_state.json: nunca mais reseta ao reiniciar na Railway!
 * - Ontem foi Carta 4 -> Hoje às 06:00 dispara a Carta 5!
 * - Horário corrigido de 2 da manhã para 06:00 em ponto!
 * - Mini servidor HTTP para Health Check na Railway (Porta 3000 ou process.env.PORT).
 * - Relógio duplo: Brasília e Portugal.
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

const STATE_FILE = path.join(__dirname, "bot_state.json");

// Anti-crash
process.on("unhandledRejection", (reason) => {
  console.error("🛡️ [ANTI-CRASH] Rejeição interceptada:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("🛡️ [ANTI-CRASH] Exceção:", err.message || err);
});

// Configurações
const CONFIG = {
  token: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.trim() : "",
  guildId: process.env.GUILD_ID ? process.env.GUILD_ID.trim() : null,
  canalCartinhaId: process.env.CANAL_CARTINHA_ID || "1560337299470946344",
  luisaUserId: process.env.LUISA_USER_ID || "1367645247655645205",
  bannerUrl: process.env.BANNER_URL || "https://i.imgur.com/AEJX7gL.jpeg",
  dataInicioConhecer: "2026-10-14",
  // ⏰ NOVO HORÁRIO: 06:00 da Manhã (sem ser 2 da manhã!)
  horaEnvio: 6,
  minutoEnvio: 0,
  fusoEnvio: "America/Sao_Paulo", // Exclusivo Horário de Brasília
  port: process.env.PORT || 3000
};

// Gerenciamento de Estado Persistente
function carregarEstado() {
  const padrao = {
    ultimoDiaEnviado: 4,
    proximaCarta: 5,
    ultimaDataEnvio: "2026-10-17",
    historico: []
  };
  try {
    if (fs.existsSync(STATE_FILE)) {
      return { ...padrao, ...JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")) };
    }
  } catch (e) {
    console.error("Erro ao ler estado:", e.message);
  }
  salvarEstado(padrao);
  return padrao;
}

function salvarEstado(estado) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(estado, null, 2), "utf-8");
  } catch (e) {
    console.error("Erro ao salvar estado:", e.message);
  }
}

let estadoAtual = carregarEstado();

function getHorario(timeZone = CONFIG.fusoEnvio) {
  const agora = new Date();
  const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
  });
  const parts = timeFormatter.formatToParts(agora);
  let hora = 0, minuto = 0, segundo = 0;
  for (const p of parts) {
    if (p.type === "hour") hora = parseInt(p.value, 10);
    if (p.type === "minute") minuto = parseInt(p.value, 10);
    if (p.type === "second") segundo = parseInt(p.value, 10);
  }
  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const isoFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return {
    hora,
    minuto,
    segundo,
    horaStr: `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`,
    dataStr: dateFormatter.format(agora),
    dataIso: isoFormatter.format(agora)
  };
}

// 💌 30 Cartinhas de Amor Completas
const CARTINHAS_LISTA = [
  {
    dia: 1,
    diaTitulo: "✨ DIA 01 — O DIA EM QUE VOCÊ ENTROU NA MINHA VIDA",
    frase: "No dia 14/10/2026 eu conheci a garota mais especial desse mundo.",
    corpo: "Bom dia, Luísa! 🌸\n\nDesde o primeiro momento em que começamos a conversar, eu percebi algo totalmente diferente em você. Seu jeito me chamou a atenção e você se tornou a melhor pessoa que já conheci.\n\nQue o seu dia seja iluminado, leve e cheio de paz. Estou muito feliz por ter te conhecido! 🌹✨",
    rodape: "🌹 Henrique & Luísa • 14/10/2026 • Dia 01"
  },
  {
    dia: 2,
    diaTitulo: "🌸 DIA 02 — CADA CONVERSA, UMA CERTEZA",
    frase: "Você tem um brilho único que alegra qualquer dia cinzento.",
    corpo: "Acordar e lembrar de você já faz a minha manhã ser muito melhor. Cada risada compartilhada e cada conversa me mostram o quanto você é incrível por dentro e por fora.\n\nTenha um dia lindo, minha princesa! ❤️",
    rodape: "💖 Henrique ➔ Luísa • Dia 02"
  },
  {
    dia: 3,
    diaTitulo: "💖 DIA 03 — VOCÊ NÃO SAI DO MEU PENSAMENTO",
    frase: "Antes mesmo de começar o dia, meu primeiro pensamento bom foi você.",
    corpo: "Bom dia, Luísa! 💖\n\nEu não consigo disfarçar o quanto você mexeu comigo. Você chegou de repente e já virou a dona dos meus melhores sorrisos. Meu coração sabe exatamente o que quer: você!\n\nTorcendo muito pelas suas conquistas hoje! 🌹",
    rodape: "✨ Conhecendo o Meu Amor • Dia 03"
  },
  {
    dia: 4,
    diaTitulo: "🌹 DIA 04 — MEU CUIDADO & CARINHO",
    frase: "Meu maior desejo diário é ver você sorrindo e bem com a vida.",
    corpo: "Você merece ser tratada como a joia rara que é. Quero estar sempre por perto para cuidar de você, te ouvir e te fazer sentir a mulher mais especial deste mundo.\n\nUm abraço quentinho para o seu dia! 🌹✨",
    rodape: "❤️ De: Henrique • Para: Luísa • Dia 04"
  },
  {
    dia: 5,
    diaTitulo: "☀️ DIA 05 — O DESTINO CERTO & MEU BOM DIA ESPECIAL",
    frase: "A gente se conheceu no dia 14/10 e tudo começou a fazer sentido.",
    corpo: "Bom dia, coisa linda! 💖\n\nÀs vezes fico pensando na sorte imensa de ter cruzado o seu caminho. Você é meiga, inteligente, divertida e tem uma energia que faz qualquer um se apaixonar.\n\nQue hoje, neste nosso 5º dia, o seu dia seja tão perfeito e radiante quanto o seu coração! ☀️🌹",
    rodape: "💍 Rumo ao Namoro • Henrique & Luísa 💕 • Dia 05"
  }
];

function getCartaPorDia(dia) {
  const achada = CARTINHAS_LISTA.find((c) => c.dia === dia);
  if (achada) return achada;
  return {
    dia,
    diaTitulo: `✨ DIA ${String(dia).padStart(2, '0')} — CONEXÃO & CARINHO DIÁRIO`,
    frase: `São ${dia} dias conhecendo a Luísa, a mulher mais fantástica!`,
    corpo: `Bom dia, minha princesa! 💖\n\nHoje completamos ${dia} dias desde que começamos a nos conhecer no dia 14/10/2026. A cada dia que passa, meu carinho e admiração por você só crescem.\n\nTenha um dia maravilhoso, Luísa! 🌹`,
    rodape: `💍 Henrique & Luísa • Dia ${dia}`
  };
}

function gerarPayloadCartinha(dia) {
  const carta = getCartaPorDia(dia);
  const tz = CONFIG.fusoEnvio;
  const h = getHorario(tz);

  const embed = new EmbedBuilder()
    .setColor(0xFF4F9A)
    .setImage(CONFIG.bannerUrl)
    .setAuthor({ name: "💌 CARTINHAS DE AMOR • HENRIQUE & LUÍSA" })
    .setTitle(carta.diaTitulo)
    .setDescription(
      `# 💖 Bom dia, minha princesa!\n\n` +
      `<@${CONFIG.luisaUserId}>\n\n` +
      `> 💌 **${carta.frase}**\n\n` +
      `${carta.corpo}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `## 🌹 Nossa História Começou\n\n` +
      `✨ **Nos conhecemos no dia**\n\`14/10/2026\`\n\n` +
      `⏳ **Estamos nos conhecendo há**\n**${dia} dias** de pura conexão e carinho!\n\n` +
      `💍 **Status do Henrique**\n*Completamente apaixonado, querendo a Luísa como namorada!* ❤️\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📅 **Data de Envio:** ${h.dataStr}\n` +
      `🕐 **Horário:** ${h.horaStr} (Brasília)\n\n` +
      `💖 **Henrique & Luísa**\n*A história mais linda apenas começando.*
`
    )
    .setThumbnail(`https://cdn.discordapp.com/avatars/${CONFIG.luisaUserId}/avatar.png`)
    .setFooter({ text: carta.rodape })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("btn_cartinha_conhecendo").setLabel("🌹 Melhor pessoa que conheci!").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("btn_cartinha_amor").setLabel("💖 Quero você como namorada!").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("btn_cartinha_marco").setLabel("✨ Conheci em 14/10/2026").setStyle(ButtonStyle.Primary)
  );

  return {
    content: `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\n        💌 **UMA CARTINHA PARA VOCÊ** 💌\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n<@${CONFIG.luisaUserId}> ❤️`,
    embeds: [embed],
    components: [row]
  };
}

// Servidor HTTP para Railway
const server = http.createServer((req, res) => {
  const br = getHorario("America/Sao_Paulo");
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({
    status: "ONLINE",
    fusoHorario: "Horário de Brasília (America/Sao_Paulo)",
    ultimaCartaEnviada: `Carta ${estadoAtual.ultimoDiaEnviado}`,
    proximaCarta: `Carta ${estadoAtual.proximaCarta}`,
    agendamento: "06:00 da manhã (sem resetar os dias)",
    relogioBrasilia: `${br.dataStr} às ${br.horaStr}`
  }, null, 2));
});

server.listen(CONFIG.port, () => {
  console.log(`🌐 [HTTP] Servidor escutando na porta ${CONFIG.port}`);
});

// Cliente Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.User]
});

async function dispararEnvioCarta(customDia) {
  const dia = customDia || estadoAtual.proximaCarta;
  const guild = client.guilds.cache.first();
  if (!guild) return false;

  let canal = guild.channels.cache.get(CONFIG.canalCartinhaId) ||
    guild.channels.cache.find((c) => c.isTextBased() && (c.name.includes("cartinha") || c.name.includes("amor")));

  if (!canal) return false;

  const payload = gerarPayloadCartinha(dia);
  await canal.send(payload);

  const h = getHorario(CONFIG.fusoEnvio);
  estadoAtual.ultimoDiaEnviado = dia;
  estadoAtual.proximaCarta = dia + 1;
  estadoAtual.ultimaDataEnvio = h.dataIso;
  salvarEstado(estadoAtual);

  console.log(`✅ [DISPARO SUCESSO] Carta ${dia} enviada para Luísa às ${h.horaStr} (${h.dataStr})! Próxima será Carta ${estadoAtual.proximaCarta}!`);
  return true;
}

client.once(Events.ClientReady, (c) => {
  console.log("====================================================");
  console.log(`🟢 [BOT ONLINE] ${c.user.tag}`);
  console.log(`⏰ HORÁRIO PROGRAMADO: 06:00 (Fuso: ${CONFIG.fusoEnvio})`);
  console.log(`💌 ÚLTIMA ENVIADA: Carta ${estadoAtual.ultimoDiaEnviado}`);
  console.log(`💌 PRÓXIMA CARTA: Carta ${estadoAtual.proximaCarta}`);
  console.log("====================================================");
});

// Agendador: checa a cada 20 segundos
setInterval(async () => {
  try {
    if (!client.isReady()) return;
    const h = getHorario(CONFIG.fusoEnvio);
    if (h.hora === CONFIG.horaEnvio && h.minuto === CONFIG.minutoEnvio && estadoAtual.ultimaDataEnvio !== h.dataIso) {
      console.log(`⏰ [HORA EXATA 06:00] Enviando Carta ${estadoAtual.proximaCarta}...`);
      await dispararEnvioCarta();
    }
  } catch (e) {
    console.error("Erro no loop:", e);
  }
}, 20 * 1000);

if (CONFIG.token && CONFIG.token.length > 25) {
  client.login(CONFIG.token).catch(console.error);
}
