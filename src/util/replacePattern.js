const userNamePattern = "{user}";
const userNamePatternEscaped = "\\{user\\}";
const firstNamePattern = "{firstName}"
const firstNamePatternEscaped = "\\{firstName\\}"

module.exports.replaceUserName = (string, userName) => string.replaceAll(userNamePattern, userName).replaceAll(userNamePatternEscaped, userName);
module.exports.replaceFirstName = (string, firstName) => string.replaceAll(firstNamePattern, firstName).replaceAll(firstNamePatternEscaped, firstName);