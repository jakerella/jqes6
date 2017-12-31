/**************************************************************************
 * jqes6
 *
 * This is a lightweight (Under 10KB unminified) version of some of
 * the core functionality in jQuery rewritten in ES5/6. This is not meant
 * to replace anyone's libraries, but merely an experiment in what can be
 * achieved in modern browsers without the use of libraries. This code will
 * not, for example, work in IE11. If you wanted to use it there then you
 * could precompile this using Babel, etc.
 *
 * Author: Jordan Kasper
 * LICENSE: MIT (https://opensource.org/licenses/MIT)
 *
 * Documentation:
 * Note that all functions support chaining where appropriate and all
 * functionality can be performed on a collection of nodes, no need to
 * loop over them.
 *
   $            The main selector function, supports string selectors,
                existing nodes, second argument with a custom root, and
                will also create detached elements if given raw HTML
   find         Just like $, but for chaining
   hide         Hides an element (display none)
   show         Unhides an element (default display type for that tagName)
   toggle       Either hide or show, depending on current state
   addClass     Add the given className
   removeClass  Remove the given className
   toggleClass  Add or remove the className depending on current classList
   on           Add an event listener, including event delegation
   off          Remove an event listener (not very smartly done)
   html         Change the HTML inside a node, supports both strings and
                using the innerHTML of an existing node
   text         Chnage the text inside a node, supports both strings and
                using the innerText of an existing node
   append       Add the given selector/node/raw HTML to the end of each node
                in the currently selected set of nodes
   appendTo     Add the selected node(s) to the end of the given node(s);
                essentially the reverse of append()
   prepend      Add the given selector/node/raw HTML to the beginning of
                each node in the currently selected set of nodes
   prependTo    Add the selected node(s) to the end of the given node(s);
                essentially the reverse of prepend()
   attr / prop  Change the value of an attribute on the selected node(s);
                if no value is given (the second arg), then the given
                attribute is removed from the node's HTML tag. Note that this
                also supports passing in an object (hash) of properties/values
                (These are just aliases of eachother)
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
            this.forEach((node) => node.classList.add(cls.toString()));
            return this;
        }
        removeClass(cls) {
            this.forEach((node) => node.classList.remove(cls.toString()));
            return this;
        }
        toggleClass(cls) {
            this.forEach((node) => {
                cls = cls.toString();
                (node.classList.contains(cls)) ? node.classList.remove(cls) : node.classList.add(cls);
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
            if (typeof(prop) === 'string' && value) {
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

    function select(selector, parent) {
        let selection;
        let parentNode = document;

        if (typeof(parent) === 'string') {
            return select(parent).find(selector);
        } else if (parent && parent.tagName) {
            parentNode = parent;
        }

        if (typeof(selector) === 'string') {
            if (/^</.test(selector)) {
                let temp = document.createElement('div');
                temp.innerHTML = selector;
                selection = [...temp.children];
                temp = null;
            } else {
                try {
                    selection = [...parentNode.querySelectorAll(selector)];
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
