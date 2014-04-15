Emoticons Parser
=======

Description

This module takes text input, and parses it for occurrences of emoticons.

Emoticons can come in the form of symbols like `:)` or `:-]`, or literal emoticon names like `(wink)`, `(sad)`

Each matched occurrence, is replaced with the specified HTML (see examples)

In addition, when run in a Browser, it can insert emoticon symbols to INPUT fields, in the caret (cursor) position.

## Install

```bash
$ npm install emoticon-parser
```

Or in a browser, simply include the emo-parser file:

```html
<script src="emo-parser.js"></script>
```

## Usage

```js
var parser = new EmoticonParser({
    debug: true,
    emoticons: {
        zzz: {
            emos: [':~']
        }
    },
    emoticon_html: '<span class="emo-class emoticon-{EMOTICON}" title="{EMOTICON}"></span>'
});
```

For example:

The text `hello :( world (zzz) :~` is replaced with:

```html
hello <span class="emo-class emoticon-sad" title="sad"></span> world <span class="emo-class emoticon-zzz" title="zzz"></span> <span class="emo-class emoticon-zzz" title="zzz"></span>
```


See more examples in the examples.js

## Tests

Jasmine Test Suite runs in the test folder
