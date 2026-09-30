/**
* ============================================================================
* ⚜️ BOT DISCORD OFICIAL • FAMÍLIA & AMIGOS + CARTINHAS DE AMOR 💌
* ============================================================================
* 
* 🚀 OTIMIZADO PARA RAILWAY (2026):
* - Mini servidor HTTP para o Health Check da Railway na porta 3000.
* - Suporta variáveis direto das "Variables" da Railway (sem precisar de .env).
* - Fuso Horário duplo: Identifica Brasília (America/Sao_Paulo) e Portugal (Europe/Lisbon).
* - Agendador automático: Envia a cartinha às 06:30 de Portugal (Europe/Lisbon).
* - NOVO MODELO DA CARTA: Embed Rosa (#FF4F9A), Moldura ASCII, Banner, Marcos 21/09 e 27/09.
* - Sistema de Registro com Tag automática no Nick ([FN] e [AMIGO]) e aprovação Staff.
* - Anti-crash reforçado para manter o bot 24/7 online.
*/
try {
	require("dotenv").config();
} catch (_) {}
const http = require("http");
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events, ChannelType, PermissionsBitField } = require("discord.js");
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
// ⚙️ CONFIGURAÇÕES (Lidas das Variables da Railway)
const CONFIG = {
	// 🔑 Token do Bot
	token: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.trim() : "",
	guildId: process.env.GUILD_ID ? process.env.GUILD_ID.trim() : null,
	// 🎨 Cores Oficiais
	corEmbedRegistro: "#D4AF37",
	corEmbedCartinha: "#FF4F9A",
	// ⚜️ IDs de Cargos (Família Nabriza & Amigos)
	cargoChefeId: process.env.CARGO_CHEFE_ID ? process.env.CARGO_CHEFE_ID.trim() : null,
	cargoFamiliaId: process.env.CARGO_FAMILIA_ID ? process.env.CARGO_FAMILIA_ID.trim() : "1546736138918694983",
	cargoAmigosId: process.env.CARGO_AMIGOS_ID ? process.env.CARGO_AMIGOS_ID.trim() : "1546736135965904926",
	cargoNaoRegistradoId: process.env.CARGO_NAO_REGISTRADO_ID ? process.env.CARGO_NAO_REGISTRADO_ID.trim() : "1515125826780135480",
	// 📜 Canais de Registro & Staff
	canalAprovacaoId: process.env.CANAL_APROVACAO_ID ? process.env.CANAL_APROVACAO_ID.trim() : null,
	bannerPainelUrl: process.env.BANNER_PAINEL_URL || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop",
	// 💌 Configurações da Cartinha de Amor (Henrique & Gabizinha)
	canalCartinhaId: process.env.CANAL_CARTINHA_ID ? process.env.CANAL_CARTINHA_ID.trim() : "1552914452146294864",
	gabizinhaUserId: process.env.GABIZINHA_USER_ID ? process.env.GABIZINHA_USER_ID.trim() : "1280444697231364183",
	nomeGabizinha: "✞ 𝑮𝒂𝒃𝒊𝒛𝒊𝒏𝒉𝒂 ✞",
	nomeHenrique: "Henrique",
	bannerUrl: process.env.BANNER_URL || "https://i.imgur.com/SEU_BANNER_AQUI.png",
	// 📅 Marcos Oficiais de Amor
	dataInicioConhecer: "2026-09-21",
	dataFimConhecer: "2026-09-26",
	dataInicioNamoro: "2026-09-27",
	// ⏰ Horário de Envio: 06:30 da Manhã em Portugal (Europe/Lisbon)
	horaEnvioPortugal: 6,
	minutoEnvioPortugal: 30,
	// Porta HTTP para Health Check da Railway
	port: process.env.PORT || 3e3
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
	return {
		hora,
		minuto,
		segundo,
		horaStr,
		dataStr: dataFormatter.format(agora)
	};
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
	return {
		hora,
		minuto,
		segundo,
		horaStr,
		dataStr: dataFormatter.format(agora)
	};
}
// 📅 CÁLCULO DE DIAS DO RELACIONAMENTO
function calcularDiasNamoro(dataInicioStr = CONFIG.dataInicioNamoro) {
	const inicio = new Date(`${dataInicioStr}T00:00:00`);
	const hoje = new Date();
	const diffTime = Math.max(0, hoje.getTime() - inicio.getTime());
	return Math.floor(diffTime / (1e3 * 60 * 60 * 24)) + 1;
}
function calcularDiasConhecendo(dataInicioStr = CONFIG.dataInicioConhecer) {
	const inicio = new Date(`${dataInicioStr}T00:00:00`);
	const hoje = new Date();
	const diffTime = Math.max(0, hoje.getTime() - inicio.getTime());
	return Math.floor(diffTime / (1e3 * 60 * 60 * 24)) + 1;
}
// 💌 30 CARTINHAS DIÁRIAS COMPLETAS
const CARTINHAS_30_DIAS = [
	{
		diaTitulo: "💍 DIA 01 — O INÍCIO DO NOSSO NAMORO SÉRIO",
		frase: "Nos conhecemos do dia 21/09 até ontem, e hoje, 27/09/2026, você é oficialmente a dona do meu coração e minha namorada!",
		corpo: "Bom dia, minha namorada linda! ❤️\n\nHoje é o dia mais feliz e especial de todos: o início oficial do nosso namoro sério! Desde o primeiro momento em que começamos a conversar no dia 21/09, meu coração já sabia que você era diferente de tudo. Esses dias conhecendo você só me deram a maior certeza da minha vida: eu quero estar com você, cuidar de você e te fazer a mulher mais feliz do mundo.\n\nQue seu primeiro dia oficialmente como minha namorada seja maravilhoso, abençoado e cheio de sorrisos! Te amo demais! 🌹💍",
		rodape: "💍 Henrique & Gabizinha • Nosso Primeiro Dia de Namoro Sério 💕 • Dia 01"
	},
	{
		diaTitulo: "🌸 DIA 02 — MEU ORGULHO EM TER VOCÊ",
		frase: "Você não imagina o orgulho e a alegria que eu sinto em poder te chamar de minha namorada.",
		corpo: "Acordar sabendo que agora é sério, que somos namorados e que tenho ao meu lado a garota mais incrível desse mundo é a melhor sensação da vida. Seu sorriso ilumina o meu dia inteiro.\n\nQue a sua manhã seja tranquila, doce e cheia de paz. Nunca se esqueça que tem um namorado aqui completamente louco por você! ❤️",
		rodape: "💍 Henrique & Gabizinha • Namoro Sério 27/09 💕 • Dia 02"
	},
	{
		diaTitulo: "💖 DIA 03 — VOCÊ EM MEUS PENSAMENTOS",
		frase: "Antes mesmo do despertador tocar, você já era o primeiro e mais lindo pensamento do meu dia.",
		corpo: "Bom dia, minha princesa! 💖\n\nPassamos do dia 21 ao 26 nos descobrindo e nos encantando, e agora cada manhã ao seu lado tem um sabor de realização. Estar em um namoro sério com você é o maior presente que Deus me deu.\n\nTenha um dia leve, cheio de motivos para sorrir e lembre-se: seu namorado está torcendo e rezando por você o tempo todo! 🌹",
		rodape: "💍 Oficialmente Namorados • Henrique & Gabizinha 💕 • Dia 03"
	},
	{
		diaTitulo: "🌹 DIA 04 — MEU CUIDADO & CARINHO",
		frase: "Meu objetivo diário é cuidar de você, te proteger e arrancar os seus sorrisos mais sinceros.",
		corpo: "Hoje eu só queria te lembrar de uma certeza absoluta:\n\n\"Você é a mulher da minha vida e a minha maior prioridade.\"\n\nQue o seu dia seja tão radiante e especial quanto você é para mim. Que nada nem ninguém tire a sua paz. Te amo com todo o meu coração! 🌹💍",
		rodape: "❤️ Do seu namorado apaixonado, Henrique • Dia 04"
	},
	{
		diaTitulo: "☀️ DIA 05 — O DESTINO CERTO",
		frase: "A gente se conheceu no dia 21/09 e hoje tudo faz sentido: você nasceu para ser minha namorada.",
		corpo: "Bom dia, minha vida! 💖\n\nÀs vezes eu paro e penso na sorte que eu tive de cruzar o seu caminho. Em tão pouco tempo você virou meu porto seguro, minha melhor companhia e a dona dos meus melhores planos.\n\n\"Meu desejo para hoje: que seu coração sinta todo o amor e carinho que eu guardo aqui para você.\" ❤️",
		rodape: "💍 Henrique & Gabizinha • Amor Real & Sincero 💕 • Dia 05"
	},
	{
		diaTitulo: "💫 DIA 06 — NOSSA CONEXÃO",
		frase: "Nossa química e a nossa lealdade mostram que o que temos é único e abençoado.",
		corpo: "Algumas pessoas passam pela nossa vida sem deixar rastro, mas você chegou para ficar e construir um futuro lindo comigo. Agora que assumimos esse namoro sério, tenho certeza de que estamos no caminho certo.\n\nTenha um dia cheio de vitórias e conquistas, minha gatinha! Te amo! 🌹",
		rodape: "💘 Henrique ➔ Minha Namorada Gabizinha • Dia 06"
	},
	{
		diaTitulo: "🌷 DIA 07 — UMA SEMANA DA NOSSA HISTÓRIA",
		frase: "Já são 7 dias desde que nos conhecemos no dia 21/09 e cada segundo valeu a pena para estarmos namorando hoje!",
		corpo: "Bom dia, meu grande amor! 💖\n\nUma semana inteira desde o momento em que Deus colocou você na minha vida. Foram dias se conhecendo, rindo juntos, trocando olhares e mensagens, até chegar no nosso 27/09 do namoro sério.\n\n\"Espero que hoje seu dia seja leve, colorido e cheio de motivos para você ser muito feliz.\" Cuide-se bem, minha namorada! 🌹",
		rodape: "💍 7 Dias de História • Henrique & Gabizinha 💕 • Dia 07"
	},
	{
		diaTitulo: "🌅 DIA 08 — O SOM DA SUA PRESENÇA",
		frase: "O seu sorriso é o meu combustível e a coisa mais perfeita que eu já vi.",
		corpo: "Que o primeiro sorriso do seu dia seja pensado em mim e que o último pensamento antes de dormir traga a certeza de que você é amada e respeitada como uma verdadeira rainha.\n\n\"Você merece todos os abraços quentes, todo o carinho e toda a felicidade desse mundo.\" 💕",
		rodape: "🌹 De: Henrique • Para: Gabizinha (Minha Namorada) • Dia 08"
	},
	{
		diaTitulo: "💘 DIA 09 — CERTEZA DO MEU CORAÇÃO",
		frase: "Você mudou minha rotina, meus planos e trouxe paz para a minha vida.",
		corpo: "Talvez você não faça ideia, mas uma simples mensagem de \"bom dia\" vinda de você ilumina a minha manhã toda. Assumir esse namoro sério foi a decisão mais acertada que tomei.\n\nTenha um dia maravilhoso, minha gatinha. Estou aqui sempre com você, para o que der e vier! 🌷",
		rodape: "💖 Henrique ➔ Gabizinha • Namoro Sério 💕 • Dia 09"
	},
	{
		diaTitulo: "🌹 DIA 10 — 10 DIAS JUNTOS & APAIXONADOS",
		frase: "Dez dias de história linda e esse namoro está apenas no comecinho de uma vida toda.",
		corpo: "Já se passaram 10 dias desde que conversamos pela primeira vez no dia 21/09. E cada manhã que passa, meu amor por você só aumenta e ganha mais força.\n\n\"Ainda tenho infinitos beijos, abraços e declarações para te entregar todos os dias.\" ❤️\n\nQue seu dia seja tão lindo quanto você!",
		rodape: "💘 Henrique & Gabizinha • Para Sempre 💕 • Dia 10"
	},
	{
		diaTitulo: "☀️ DIA 15 — MEU COMPROMISSO COM VOCÊ",
		frase: "Meu compromisso com você é de lealdade, respeito, carinho e amor verdadeiro todos os dias.",
		corpo: "Chegamos à metade do nosso primeiro mês de cartinhas diárias! E se tem algo que só cresceu desde o nosso pedido de namoro no dia 27/09, foi o meu sentimento por você.\n\n\"Que o seu dia seja repleto de boas notícias e muito amor!\" 🌹",
		rodape: "❤️ Henrique (Seu Namorado) • Dia 15"
	},
	{
		diaTitulo: "🌻 DIA 20 — 20 DIAS DE HISTÓRIA",
		frase: "Vinte dias de mensagens, vinte dias de carinho e a certeza de que esse namoro é para a vida toda.",
		corpo: "Vinte dias, meu amor! E cada amanhecer ao seu lado me dá mais ânimo para sonhar alto com o nosso futuro.\n\n\"Se essa mensagem arrancar um sorriso do seu rosto, meu dia já ganhou sentido.\" ❤️",
		rodape: "🌹 Henrique & Gabizinha • Namorados Oficiais • Dia 20"
	},
	{
		diaTitulo: "👑 DIA 30 — UM MÊS DE CARTINHAS & UMA VIDA AO SEU LADO",
		frase: "Foram 30 manhãs de carinho, mas a nossa história de namoro sério é para a vida toda!",
		corpo: "Chegamos à nossa 30ª cartinha diária de bom dia!\n\nForam 30 manhãs, 30 mensagens e 30 declarações do quanto você mudou a minha vida.\n\nFicamos nos conhecendo do dia 21/09 até 26/09, e no dia 27/09/2026 oficializamos nosso namoro sério. E essa foi a melhor escolha que já fiz.\n\n\"Eu quero continuar ao seu lado, cuidando de você, te amando e te fazendo a mulher mais feliz do mundo por todos os dias que virão.\" ❤️💍\n\nTe amo mais que tudo, minha namorada eterna!",
		rodape: "💍 Henrique & Gabizinha • Namoro Sério Para Sempre 💕 • Dia 30"
	}
];
// ============================================================================
// 🎨 NOVO MODELO DA CARTA (SOLICITADO PELO USUÁRIO)
// ============================================================================
function gerarEmbedCartinhaBomDia(customDia) {
	const diasNamoro = calcularDiasNamoro();
	const diasConhecendo = calcularDiasConhecendo();
	const targetIndex = customDia !== undefined && customDia > 0 ? (customDia - 1) % CARTINHAS_30_DIAS.length : Math.max(0, (diasNamoro - 1) % CARTINHAS_30_DIAS.length);
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
	const bannerParaExibir = CONFIG.bannerUrl && !CONFIG.bannerUrl.includes("SEU_BANNER_AQUI") ? CONFIG.bannerUrl : "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop";
	const embed = new EmbedBuilder().setColor(16732058).setImage(bannerParaExibir).setAuthor({ name: "💌 CARTINHAS DE AMOR • HENRIQUE & GABIZINHA" }).setTitle(`${carta.diaTitulo}`).setDescription(`# 💖 Bom dia, minha namorada!\n\n` + `<@${CONFIG.gabizinhaUserId}>\n\n` + `> 💌 **${carta.frase}**\n\n` + `${carta.corpo}\n\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` + `## 💍 Nossa História\n\n` + `🌹 **Nos conhecemos**\n` + `\`21/09/2026 → 26/09/2026\`\n\n` + `💍 **Início oficial do namoro**\n` + `\`27/09/2026\`\n\n` + `❤️ **Hoje estamos juntos há**\n` + `**${diasNamoro}º dia de namoro**\n\n` + `✨ **Nossa história começou há**\n` + `**${diasConhecendo} dias**\n\n` + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` + `📅 **Hoje:** ${dataAtual}\n` + `🕐 **Horário:** ${horaAtual} — Brasília\n\n` + `💖 **Henrique & Gabizinha**\n` + `*Uma história que está apenas começando.*`).setThumbnail(`https://cdn.discordapp.com/avatars/${CONFIG.gabizinhaUserId}/avatar.png`).setFooter({ text: carta.rodape }).setTimestamp();
	const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("btn_cartinha_namoro").setLabel("💍 Oficialmente Namorados!").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("btn_cartinha_amor").setLabel("💖 Te Amo, Minha Namorada!").setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId("btn_cartinha_marco").setLabel("🌹 21/09 a 26/09 • Namoro 27/09").setStyle(ButtonStyle.Primary));
	return {
		content: `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\n` + `        💌 **UMA CARTINHA PARA VOCÊ** 💌\n` + `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` + `<@${CONFIG.gabizinhaUserId}> ❤️`,
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
		relacionamento: {
			conhecer: "21/09/2026 a 26/09/2026",
			inicioNamoro: "27/09/2026",
			diasNamoro: `${calcularDiasNamoro()}º dia oficial`,
			diasHistoria: `${calcularDiasConhecendo()} dias`
		}
	}, null, 2));
});
server.listen(CONFIG.port, () => {
	console.log(`🌐 [RAILWAY HTTP] Servidor de monitoramento escutando na porta ${CONFIG.port}`);
});
// ============================================================================
// 🤖 CLIENTE DISCORD COM INTENTS OBRIGATÓRIOS
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
// 💌 Envio Automático da Cartinha Diária
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
		canal = guild.channels.cache.find((c) => c.type === ChannelType.GuildText && (c.name.toLowerCase().includes("cartinha") || c.name.toLowerCase().includes("amor") || c.name.toLowerCase().includes("gabi")));
	}
	if (!canal) {
		canal = guild.channels.cache.find((c) => c.type === ChannelType.GuildText && c.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages));
	}
	if (canal) {
		const payload = gerarEmbedCartinhaBomDia(customDia);
		await canal.send(payload);
		const pt = getHorarioPortugal();
		console.log(`💌 [CARTINHA] Bom dia enviado com sucesso para Gabizinha às ${pt.horaStr} (Portugal)!`);
		return true;
	}
	return false;
}
// ============================================================================
// ⚜️ SISTEMA DE REGISTRO FAMÍLIA & AMIGOS (COM TAGS [FN] E [AMIGO])
// ============================================================================
function gerarPainelEscolhaCargos() {
	const embed = new EmbedBuilder().setColor(CONFIG.corEmbedRegistro).setTitle("╔══════════════════════════════════════════════╗\n║ ⚜️ REGISTRO OFICIAL DE CARGOS ⚜️ ║\n║ FAMÍLIA & AMIGOS ║\n╚══════════════════════════════════════════════╝").setDescription("👋 **Seja muito bem-vindo(a) ao servidor Família & Amigos!**\n\n" + "Para liberar o acesso aos canais de texto, jogos, bate-papo e salas de voz, escolha a sua categoria:\n\n" + "⚜️ **1. FAMÍLIA NABRIZA [FN]**\n" + "> Membro oficial da Família Nabriza. Libera canais exclusivos da Família, reuniões e eventos. Recebe tag `[FN]` no Nick.\n\n" + "🤝 **2. AMIGOS DA FAMÍLIA [AMIGO]**\n" + "> Amigo, aliado e parceiro para curtir as calls, resenhas e jogos. Recebe tag `[AMIGO]` no Nick.\n\n" + "──────────────────────────────────────────\n" + "📌 **COMO FUNCIONA O CADASTRO:**\n" + "1️⃣ Clique no botão correspondente abaixo (**Família** ou **Amigo**).\n" + "2️⃣ Preencha o formulário rápido com seu Nick RP e respostas.\n" + "3️⃣ A Staff avaliará sua ficha no canal de aprovação com 1 clique.\n" + "4️⃣ Sendo aprovado, seu cargo é entregue na hora e seu nick é atualizado com a tag!\n\n" + "👇 *Clique no botão abaixo para iniciar seu cadastro:*").setFooter({ text: "Família & Amigos • Lealdade, União e Respeito ⚜️" }).setTimestamp();
	if (CONFIG.bannerPainelUrl) {
		embed.setImage(CONFIG.bannerPainelUrl);
	}
	const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("btn_iniciar_familia").setLabel("Entrar na Família [FN]").setEmoji("⚜️").setStyle(ButtonStyle.Primary), new ButtonBuilder().setCustomId("btn_iniciar_amigos").setLabel("Entrar como Amigo [AMIGO]").setEmoji("🤝").setStyle(ButtonStyle.Success));
	return {
		embeds: [embed],
		components: [row]
	};
}
function gerarCardRegistroMembro(user) {
	const embed = new EmbedBuilder().setColor(CONFIG.corEmbedRegistro).setTitle("⚜️ REGISTRO OFICIAL • FAMÍLIA & AMIGOS ⚜️").setDescription(`Olá ${user ? `<@${user.id}>` : "Membro"}! Seja muito bem-vindo(a) ao nosso servidor!\n\n` + "Para se cadastrar e liberar todos os canais de texto, resenha e salas de voz, escolha a sua categoria:\n\n" + "⚜️ **1. FAMÍLIA NABRIZA [FN]**\n" + "> Membro oficial da Família Nabriza. Recebe tag `[FN]` no Nick.\n\n" + "🤝 **2. AMIGOS DA FAMÍLIA [AMIGO]**\n" + "> Amigo, aliado e parceiro para curtir o servidor. Recebe tag `[AMIGO]` no Nick.\n\n" + "──────────────────────────────────────────\n" + "👇 *Clique em um dos botões abaixo para preencher sua ficha:*").setFooter({ text: "Família & Amigos • Lealdade, União e Respeito ⚜️" }).setTimestamp();
	const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("btn_iniciar_familia").setLabel("Entrar na Família [FN]").setEmoji("⚜️").setStyle(ButtonStyle.Primary), new ButtonBuilder().setCustomId("btn_iniciar_amigos").setLabel("Entrar como Amigo [AMIGO]").setEmoji("🤝").setStyle(ButtonStyle.Success));
	return {
		embeds: [embed],
		components: [row]
	};
}
// Configurar Canais Oficiais de Registro e Staff
async function configurarCanaisRegistro(guild) {
	const everyone = guild.roles.everyone;
	await configurarCargosOficiais(guild);
	let canalRegistro = guild.channels.cache.find((c) => c.type === ChannelType.GuildText && (c.name.includes("escolha-seu-cargo") || c.name === "registro" || c.name.includes("cargos")));
	if (!canalRegistro) {
		canalRegistro = await guild.channels.create({
			name: "📜・escolha-seu-cargo",
			type: ChannelType.GuildText,
			topic: "⚜️ Registro Oficial de Membros: Família Nabriza [FN] ou Amigos [AMIGO].",
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
	let canalStaff = null;
	if (CONFIG.canalAprovacaoId) {
		canalStaff = guild.channels.cache.get(CONFIG.canalAprovacaoId);
	}
	if (!canalStaff) {
		canalStaff = guild.channels.cache.find((c) => c.type === ChannelType.GuildText && (c.name.includes("aprovacao") || c.name.includes("fichas-registro") || c.name.includes("fichas")));
	}
	if (!canalStaff) {
		canalStaff = await guild.channels.create({
			name: "🛡️・fichas-aprovacao",
			type: ChannelType.GuildText,
			topic: "📥 Fichas de cadastro aguardando avaliação da Staff.",
			permissionOverwrites: [{
				id: everyone.id,
				deny: [PermissionsBitField.Flags.ViewChannel]
			}]
		}).catch(() => null);
	}
	return {
		canalRegistroId: canalRegistro ? canalRegistro.id : null,
		canalStaffId: canalStaff ? canalStaff.id : null
	};
}
// Configurar Cargos Oficiais
async function configurarCargosOficiais(guild) {
	const rolesCreated = [];
	// Chefe
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
	// Família
	let roleFamilia = guild.roles.cache.get(CONFIG.cargoFamiliaId) || guild.roles.cache.find((r) => r.name.includes("Família") || r.name.includes("Familia"));
	if (!roleFamilia) {
		roleFamilia = await guild.roles.create({
			name: "⚜️ Família Nabriza",
			color: "#D4AF37",
			hoist: true
		}).catch(() => null);
		if (roleFamilia) rolesCreated.push("⚜️ Família Nabriza");
	}
	// Amigos
	let roleAmigos = guild.roles.cache.get(CONFIG.cargoAmigosId) || guild.roles.cache.find((r) => r.name.includes("Amigo"));
	if (!roleAmigos) {
		roleAmigos = await guild.roles.create({
			name: "🤝 Amigos",
			color: "#2ECC71",
			hoist: true
		}).catch(() => null);
		if (roleAmigos) rolesCreated.push("🤝 Amigos");
	}
	// Não Registrado
	let roleNaoReg = guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) || guild.roles.cache.find((r) => r.name.includes("Não Registrado"));
	if (!roleNaoReg) {
		roleNaoReg = await guild.roles.create({
			name: "❌ Não Registrado",
			color: "#95A5A6",
			hoist: false
		}).catch(() => null);
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
	console.log("====================================================");
	c.user.setPresence({
		activities: [{
			name: "💌 Cartinhas de Amor | ⚜️ Família & Amigos",
			type: 3
		}],
		status: "online"
	});
	const slashCommands = [
		{
			name: "cartinha",
			description: "💌 Envia o novo modelo da cartinha de amor para a Gabizinha no canal."
		},
		{
			name: "namoro",
			description: "💍 Exibe o status oficial do namoro sério de Henrique & Gabizinha!"
		},
		{
			name: "horario",
			description: "⏰ Exibe os relógios ao vivo de Brasília e Portugal."
		},
		{
			name: "registro",
			description: "⚜️ Abre sua ficha de cadastro para Família Nabriza [FN] ou Amigos [AMIGO]."
		},
		{
			name: "painel",
			description: "⚜️ (Staff) Envia o Painel Oficial de Registro com botões."
		},
		{
			name: "setupregistro",
			description: "⚙️ (Staff) Cria automaticamente os canais #escolha-seu-cargo e #fichas-aprovacao."
		},
		{
			name: "fichas",
			description: "📋 (Staff) Localiza o canal de fichas de registro pendentes."
		},
		{
			name: "statusregistro",
			description: "📊 Estatísticas de membros registrados no servidor."
		}
	];
	setTimeout(async () => {
		try {
			if (c.application) {
				await c.application.commands.set(slashCommands).catch(() => {});
			}
		} catch (_) {}
	}, 2e3);
});
// Novo Membro Entra no Servidor
client.on(Events.GuildMemberAdd, async (member) => {
	try {
		let roleNaoReg = member.guild.roles.cache.get(CONFIG.cargoNaoRegistradoId) || member.guild.roles.cache.find((r) => r.name.includes("Não Registrado"));
		if (roleNaoReg) {
			await member.roles.add(roleNaoReg).catch(() => {});
		}
	} catch (_) {}
});
// Mensagens de Texto Prefixadas (!cartinha, !painel, !registro, etc.)
client.on(Events.MessageCreate, async (msg) => {
	if (msg.author.bot || !msg.guild) return;
	const content = msg.content.trim().toLowerCase();
	// 💌 1. Cartinha de Amor (NOVO MODELO)
	if (content === "!cartinha" || content === "!amor" || content === "!carta") {
		const payload = gerarEmbedCartinhaBomDia();
		return msg.channel.send(payload);
	}
	// 💍 2. Status do Namoro
	if (content === "!namoro" || content === "!statusnamoro" || content === "!statuscartinha") {
		const diasNamoro = calcularDiasNamoro();
		const diasConhecendo = calcularDiasConhecendo();
		const embed = new EmbedBuilder().setColor(CONFIG.corEmbedCartinha).setTitle("💍 STATUS OFICIAL: NAMORO SÉRIO • HENRIQUE & GABIZINHA").setDescription(`\`\`\`yaml\n` + `💍 RELACIONAMENTO: NAMORO SÉRIO OFICIAL ❤️\n` + `🗓️ INÍCIO DO NAMORO: 27/09/2026\n` + `🌹 FICAMOS NOS CONHECENDO: 21/09/2026 a 26/09/2026\n` + `⏳ DIAS DE NAMORO: ${diasNamoro}º Dia Oficial\n` + `✨ DIAS DE HISTÓRIA: ${diasConhecendo} Dias Juntos\n` + `\`\`\`\n\n` + `👸 **Minha Namorada:** <@${CONFIG.gabizinhaUserId}>\n` + `🤴 **Seu Namorado:** **${CONFIG.nomeHenrique}**`);
		return msg.reply({ embeds: [embed] });
	}
	// ⏰ 3. !horario
	if (content === "!horario" || content === "!tempo") {
		const br = getHorarioBrasilia();
		const pt = getHorarioPortugal();
		const embed = new EmbedBuilder().setColor(5793266).setTitle("⏰ RELÓGIOS OFICIAIS DO CASAL").setDescription(`🇧🇷 **Henrique (Brasília):** ${br.dataStr} às **${br.horaStr}**\n` + `🇵🇹 **Gabizinha (Portugal):** ${pt.dataStr} às **${pt.horaStr}**\n\n` + `💌 **Próximo Disparo da Cartinha:** Diariamente às **06:30** no Horário de Portugal!`);
		return msg.reply({ embeds: [embed] });
	}
	// ⚜️ 4. !painel
	if (content === "!painel") {
		const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageRoles) || msg.member.permissions.has(PermissionsBitField.Flags.Administrator);
		if (!perms) return msg.reply(gerarCardRegistroMembro(msg.author));
		return msg.channel.send(gerarPainelEscolhaCargos());
	}
	// ⚜️ 5. !registro
	if (content === "!registro" || content === "!cadastrar") {
		return msg.reply(gerarCardRegistroMembro(msg.author));
	}
	// ⚙️ 6. !setupregistro
	if (content === "!setupregistro") {
		const perms = msg.member.permissions.has(PermissionsBitField.Flags.ManageChannels) || msg.member.permissions.has(PermissionsBitField.Flags.Administrator);
		if (!perms) return msg.reply("❌ Apenas a Staff pode configurar canais.");
		const res = await configurarCanaisRegistro(msg.guild);
		return msg.reply(`✅ Canais configurados! Registro: <#${res.canalRegistroId}> | Staff: <#${res.canalStaffId}>`);
	}
	// 📊 7. !status
	if (content === "!status" || content === "!botinfo") {
		const br = getHorarioBrasilia();
		const pt = getHorarioPortugal();
		const embed = new EmbedBuilder().setColor(CONFIG.corEmbedRegistro).setTitle("📊 STATUS DO BOT (RAILWAY)").setDescription(`🟢 **Status:** Online na Railway e no Discord\n` + `📶 **Ping:** ${client.ws.ping}ms\n` + `🇧🇷 **Brasília:** ${br.dataStr} às ${br.horaStr}\n` + `🇵🇹 **Portugal:** ${pt.dataStr} às ${pt.horaStr}\n` + `💌 **Cartinha:** Agendada para 06:30 de Portugal (Europe/Lisbon)\n` + `👥 **Membros no Servidor:** ${msg.guild.memberCount}`);
		return msg.reply({ embeds: [embed] });
	}
});
// Interações (Slash Commands, Modais e Botões)
client.on(Events.InteractionCreate, async (interaction) => {
	try {
		// Slash Commands
		if (interaction.isChatInputCommand()) {
			const { commandName } = interaction;
			if (commandName === "cartinha") {
				return interaction.reply(gerarEmbedCartinhaBomDia());
			}
			if (commandName === "namoro") {
				const diasNamoro = calcularDiasNamoro();
				const diasConhecendo = calcularDiasConhecendo();
				return interaction.reply({
					content: `💍 **Status Oficial: Namoro Sério (Henrique & Gabizinha)**\n` + `• **Início do Namoro:** 27/09/2026 (${diasNamoro}º dia oficial ❤️)\n` + `• **Nos Conhecendo:** 21/09/2026 a 26/09/2026 (${diasConhecendo} dias de história 🌹)\n` + `• **Canal:** <#${CONFIG.canalCartinhaId}>`,
					ephemeral: true
				});
			}
			if (commandName === "horario") {
				const br = getHorarioBrasilia();
				const pt = getHorarioPortugal();
				return interaction.reply({
					content: `⏰ **Relógios:**\n🇧🇷 Brasília: ${br.dataStr} às ${br.horaStr}\n🇵🇹 Portugal: ${pt.dataStr} às ${pt.horaStr}\n💌 Envio da Cartinha: 06:30 (Lisboa)`,
					ephemeral: true
				});
			}
			if (commandName === "registro") {
				return interaction.reply({
					...gerarCardRegistroMembro(interaction.user),
					ephemeral: true
				});
			}
			if (commandName === "painel") {
				await interaction.channel?.send(gerarPainelEscolhaCargos());
				return interaction.reply({
					content: "✅ Painel Oficial enviado!",
					ephemeral: true
				});
			}
			if (commandName === "setupregistro") {
				const res = await configurarCanaisRegistro(interaction.guild);
				return interaction.reply({
					content: `✅ Canais configurados! Registro: <#${res.canalRegistroId}> | Staff: <#${res.canalStaffId}>`,
					ephemeral: true
				});
			}
			if (commandName === "fichas") {
				let canalStaff = CONFIG.canalAprovacaoId ? interaction.guild?.channels.cache.get(CONFIG.canalAprovacaoId) : null;
				if (!canalStaff) {
					canalStaff = interaction.guild?.channels.cache.find((c) => c.type === ChannelType.GuildText && c.name.includes("aprovacao"));
				}
				return interaction.reply({
					content: canalStaff ? `📋 Canal de Fichas: <#${canalStaff.id}>` : "⚠️ Canal não encontrado. Use /setupregistro.",
					ephemeral: true
				});
			}
			if (commandName === "statusregistro") {
				return interaction.reply({
					content: `👥 Membros: ${interaction.guild?.memberCount || 0}`,
					ephemeral: true
				});
			}
		}
		// Botões dos Modais de Cadastro
		if (interaction.isButton() && interaction.customId === "btn_iniciar_familia") {
			const modal = new ModalBuilder().setCustomId("modal_familia").setTitle("Ficha: Família Nabriza [FN]");
			modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("nome").setLabel("Seu Nome / Nick RP:").setStyle(TextInputStyle.Short).setRequired(true)), new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("idade").setLabel("Sua Idade:").setStyle(TextInputStyle.Short).setRequired(true)), new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("p1").setLabel("Quem te convidou?").setStyle(TextInputStyle.Paragraph).setRequired(true)), new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("p2").setLabel("Concorda em honrar a tag [FN]?").setStyle(TextInputStyle.Paragraph).setRequired(true)));
			return await interaction.showModal(modal);
		}
		if (interaction.isButton() && interaction.customId === "btn_iniciar_amigos") {
			const modal = new ModalBuilder().setCustomId("modal_amigos").setTitle("Ficha: Amigos da Família [AMIGO]");
			modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("nome").setLabel("Seu Nome / Nick RP:").setStyle(TextInputStyle.Short).setRequired(true)), new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("idade").setLabel("Sua Idade:").setStyle(TextInputStyle.Short).setRequired(true)), new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("p1").setLabel("De quem você é amigo na Família?").setStyle(TextInputStyle.Paragraph).setRequired(true)), new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("p2").setLabel("Quais jogos costuma jogar?").setStyle(TextInputStyle.Paragraph).setRequired(true)));
			return await interaction.showModal(modal);
		}
		// Submissão do Modal (Envia para Staff com botões)
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
				const embedStaff = new EmbedBuilder().setColor(isFam ? 13938487 : 3066993).setTitle(`📥 NOVA FICHA • ${isFam ? "⚜️ FAMÍLIA NABRIZA [FN]" : "🤝 AMIGOS [AMIGO]"}`).setDescription(`👤 **Membro:** <@${interaction.user.id}>\n` + `🏷️ **Cargo:** ${isFam ? "Família Nabriza" : "Amigo da Família"}\n` + `📝 **Nick Solicitado:** **${nome}**\n` + `🎂 **Idade:** ${idade}\n\n` + `📋 **Respostas:**\n> 1. ${p1}\n> 2. ${p2}`).setThumbnail(interaction.user.displayAvatarURL()).setTimestamp();
				const safeNick = encodeURIComponent(nome.replace(/\|/g, ""));
				const tipo = isFam ? "fam" : "amg";
				const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`apv|${interaction.user.id}|${tipo}|${safeNick}`).setLabel(`Aprovar ${isFam ? "[FN]" : "[AMIGO]"}`).setStyle(ButtonStyle.Success).setEmoji("✅"), new ButtonBuilder().setCustomId(`rep|${interaction.user.id}`).setLabel("Reprovar").setStyle(ButtonStyle.Danger).setEmoji("❌"));
				await canalStaff.send({
					embeds: [embedStaff],
					components: [row]
				}).catch(() => {});
			}
			return await interaction.editReply({ content: "✅ **Sua ficha foi enviada com sucesso!** Aguarde a avaliação da Staff para liberar os canais." });
		}
		// Aprovação pela Staff via Botão
		if (interaction.isButton() && interaction.customId.startsWith("apv|")) {
			const temPerm = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) || interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);
			if (!temPerm) {
				return interaction.reply({
					content: "❌ Apenas a Staff pode aprovar cadastros!",
					ephemeral: true
				});
			}
			const parts = interaction.customId.split("|");
			const userId = parts[1];
			const tipo = parts[2];
			const rawNick = decodeURIComponent(parts[3] || "");
			const isFam = tipo === "fam";
			const member = await interaction.guild?.members.fetch(userId).catch(() => null);
			if (!member) {
				return interaction.reply({
					content: "⚠️ Membro não encontrado no servidor!",
					ephemeral: true
				});
			}
			const roleId = isFam ? CONFIG.cargoFamiliaId : CONFIG.cargoAmigosId;
			const role = interaction.guild?.roles.cache.get(roleId) || interaction.guild?.roles.cache.find((r) => r.name.toLowerCase().includes(isFam ? "família" : "amigo"));
			if (role) await member.roles.add(role).catch(() => {});
			if (CONFIG.cargoNaoRegistradoId) {
				const roleNaoReg = interaction.guild?.roles.cache.get(CONFIG.cargoNaoRegistradoId) || interaction.guild?.roles.cache.find((r) => r.name.includes("Não Registrado"));
				if (roleNaoReg) await member.roles.remove(roleNaoReg).catch(() => {});
			}
			const novoNick = isFam ? `[FN] ${rawNick}` : `[AMIGO] ${rawNick}`;
			try {
				if (member.manageable) {
					await member.setNickname(novoNick.substring(0, 32)).catch(() => {});
				}
			} catch (_) {}
			await interaction.update({
				content: `✅ **Aprovado por <@${interaction.user.id}>!** Cargo **${isFam ? "⚜️ Família Nabriza" : "🤝 Amigos"}** entregue e nick atualizado para \`${novoNick}\`.`,
				embeds: [],
				components: []
			});
			await member.send(`🎉 Sua ficha para **${isFam ? "Família Nabriza" : "Amigos"}** foi **APROVADA**! Bom jogo! ⚜️`).catch(() => {});
			return;
		}
		// Reprovação pela Staff
		if (interaction.isButton() && interaction.customId.startsWith("rep|")) {
			const temPerm = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles) || interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);
			if (!temPerm) return interaction.reply({
				content: "❌ Apenas a Staff pode reprovar!",
				ephemeral: true
			});
			return await interaction.update({
				content: `❌ **Registro Reprovado por <@${interaction.user.id}>.**`,
				embeds: [],
				components: []
			});
		}
		// Botões Românticos da Cartinha
		if (interaction.isButton() && interaction.customId.startsWith("btn_cartinha_")) {
			const diasNamoro = calcularDiasNamoro();
			const diasConhecendo = calcularDiasConhecendo();
			if (interaction.customId === "btn_cartinha_namoro") {
				return interaction.reply({
					content: `💍 **OFICIALMENTE NAMORADOS!** ❤️ Hoje estamos no nosso **${diasNamoro}º dia oficial de namoro**, e o Henrique promete amar e cuidar da Gabizinha para sempre! ✨🌹`,
					ephemeral: true
				});
			}
			if (interaction.customId === "btn_cartinha_amor") {
				return interaction.reply({
					content: "💖 O Henrique é completamente apaixonado pela Gabizinha! Oficialmente namorados desde 27/09/2026! 🌹💍",
					ephemeral: true
				});
			}
			if (interaction.customId === "btn_cartinha_marco") {
				return interaction.reply({
					content: `🌹 **LINHA DO TEMPO DO AMOR:**\n• Conhecer: 21/09/2026 a 26/09/2026\n• Namoro Sério: 27/09/2026\n• Total: ${diasNamoro}º dia de namoro • ${diasConhecendo} dias juntos! ✨`,
					ephemeral: true
				});
			}
		}
	} catch (err) {
		console.error("Erro na interação:", err);
	}
});
// ============================================================================
// ⏰ AGENDADOR PRECISO DAS 06:30 NO HORÁRIO DE PORTUGAL (Europe/Lisbon)
// ============================================================================
let ultimaDataEnvioCartinha = null;
setInterval(async () => {
	try {
		if (!client.isReady()) return;
		const pt = getHorarioPortugal();
		if (pt.hora === CONFIG.horaEnvioPortugal && pt.minuto === CONFIG.minutoEnvioPortugal && ultimaDataEnvioCartinha !== pt.dataStr) {
			console.log(`⏰ [AGENDADOR 06:30 PORTUGAL] Enviando Cartinha de Bom Dia (${pt.dataStr})...`);
			const enviado = await enviarCartinhaDiaria().catch(() => false);
			if (enviado) {
				ultimaDataEnvioCartinha = pt.dataStr;
				console.log(`✅ [AGENDADOR] Cartinha enviada com sucesso no dia ${pt.dataStr}!`);
			}
		}
	} catch (e) {
		console.error("Erro no agendador:", e.message || e);
	}
}, 30 * 1e3);
// ============================================================================
// 🔑 INICIALIZAÇÃO COM TOKEN DAS VARIABLES DO RAILWAY
// ============================================================================
if (!CONFIG.token || CONFIG.token.length < 25) {
	console.log("====================================================");
	console.log("⚠️ [RAILWAY SETUP - AGUARDANDO DISCORD_TOKEN]");
	console.log("Você não precisa de arquivo .env!");
	console.log("👉 No site da Railway:");
	console.log(" 1. Abra seu Projeto e clique no Serviço");
	console.log(" 2. Clique na aba \"Variables\"");
	console.log(" 3. Adicione a variável: DISCORD_TOKEN");
	console.log(" 4. Cole o seu token do Discord e salve!");
	console.log("====================================================");
} else {
	client.login(CONFIG.token).catch((err) => {
		console.error("====================================================");
		console.error("❌ [ERRO AO LOGAR NO DISCORD]:", err.message);
		if (err.message.includes("disallowed intents") || err.code === "DisallowedIntents") {
			console.error("📌 ATIVE OS PRIVILEGED GATEWAY INTENTS no Discord Developer Portal:");
			console.error(" • Server Members Intent");
			console.error(" • Message Content Intent");
		}
		console.error("====================================================");
	});
}
