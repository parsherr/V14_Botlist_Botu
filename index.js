// Discord
const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder, AuditLogEvent, UserFlags } = require("discord.js");

// İNTENTS
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember] });
//roman
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")

// Database
const db = require("croxydb")

global.client = client;
client.commands = (global.commands = []);
const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: false,
        type: 1
    });

    console.log(`[COMMAND] ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(`[EVENT] ${name} eventi yüklendi.`)
});
//roman

client.login(TOKEN)

// Bir Hata Oluştu
process.on("unhandledRejection", (reason, p) => {
    console.log(reason, p);
})

process.on("unhandledRejection", async (error) => {
    return console.log("Bir hata oluştu! " + error)
})
//
//
//

client.on("messageCreate", async (message) => {
    const botlist$ = db.get(`botlist_${message.guild.id}`);
    if (!botlist$) return;
    if (message.channel.id === botlist$.botadd_channel) {
        if (message.author?.bot) return;
        // if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        if (isNaN(message.content)) return message.delete();

        if (botlist$.botadd_limit) {
            const botsCount = db.get(`generalBotOwner_${message.author.id}_${message.guild.id}`)
            if (botsCount) {
                if (botlist$.botadd_limit <= botsCount.length) {
                    message.delete()
                    setTimeout(async () => {
                        await message.channel.send({ content: `${message.author} __sunucuya bot ekleme limitini doldurmuşsun__. (5 saniye sonra silinecek)` }).then((msg) => {
                            setTimeout(async () => {
                                await msg.delete()
                            }, 4000);
                        })
                    }, 1000);
                    return;
                }
            }
        }

        if (message.content.length < 18) {
            message.delete()
            setTimeout(async () => {
                await message.channel.send({ content: `${message.author} __bu bir bot id'si değil__, lütfen geçerli bir id gir. (5 saniye sonra silinecek)` }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete()
                    }, 4000);
                })
            }, 1000);
            return;
        }

//roman
        if (message.content.length > 25) {
            message.delete().catch(roman => { })

            setTimeout(async () => {
                await message.channel.send({ content: `${message.author} __bu bir bot id'si değil__, lütfen geçerli bir id gir. (5 saniye sonra silinecek)` }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch(roman => { })
                    }, 4000);
                })
            }, 1000);
            return;
        }

        const bot_info = await client.users.fetch(message.content)
        if (!bot_info.bot) return message.delete();

        try {
            const userSearch = await message.guild.members.fetch(message.content);
            if (userSearch) {
                message.delete()
                setTimeout(async () => {
                    await message.channel.send({ content: `${message.author} __bu bot sunucuda zaten mevcut__, lütfen başka bir id gir. (5 saniye sonra silinecek)` }).then((msg) => {
                        setTimeout(async () => {
                            await msg.delete()
                        }, 4000);
                    })
                }, 1000);
                return;
            }
        } catch {
            const botadd_newinfo = db.get(`botadd_${message.content}`)
            if (botadd_newinfo) {
                if (botadd_newinfo.botId === message.content) {
                    message.delete()
                    setTimeout(async () => {
                        await message.channel.send({ content: `${message.author} __bu bot ekli veya zaten başvurulmuş__, lütfen başka bir id gir. (5 saniye sonra silinecek)` }).then((msg) => {
                            setTimeout(async () => {
                                await msg.delete()
                            }, 4000);
                        })
                    }, 1000);
                    return;
                }
            }

            message.delete().catch(roman => { })
            setTimeout(async () => {
                await message.channel.send({ content: `${message.author} __botun onay için iletildi__, en kısa sürede eklenecektir. (5 saniye sonra silinecek)` }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch(roman => { })
                    }, 5000);
                })
            }, 1000);

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji("⏺")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.com/oauth2/authorize?client_id=" + message.content + "&scope=bot&permissions=0")
                )
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji("🛠️")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.com/oauth2/authorize?client_id=" + message.content + "&scope=bot&permissions=8")
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Reddet")
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId("bot_deny")
                )

            const bot_approve_embed = new EmbedBuilder()
                .setColor("DarkButNotBlack")
                .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                .setDescription(`${message.author} adlı kullanıcı **${bot_info.username}** botu için başvurdu!`)
                .addFields(
                    { name: "\u200B", value: `${bot_info.avatar ? "\`\`\`Güvenilir\`\`\`" : "\`\`\`Şüpheli!\`\`\`"}`, inline: true },
                    { name: "\u200B", value: `\`\`\`${bot_info.id}\`\`\``, inline: true },
                    { name: "\u200B", value: `\`\`\`${bot_info.flags & UserFlags.VerifiedBot ? "Onaylı" : "Onaysız"}\`\`\``, inline: true }
                )
                .setThumbnail(bot_info.displayAvatarURL())

            client.channels.cache.get(botlist$.approve_channel).send({ content: `<@&${botlist$.admin_role}>`, embeds: [bot_approve_embed], components: [row] }).then((msg) => {
                db.set(`botadd_${message.content}`, { botId: message.content, userId: message.author.id, messageId: msg.id })
            })
            db.add(`appealedBot_${message.guild.id}`, 1)
        }
    }
})


