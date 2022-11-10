import { CommandInteraction, Client, Interaction, ButtonInteraction, ContextMenuCommandInteraction, ApplicationCommandType, UserContextMenuCommandInteraction } from "discord.js";
import LogManager from "src/logger/logger";
import { codeblocks, metafrage, about } from "../action/infoMessages";
import { createRoleInterface } from '../action/roles_buttons_create'
import { toggleRoles } from "../action/toggleRole";
import startUserReport from "../action/userReport"
import { Database } from 'sqlite3'

export default (client: Client, logger: LogManager, db: Database): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction, logger);
        }
        if (interaction.isButton()) {
            handleButtonInteraction(client, interaction, logger)
        }
        if (interaction.isContextMenuCommand() && interaction.commandType == ApplicationCommandType.User) {
            handleUserContextMenuCommand(client, interaction, logger, db)
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction, logger: LogManager) => {
    // handle slash command here
    switch (interaction.commandName) {
        case 'metafrage':
            metafrage(client, interaction, logger.logger('Metafrage'))
            return;
        case 'codeblocks':
            codeblocks(client, interaction, logger.logger('Codeblocks'))
            return;
        case 'role':
            createRoleInterface(interaction, "once", logger.logger('Toogle-Roles'))
            return;
        case 'role-force-button':
            createRoleInterface(interaction, "global", logger.logger('Toggle-Roles'))
            return;
       case 'about':
            about(client, interaction, logger.logger('About'))
            return;
    }

};

const handleButtonInteraction = async (client: Client, interaction: ButtonInteraction, logger: LogManager) => {
    if (/(addRole-|removeRole-)([0-9]+)/.test(interaction.customId)) {
        toggleRoles(client, interaction, logger.logger("Toggle-Roles"))
    }
}

const handleUserContextMenuCommand = async (client: Client, interaction: UserContextMenuCommandInteraction, logger: LogManager, db: Database) => {
    if (interaction.commandType == ApplicationCommandType.User && interaction.commandName == "REPORT") {
        startUserReport(interaction, client, db, logger.logger("Report-System"))
    }
}