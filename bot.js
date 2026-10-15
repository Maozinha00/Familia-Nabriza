/**
 * ============================================================================
 * ⚜️ BOT DISCORD OFICIAL • FAMÍLIA SOUZA & AMIGOS + CARTINHAS DE AMOR 💌
 * ============================================================================
 * 
 * 🚀 VERSÃO ATUALIZADA: HENRIQUE & LUÍSA (2026)
 * - Canal da Cartinha: 1560337299470946344
 * - Homenageada: Luísa (ID: 1367645247655645205)
 * - Marco inicial: 14/10/2026 (O dia em que se conheceram)
 * - Servidor: Família Souza [FS] & Amigos [AMIGO]
 * - Mini servidor HTTP para Health Check na Railway (Porta 3000).
 * - Fuso Horário duplo: Brasília (America/Sao_Paulo) e Portugal (Europe/Lisbon).
 * - Agendador automático: Envia a cartinha diária às 06:30 (Europe/Lisbon).
 * - Sistema de Registro com Tags automáticas ([FS] e [AMIGO]) e aprovação Staff.
 */

try {
	require("dotenv").config();
} catch (_) {}

const http = require("http");
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

// 🛡️ SISTEMA ANTI-CRASH PROFISSIONAL
process.on("unhandledRejection", (reason, promise) => {
	console.error("🛡️ [ANTI-CRASH] Rejeição interceptada:", reason);
});
process.on("uncaughtException", (err, origin) => {
	console.error(`🛡️ [ANTI-CRASH] Exceção (${origin}):`, err.message || err);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
	console.error(`🛡️ [ANTI-CRASH Monitor] Erro detectado (${origin}):`, err.message || err);
});

// ⚙️ CONFIGURAÇÕES GERAIS
const CONFIG = {
	// 🔑 Token do Bot
	token: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.trim() : "",
	guildId: process.env.GUILD_ID ? process.env.GUILD_ID.trim() : null,

	// 🎨 Cores Oficiais
	corEmbedRegistro: "#D4AF37",
	corEmbedCartinha: "#FF4F9A",

	// ⚜️ IDs de Cargos (Família Souza & Amigos)
	cargoChefeId: process.env.CARGO_CHEFE_ID ? process.env.CARGO_CHEFE_ID.trim() : null,
	cargoFamiliaId: process.env.CARGO_FAMILIA_ID ? process.env.CARGO_FAMILIA_ID.trim() : "1546736138918694983",
	cargoAmigosId: process.env.CARGO_AMIGOS_ID ? process.env.CARGO_AMIGOS_ID.trim() : "1546736135965904926",
	cargoNaoRegistradoId: process.env.CARGO_NAO_REGISTRADO_ID ? process.env.CARGO_NAO_REGISTRADO_ID.trim() : "1515125826780135480",

	// 📜 Canais de Registro & Staff
	canalAprovacaoId: process.env.CANAL_APROVACAO_ID ? process.env.CANAL_APROVACAO_ID.trim() : null,
	bannerPainelUrl: process.env.BANNER_PAINEL_URL || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop",

	// 💌 Configurações da Cartinha de Amor (Henrique & Luísa)
	canalCartinhaId: process.env.CANAL_CARTINHA_ID ? process.env.CANAL_CARTINHA_ID.trim() : "1560337299470946344",
	luisaUserId: process.env.LUISA_USER_ID ? process.env.LUISA_USER_ID.trim() : "1367645247655645205",
	nomeLuisa: "Luísa",
	nomeHenrique: "Henrique",
	bannerUrl: process.env.BANNER_URL || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop",

	// 📅 Marcos Oficiais
	dataInicioConhecer: "2026-10-14",

	// ⏰ Horário de Envio: 06:30 da Manhã em Portugal (Europe/Lisbon)
	horaEnvioPortugal: 6,
	minutoEnvioPortugal: 30,

	// Porta HTTP para Health Check da Railway
	port: process.env.PORT || 3000
};

// ⏰ FUNÇÕES DE HORÁRIO (BRASÍLIA & PORTUGAL)
function getHorarioBrasilia() {
	const agora = new Date();
	const formatter = new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: false
	});
	const parts = formatter.formatToParts(agora);
	let hora = 0, minuto = 0, segundo = 0;
	for (const p of parts) {
		if (p.type === "hour") hora = parseInt(p.value, 10);
		if (p.type === "minute") minuto = parseInt(p.value, 10);
		if (p.type === "second") segundo = parseInt(p.value, 10);
	}
	const dataFormatter = new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	});
	const horaStr = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
	return { hora, minuto, segundo, horaStr, dataStr: dataFormatter.format(agora) };
}

function getHorarioPortugal() {
	const agora = new Date();
	const formatter = new Intl.DateTimeFormat("pt-BR", {
		timeZone: "Europe/Lisbon",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: false
	});
	const parts = formatter.formatToParts(agora);
	let hora = 0, minuto = 0, segundo = 0;
	for (const p of parts) {
		if (p.type === "hour") hora = parseInt(p.value, 10);
		if (p.type === "minute") minuto = parseInt(p.value, 10);
		if (p.type === "second") segundo = parseInt(p.value, 10);
	}
	const dataFormatter = new Intl.DateTimeFormat("pt-BR", {
		timeZone: "Europe/Lisbon",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	});
	const horaStr = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
	return { hora, minuto, segundo, horaStr, dataStr: dataFormatter.format(agora) };
}

