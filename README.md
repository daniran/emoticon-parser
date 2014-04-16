Emoticons Parser
=======

## Description

This module takes text input, and parses it for occurrences of emoticons.

Emoticons can come in the form of symbols like `:)` or `:-]`, or literal emoticon names like `(wink)`, `(sad)`

Each matched occurrence, is replaced with the specified HTML (see examples)

In addition, when run in a Browser, it can insert emoticon symbols to INPUT fields, in the caret (cursor) position.

### Demo

you can access a simple demo at:
http://emoparser.herokuapp.com/

## Install

```bash
$ npm install emoticon-parser
```

Or in a browser, simply include the emo-parser file:

```html
<script src="emo-parser.js"></script>
```

## Usage

This code initialize a parser instance.

Each emoticon is defined by it's key.

If the emoticon contains an array of emo definitions, the text is searched for every symbol occurrence.

Symbols that can be mirrored like `:-)` `(-:` are also searched for.

The `emoticon_html` is used when an emoticon is matched.

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

A call to

```js
parser.parseText("hello :( world (zzz) :~")
```

returns:

```html
hello <span class="emo-class emoticon-sad" title="sad"></span> world <span class="emo-class emoticon-zzz" title="zzz"></span> <span class="emo-class emoticon-zzz" title="zzz"></span>
```

See more examples in the examples.js

## Parser

Actual parsing is done by building a tree of characters during initialization.
The tree contains all possible symbol combinations - when running with `debug: true` you can see the tree printed to console.

Depending on the emoticon symbols, it would look something like this:

```
  ├─┬ :
  │ ├── ) #happy  :)
  │ ├─┬ -
  │ │ ├── ) #happy  :-)
  │ │ ├── ] #happy  :-]
  │ │ ├── D #LOL  :-D
  │ │ ├── / #puzzled  :-/
  │ │ ├── ( #sad  :-(
  │ │ ├── [ #angry  :-[
  │ │ ├── O #shocked  :-O
  │ │ └── o #surprised  :-o
  │ ├── ] #happy  :]
  │ ├── D #LOL  :D
  │ ├── / #puzzled  :/
  │ ├── ( #sad  :(
  │ ├── [ #angry  :[
  │ ├── O #shocked  :O
  │ └── o #surprised  :o
  ├─┬ [
  │ ├── : #happy  [:
  │ └─┬ -
  │   └── : #happy  [-:
  ├─┬ \
  │ ├── : #puzzled  \:
  │ └─┬ -
  │   └── : #puzzled  \-:
  ├─┬ )
  │ ├── : #sad  ):
  │ └─┬ -
  │   └── : #sad  )-:
  ├─┬ ]
  │ ├── : #angry  ]:
  │ └─┬ -
  │   └── : #angry  ]-:
```

During a call to `parseText()` the input text is compared against the tree char by char, until a symbol is matched.

## Tests

Jasmine Test Suite runs in the test folder
