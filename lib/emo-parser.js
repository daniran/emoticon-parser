(function() {

    /**
     * Initialize a parser instance.
     * Each emoticon is defined by it's key.
     * If the emoticon contains an emo:[] definition, the text is searched for every symbol occurrence.
     * Symbols that can be mirrored like :-) (-: are also searched for
     * The emoticon_html is used when an emoticon is matched.
     * This is used when parsing a text using {@link EmoticonsParser#parseText()}
     * @param config object:
     * @example
     *   {
     *     debug: true, // the debug flag prints the parse tree to console
     *     emoticons: {
     *       zzz: {
     *       emos: [':~']
     *     }
     *   }
     *   emoticon_html: '<span class="emo-class emoticon-{EMOTICON}" title="{EMOTICON}"></span>'
     * }
     *
     * @constructor
     *
     */
    var EmoticonsParser = function(config) {
        this.config = {
            debug: !!config.debug,
            emoticon_html: config.emoticon_html || EmoticonsParser.defaults.emoticon_html,
            emoticons: this._copyDefaults(EmoticonsParser.defaults.emoticons, config.emoticons)
        };
        this.root_ast_node = {
            children: []
        };
        this.init();
    };

    /**
     * Parser defaults
     */
    EmoticonsParser.defaults = {
        debug: false,
        emoticon_html: '<span class="emoticon-{EMOTICON}" title="{EMOTICON}"></span>',
        emoticons: {
            "happy": {
                emos: [':)', ':-)', ':]', ':-]']
            },
            "LOL": {
                emos: [':D', ':-D']
            },
            "puzzled": {
                emos: [':/', ':-/']
            },
            "sad": {
                emos: [':(', ':-(']
            },
            "angry": {
                emos: [':[', ':-[']
            },
            "annoyed": {
            },
            "proud": {
            },
            "heartbroken": {
                emos: ['</3']
            },
            "curious": {
            },
            "thumbsup": {
            },
            "loveyou": {
                emos: ['<3']
            },
            "marryme": {
            },
            "shocked": {
                emos: [':-O', ':O']
            },
            "surprised": {
                emos: [':o', ':-o']
            },
            "wink": {
                emos: [';)', ';-)']
            }
        }
    };

    var p = EmoticonsParser.prototype;

    p.init = function() {
        this._initParseTree();
    };

    /**
     * Initialize the parse tree
     * @private
     */
    p._initParseTree = function() {
        var self = this;
        for(var emo_id in this.config.emoticons) {
            // add names in the form (name)
            this._parseSymbolToTree("(" + emo_id + ")", emo_id);
            var emos = this.config.emoticons[emo_id].emos;
            if(emos) {
                emos.forEach(function(emo) {
                    // add emo texts :) :-)
                    self._parseSymbolToTree(emo, emo_id);
                    // also add the mirror form (: (-:
                    self._parseSymbolToTree(self._mirrorEmoticon(emo), emo_id);
                });
            }
        }
        if(this.config.debug)
            this._printTree();
    };

    /**
     * Fill in a given object with default properties.
     * @param obj
     * @private
     */
    p._copyDefaults = function(obj) {
        Array.prototype.slice.call(arguments, 1).forEach(function(source) {
            if(source) {
                for(var prop in source) {
                    if(obj[prop] === void 0) obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    /**
     * return emoticons in mirror form :) => (:
     * @param emo_symbol
     * @returns {string}
     * @private
     */
    p._mirrorEmoticon = function(emo_symbol) {
        var char_array = emo_symbol.split('');
        var result = '';
        for(var i = char_array.length - 1; i >= 0; i--) {
            var _char = char_array[i];
            switch(_char) {
                case ')':
                    result += '(';
                    break;
                case '(':
                    result += ')';
                    break;
                case ']':
                    result += '[';
                    break;
                case '[':
                    result += ']';
                    break;
                case '/':
                    result += '\\';
                    break;
                case '<':
                    result += '>';
                    break;
                case 'D':
                case '3':
                    return ''; // can't mirror
                    break;
                default:
                    result += _char;
                    break;
            }
        }
        return result;
    };

    /**
     * add a symbol to the parse tree
     * @param _symbol
     * @param code
     * @private
     */
    p._parseSymbolToTree = function(_symbol, code) {
        if(!_symbol)
            return;

        if(this.config.debug)
            console.log('EmoticonsParser: adding ' + _symbol);

        // add a leading space
        var symbol = ' ' + _symbol;

        var current_node = this.root_ast_node;
        symbol.split("").forEach(function(_char, index) {
            var found = false;
            //TODO: use some
            current_node.children.forEach(function(child) {
                if(child.char == _char) {
                    found = true;
                    current_node = child;
                }
            });
            if(!found) {
                // add the char to the tree
                var new_child = { "char": _char, children: [] };
                current_node.children.push(new_child);
                current_node = new_child;
            }
            if(index == symbol.length - 1) {
                current_node.value = symbol;
                current_node.code = code;
            }
        });
    };

    /**
     * parse the text char by char, traversing the parse tree to find matches
     * @param text
     * @returns {string}
     */
    p.parseText = function(text) {
        if(!text)
            return "";

        var self = this;
        var result = "";
        var current_node = this.root_ast_node;
        var matched_chars = [];

        // fix HTML escaping for '<>'
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');

        // add a space to start the matching
        text = ' ' + text;

        // loop chars
        var char_array = text.split("");
        for(var i = 0; i < char_array.length; i++) {
            var _char = char_array[i];
            // handle newline
            if(_char === '\n') {
                result += _char;
                current_node = self.root_ast_node.children[0];
                continue;
            }
            var matched = false;
            var found = false;
            // loop tree
            var next_char = i < char_array.length - 1 ? char_array[i + 1] : ' ';
            for(var j = 0; j < current_node.children.length; j++) {
                var child = current_node.children[j];
                // collapse spaces
                if(_char === ' ') {
                    current_node = self.root_ast_node.children[0];
                    matched = true;
                    break;
                }
                if(child.char == _char) {
                    // matched a node, continue traversing the tree
                    matched = true;
                    current_node = child;
                    if(child.code && (/\s/.test(next_char))) {
                        result += ' ' + self.printEmoId(child.code, 'html');
                        // its a match
                        found = true;
                        matched_chars = [];
                    }
                    break;
                }
            }
            if(found) {
                current_node = self.root_ast_node;
            }
            if(matched && !found) {
                // save the matched chars, if the pattern is not completed, these have to go back into the text
                matched_chars.push(_char);
            }
            if(!matched) {
                current_node = self.root_ast_node;
                if(matched_chars.length) {
                    // put back the matched items form the failed pattern
                    result += matched_chars.join('') + _char;
                    matched_chars = [];
                } else {
                    result += _char;
                }
            }
        }
        return result.trim();
    };

    p._printTree = function() {
        var prefix = 'EmoticonsParser: printing parser tree:\n';
        console.log(prefix + this._archy(this.root_ast_node));
    };

    /**
     * print the parse tree
     * based on {@link https://github.com/substack/node-archy}
     * @param obj
     * @param prefix
     * @param opts
     * @returns {string}
     * @private
     */
    p._archy = function(obj, prefix, opts) {
        var self = this;
        if(prefix === undefined) prefix = '';
        if(!opts) opts = {};
        var chr = function(s) {
            var chars = {
                '│': '|',
                '└': '`',
                '├': '+',
                '─': '-',
                '┬': '-'
            };
            return opts.unicode === false ? chars[s] : s;
        };

        if(typeof obj === 'string') obj = { label: obj };

        var nodes = obj.children || [];
        var lines = (obj.char || '').split('\n');
        var splitter = '\n' + prefix + (nodes.length ? chr('│') : ' ') + ' ';

        return prefix
            + lines.join(splitter) + (obj.code ? ' #' + obj.code + ' ' + obj.value : '') + '\n'
            + nodes.map(function(node, ix) {
                var last = ix === nodes.length - 1;
                var more = node.children && node.children.length;
                var prefix_ = prefix + (last ? ' ' : chr('│')) + ' ';

                return prefix
                    + (last ? chr('└') : chr('├')) + chr('─')
                    + (more ? chr('┬') : chr('─')) + ' '
                    + self._archy(node, prefix_, opts).slice(prefix.length + 2)
                    ;
            }).join('')
            ;
    };

    p.printEmoId = function(emo_id, type) {
        switch(type) {
            case 'html':
                return this.config.emoticon_html.replace(/\{EMOTICON\}/g, emo_id)
            case 'txt':
                return "(" + emo_id + ")";
        }
    };

    /**
     * Get the active emoticons config
     * @returns {Object}
     */
    p.getEmoticons = function() {
        return this.config.emoticons;
    };

    /**
     * insert emoticon symbol (not HTML) into the given INPUT/TEXTAREA element, at the caret position
     * @param emo_id
     * the emoticon key id
     * @param input_elem
     * a reference to the INPUT/TEXTAREA DOM element
     */
    p.insertEmoticon = function(emo_id, input_elem) {
        // expect a DOM element
        if(!input_elem || !input_elem.nodeName)
            return;

        var emo_obj = this.config.emoticons[emo_id];
        if(!emo_obj)
            return;

        var emo_txt = emo_obj.emos ? emo_obj.emos[0] : this.printEmoId(emo_id, 'txt');
        this._addTextAtCaret(input_elem, emo_txt);
        input_elem.focus();
        this._moveCursorToEnd(input_elem);
    };

    p._addTextAtCaret = function(elem, text) {
        if(typeof elem.selectionEnd == "number") {
            var val = elem.value;
            var before = val.substring(0, elem.selectionEnd);
            var after = val.substring(elem.selectionEnd);
            elem.value = before + ' ' + text + ' ' + after;
        } else {
            elem.value = elem.value + ' ' + text;
        }

    };

    p._moveCursorToEnd = function(elem) {
        if(typeof elem.selectionStart == "number") {
            elem.selectionStart = elem.selectionEnd = elem.value.length;
        } else if(typeof elem.createTextRange != "undefined") {
            elem.focus();
            var range = elem.createTextRange();
            range.collapse(false);
            range.select();
        }
    };

    // export
    if(typeof module !== "undefined" && module.exports) {
        module.exports = EmoticonsParser;
    } else if(window) {
        window.EmoticonsParser = EmoticonsParser;
    } else if(global) {
        global.EmoticonsParser = EmoticonsParser;
    }

}());

