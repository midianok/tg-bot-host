const { speechToText, SPEECH_TO_TEXT } = require("./speechToText");
const { reply, REPLY} = require("./reply");
const { greetings, GREETINGS} = require("./greetings");
const { farewell, FAREWELL} = require("./farewell");
const { tiktok, TIKTOK} = require("./tikTok");
const { randomCat, RANDOM_CAT} = require("./randomCat");
const { randomPug, RANDOM_PUG} = require("./randomPug");
const { sendVoiceInline, VOICE_INLINE} = require("./voiceInline");

module.exports.features = {
    [SPEECH_TO_TEXT]: speechToText,
    [REPLY]: reply,
    [GREETINGS]: greetings,
    [FAREWELL]: farewell,
    [TIKTOK]: tiktok,
    [RANDOM_CAT]: randomCat,
    [RANDOM_PUG]: randomPug,
    [VOICE_INLINE]: sendVoiceInline
}