function gerarEmbedCartinhaBomDia(customDia) {
    const diasNamoro = calcularDiasNamoro();
    const diasConhecendo = calcularDiasConhecendo();

    const targetIndex = customDia !== undefined && customDia > 0
        ? (customDia - 1) % CARTINHAS_30_DIAS.length
        : Math.max(0, (diasNamoro - 1) % CARTINHAS_30_DIAS.length);

    const carta = CARTINHAS_30_DIAS[targetIndex];

    const agora = new Date();

    const dataAtual = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(agora);

    const horaAtual = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit'
    }).format(agora);

    const horaPortugal = new Intl.DateTimeFormat('pt-PT', {
        timeZone: 'Europe/Lisbon',
        hour: '2-digit',
        minute: '2-digit'
    }).format(agora);

    const bannerImage = (CONFIG.bannerUrl && !CONFIG.bannerUrl.includes('SEU_BANNER_AQUI'))
        ? CONFIG.bannerUrl
        : 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop';

    const embed = new EmbedBuilder()
        .setColor(0xFF4F9A)

        // 🖼️ BANNER / OVERLAY
        .setImage(bannerImage)

        .setAuthor({
            name: '💌 CARTINHAS DE AMOR • HENRIQUE & GABIZINHA'
        })

        .setTitle(
            `${carta.diaTitulo}`
        )

        .setDescription(
            `# 💖 Bom dia, minha namorada!\n\n` +

            `<@${CONFIG.gabizinhaUserId}>\n\n` +

            `> 💌 **${carta.frase}**\n\n` +

            `${carta.corpo}\n\n` +

            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +

            `## 💍 Nossa História\n\n` +

            `🌹 **Nos conhecemos**\n` +
            `\`21/09/2026 → 26/09/2026\`\n\n` +

            `💍 **Início oficial do namoro**\n` +
            `\`27/09/2026\`\n\n` +

            `❤️ **Hoje estamos juntos há**\n` +
            `**${diasNamoro}º dia de namoro**\n\n` +

            `✨ **Nossa história começou há**\n` +
            `**${diasConhecendo} dias**\n\n` +

            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +

            `📅 **Hoje:** ${dataAtual}\n` +
            `🇵🇹 **Horário:** ${horaPortugal} — Portugal (Enviado às 06:30)\n` +
            `🇧🇷 **Horário:** ${horaAtual} — Brasília\n\n` +

            `💖 **Henrique & Gabizinha**\n` +
            `*Uma história que está apenas começando.*`
        )

        .setThumbnail(
            `https://cdn.discordapp.com/avatars/${CONFIG.gabizinhaUserId}/avatar.png`
        )

        .setFooter({
            text: carta.rodape
        })

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
            .setLabel("🌹 21/09 a 26/09 • Namoro 27/09")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("btn_cartinha_fusos")
            .setLabel("🇧🇷 Brasília & Portugal 🇵🇹")
            .setStyle(ButtonStyle.Secondary)
    );

    return {
        content:
            `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\n` +
            `        💌 **UMA CARTINHA PARA VOCÊ** 💌\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
            `<@${CONFIG.gabizinhaUserId}> ❤️`,

        embeds: [embed],
        components: [row]
    };
}
