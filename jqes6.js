/**************************************************************************
 * jqes6
 *
 * This is a lightweight version of some of the core functionality in jQuery
 * rewritten in ES5/6. This is not meant to replace jQuery, just an experiment
 * in what can be achieved in modern browsers without a library. This code will
 * not, for example, work in IE11. If you wanted to use it there then you
 * could precompile this using Babel, etc.
 *
 * Author: Jordan Kasper
 * LICENSE: MIT (https://opensource.org/licenses/MIT)
 *
 **************************************************************************/

(function() {
    'use strict';

    let selection = [];

    class Collection extends Array {
        constructor(nodeList = []) {
            if (Number.isInteger(nodeList)) { nodeList = []; }
            super(...nodeList.filter((item) => item.tagName));
        }

        find(selector) {
            let children = [];
            this.forEach((node) => {
                children = [...children, ...select(selector, node)];
            });
            return new Collection(children);
        }

        hide() {
            this.toggle('hide');
        }

        show() {
            this.toggle('show');
        }

        toggle(force) {
            this.forEach((node) => {
                let display = 'none';
                let show = false;
                let curr = node.style.display;
                if (force === 'show' || (curr === 'none' && !force)) {
                    show = true;
                }

                if (show) {
                    let temp = document.createElement(node.tagName);
                    document.body.appendChild(temp);
                    display = window.getComputedStyle(temp).display;
                    document.body.removeChild(temp);
                }
                node.style.display = display;
            });
            return this;
        }

        addClass(cls) {
            return this.toggleClass(cls, true);
        }
        removeClass(cls) {
            return this.toggleClass(cls, false);
        }
        toggleClass(cls, state) {
            let names = cls.split(/\s/);
            this.forEach((node) => {
                names.forEach((name) => {
                    if (state === true) {
                        node.classList.add(name);
                    } else if (state === false) {
                        node.classList.remove(name);
                    } else if (node.classList.contains(name)) {
                        node.classList.remove(name);
                    } else {
                        node.classList.add(name);
                    }
                });
            });
            return this;
        }

        on(evtName, target, fn) {
            if (typeof(target) === 'function') {
                fn = target;
                target = null;
            }
            this.forEach((node) => {
                node[`${evtName}_handler`] = function(evt) {
                    if (target && !evt.target.matches(target)) { return evt.preventDefault(); }
                    fn.apply( (target) ? evt.target : node, [...arguments] );
                };
                node.addEventListener(evtName, node[`${evtName}_handler`]);
            });
            return this;
        }
        off(evtName) {
            this.forEach((node) => node.removeEventListener(evtName, node[`${evtName}_handler`]));
            return this;
        }

        html(content) {
            if (!content) { return this.map((node) => node.innerHTML).join(''); }

            let html = content;
            if (content.tagName) { html = content.outerHTML; }
            this.forEach((node) => {
                node.innerHTML = html;
            });
            return this;
        }

        text(content) {
            if (!content) { return this.map((node) => node.innerText).join(''); }

            let text = content;
            if (content.tagName) { text = content.innerText; }
            this.forEach((node) => {
                node.innerText = text;
            });
            return this;
        }

        append(content) {
            let html = content;
            if (content.tagName) { html = content.outerHTML; }
            this.forEach((node) => {
                node.innerHTML += html;
            });
            return this;
        }

        appendTo(selector) {
            let elem = select(selector);
            let old = this.map((node) => node);
            this.length = 0;
            elem.forEach((parent) => {
                old.forEach((child) => {
                    parent.innerHTML += child.outerHTML;
                });
                this.push(...[...parent.children].slice(parent.children.length - old.length));
            });
            return this;
        }

        prepend(content) {
            let html = content;
            if (content.tagName) { html = content.outerHTML; }
            this.forEach((node) => {
                node.innerHTML = html + node.innerHTML;
            });
            return this;
        }

        prependTo(selector) {
            let elem = select(selector);
            let old = this.map((node) => node).reverse();
            this.length = 0;
            elem.forEach((parent) => {
                old.forEach((child) => {
                    parent.innerHTML = child.outerHTML + parent.innerHTML;
                });
                this.push(...[...parent.children].slice(0, old.length));
            });
            return this;
        }

        attr(prop, value) {
            if (typeof(prop) === 'string' && value === undefined) {
                return this[0] && this[0].getAttribute(prop);
            } else if (typeof(prop) === 'string' && value) {
                this.forEach((node) => node.setAttribute(prop, value.toString()));
            } else if (typeof(prop) === 'string' && !value && value !== 0) {
                this.forEach((node) => node.removeAttribute(prop));
            } else if (typeof(prop) === 'object') {
                Object.keys(prop).forEach((key) => this.attr(key, prop[key]));
            }
            return this;
        }
    }
    Collection.prototype.prop = Collection.prototype.attr;

    function select(selector, context = document) {
        let selection;

        if (typeof(context) === 'string') {
            return select(context).find(selector);
        } else if (!context.querySelectorAll) {
            context = document;
        }

        if (typeof(selector) === 'string') {
            if (/^</.test(selector)) {
                let temp = document.createElement('div');
                temp.innerHTML = selector;
                selection = [...temp.children];
                temp = null;
            } else {
                try {
                    selection = [...context.querySelectorAll(selector)];
                } catch (err) {
                    selection = [];
                }
            }
        } else if (selector.tagName) {
            selection = [selector];
        } else {
            try { selection = [...selector]; } catch (err) { /* don't care here... leave it empty */ }
        }
        return new Collection(selection);
    }

    window.$ = select;

}());
