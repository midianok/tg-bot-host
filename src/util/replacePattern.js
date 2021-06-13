const userNamePattern = "{user}";
const userNamePatternEscaped = "\\{user\\}";
const firstNamePattern = "{firstName}"
const firstNamePatternEscaped = "\\{firstName\\}"

const replaceUserName = (string, userName) => string.replaceAll(userNamePattern, userName).replaceAll(userNamePatternEscaped, userName);
const replaceFirstName = (string, firstName) => string.replaceAll(firstNamePattern, firstName).replaceAll(firstNamePatternEscaped, firstName);

module.exports.replaceUserName = replaceUserName
module.exports.replaceFirstName = replaceFirstName