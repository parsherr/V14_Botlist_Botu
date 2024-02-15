const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");
// roman - https://discord.gg/7Br5qeVgcz
module.exports = {
    name: "botlist-ayarla",
    description: 'Botlist sistemini ayarlarsın',
    type: 1,
    options: [
        {
            name: "botlist-log",
            description: "Botlist log kanalını ayarlarsın",
            type: 7,
            required: true,
            channel_types: [0]
        },

        {
            name: "bot-rolü",
            description: "Botlara verilecek rolü ayarlarsın",
            type: 8,
            required: true
        },

        {
            name: "üye-rolü",
            description: "Üyelere verilecek rolü ayarlarsın",
            type: 8,
            required: true
        },

        {
            name: "developer-rolü",
            description: "Botunu ekleyen kişilere verilecek rolü ayarlarsın",
            type: 8,
            required: true
        },

        {
            name: "yetkili-rolü",
            description: "Sunucunuza bot ekleyecek yetkili rolünü ayarlarsın",
            type: 8,
            required: true,
        },

        {
            name: "onay-kanalı",
            description: "Botlist log kanalını ayarlarsın",
            type: 7,
            required: true,
            channel_types: [0]
        },

        {
            name: "botekle-kanalı",
            description: "Botların eklenebileceği kanalı ayarlarsın",
            type: 7,
            required: true,
            channel_types: [0]
        },

        {
            name: "sunucu-limiti",
            description: "Eklenen botun en az kaç sunucuda olması gerektiğini ayarlarsın",
            type: 10,
            required: false,
        },

        {
            name: "bot-ekle-limit",
            description: "Kullanıcıların sunucunuza maksimum kaç bot ekleyebileceğini ayarlarsın",
            type: 10,
            required: false,
        }
    ],
    run: async (client, interaction) => {

        const perm = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için **Yönetici** yetkisine sahip olmalısın.")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [perm], ephemeral: true })

        const log_channel = interaction.options.getChannel('botlist-log')
        const bot_role = interaction.options.getRole('bot-rolü')
        const member_role = interaction.options.getRole('üye-rolü')
        const dev_role = interaction.options.getRole('developer-rolü')
        const admin_role = interaction.options.getRole('yetkili-rolü')
        const approve_channel = interaction.options.getChannel('onay-kanalı')
        const botadd_channel = interaction.options.getChannel('botekle-kanalı')
        const server_limit = interaction.options.getNumber('sunucu-limiti')
        const botadd_limit = interaction.options.getNumber('bot-ekle-limit')

        const success = new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `${interaction.user.username} • Başarıyla Ayarlandı`, iconURL: interaction.user.displayAvatarURL() })
            .addFields(
                { name: "Log Kanalı:", value: `${log_channel}`, inline: true },
                { name: "Onay Kanalı:", value: `${approve_channel}`, inline: true },
                { name: "Bot Ekle Kanalı:", value: `${botadd_channel}`, inline: true },
                { name: "Bot Rol:", value: `${bot_role}`, inline: true },
                { name: "Üye Rol:", value: `${member_role}`, inline: true },
                { name: "Developer Rol:", value: `${dev_role}`, inline: true },
                { name: "Yetkili Rol:", value: `${admin_role}`, inline: true },
                { name: "Yetkili Rol:", value: `${admin_role}`, inline: true },
                { name: "Sunucu Limiti:", value: `\`${server_limit || "girilmedi"}\``, inline: true },
                { name: "Bot Ekle Limiti:", value: `\`${botadd_limit || "girilmedi"}\``, inline: true },
            )
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()


        db.set(`botlist_${interaction.guild.id}`, {
            log: log_channel.id, bot_role: bot_role.id, member_role: member_role.id, dev_role: dev_role.id, admin_role: admin_role.id, approve_channel: approve_channel.id, botadd_channel: botadd_channel.id, server_limit: server_limit, botadd_limit: botadd_limit
        })

        interaction.reply({ embeds: [success], ephemeral: true })

        const botlist_embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
            .addFields(
                { name: "\u200B", value: "Botunu eklemek için **sadece bot id'ni kanala yaz**" },
                { name: "\u200B", value: `${server_limit ? `Botunun en az \`${server_limit}\` sunucuda olması gerekiyor` : "Botunu eklemek için herhangi bir şart yoktur"}` },
                { name: "\u200B", value: `${botadd_limit ? `Sunucumuza en fazla \`${botadd_limit}\` kadar bot ekleyebilirsin` : "Sunucumuza istediğiniz kadar bot ekleyebilirsiniz"}` },
            )
            .setThumbnail(interaction.guild.iconURL())

        botadd_channel.send({ embeds: [botlist_embed] })
    }
}