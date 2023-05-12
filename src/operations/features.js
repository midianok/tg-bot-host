const { reply, REPLY} = require("./reply");
const { greetings, GREETINGS} = require("./greetings");
const { farewell, FAREWELL} = require("./farewell");
const { randomCat, RANDOM_CAT} = require("./randomCat");
const { randomPug, RANDOM_PUG} = require("./randomPug");
const { sendVoiceInline, VOICE_INLINE} = require("./voiceInline");
const {sendTreechText, TREECH_TEXT } = require("./treechSpeaks");
const {imageDistort, IMAGE_DISTORT } = require("./imageDistort");

module.exports.features = {
    [REPLY]: reply,
    [GREETINGS]: greetings,
    [FAREWELL]: farewell,
    [RANDOM_CAT]: randomCat,
    [RANDOM_PUG]: randomPug,
    [VOICE_INLINE]: sendVoiceInline,
    [TREECH_TEXT]: sendTreechText,
    [IMAGE_DISTORT]: imageDistort
};
