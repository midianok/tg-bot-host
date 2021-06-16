const axios = require("axios");
const rateLimit = require("telegraf-ratelimit");

async function downloadBuffer(url, headers = {}) {
    const result = await axios({url, responseType: 'arraybuffer', headers,  validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
        }});
    return result.data;
}

const limitConfig = {
    window: 5000,
    limit: 1,
    onLimitExceeded: ctx => ctx.deleteMessage(ctx.message.message_id)
};

/**
 * @param root0
 * @param root0.deleteMessage
 */
function createGeneralRateLimiter({ deleteMessage } = { deleteMessage: true }) {
    if (deleteMessage) {
        return rateLimit(limitConfig);
    }
    return rateLimit(
        Object.assign(limitConfig, { onLimitExceeded: () => {} })
    );
}

module.exports = {
    generalRateLimiter: createGeneralRateLimiter({ deleteMessage: true }),
    nonDeletingRateLimiter: createGeneralRateLimiter({ deleteMessage: false }),
    downloadBuffer
};