// 📅 CÁLCULO DE DIAS
function calcularDiasConhecendo(dataInicioStr = CONFIG.dataInicioConhecer) {
	const inicio = new Date(`${dataInicioStr}T00:00:00`);
	const hoje = new Date();
	const diffTime = Math.max(0, hoje.getTime() - inicio.getTime());
	return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// 💌 30 CARTINHAS DIÁRIAS (CONQUISTANDO A LUÍSA)
const CARTINHAS_30_DIAS = [
	{
		diaTitulo: "✨ DIA 01 — O DIA EM QUE VOCÊ ENTROU NA MINHA VIDA",
		frase: "No dia 14/10/2026 eu conheci a garota mais especial desse mundo.",
		corpo: "Bom dia, Luísa! 🌸\n\nDesde o primeiro momento em que começamos a conversar, eu percebi algo totalmente diferente em você. Seu jeito me chamou a atenção e você se tornou a melhor pessoa que já conheci.\n\nQue o seu dia seja iluminado, leve e cheio de paz. Estou muito feliz por ter te conhecido! 🌹✨",
		rodape: "🌹 Henrique & Luísa • 14/10/2026 • Dia 01"
	},
	{
		diaTitulo: "🌸 DIA 02 — CADA CONVERSA, UMA CERTEZA",
		frase: "Você tem um brilho único que alegra qualquer dia cinzento.",
		corpo: "Acordar e lembrar de você já faz a minha manhã ser muito melhor. Cada risada compartilhada e cada conversa me mostram o quanto você é incrível por dentro e por fora.\n\nTenha um dia lindo, minha princesa! ❤️",
		rodape: "💖 Henrique ➔ Luísa • Dia 02"
	},
	{
		diaTitulo: "💖 DIA 03 — VOCÊ NÃO SAI DO MEU PENSAMENTO",
		frase: "Antes mesmo de começar o dia, meu primeiro pensamento bom foi você.",
		corpo: "Bom dia, Luísa! 💖\n\nEu não consigo disfarçar o quanto você mexeu comigo. Você chegou de repente e já virou a dona dos meus melhores sorrisos. Meu coração sabe exatamente o que quer: você!\n\nTorcendo muito pelas suas conquistas hoje! 🌹",
		rodape: "✨ Conhecendo o Meu Amor • Dia 03"
	},
	{
		diaTitulo: "🌹 DIA 04 — MEU CUIDADO & CARINHO",
		frase: "Meu maior desejo diário é ver você sorrindo e bem com a vida.",
		corpo: "Você merece ser tratada como a joia rara que é. Quero estar sempre por perto para cuidar de você, te ouvir e te fazer sentir a mulher mais especial deste mundo.\n\nUm abraço quentinho para o seu dia! 🌹✨",
		rodape: "❤️ De: Henrique • Para: Luísa • Dia 04"
	},
	{
		diaTitulo: "☀️ DIA 05 — O DESTINO CERTO",
		frase: "A gente se conheceu no dia 14/10 e tudo começou a fazer sentido.",
		corpo: "Bom dia, coisa linda! 💖\n\nÀs vezes fico pensando na sorte imensa de ter cruzado o seu caminho. Você é meiga, inteligente e tem uma energia que faz qualquer um se apaixonar.\n\nQue hoje seu dia seja tão perfeito quanto seu coração! ☀️",
		rodape: "💍 Rumo ao Namoro • Henrique & Luísa 💕 • Dia 05"
	},
	{
		diaTitulo: "💫 DIA 06 — UMA CONEXÃO SURPREENDENTE",
		frase: "Nossa química é diferente de qualquer coisa que já vivi.",
		corpo: "Poucas pessoas conseguem marcar nossa vida de verdade, mas você chegou com esse sorriso e virou minha prioridade. Quero poder te chamar de minha namorada muito em breve.\n\nTe desejo um dia cheio de vitórias! 🌹",
		rodape: "💘 Henrique & Luísa • Dia 06"
	},
	{
		diaTitulo: "🌷 DIA 07 — UMA SEMANA DESDE O DIA 14/10",
		frase: "Sete dias conhecendo a garota mais fantástica do mundo!",
		corpo: "Bom dia, Luísa! 🌷\n\nUma semana inteira desde que Deus colocou você no meu caminho. Cada dia ao seu lado é uma página nova e bonita que quero continuar escrevendo para sempre.\n\nTenha uma manhã abençoada e alegre! 💕",
		rodape: "🌹 7 Dias de História • Henrique & Luísa • Dia 07"
	},
	{
		diaTitulo: "🌅 DIA 08 — A LUZ DO SEU SORRISO",
		frase: "Basta uma mensagem sua para mudar o meu humor completamente.",
		corpo: "Você tem um poder absurdo de trazer paz para o meu dia. Espero que essa mensagem chegue até você e arranque aquele sorriso lindo que só você tem.\n\nEstou aqui para tudo que você precisar! ❤️",
		rodape: "✨ Henrique ➔ Luísa • Dia 08"
	},
	{
		diaTitulo: "💘 DIA 09 — QUERO VOCÊ AO MEU LADO",
		frase: "A cada dia que passa, tenho mais certeza de que quero você como minha namorada.",
		corpo: "Conhecer você foi um presente e cada detalhe seu me encanta mais. Não quero algo passageiro; quero construir algo sincero, duradouro e verdadeiro com você.\n\nTenha um dia espetacular, Luísa! 🌹",
		rodape: "💍 Futuro ao seu lado • Dia 09"
	},
	{
		diaTitulo: "🌹 DIA 10 — 10 DIAS TE CONHECENDO",
		frase: "Dez dias com o coração batendo no compasso da sua presença.",
		corpo: "Já são 10 dias de muitas mensagens, carinho e sintonia. Essa história está só no começo e o meu sentimento por você só cresce a cada amanhecer.\n\nVocê é incrível demais! 💖",
		rodape: "💘 Henrique & Luísa • Dia 10"
	},
	{
		diaTitulo: "☀️ DIA 15 — CADA DIA MAIS APAIXONADO",
		frase: "Você se tornou o motivo dos meus melhores sorrisos.",
		corpo: "Chegamos ao 15º dia e eu só consigo agradecer por ter você na minha rotina. Você é doce, única e muito preciosa para mim.\n\nTenha uma manhã tão especial quanto você é! 🌹",
		rodape: "❤️ Henrique apaixonado • Dia 15"
	},
	{
		diaTitulo: "🌻 DIA 20 — MEU CORAÇÃO JÁ TE ESCOLHEU",
		frase: "Entre tantas escolhas no mundo, eu escolheria você mil vezes.",
		corpo: "Vinte dias se passaram e o que sinto por você só se fortalece. Mal posso esperar pelo momento em que vou poder te chamar oficialmente de minha namorada.\n\nUm beijo com todo o meu carinho! 🌻",
		rodape: "✨ Henrique & Luísa • Dia 20"
	},
	{
		diaTitulo: "👑 DIA 30 — UM MÊS AO SEU LADO & A CERTEZA DO AMOR",
		frase: "Um mês conhecendo a melhor pessoa da minha vida, rumo a uma vida inteira juntos!",
		corpo: "Chegamos à nossa 30ª cartinha diária!\n\nForam 30 dias de muito afeto, conversas inesquecíveis e carinho genuíno. Desde aquele 14/10/2026, você transformou meus dias.\n\nMeu coração é totalmente seu e eu quero fazer de você a mulher mais amada, respeitada e feliz do planeta! 💍❤️\n\nTe admiro e te quero muito, minha Luísa!",
		rodape: "💍 Henrique & Luísa • Para Sempre • Dia 30"
	}
];

// ============================================================================
// 🎨 GERADOR DA CARTINHA DE BOM DIA (HENRIQUE & LUÍSA)
// ============================================================================
function gerarEmbedCartinhaBomDia(customDia) {
	const diasConhecendo = calcularDiasConhecendo();
	const targetIndex = customDia !== undefined && customDia > 0 
		? (customDia - 1) % CARTINHAS_30_DIAS.length 
		: Math.max(0, (diasConhecendo - 1) % CARTINHAS_30_DIAS.length);

	const carta = CARTINHAS_30_DIAS[targetIndex];
	const agora = new Date();
	const dataAtual = new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	}).format(agora);

	const horaAtual = new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Sao_Paulo",
		hour: "2-digit",
		minute: "2-digit"
	}).format(agora);

	const bannerParaExibir = CONFIG.bannerUrl;

	const embed = new EmbedBuilder()
		.setColor(0xFF4F9A)
		.setImage(bannerParaExibir)
		.setAuthor({ name: "💌 CARTINHAS DE AMOR • HENRIQUE & LUÍSA" })
		.setTitle(`${carta.diaTitulo}`)
		.setDescription(
			`# 💖 Bom dia, minha princesa!\n\n` +
			`<@${CONFIG.luisaUserId}>\n\n` +
			`> 💌 **${carta.frase}**\n\n` +
			`${carta.corpo}\n\n` +
			`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
			`## 🌹 Nossa História Começou\n\n` +
			`✨ **Nos conhecemos no dia**\n` +
			`\`14/10/2026\`\n\n` +
			`⏳ **Estamos nos conhecendo há**\n` +
			`**${diasConhecendo} dias** de pura conexão e carinho!\n\n` +
			`💍 **Status do Henrique**\n` +
			`*Completamente encantado, querendo a Luísa como namorada!* ❤️\n\n` +
			`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
			`📅 **Hoje:** ${dataAtual}\n` +
			`🕐 **Horário:** ${horaAtual} — Brasília\n\n` +
			`💖 **Henrique & Luísa**\n` +
			`*A história mais linda apenas começando.*`
		)
		.setThumbnail(`https://cdn.discordapp.com/avatars/${CONFIG.luisaUserId}/avatar.png`)
		.setFooter({ text: carta.rodape })
		.setTimestamp();

	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("btn_cartinha_conhecendo")
			.setLabel("🌹 Melhor pessoa que conheci!")
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId("btn_cartinha_amor")
			.setLabel("💖 Quero você como namorada!")
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId("btn_cartinha_marco")
			.setLabel("✨ Conheci em 14/10/2026")
			.setStyle(ButtonStyle.Primary)
	);

	return {
		content: `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\n` +
		         `        💌 **UMA CARTINHA PARA VOCÊ** 💌\n` +
		         `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
		         `<@${CONFIG.luisaUserId}> ❤️`,
		embeds: [embed],
		components: [row]
	};
}

// ============================================================================
// 🌐 SERVIDOR HTTP LEVE PARA HEALTH CHECK DA RAILWAY
// ============================================================================
let client = null;

const server = http.createServer((req, res) => {
	const isReady = client && client.isReady();
	const br = getHorarioBrasilia();
	const pt = getHorarioPortugal();

	res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
	res.end(JSON.stringify({
		status: isReady ? "ONLINE NO DISCORD E NA RAILWAY" : "INICIANDO...",
		bot: client?.user ? client.user.tag : "Iniciando...",
		servidores: client?.guilds?.cache?.size || 0,
		horarios: {
			brasilia: `${br.dataStr} às ${br.horaStr} (America/Sao_Paulo)`,
			portugal: `${pt.dataStr} às ${pt.horaStr} (Europe/Lisbon)`
		},
		agendamentoCartinha: "06:30 da manhã em Portugal (Europe/Lisbon)",
		homenagem: {
			conheceu: "14/10/2026",
			homenageada: "Luísa",
			canalId: CONFIG.canalCartinhaId,
			diasConhecendo: `${calcularDiasConhecendo()} dias`
		}
	}, null, 2));
});

server.listen(CONFIG.port, () => {
	console.log(`🌐 [RAILWAY HTTP] Servidor de monitoramento escutando na porta ${CONFIG.port}`);
});

// ============================================================================
// 🤖 CLIENTE DISCORD
// ============================================================================
client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	],
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.User
	]
});

async function getTargetGuild() {
	if (CONFIG.guildId && client.guilds.cache.has(CONFIG.guildId)) {
		return client.guilds.cache.get(CONFIG.guildId);
	}
	return client.guilds.cache.first();
}

async function enviarCartinhaDiaria(customGuild, customDia) {
	const guild = customGuild || await getTargetGuild();
	if (!guild) {
		console.error("⚠️ [CARTINHA] Servidor Discord não encontrado.");
		return false;
	}

	let canal = guild.channels.cache.get(CONFIG.canalCartinhaId);
	if (!canal) {
		canal = guild.channels.cache.find((c) => c.type === ChannelType.GuildText && (c.name.toLowerCase().includes("cartinha") || c.name.toLowerCase().includes("amor") || c.name.toLowerCase().includes("luisa")));
	}
	if (!canal) {
		canal = guild.channels.cache.find((c) => c.type === ChannelType.GuildText && c.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages));
	}

	if (canal) {
		const payload = gerarEmbedCartinhaBomDia(customDia);
		await canal.send(payload);
		const pt = getHorarioPortugal();
		console.log(`💌 [CARTINHA] Bom dia enviado com sucesso para Luísa no canal ${canal.id} às ${pt.horaStr} (Portugal)!`);
		return true;
	}
	return false;
}

// ============================================================================
// ⚜️ SISTEMA DE REGISTRO FAMÍLIA SOUZA & AMIGOS
// ============================================================================
function gerarPainelEscolhaCargos() {
	const embed = new EmbedBuilder()
		.setColor(CONFIG.corEmbedRegistro)
		.setTitle("╔══════════════════════════════════════════════╗\n║ ⚜️ REGISTRO OFICIAL DE CARGOS ⚜️ ║\n║ FAMÍLIA SOUZA & AMIGOS ║\n╚══════════════════════════════════════════════╝")
		.setDescription(
			"👋 **Seja muito bem-vindo(a) ao servidor da Família Souza!**\n\n" +
			"Para liberar o acesso aos canais de texto, jogos, bate-papo e salas de voz, escolha a sua categoria:\n\n" +
			"⚜️ **1. FAMÍLIA SOUZA [FS]**\n" +
			"> Membro oficial da Família Souza. Libera canais exclusivos da Família, reuniões e eventos. Recebe tag `[FS]` no Nick.\n\n" +
			"🤝 **2. AMIGOS DA FAMÍLIA [AMIGO]**\n" +
			"> Amigo, aliado e parceiro para curtir as calls, resenhas e jogos. Recebe tag `[AMIGO]` no Nick.\n\n" +
			"──────────────────────────────────────────\n" +
			"📌 **COMO FUNCIONA O CADASTRO:**\n" +
			"1️⃣ Clique no botão correspondente abaixo (**Família** ou **Amigo**).\n" +
			"2️⃣ Preencha o formulário rápido com seu Nick RP e respostas.\n" +
			"3️⃣ A Staff avaliará sua ficha no canal de aprovação com 1 clique.\n" +
			"4️⃣ Sendo aprovado, seu cargo é entregue na hora e seu nick é atualizado com a tag!\n\n" +
			"👇 *Clique no botão abaixo para iniciar seu cadastro:*"
		)
		.setFooter({ text: "Família Souza & Amigos • Lealdade, União e Respeito ⚜️" })
		.setTimestamp();

	if (CONFIG.bannerPainelUrl) embed.setImage(CONFIG.bannerPainelUrl);

	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("btn_iniciar_familia").setLabel("Entrar na Família [FS]").setEmoji("⚜️").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId("btn_iniciar_amigos").setLabel("Entrar como Amigo [AMIGO]").setEmoji("🤝").setStyle(ButtonStyle.Success)
	);

	return { embeds: [embed], components: [row] };
}

function gerarCardRegistroMembro(user) {
	const embed = new EmbedBuilder()
		.setColor(CONFIG.corEmbedRegistro)
		.setTitle("⚜️ REGISTRO OFICIAL • FAMÍLIA SOUZA & AMIGOS ⚜️")
		.setDescription(
			`Olá ${user ? `<@${user.id}>` : "Membro"}! Seja muito bem-vindo(a) ao nosso servidor!\n\n` +
			"Para se cadastrar e liberar todos os canais de texto, resenha e salas de voz, escolha a sua categoria:\n\n" +
			"⚜️ **1. FAMÍLIA SOUZA [FS]**\n> Membro oficial da Família Souza. Recebe tag `[FS]` no Nick.\n\n" +
			"🤝 **2. AMIGOS DA FAMÍLIA [AMIGO]**\n> Amigo, aliado e parceiro para curtir o servidor. Recebe tag `[AMIGO]` no Nick.\n\n" +
			"──────────────────────────────────────────\n👇 *Clique em um dos botões abaixo:*"
		)
		.setFooter({ text: "Família Souza & Amigos • Lealdade, União e Respeito ⚜️" })
		.setTimestamp();

	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("btn_iniciar_familia").setLabel("Entrar na Família [FS]").setEmoji("⚜️").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId("btn_iniciar_amigos").setLabel("Entrar como Amigo [AMIGO]").setEmoji("🤝").setStyle(ButtonStyle.Success)
	);

	return { embeds: [embed], components: [row] };
}

async function configurarCanaisRegistro(guild) {
	const everyone = guild.roles.everyone;
	await configurarCargosOficiais(guild);

	let canalRegistro = guild.channels.cache.find((c) => c.type === ChannelType.GuildText && (c.name.includes("escolha-seu-cargo") || c.name === "registro" || c.name.includes("cargos")));
	if (!canalRegistro) {
		canalRegistro = await guild.channels.create({
			name: "📜・escolha-seu-cargo",
			type: ChannelType.GuildText,
			topic: "⚜️ Registro Oficial de Membros: Família Souza [FS] ou Amigos [AMIGO].",
			permissionOverwrites: [{
				id: everyone.id,
				allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
				deny: [PermissionsBitField.Flags.SendMessages]
			}]
		}).catch(() => null);
	}

	if (canalRegistro) {
		const painel = gerarPainelEscolhaCargos();
		const msgPainel = await canalRegistro.send(painel).catch(() => null);
		if (msgPainel) await msgPainel.pin().catch(() => {});
	}

	let canalStaff = CONFIG.canalAprovacaoId ? guild.channels.cache.get(CONFIG.canalAprovacaoId) : null;
	if (!canalStaff) {
		canalStaff = guild.channels.cache.find((c) => c.type === ChannelType.GuildText && (c.name.includes("aprovacao") || c.name.includes("fichas-registro") || c.name.includes("fichas")));
	}
	if (!canalStaff) {
		canalStaff = await guild.channels.create({
			name: "🛡️・fichas-aprovacao",
			type: ChannelType.GuildText,
			topic: "📥 Fichas de cadastro aguardando avaliação da Staff.",
			permissionOverwrites: [{ id: everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] }]
		}).catch(() => null);
	}

	return {
		canalRegistroId: canalRegistro ? canalRegistro.id : null,
		canalStaffId: canalStaff ? canalStaff.id : null
	};
}

async function configurarCargosOficiais(guild) {
	const rolesCreated = [];
	let roleChefe = guild.roles.cache.find((r) => r.name.includes("Chefe"));
	if (!roleChefe) {
		roleChefe = await guild.roles.create({
			name: "👑 Chefe",
			color: "#FFD700",
			hoist: true,
			permissions: [PermissionsBitField.Flags.ManageMessages]
		}).catch(() => null);
		if (roleChefe) rolesCreated.push("👑 Chefe");
	}

	let roleFamilia = guild.roles.cache.get(CONFIG.cargoFamiliaId) || guild.roles.cache.find((r) => r.name.includes("Família") || r.name.includes("Familia") || r.name.includes("Souza"));
	if (!roleFamilia) {
		roleFamilia = await guild.roles.create({ name: "⚜️ Família Souza", color: "#D4AF37", hoist: true }).catch(() => null);
		if (roleFamilia) rolesCreated.push("⚜️ Família Souza");
	}

	let roleAmigos = guild.roles.cache.get(CONFIG.cargoAmigosId) || guild.roles.cache.find((r) => r.name.includes("Amigo"));
	if (!roleAmigos) {
		roleAmigos = await guild.roles.create({ name: "🤝 Amigos", color: "#2ECC71", hoist: true }).catch(() => null);
		if (roleAmigos) rolesCreated.push("🤝 Amigos");
	}

	let roleNaoReg = guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) || guild.roles.cache.find((r) => r.name.includes("Não Registrado"));
	if (!roleNaoReg) {
		roleNaoReg = await guild.roles.create({ name: "❌ Não Registrado", color: "#95A5A6", hoist: false }).catch(() => null);
		if (roleNaoReg) rolesCreated.push("❌ Não Registrado");
	}

	return rolesCreated;
}

// ============================================================================
// 🤖 EVENTOS DO DISCORD BOT
// ============================================================================
client.once(Events.ClientReady, async (c) => {
	const br = getHorarioBrasilia();
	const pt = getHorarioPortugal();
	console.log("====================================================");
	console.log(`🟢 [BOT ONLINE NO RAILWAY] Conectado como: ${c.user.tag}`);
	console.log(`⚜️ Servidores Conectados: ${c.guilds.cache.size}`);
	console.log(`⏰ Horário Brasília: ${br.dataStr} às ${br.horaStr}`);
	console.log(`⏰ Horário Portugal: ${pt.dataStr} às ${pt.horaStr} (Envio às 06:30)`);
	console.log(`💌 Canal da Cartinha configurado: ${CONFIG.canalCartinhaId}`);
	console.log(`💌 Homenageando: Luísa (Desde 14/10/2026)`);
	console.log(`⚜️ Servidor Oficial: Família Souza`);
	console.log("====================================================");

	c.user.setPresence({
		activities: [{ name: "💌 Cartinhas para Luísa | ⚜️ Família Souza", type: 3 }],
		status: "online"
	});

	const slashCommands = [
		{ name: "cartinha", description: "💌 Envia uma cartinha diária para a Luísa no canal." },
		{ name: "status", description: "🌹 Exibe a contagem de dias te conhecendo e intenção de namoro!" },
		{ name: "horario", description: "⏰ Exibe os relógios ao vivo de Brasília e Portugal." },
		{ name: "registro", description: "⚜️ Abre sua ficha de cadastro para Família Souza [FS] ou Amigos [AMIGO]." },
		{ name: "painel", description: "⚜️ (Staff) Envia o Painel Oficial de Registro com botões." },
		{ name: "setupregistro", description: "⚙️ (Staff) Cria automaticamente os canais de registro." }
	];

	setTimeout(async () => {
		try {
			if (c.application) await c.application.commands.set(slashCommands).catch(() => {});
		} catch (_) {}
	}, 2000);
});

// Mensagens Prefixadas (!cartinha, !status, !horario, etc.)
client.on(Events.MessageCreate, async (msg) => {
	if (msg.author.bot || !msg.guild) return;
	const content = msg.content.trim().toLowerCase();

	// 💌 Cartinha para a Luísa
	if (content === "!cartinha" || content === "!amor" || content === "!carta") {
		const payload = gerarEmbedCartinhaBomDia();
		return msg.channel.send(payload);
	}

	// 🌹 Status do Amor (Henrique & Luísa)
	if (content === "!status" || content === "!luisa" || content === "!namoro") {
		const diasConhecendo = calcularDiasConhecendo();
		const embed = new EmbedBuilder()
			.setColor(CONFIG.corEmbedCartinha)
			.setTitle("🌹 STATUS DO CORAÇÃO • HENRIQUE & LUÍSA")
			.setDescription(
				`\`\`\`yaml\n` +
				`✨ HISTÓRIA: Conhecendo a mulher da minha vida ❤️\n` +
				`🗓️ NOS CONHECEMOS EM: 14/10/2026\n` +
				`⏳ DIAS JUNTOS: ${diasConhecendo}º Dia de Conexão\n` +
				`💍 OBJETIVO: Fazer da Luísa a minha namorada!\n` +
				`\`\`\`\n\n` +
				`👸 **A mulher mais incrível:** <@${CONFIG.luisaUserId}>\n` +
				`🤴 **Quem quer te fazer feliz:** **${CONFIG.nomeHenrique}**`
			);
		return msg.reply({ embeds: [embed] });
	}

	// ⏰ Relógios
	if (content === "!horario" || content === "!tempo") {
		const br = getHorarioBrasilia();
		const pt = getHorarioPortugal();
		const embed = new EmbedBuilder()
			.setColor(5793266)
			.setTitle("⏰ RELÓGIOS OFICIAIS")
			.setDescription(
				`🇧🇷 **Henrique (Brasília):** ${br.dataStr} às **${br.horaStr}**\n` +
				`🇵🇹 **Horário Portugal:** ${pt.dataStr} às **${pt.horaStr}**\n\n` +
				`💌 **Disparo das Cartinhas:** Diariamente às **06:30** no canal <#${CONFIG.canalCartinhaId}>!`
			);
		return msg.reply({ embeds: [embed] });
	}

	// ⚜️ Painel e Registro
	if (content === "!painel") {
		const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageRoles) || msg.member.permissions.has(PermissionsBitField.Flags.Administrator);
		if (!perms) return msg.reply(gerarCardRegistroMembro(msg.author));
		return msg.channel.send(gerarPainelEscolhaCargos());
	}

	if (content === "!registro" || content === "!cadastrar") {
		return msg.reply(gerarCardRegistroMembro(msg.author));
	}

	if (content === "!setupregistro") {
		const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageChannels) || msg.member.permissions.has(PermissionsBitField.Flags.Administrator);
		if (!perms) return msg.reply("❌ Apenas a Staff pode configurar canais.");
		const res = await configurarCanaisRegistro(msg.guild);
		return msg.reply(`✅ Canais configurados! Registro: <#${res.canalRegistroId}> | Staff: <#${res.canalStaffId}>`);
	}
});

