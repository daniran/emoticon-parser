/**
 * Examples
 */


var EmoticonParser = require('./lib/emo-parser');
var parser = new EmoticonParser({
    debug: true,
    emoticons: {
        zzz: {
            emos: [':~']
        }
    },
    emoticon_html: '<span class="emo-class emoticon-{EMOTICON}" title="{EMOTICON}"></span>'
});

testParser("hello :( world (zzz) :~");
testParser("first line :)\nSecond line :(");
testParser("first line :)\n(wink) Second line :(");

function testParser(text) {
    console.info("Text: " + text);
    console.info("Result: " + parser.parseText(text));
}