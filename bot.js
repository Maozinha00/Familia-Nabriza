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
 * - Registro com tags [FS] e [AMIGO].
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
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  Events, 
  ChannelType, 
  PermissionsBitField 
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
  corEmbedRegistro: "#D4AF37",
  corEmbedCartinha: "#FF4F9A",
  cargoFamiliaId: process.env.CARGO_FAMILIA_ID || "1546736138918694983",
  cargoAmigosId: process.env.CARGO_AMIGOS_ID || "1546736135965904926",
  cargoNaoRegistradoId: process.env.CARGO_NAO_REGISTRADO_ID || "1515125826780135480",
  canalAprovacaoId: process.env.CANAL_APROVACAO_ID || null,
  bannerPainelUrl: process.env.BANNER_PAINEL_URL || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop",
  canalCartinhaId: process.env.CANAL_CARTINHA_ID || "1560337299470946344",
  luisaUserId: process.env.LUISA_USER_ID || "1367645247655645205",
  nomeLuisa: "Luísa",
  nomeHenrique: "Henrique",
  bannerUrl: process.env.BANNER_URL || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop",
  dataInicioConhecer: "2026-10-14",
  // ⏰ NOVO HORÁRIO: 06:00 da Manhã (sem ser 2 da manhã!)
  horaEnvio: 6,
  minutoEnvio: 0,
  fusoEnvio: process.env.FUSO_ENVIO || "America/Sao_Paulo", // Brasília ou Europe/Lisbon
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