// Interações (Slash Commands, Modais e Botões)
client.on(Events.InteractionCreate, async (interaction) => {
	try {
		if (interaction.isChatInputCommand()) {
			const { commandName } = interaction;
			if (commandName === "cartinha") return interaction.reply(gerarEmbedCartinhaBomDia());
			if (commandName === "status") {
				const diasConhecendo = calcularDiasConhecendo();
				return interaction.reply({
					content: `🌹 **Henrique & Luísa:** Nos conhecemos no dia **14/10/2026** (${diasConhecendo} dias te conhecendo)!\n> O Henrique tem a maior certeza do mundo de que quer a Luísa como namorada! ✨💖`,
					ephemeral: true
				});
			}
			if (commandName === "horario") {
				const br = getHorarioBrasilia();
				const pt = getHorarioPortugal();
				return interaction.reply({
					content: `⏰ **Relógios:**\n🇧🇷 Brasília: ${br.dataStr} às ${br.horaStr}\n🇵🇹 Portugal: ${pt.dataStr} às ${pt.horaStr}`,
					ephemeral: true
				});
			}
			if (commandName === "registro") return interaction.reply({ ...gerarCardRegistroMembro(interaction.user), ephemeral: true });
			if (commandName === "painel") {
				await interaction.channel?.send(gerarPainelEscolhaCargos());
				return interaction.reply({ content: "✅ Painel Oficial enviado!", ephemeral: true });
			}
			if (commandName === "setupregistro") {
				const res = await configurarCanaisRegistro(interaction.guild);
				return interaction.reply({ content: `✅ Canais configurados! Registro: <#${res.canalRegistroId}> | Staff: <#${res.canalStaffId}>`, ephemeral: true });
			}
		}

		// Botões dos Modais de Cadastro (Família Souza [FS])
		if (interaction.isButton() && interaction.customId === "btn_iniciar_familia") {
			const modal = new ModalBuilder().setCustomId("modal_familia").setTitle("Ficha: Família Souza [FS]");
			modal.addComponents(
				new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("nome").setLabel("Seu Nome / Nick RP:").setStyle(TextInputStyle.Short).setRequired(true)),
				new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("idade").setLabel("Sua Idade:").setStyle(TextInputStyle.Short).setRequired(true)),
				new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("p1").setLabel("Quem te convidou?").setStyle(TextInputStyle.Paragraph).setRequired(true)),
				new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("p2").setLabel("Concorda em honrar a tag [FS]?").setStyle(TextInputStyle.Paragraph).setRequired(true))
			);
			return await interaction.showModal(modal);
		}

		if (interaction.isButton() && interaction.customId === "btn_iniciar_amigos") {
			const modal = new ModalBuilder().setCustomId("modal_amigos").setTitle("Ficha: Amigos da Família [AMIGO]");
			modal.addComponents(
				new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("nome").setLabel("Seu Nome / Nick RP:").setStyle(TextInputStyle.Short).setRequired(true)),
				new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("idade").setLabel("Sua Idade:").setStyle(TextInputStyle.Short).setRequired(true)),
				new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("p1").setLabel("De quem você é amigo na Família?").setStyle(TextInputStyle.Paragraph).setRequired(true)),
				new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("p2").setLabel("Quais jogos costuma jogar?").setStyle(TextInputStyle.Paragraph).setRequired(true))
			);
			return await interaction.showModal(modal);
		}

		// Submissão do Modal
		if (interaction.isModalSubmit() && (interaction.customId === "modal_familia" || interaction.customId === "modal_amigos")) {
			await interaction.deferReply({ ephemeral: true }).catch(() => {});
			const isFam = interaction.customId === "modal_familia";
			const nome = interaction.fields.getTextInputValue("nome");
			const idade = interaction.fields.getTextInputValue("idade");
			const p1 = interaction.fields.getTextInputValue("p1");
			const p2 = interaction.fields.getTextInputValue("p2");

			let canalStaff = CONFIG.canalAprovacaoId ? interaction.guild?.channels.cache.get(CONFIG.canalAprovacaoId) : null;
			if (!canalStaff) {
				canalStaff = interaction.guild?.channels.cache.find((c) => c.type === ChannelType.GuildText && (c.name.includes("aprovacao") || c.name.includes("fichas")));
			}

			if (canalStaff) {
				const embedStaff = new EmbedBuilder()
					.setColor(isFam ? 13938487 : 3066993)
					.setTitle(`📥 NOVA FICHA • ${isFam ? "⚜️ FAMÍLIA SOUZA [FS]" : "🤝 AMIGOS [AMIGO]"}`)
					.setDescription(`👤 **Membro:** <@${interaction.user.id}>\n🏷️ **Cargo:** ${isFam ? "Família Souza" : "Amigo da Família"}\n📝 **Nick Solicitado:** **${nome}**\n🎂 **Idade:** ${idade}\n\n📋 **Respostas:**\n> 1. ${p1}\n> 2. ${p2}`)
					.setThumbnail(interaction.user.displayAvatarURL())
					.setTimestamp();

				const safeNick = encodeURIComponent(nome.replace(/\|/g, ""));
				const tipo = isFam ? "fam" : "amg";
				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`apv|${interaction.user.id}|${tipo}|${safeNick}`).setLabel(`Aprovar ${isFam ? "[FS]" : "[AMIGO]"}`).setStyle(ButtonStyle.Success).setEmoji("✅"),
					new ButtonBuilder().setCustomId(`rep|${interaction.user.id}`).setLabel("Reprovar").setStyle(ButtonStyle.Danger).setEmoji("❌")
				);

				await canalStaff.send({ embeds: [embedStaff], components: [row] }).catch(() => {});
			}
			return await interaction.editReply({ content: "✅ **Sua ficha foi enviada com sucesso!** Aguarde a avaliação da Staff para liberar os canais." });
		}

		// Aprovação Staff
		if (interaction.isButton() && interaction.customId.startsWith("apv|")) {
			const temPerm = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) || interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);
			if (!temPerm) return interaction.reply({ content: "❌ Apenas a Staff pode aprovar cadastros!", ephemeral: true });

			const parts = interaction.customId.split("|");
			const userId = parts[1];
			const tipo = parts[2];
			const rawNick = decodeURIComponent(parts[3] || "");
			const isFam = tipo === "fam";

			const member = await interaction.guild?.members.fetch(userId).catch(() => null);
			if (!member) return interaction.reply({ content: "⚠️ Membro não encontrado no servidor!", ephemeral: true });

			const roleId = isFam ? CONFIG.cargoFamiliaId : CONFIG.cargoAmigosId;
			const role = interaction.guild?.roles.cache.get(roleId) || interaction.guild?.roles.cache.find((r) => r.name.toLowerCase().includes(isFam ? "souza" : "amigo") || r.name.toLowerCase().includes("família"));
			if (role) await member.roles.add(role).catch(() => {});

			if (CONFIG.cargoNaoRegistradoId) {
				const roleNaoReg = interaction.guild?.roles.cache.get(CONFIG.cargoNaoRegistradoId) || interaction.guild?.roles.cache.find((r) => r.name.includes("Não Registrado"));
				if (roleNaoReg) await member.roles.remove(roleNaoReg).catch(() => {});
			}

			const novoNick = isFam ? `[FS] ${rawNick}` : `[AMIGO] ${rawNick}`;
			try {
				if (member.manageable) await member.setNickname(novoNick.substring(0, 32)).catch(() => {});
			} catch (_) {}

			await interaction.update({
				content: `✅ **Aprovado por <@${interaction.user.id}>!** Cargo **${isFam ? "⚜️ Família Souza" : "🤝 Amigos"}** entregue e nick atualizado para \`${novoNick}\`.`,
				embeds: [],
				components: []
			});
			await member.send(`🎉 Sua ficha para **${isFam ? "Família Souza" : "Amigos"}** foi **APROVADA**! Bom jogo! ⚜️`).catch(() => {});
			return;
		}

		// Reprovação Staff
		if (interaction.isButton() && interaction.customId.startsWith("rep|")) {
			const temPerm = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) || interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);
			if (!temPerm) return interaction.reply({ content: "❌ Apenas a Staff pode reprovar!", ephemeral: true });
			return await interaction.update({ content: `❌ **Registro Reprovado por <@${interaction.user.id}>.**`, embeds: [], components: [] });
		}

		// Botões das Cartinhas para a Luísa
		if (interaction.isButton() && interaction.customId.startsWith("btn_cartinha_")) {
			const diasConhecendo = calcularDiasConhecendo();

			if (interaction.customId === "btn_cartinha_conhecendo") {
				return interaction.reply({
					content: `🌹 **A MELHOR PESSOA DO MUNDO!** ❤️ O Henrique conheceu a Luísa no dia **14/10/2026** e tem certeza absoluta de que ela é especial demais! ✨`,
					ephemeral: true
				});
			}
			if (interaction.customId === "btn_cartinha_amor") {
				return interaction.reply({
					content: "💖 O Henrique está cada dia mais encantado pela Luísa e quer muito que ela seja a namorada dele! 💍🌹",
					ephemeral: true
				});
			}
			if (interaction.customId === "btn_cartinha_marco") {
				return interaction.reply({
					content: `✨ **LINHA DO TEMPO:**\n• Conheceu: 14/10/2026\n• Dias te conhecendo: ${diasConhecendo} dias de pura admiração e carinho! 🌹`,
					ephemeral: true
				});
			}
		}
	} catch (err) {
		console.error("Erro na interação:", err);
	}
});

