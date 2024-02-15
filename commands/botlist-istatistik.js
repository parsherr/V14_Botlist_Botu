const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");
// roman - https://discord.gg/7Br5qeVgcz
module.exports = {
    name: "botlist-istatistik",
    description: 'Sunucunun botlist istatistiğini gösterir',
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const perm = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için **Yönetici** yetkisine sahip olmalısın.")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [perm], ephemeral: true })

        const added = db.get(`addedBot_${interaction.guild.id}`);
        const deny = db.get(`denyedBot_${interaction.guild.id}`);
        const appealed = db.get(`appealedBot_${interaction.guild.id}`);

        const statEmbed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .addFields(
                { name: "Toplam Başvuru:", value: `\`\`\`${appealed || 0}\`\`\``, inline: true },
                { name: "Toplam Onay:", value: `\`\`\`${appealed || 0}\`\`\``, inline: true },
                { name: "Toplam Red:", value: `\`\`\`${deny || 0}\`\`\``, inline: true },
            )
            .setThumbnail(interaction.guild.iconURL())

        interaction.reply({ embeds: [statEmbed], ephemeral: true })
    }
}