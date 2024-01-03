import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, Colors, EmbedBuilder } from 'discord.js'
import { ILogger } from '../logger/logger'
import { containsKeywordFromArray, mentionsBot, greetings, sleepings } from './autoReactHelperFunctions'

export default async (client: Client, logger: ILogger): Promise<void> => {
  logger.logSync('INFO', 'Initializing message logger')

  client.on('messageCreate', async (msg) => {
    if (msg.author?.bot) return
    if (containsKeywordFromArray(msg.content, greetings)) {
      /*
      Checks if the message mentions the bot and prevents the bot from replying to everyone pings or announcements
      */
      if (
        mentionsBot(client, msg)
      ) {
        await msg.reply({
          content: `👋 Hallo <@${msg.author.id}>!`
        })
      } else {
        // add a waving hand reaction to the message
        await msg.react('👋')
      }
    } else if (containsKeywordFromArray(msg.content, sleepings)) {
      if (
        mentionsBot(client, msg)
      ) {
        await msg.reply({
          content: `😴 Schlaf gut <@${msg.author.id}>!`
        })
      } else {
        await msg.react('💤')
      }
    }

    // check if the message contains the :kekw: emoji
    if (msg.content.toLowerCase().includes(':kekw:')) {
      // 50% chance to react with the :kekw: emoji
      if (Math.random() > 0.5) {
        const reactionEmoji = msg.guild?.emojis.cache.find((emoji) => emoji.name === 'kekw')
        if (reactionEmoji == null) return
        await msg.react(reactionEmoji)
      }
    }
  })

  client.on('messageUpdate', async (oldMsg, newMsg) => {
    if (oldMsg.author?.bot === true) return
    if (newMsg.author?.bot === true) return

    logger.logSync('INFO', 'messageUpdate')

    const logChannel = await newMsg.guild?.channels.fetch(process.env.MESSAGE_LOGS ?? '')

    if (logChannel == null) {
      logger.logSync('WARN', 'MessageLogger could not find log channel')
      return
    }

    if (logChannel.type !== ChannelType.GuildText) {
      logger.logSync('WARN', 'LogChannel is not TextBased')
      return
    }

    await logChannel.send({
      content: `Message edited in <#${oldMsg.channelId}>`,
      files: oldMsg.attachments.map((attachment) => attachment.url),
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${oldMsg.author?.username as string} - ${oldMsg.author?.id as string}`,
            iconURL: `${oldMsg.author?.avatarURL()}`
          })
          .setDescription(
            oldMsg.content ? (oldMsg.content?.length > 0 ? oldMsg.content : '<kein Inhalt>') : '<kein Inhalt>'
          )
          .setColor(Colors.Yellow)
          .setTimestamp(oldMsg.createdTimestamp),
        new EmbedBuilder()
          .setAuthor({
            name: `${newMsg.author?.username as string} - ${newMsg.author?.id as string}`,
            iconURL: `${newMsg.author?.avatarURL()}`
          })
          .setDescription(
            newMsg.content ? (newMsg.content?.length > 0 ? newMsg.content : '<kein Inhalt>') : '<kein Inhalt>'
          )
          .setColor(Colors.Green)
          .setTimestamp(newMsg.editedTimestamp)
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setURL(newMsg.url).setLabel('Nachricht im Chat zeigen').setStyle(ButtonStyle.Link)
        )
      ]
    })
  })

  client.on('messageDelete', async (msg) => {
    const logChannel = await msg.guild?.channels.fetch(process.env.MESSAGE_LOGS ?? '')

    if (logChannel == null) {
      logger.logSync('WARN', 'MessageLogger could not find log channel')
      return
    }

    if (logChannel.type !== ChannelType.GuildText) {
      logger.logSync('WARN', 'LogChannel is not TextBased')
      return
    }
    let embed: EmbedBuilder
    if (msg.attachments && msg.attachments.size > 0) {
      embed = new EmbedBuilder()
        .setAuthor({
          name: `${msg.author?.username as string} - ${msg.author?.id as string}`,
          iconURL: `${msg.author?.avatarURL()}`
        })
        .setColor(Colors.Red)
        .setDescription(msg.content ? (msg.content?.length > 0 ? msg.content : '<kein Inhalt>') : '<kein Inhalt>')
        .setColor(Colors.Red)
        .setTimestamp(msg.createdTimestamp)
      msg.attachments.forEach((attachment) => {
        embed.addFields({
          name: `${attachment.name ?? "kein Name"} | ${
            attachment.contentType ?? "unknown Type"
          }`,
          value:
            (attachment.url ?? "Fehler") +
            "\n" +
            (attachment.proxyURL ?? "Fehler")
        })
      })
    } else {
      embed = new EmbedBuilder()
        .setAuthor({
          name: `${msg.author?.username as string} - ${msg.author?.id as string}`,
          iconURL: `${msg.author?.avatarURL()}`
        })
        .setDescription(msg.content ? (msg.content?.length > 0 ? msg.content : '<kein Inhalt>') : '<kein Inhalt>')
        .setColor(Colors.Red)
        .setTimestamp(msg.createdTimestamp)
    }

    await logChannel.send({
      content: `Message deleted in <#${msg.channelId}>`,
      embeds: [embed],
      files: msg.attachments.map((attachment) => attachment.url)
    })
  })
}