// ============================================================================
// ⏰ AGENDADOR DAS 06:30 EM PORTUGAL (Europe/Lisbon)
// ============================================================================
let ultimaDataEnvioCartinha = null;

setInterval(async () => {
	try {
		if (!client.isReady()) return;
		const pt = getHorarioPortugal();
		if (pt.hora === CONFIG.horaEnvioPortugal && pt.minuto === CONFIG.minutoEnvioPortugal && ultimaDataEnvioCartinha !== pt.dataStr) {
			console.log(`⏰ [AGENDADOR 06:30 PORTUGAL] Enviando Cartinha de Bom Dia para Luísa (${pt.dataStr})...`);
			const enviado = await enviarCartinhaDiaria().catch(() => false);
			if (enviado) {
				ultimaDataEnvioCartinha = pt.dataStr;
				console.log(`✅ [AGENDADOR] Cartinha enviada com sucesso no canal ${CONFIG.canalCartinhaId} no dia ${pt.dataStr}!`);
			}
		}
	} catch (e) {
		console.error("Erro no agendador:", e.message || e);
	}
}, 30 * 1000);

// ============================================================================
// 🔑 INICIALIZAÇÃO
// ============================================================================
if (!CONFIG.token || CONFIG.token.length < 25) {
	console.log("====================================================");
	console.log("⚠️ [RAILWAY SETUP - AGUARDANDO DISCORD_TOKEN]");
	console.log("Adicione a variável DISCORD_TOKEN nas Variables da Railway.");
	console.log("====================================================");
} else {
	client.login(CONFIG.token).catch((err) => {
		console.error("====================================================");
		console.error("❌ [ERRO AO LOGAR NO DISCORD]:", err.message);
		console.error("====================================================");
	});
}
