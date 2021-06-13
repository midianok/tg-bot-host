const { replaceUserName, replaceFirstName } = require('./replacePattern');
const { markdownv2: format } = require('telegram-format');

test('userName pattern replace', () => {
    expect(replaceUserName("test123 string!.&^? {user} test string!.&^? {user}", "Testname"))
        .toBe("test123 string!.&^? Testname test string!.&^? Testname");
});

test('userName pattern replace escaped', () => {
    expect(replaceUserName(format.escape("test123 string!.&^? {user} test string!.&^? {user}"), "Testname"))
        .toBe("test123 string\\!\\.&^? Testname test string\\!\\.&^? Testname");
});

test('multiple firstName pattern replace', () => {
    expect(replaceFirstName("test123 string!.&^? {firstName} test string!.&^? {firstName}", "Testname"))
        .toBe("test123 string!.&^? Testname test string!.&^? Testname");
});

test('multiple firstName pattern replace escaped', () => {
    expect(replaceFirstName(format.escape("test123 string!.&^? {firstName} test string!.&^? {firstName}"), "Testname"))
        .toBe("test123 string\\!\\.&^? Testname test string\\!\\.&^? Testname");
});