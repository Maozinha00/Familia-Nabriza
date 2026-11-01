/**
 * 💌 HENRIQUE & NALA
 * Namoro: 01/11/2026
 * Envio automático: 06:00 — Brasília
 *
 * /cartinha — envia a carta de hoje no canal
 * /testar   — prévia privada, sem marcar Nala
 * /horario  — horários de Brasília e Portugal
 * /status   — situação das cartinhas
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
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  PermissionFlagsBits
} = require("discord.js");

const CONFIG = {
  token: (process.env.DISCORD_TOKEN || "").trim(),
  guildId: (process.env.GUILD_ID || "").trim(),
  canalId:
    (process.env.CANAL_CARTINHA_ID || "1560337299470946344").trim(),
  nalaId:
    (process.env.NALA_USER_ID || "1536514317841866873").trim(),
  banner:
    process.env.BANNER_URL || "https://i.imgur.com/AEJX7gL.jpeg",
  inicio: "2026-11-01",
  fuso: "America/Sao_Paulo",
  hora: 6,
  minuto: 0,
  porta: Number(process.env.PORT || 3000)
};

// Arquivo exclusivo para a nova história com Nala.
const STATE_FILE = path.join(
  __dirname,
  "bot_state_nala_2026-11-01.json"
);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

let enviando = false;
let timer;

function horario(fuso = CONFIG.fuso) {
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: fuso,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());

  const p = {};

  for (const parte of partes) {
    if (parte.type !== "literal") p[parte.type] = parte.value;
  }

  return {
    iso: `${p.year}-${p.month}-${p.day}`,
    data: `${p.day}/${p.month}/${p.year}`,
    hora: Number(p.hour),
    minuto: Number(p.minute),
    texto: `${p.hour}:${p.minute}:${p.second}`
  };
}

function diaNamoro() {
  const hoje = horario().iso;

  return Math.floor(
    (
      Date.parse(`${hoje}T00:00:00Z`) -
      Date.parse(`${CONFIG.inicio}T00:00:00Z`)
    ) / 86400000
  ) + 1;
}

function carregarEstado() {
  const padrao = {
    ultimoDiaEnviado: 0,
    proximaCarta: 1,
    ultimaDataEnvio: null,
    horaEnvio: CONFIG.hora,
    minutoEnvio: CONFIG.minuto,
    fusoEnvio: CONFIG.fuso,
    historico: []
  };

  if (!fs.existsSync(STATE_FILE)) return padrao;

  // Um arquivo inválido gera erro para evitar reenvio por reset silencioso.
  const salvo = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));

  return {
    ...padrao,
    ...salvo,
    historico: Array.isArray(salvo.historico) ? salvo.historico : []
  };
}

function salvarEstado(novoEstado) {
  const temporario = `${STATE_FILE}.tmp`;

  fs.writeFileSync(
    temporario,
    JSON.stringify(novoEstado, null, 2),
    "utf8"
  );

  fs.renameSync(temporario, STATE_FILE);
}

let estado = carregarEstado();

const CARTAS = [
  {
    titulo: "O COMEÇO DO NOSSO NAMORO",
    frase: "01/11/2026: o começo da nossa história juntos.",
    texto:
      "Bom dia, Nala! 🌸\n\n" +
      "Hoje começa uma nova página da nossa história. " +
      "Estou feliz por ter você ao meu lado e quero " +
      "construir com você um namoro cheio de carinho, " +
      "respeito e companheirismo.\n\n" +
      "Que este seja o primeiro de muitos bons dias " +
      "que vamos compartilhar. ❤️"
  },
  {
    titulo: "FELIZ POR TER VOCÊ",
    frase: "Pensar em você deixa minha manhã mais bonita.",
    texto:
      "Bom dia, minha princesa! 💖\n\n" +
      "É muito bom lembrar que estamos juntos. " +
      "Quero aproveitar nossas conversas, nossas risadas " +
      "e cada momento que pudermos viver lado a lado.\n\n" +
      "Tenha um dia lindo, Nala! 🌹"
  },
  {
    titulo: "MEU PRIMEIRO PENSAMENTO",
    frase: "Meu primeiro pensamento bom do dia foi você.",
    texto:
      "Bom dia, Nala! ☀️\n\n" +
      "Você trouxe novos motivos para eu sorrir. " +
      "Quero conhecer cada vez mais seu jeito e " +
      "compartilhar com você as pequenas alegrias da vida.\n\n" +
      "Estou torcendo pelas suas conquistas! ❤️"
  },
  {
    titulo: "CUIDADO E CARINHO",
    frase: "Quero que você se sinta querida ao meu lado.",
    texto:
      "Bom dia, meu amor! 🌹\n\n" +
      "Quero te ouvir, respeitar seu espaço e cuidar " +
      "do que estamos construindo. Que nunca faltem " +
      "conversa, carinho e parceria entre nós.\n\n" +
      "Receba um abraço apertado para começar o dia! 💖"
  },
  {
    titulo: "NOSSA HISTÓRIA CONTINUA",
    frase: "Cada dia juntos é uma nova página da nossa história.",
    texto:
      "Bom dia, coisa linda! 💖\n\n" +
      "Gosto de compartilhar meus dias com você e " +
      "quero que a gente continue criando boas lembranças. " +
      "Que nosso namoro cresça com respeito e carinho.\n\n" +
      "Que hoje você tenha muitos motivos para sorrir! ☀️"
  },
  {
    titulo: "SUA COMPANHIA",
    frase: "Sua companhia faz diferença nos meus dias.",
    texto:
      "Bom dia, Nala! 🌸\n\n" +
      "Mesmo nos dias corridos, quero encontrar " +
      "um tempinho para saber como você está e " +
      "compartilhar um pouco do meu dia com você.\n\n" +
      "Que sua manhã seja leve, minha princesa! ❤️"
  },
  {
    titulo: "NOSSOS MOMENTOS",
    frase: "As pequenas coisas ficam especiais com você.",
    texto:
      "Bom dia, meu amor! 💖\n\n" +
      "Uma conversa, uma risada ou um momento juntos " +
      "já são motivos para guardar boas lembranças. " +
      "Quero continuar vivendo tudo isso com você.\n\n" +
      "Tenha um dia cheio de paz, Nala! 🌹"
  }
];

function payloadCarta(dia, previa = false) {
  // Após a sétima carta, os textos se alternam semanalmente.
  const carta = CARTAS[(dia - 1) % CARTAS.length];
  const agora = horario();

  const embed = new EmbedBuilder()
    .setColor(0xff4f9a)
    .setAuthor({
      name: "💌 CARTINHAS DE AMOR • HENRIQUE & NALA"
    })
    .setTitle(
      `💖 DIA ${String(dia).padStart(2, "0")} — ${carta.titulo}`
    )
    .setDescription(
      `> **${carta.frase}**\n\n` +
      `${carta.texto}\n\n` +
      "━━━━━━━━━━━━━━━━━━━━\n\n" +
      "💍 **Henrique & Nala**\n" +
      "📅 Juntos desde **01/11/2026**\n" +
      `🌹 **Dia ${dia} do nosso namoro**\n\n` +
      `🕐 ${agora.data} às ${agora.texto} — Brasília`
    )
    .setFooter({
      text: previa
        ? "Prévia privada • não altera o histórico"
        : "Com carinho, Henrique ❤️"
    })
    .setTimestamp();

  if (CONFIG.banner) embed.setImage(CONFIG.banner);

  const botoes = new ActionRowBuilder().addComponents(
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
      .setLabel("💍 Desde 01/11/2026")
      .setStyle(ButtonStyle.Primary)
  );

  return {
    content: previa
      ? "🔎 **PRÉVIA DA CARTINHA**"
      : `💌 **Uma cartinha para você, Nala!**\n<@${CONFIG.nalaId}> ❤️`,
    embeds: [embed],
    components: [botoes],
    allowedMentions: {
      parse: [],
      users: previa ? [] : [CONFIG.nalaId]
    }
  };
}

async function enviarCarta() {
  if (enviando) return "⏳ Já existe um envio em andamento.";

  enviando = true;

  try {
    const agora = horario();
    const dia = diaNamoro();

    if (dia < 1) {
      return "📅 As cartinhas começam em 01/11/2026.";
    }

    if (estado.ultimaDataEnvio === agora.iso) {
      return "💌 A cartinha de hoje já foi enviada.";
    }

    const canal = await client.channels.fetch(CONFIG.canalId);

    if (!canal || !canal.isTextBased() || !canal.send) {
      throw new Error("Canal de cartinhas não encontrado ou incompatível.");
    }

    if (CONFIG.guildId && canal.guildId !== CONFIG.guildId) {
      throw new Error("O canal não pertence ao servidor configurado.");
    }

    const mensagem = await canal.send(payloadCarta(dia));

    const novoEstado = {
      ...estado,
      ultimoDiaEnviado: dia,
      proximaCarta: dia + 1,
      ultimaDataEnvio: agora.iso,
      historico: [
        ...estado.historico,
        {
          dia,
          data: agora.iso,
          horario: agora.texto,
          status: "Enviada com sucesso",
          mensagemId: mensagem.id
        }
      ]
    };

    // Mantém a proteção contra duplicação nesta execução,
    // mesmo se houver uma falha ao gravar o arquivo.
    estado = novoEstado;
    salvarEstado(estado);

    console.log(`✅ Cartinha do dia ${dia} enviada para Nala.`);

    return `✅ Cartinha enviada em <#${CONFIG.canalId}>!`;
  } finally {
    enviando = false;
  }
}

function embedStatus() {
  const dia = diaNamoro();

  return new EmbedBuilder()
    .setColor(0xff4f9a)
    .setTitle("💌 Status • Henrique & Nala")
    .addFields(
      {
        name: "💍 Início do namoro",
        value: "01/11/2026",
        inline: true
      },
      {
        name: "🌹 Dia do namoro",
        value: dia > 0 ? String(dia) : "Ainda não começou",
        inline: true
      },
      {
        name: "📨 Última carta enviada",
        value: estado.ultimoDiaEnviado
          ? `Dia ${estado.ultimoDiaEnviado}`
          : "Nenhuma"
      },
      {
        name: "📅 Último envio",
        value: estado.ultimaDataEnvio || "Nenhum"
      },
      {
        name: "⏰ Envio automático",
        value: "06:00 — Brasília"
      },
      {
        name: "📍 Canal",
        value: `<#${CONFIG.canalId}>`
      }
    )
    .setTimestamp();
}

const COMANDOS = [
  {
    name: "cartinha",
    description: "Envia a cartinha do dia para Nala.",
    default_member_permissions:
      PermissionFlagsBits.ManageGuild.toString()
  },
  {
    name: "testar",
    description: "Mostra uma prévia privada da cartinha.",
    default_member_permissions:
      PermissionFlagsBits.ManageGuild.toString()
  },
  {
    name: "horario",
    description: "Mostra os horários de Brasília e Portugal."
  },
  {
    name: "status",
    description: "Mostra o status das cartinhas de Henrique e Nala."
  }
];

async function registrarComandos() {
  // Atualiza versões globais antigas sem apagar outros comandos.
  const globais = await client.application.commands.fetch();

  for (const comando of COMANDOS) {
    const antigo = globais.find(
      (item) => item.name === comando.name && item.type === 1
    );

    if (antigo) {
      await client.application.commands.edit(antigo.id, comando);
    }
  }

  const servidores = CONFIG.guildId
    ? [await client.guilds.fetch(CONFIG.guildId)]
    : [...client.guilds.cache.values()];

  for (const servidor of servidores) {
    // create atualiza comandos existentes com o mesmo nome.
    for (const comando of COMANDOS) {
      await servidor.commands.create(comando);
    }

    console.log(`✅ Comandos atualizados em ${servidor.name}.`);
  }
}

async function verificarAgendamento() {
  if (!client.isReady()) return;

  const agora = horario();
  const minutosAgora = agora.hora * 60 + agora.minuto;
  const minutosEnvio = CONFIG.hora * 60 + CONFIG.minuto;

  // Se o bot iniciar depois das 06h, envia a carta
  // de hoje, desde que ainda não tenha sido enviada.
  if (
    minutosAgora >= minutosEnvio &&
    estado.ultimaDataEnvio !== agora.iso &&
    diaNamoro() >= 1
  ) {
    await enviarCarta();
  }
}

client.once(Events.ClientReady, async (bot) => {
  console.log(`🟢 Conectado como ${bot.user.tag}`);
  console.log("💖 Henrique & Nala • 01/11/2026");
  console.log("⏰ Cartinhas às 06:00 — Brasília");

  try {
    await registrarComandos();
  } catch (erro) {
    console.error("❌ Erro ao registrar comandos:", erro);
  }

  try {
    await verificarAgendamento();
  } catch (erro) {
    console.error("❌ Erro no envio inicial:", erro);
  }

  timer = setInterval(() => {
    verificarAgendamento().catch((erro) => {
      console.error("❌ Erro no agendamento:", erro);
    });
  }, 20000);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isButton()) {
      const respostas = {
        btn_cartinha_conhecendo:
          "🌹 Nala, você é muito especial para mim! — Henrique",
        btn_cartinha_amor:
          "💖 Feliz por compartilhar essa história com você! — Henrique",
        btn_cartinha_marco:
          `💍 Henrique & Nala • Desde 01/11/2026\n` +
          `🌹 Dia ${diaNamoro()} do nosso namoro.`
      };

      const resposta = respostas[interaction.customId];

      if (resposta) {
        await interaction.reply({
          content: resposta,
          flags: 64
        });
      }

      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const nome = interaction.commandName;

    if (!COMANDOS.some((comando) => comando.name === nome)) {
      return;
    }

    if (nome === "cartinha" || nome === "testar") {
      if (
        !interaction.inGuild() ||
        !interaction.memberPermissions?.has(
          PermissionFlagsBits.ManageGuild
        )
      ) {
        await interaction.reply({
          content: "❌ Você precisa da permissão Gerenciar Servidor.",
          flags: 64
        });
        return;
      }
    }

    if (nome === "cartinha") {
      await interaction.deferReply({ flags: 64 });
      await interaction.editReply(await enviarCarta());
      return;
    }

    if (nome === "testar") {
      await interaction.reply({
        ...payloadCarta(Math.max(1, diaNamoro()), true),
        flags: 64
      });
      return;
    }

    if (nome === "status") {
      await interaction.reply({
        embeds: [embedStatus()],
        flags: 64
      });
      return;
    }

    if (nome === "horario") {
      const brasil = horario("America/Sao_Paulo");
      const portugal = horario("Europe/Lisbon");

      const embed = new EmbedBuilder()
        .setColor(0xff4f9a)
        .setTitle("🕐 Brasília e Portugal")
        .addFields(
          {
            name: "🇧🇷 Brasília",
            value: `${brasil.data} — ${brasil.texto}`
          },
          {
            name: "🇵🇹 Lisboa",
            value: `${portugal.data} — ${portugal.texto}`
          },
          {
            name: "💌 Cartinhas",
            value: "Todos os dias às 06:00 de Brasília."
          }
        )
        .setFooter({
          text: "Horários no momento da consulta"
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        flags: 64
      });
    }
  } catch (erro) {
    console.error("❌ Erro na interação:", erro);

    const resposta = {
      content:
        "❌ Não consegui concluir. Confira os logs da hospedagem."
    };

    try {
      if (interaction.deferred) {
        await interaction.editReply(resposta);
      } else if (interaction.replied) {
        await interaction.followUp({
          ...resposta,
          flags: 64
        });
      } else {
        await interaction.reply({
          ...resposta,
          flags: 64
        });
      }
    } catch (erroResposta) {
      console.error("Erro ao responder:", erroResposta);
    }
  }
});

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(JSON.stringify({
    status: client.isReady() ? "ONLINE" : "DESCONECTADO",
    casal: "Henrique & Nala",
    inicioNamoro: "01/11/2026",
    diaNamoro: diaNamoro(),
    ultimaDataEnvio: estado.ultimaDataEnvio,
    ultimoDiaEnviado: estado.ultimoDiaEnviado,
    agendamento: "06:00 — Brasília",
    horario: horario()
  }, null, 2));
});

server.on("error", (erro) => {
  console.error("❌ Erro no servidor HTTP:", erro);
});

server.listen(CONFIG.porta, "0.0.0.0", () => {
  console.log(`🌐 HTTP ativo na porta ${CONFIG.porta}`);
});

process.on("unhandledRejection", (erro) => {
  console.error("❌ Rejeição não tratada:", erro);
});

function encerrar() {
  if (timer) clearInterval(timer);
  client.destroy();
  server.close(() => process.exit(0));
}

process.once("SIGTERM", encerrar);
process.once("SIGINT", encerrar);

if (CONFIG.token) {
  client.login(CONFIG.token).catch((erro) => {
    console.error("❌ Falha ao conectar ao Discord:", erro);
    process.exitCode = 1;
    server.close();
  });
} else {
  console.error(
    "❌ Configure DISCORD_TOKEN nas variáveis da hospedagem."
  );
}
