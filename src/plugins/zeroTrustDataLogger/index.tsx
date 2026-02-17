import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";
import { FluxDispatcher } from "@webpack/common";

const logger = new Logger("0TCord");

// Event Handlers
function handleMessageCreate({ channelId, message, optimistic }: any) {
    if (optimistic) return;
    logger.log(
        `[New Message] Channel: ${channelId} | Author: ${message.author?.username} (${message.author?.id})`,
        "\nContent:", message.content
    );
}

function handleMessageDelete({ channelId, id }: any) {
    logger.log(
        `[Message Deleted] Channel: ${channelId} | Message ID: ${id}`
    );
}

function handleMessageUpdate({ message }: any) {
    if (message.content) {
        logger.log(
            `[Message Edited] Channel: ${message.channel_id} | Message ID: ${message.id}`,
            "\nNew Content:", message.content
        );
    }
}

function handleReactionAdd({ channelId, messageId, emoji, userId }: any) {
    logger.log(
        `[Reaction Added] Channel: ${channelId} | User: ${userId}`,
        `\nEmoji: ${emoji.name || emoji.id} on Message: ${messageId}`
    );
}

function handleReactionRemove({ channelId, messageId, emoji, userId }: any) {
    logger.log(
        `[Reaction Removed] Channel: ${channelId} | User: ${userId}`,
        `\nEmoji: ${emoji.name || emoji.id} on Message: ${messageId}`
    );
}

export default definePlugin({
    name: "0T Logger",
    description: "Stores user-generated content in 0T database",
    authors: [Devs.miyako],

    start() {
        logger.log("Started Logging Events...");

        FluxDispatcher.subscribe("MESSAGE_CREATE", handleMessageCreate);
        FluxDispatcher.subscribe("MESSAGE_DELETE", handleMessageDelete);
        FluxDispatcher.subscribe("MESSAGE_UPDATE", handleMessageUpdate);
        FluxDispatcher.subscribe("MESSAGE_REACTION_ADD", handleReactionAdd);
        FluxDispatcher.subscribe("MESSAGE_REACTION_REMOVE", handleReactionRemove);
    },

    stop() {
        FluxDispatcher.unsubscribe("MESSAGE_CREATE", handleMessageCreate);
        FluxDispatcher.unsubscribe("MESSAGE_DELETE", handleMessageDelete);
        FluxDispatcher.unsubscribe("MESSAGE_UPDATE", handleMessageUpdate);
        FluxDispatcher.unsubscribe("MESSAGE_REACTION_ADD", handleReactionAdd);
        FluxDispatcher.unsubscribe("MESSAGE_REACTION_REMOVE", handleReactionRemove);

        logger.log("Stopped Logging Events.");
    }
});