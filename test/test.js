/**
 * jasmine test suite: runs in the node.js console
 */
jasmineRequire = require('./jasmine-2.0.0/jasmine');
var j = require('./jasmine-2.0.0/boot');
var consoleRequire = require('./jasmine-2.0.0/console');

consoleRequire.console(consoleRequire, global);

var reporter = new ConsoleReporter({
    timer: new jasmine.Timer,
    print: console.log,
    showColors: true
});

var env = jasmine.getEnv();
env.addReporter(reporter);

// parser
var EmoticonParser = require('../lib/emo-parser');
var parser = new EmoticonParser({
    debug: false,
    emoticons: {
        zzz: {
            emos: [':~']
        }
    },
    emoticon_html: '<{EMOTICON}/>'
});

j.describe("Emoticon Parser Tests", function() {
    j.it("test built-in symbol emo", function() {
        j.expect(parser.parseText('test :)')).toBe('test <happy/>');
    });
    j.it("test built-in name wink", function() {
        j.expect(parser.parseText('test (wink)')).toBe('test <wink/>');
    });
    j.it("test user-defined symbol emo", function() {
        j.expect(parser.parseText('test :~')).toBe('test <zzz/>');
    });
    j.it("test user-defined symbol emo", function() {
        j.expect(parser.parseText('test (zzz)')).toBe('test <zzz/>');
    });
    j.it("test several symbols", function() {
        j.expect(parser.parseText('test :) :( ')).toBe('test <happy/> <sad/>');
    });
    j.it("test new line 1", function() {
        j.expect(parser.parseText('test :)\n:( ')).toBe('test <happy/>\n <sad/>');
    });
});

env.execute();