client.on("interactionCreate", async (interaction) => {

    const roman = new ModalBuilder()
        .setCustomId('deny_form')
        .setTitle('Bot Reddetme')
    const plugin = new TextInputBuilder()
        .setCustomId('textmenu')
        .setLabel('Bot Reddetme Sebebi')
        .setStyle(TextInputStyle.Short)
        .setMinLength(3)
        .setMaxLength(200)
        .setRequired(true)

    const row = new ActionRowBuilder().addComponents(plugin);
    roman.addComponents(row);

    if (interaction.customId === "bot_deny") {
        const botlistadmin$ = db.get(`botlist_${interaction.guild.id}`);
        if (!botlistadmin$) return await interaction.deferUpdate()
        if (!interaction.member.roles.cache.has(botlistadmin$.admin_role)) return await interaction.deferUpdate()
        await interaction.showModal(roman);
    }

    if (interaction.customId === "deny_form") {
        const deny_reason = interaction.fields.getTextInputValue("textmenu")
        const add_bot_id = interaction.message.embeds[0].fields[1].value.replace(/```/g, ''); // roman

        const botlist$ = db.get(`botlist_${interaction.guild.id}`)
        const bot_add = db.get(`botadd_${add_bot_id}`)

        if (bot_add) {
            const bot_info = await client.users.fetch(bot_add.botId);
            const author_info = await client.users.fetch(bot_add.userId);


            const bot_deny_update_embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `${author_info.username}`, iconURL: author_info.displayAvatarURL() })
                .setDescription(`${author_info} adlı kullanıcı'nın ${bot_info} bot başvurusu **reddedildi**!`)
                .addFields(
                    { name: "\u200B", value: `**${interaction.user.username}** tarafından reddedildi`, inline: true },
                    { name: "\u200B", value: `__${deny_reason}__ sebebiyle`, inline: true },
                    { name: "\u200B", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                )
                .setThumbnail(bot_info.displayAvatarURL())

            const logChannel = client.channels.cache.get(botlist$.log)
            if (!logChannel) return;
            const approveChannel = client.channels.cache.get(botlist$.approve_channel);
            if (!approveChannel) return;
            const editMessage = await approveChannel.messages.fetch(bot_add.messageId)
            await interaction.deferUpdate()
            editMessage.edit({ content: " ", embeds: [bot_deny_update_embed], components: [] })

            const bot_deny_embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `${author_info.username}`, iconURL: author_info.displayAvatarURL() })
                .setDescription(`${author_info} ${bot_info} bot başvurun **reddedildi**!`)
                .addFields(
                    { name: "\u200B", value: `**${interaction.user.username}** tarafından reddedildi`, inline: true },
                    { name: "\u200B", value: `__${deny_reason}__ sebebiyle`, inline: true },
                    { name: "\u200B", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                )
                .setThumbnail(bot_info.displayAvatarURL())

            logChannel.send({ content: `${author_info}`, embeds: [bot_deny_embed] })
            db.add(`denyedBot_${interaction.guild.id}`, 1)
            if (db.get(`generalBotOwner_${interaction.user.id}_${interaction.guild.id}`)) {
                db.unpush(`generalBotOwner_${interaction.user.id}_${interaction.guild.id}`, add_bot_id)
            }
            db.delete(`botadd_${add_bot_id}`)
        }
    }
})


// otomatik onay
client.on("guildMemberAdd", async (member) => {
    const botlist$ = db.get(`botlist_${member.guild.id}`)
    const bot_add = db.get(`botadd_${member.user.id}`)

    if (botlist$) {
        if (!member.user.bot) {
            member.guild.members.cache.get(member.id).roles.add(botlist$.member_role).catch(e => { })
        } else {
            member.guild.members.cache.get(member.id).roles.add(botlist$.bot_role).catch(e => { })
        }

        if (!member.user.bot) return;

        if (bot_add) {
            const bot_info = await client.users.fetch(bot_add.botId);
            const author_info = await client.users.fetch(bot_add.userId);
            if (bot_add.botId === member.user.id) {

                var fetchedLogs = await member.guild.fetchAuditLogs({
                    limit: 1,
                    type: Discord.AuditLogEvent.BotAdd,
                });

                var addBot = fetchedLogs.entries.first();

                const bot_approve_update_embed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: `${author_info.username}`, iconURL: author_info.displayAvatarURL() })
                    .setDescription(`${author_info} adlı kullanıcı'nın ${member} bot başvurusu **onaylandı**!`)
                    .addFields(
                        { name: "\u200B", value: `**${addBot?.executor?.username}** tarafından eklendi`, inline: true },
                        { name: "\u200B", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                    )
                    .setThumbnail(member.user.displayAvatarURL())

                const logChannel = client.channels.cache.get(botlist$.log)
                if (!logChannel) return;
                const approveChannel = client.channels.cache.get(botlist$.approve_channel);
                if (!approveChannel) return;
                const editMessage = await approveChannel.messages.fetch(bot_add.messageId)
                editMessage.edit({ content: " ", embeds: [bot_approve_update_embed], components: [] })

                member.guild.members.cache.get(bot_add.userId).roles.add(botlist$.dev_role).catch(e => { })

                const bot_approved_embed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: `${author_info.username}`, iconURL: author_info.displayAvatarURL() })
                    .setDescription(`${author_info} ${member} bot başvurun **onaylandı**!`)
                    .addFields(
                        { name: "\u200B", value: `**${addBot?.executor?.username}** tarafından eklendi`, inline: true },
                        { name: "\u200B", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                    )
                    .setThumbnail(member.user.displayAvatarURL())

                logChannel.send({ content: `${author_info}`, embeds: [bot_approved_embed] })
                db.push(`generalBotOwner_${author_info.id}_${member.guild.id}`, member.id)
                db.add(`addedBot_${member.guild.id}`, 1)
            }
        }
    }
})


// developer çıkınca bot otomatik atılma sistemi - roman
client.on("guildMemberRemove", async (member) => {
    const generalBots = db.get(`generalBotOwner_${member.user.id}_${member.guild.id}`)
    if (generalBots) {
        generalBots.map(botIds => member.guild.members.ban(botIds))

        db.delete(`generalBotOwner_${member.user.id}_${member.guild.id}`)
    }
})
//roman