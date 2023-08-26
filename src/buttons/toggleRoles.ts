import { ButtonInteraction, Role } from "discord.js"
import LogManager from "src/logger/logger"

export default {
  buttonId: /toggle-role/,
  async execute (interaction: ButtonInteraction): Promise<void> {
    const logger = LogManager.getInstance().logger("ToggleRoleButton")
    const [method, rId] = interaction.customId.split('-')

    const role: Role | null | undefined = await interaction.guild?.roles.fetch(rId)

    if (role == null) {
      await interaction.reply({
        content: 'Ein Fehler ist beim zuweisen geschehen. Bitte versuche es später erneut.',
        ephemeral: true
      })
      return
    }

    if (!(process.env.TOGGLE_ROLES ?? '').includes(rId)) {
      await interaction.reply({
        content: 'Die Rolle ist nicht frei verfügbar.',
        ephemeral: true
      })
    }

    const member = interaction.member

    if (member == null) {
      await interaction.reply({
        content: 'Ein Fehler ist passiert.',
        ephemeral: true
      })
      return
    }

    const guildMember = await interaction.guild?.members.fetch(member.user.id)

    if (guildMember == null) {
      await interaction.reply({
        content: 'Ein Fehler ist passiert.',
        ephemeral: true
      })
      return
    }

    if (method === 'addRole') {
      await guildMember.roles.add(role)
      await interaction.reply({ content: 'Rolle wurde hinzugefügt!', ephemeral: true })
      logger.logSync('INFO', `${guildMember?.user.username}#${guildMember?.user.discriminator} got role ${role?.name}`)
    }
    if (method === 'removeRole') {
      await guildMember.roles.remove(role)
      await interaction.reply({
        content: 'Rolle wurde entfernt!',
        ephemeral: true
      })
      logger.logSync('INFO', `${guildMember?.user.username}#${guildMember?.user.discriminator} got role ${role?.name}`)
    }
  }
}