function getHorario(timeZone) {
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
  },
  {
    dia: 6,
    diaTitulo: "💫 DIA 06 — UMA CONEXÃO SURPREENDENTE",
    frase: "Nossa química é diferente de qualquer coisa que já vivi.",
    corpo: "Poucas pessoas conseguem marcar nossa vida de verdade tão rápido, mas você chegou com esse sorriso e virou minha prioridade. Quero poder te chamar de minha namorada muito em breve.\n\nTe desejo um dia cheio de vitórias e paz! 🌹",
    rodape: "💘 Henrique & Luísa • Dia 06"
  },
  {
    dia: 7,
    diaTitulo: "🌷 DIA 07 — UMA SEMANA DESDE O DIA 14/10",
    frase: "Sete dias conhecendo a garota mais fantástica do mundo!",
    corpo: "Bom dia, Luísa! 🌷\n\nUma semana inteira desde que Deus colocou você no meu caminho. Cada dia ao seu lado é uma página nova e bonita que quero continuar escrevendo para sempre.\n\nTenha uma manhã abençoada e alegre! 💕",
    rodape: "🌹 7 Dias de História • Henrique & Luísa • Dia 07"
  },
  {
    dia: 8,
    diaTitulo: "🌅 DIA 08 — A LUZ DO SEU SORRISO",
    frase: "Basta uma mensagem sua para mudar o meu humor completamente.",
    corpo: "Você tem um poder absurdo de trazer paz para o meu dia. Espero que essa mensagem chegue logo cedinho até você e arranque aquele sorriso lindo que só você tem.\n\nEstou aqui para tudo o que você precisar hoje e sempre! ❤️",
    rodape: "✨ Henrique ➔ Luísa • Dia 08"
  },
  {
    dia: 9,
    diaTitulo: "💘 DIA 09 — QUERO VOCÊ AO MEU LADO",
    frase: "A cada dia que passa, tenho mais certeza de que quero você como minha namorada.",
    corpo: "Conhecer você foi o melhor presente deste mês e cada detalhe seu me encanta mais. Não quero algo passageiro; quero construir algo sincero, duradouro e verdadeiro com você.\n\nTenha um dia espetacular, Luísa! 🌹",
    rodape: "💍 Futuro ao seu lado • Henrique & Luísa • Dia 09"
  },
  {
    dia: 10,
    diaTitulo: "🌹 DIA 10 — DEZ DIAS TE CONHECENDO",
    frase: "Dez dias com o coração batendo no compasso da sua presença.",
    corpo: "Já são 10 dias de muitas mensagens, carinho e sintonia sem igual. Essa história está só no começo e o meu sentimento por você só cresce a cada amanhecer.\n\nVocê é doce, incrível e única! 💖",
    rodape: "💘 Henrique & Luísa • 10 Dias • Dia 10"
  },
  {
    dia: 11,
    diaTitulo: "✨ DIA 11 — A DOÇURA DO SEU JEITO",
    frase: "A delicadeza do seu coração me conquista cada vez mais.",
    corpo: "Bom dia, meu bem! 🌸\n\nAdoro o som da sua voz e a leveza com que a gente conversa sobre qualquer assunto. Com você as horas voam e a vontade de estar junto só aumenta.\n\nTenha uma manhã repleta de coisas boas! 🌹",
    rodape: "💖 Henrique & Luísa • Dia 11"
  },
  {
    dia: 12,
    diaTitulo: "💎 DIA 12 — VOCÊ É UMA JOIA PRECIOSA",
    frase: "Quanto mais te conheço, mais descubro o quão rara você é.",
    corpo: "Você não é como a maioria das pessoas; tem valores, beleza na alma e uma simpatia contagiante. Me sinto um homem de muita sorte por ter você na minha vida!\n\nQue seu dia seja maravilhoso! ✨💍",
    rodape: "✨ Henrique & Luísa • Dia 12"
  },
  {
    dia: 13,
    diaTitulo: "💌 DIA 13 — MEU PENSAMENTO EM VOCÊ",
    frase: "O dia mal começou e a saudade de conversar com você já apertou.",
    corpo: "Acordar sabendo que tenho você para compartilhar risadas e confidências é bom demais. Nunca se esqueça do quanto você é especial para mim!\n\nUm abraço bem apertado, Luísa! ❤️",
    rodape: "🌹 De: Henrique • Para: Luísa • Dia 13"
  },
  {
    dia: 14,
    diaTitulo: "🌙 DIA 14 — DUAS SEMANAS DE PURA MAGIA",
    frase: "Duas semanas desde que nossos caminhos se cruzaram.",
    corpo: "Parece que te conheço há anos pela facilidade com que nos entendemos. Nesses 14 dias, você me provou que amor e cumplicidade nascem dos pequenos gestos sinceros.\n\nQue a nossa conexão continue crescendo assim! 🌹✨",
    rodape: "💍 14 Dias Conhecendo a Luísa • Dia 14"
  },
  {
    dia: 15,
    diaTitulo: "☀️ DIA 15 — CADA DIA MAIS APAIXONADO",
    frase: "Você se tornou o motivo dos meus melhores sorrisos.",
    corpo: "Chegamos ao 15º dia e eu só consigo agradecer por ter você na minha rotina. Você é doce, autêntica e extremamente preciosa para mim.\n\nTenha uma manhã tão linda e radiante quanto você! 🌹",
    rodape: "❤️ Henrique apaixonado • Dia 15"
  },
  {
    dia: 20,
    diaTitulo: "🌻 DIA 20 — MEU CORAÇÃO JÁ TE ESCOLHEU",
    frase: "Entre tantas escolhas no mundo, eu escolheria você mil vezes.",
    corpo: "Vinte dias se passaram e o que sinto por você só se fortalece a cada conversa. Mal posso esperar pelo momento em que vou poder te chamar oficialmente de minha namorada.\n\nUm beijo com todo o meu carinho, minha linda! 🌻",
    rodape: "✨ Henrique & Luísa • Dia 20"
  },
  {
    dia: 25,
    diaTitulo: "🏹 DIA 25 — TIRO CERTEIRO NO CORAÇÃO",
    frase: "Você acertou meu coração em cheio desde o primeiro 'oi'.",
    corpo: "Já são 25 dias te conhecendo e eu me encanto cada vez mais com sua personalidade, sua inteligência e sua bondade.\n\nQuero cuidar de você todos os dias! 💘🌹",
    rodape: "💘 Henrique Apaixonado • Dia 25"
  },
  {
    dia: 30,
    diaTitulo: "👑 DIA 30 — UM MÊS AO SEU LADO & A CERTEZA DO AMOR",
    frase: "Um mês conhecendo a melhor pessoa da minha vida, rumo a uma vida inteira juntos!",
    corpo: "Chegamos à nossa 30ª cartinha diária!\n\nForam 30 dias de muito afeto, conversas inesquecíveis e carinho genuíno. Desde aquele 14/10/2026, você transformou meus dias de uma maneira mágica.\n\nMeu coração é totalmente seu e eu quero fazer de você a mulher mais amada, respeitada e feliz do planeta! 💍❤️\n\nTe admiro, te quero e vou estar sempre aqui por você, minha Luísa!",
    rodape: "💍 Henrique & Luísa • Para Sempre • Dia 30"
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
      `🕐 **Horário:** ${h.horaStr}\n\n` +
      `💖 **Henrique & Luísa**\n*A história mais linda apenas começando.*`
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
  const pt = getHorario("Europe/Lisbon");
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({
    status: "ONLINE",
    ultimaCartaEnviada: `Carta ${estadoAtual.ultimoDiaEnviado}`,
    proximaCarta: `Carta ${estadoAtual.proximaCarta}`,
    agendamento: "06:00 da manhã (sem resetar os dias)",
    relogios: {
      brasilia: `${br.dataStr} às ${br.horaStr}`,
      portugal: `${pt.dataStr} às ${pt.horaStr}`
    }
  }, null, 2));
});

server.listen(CONFIG.port, () => {
  console.log(`🌐 [HTTP] Servidor escutando na porta ${CONFIG.port}`);
});

// Cliente Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
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
