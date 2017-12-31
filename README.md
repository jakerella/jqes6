
# jqes6

This is a lightweight (Under 10KB unminified) version of some of the core functionality in jQuery rewritten in ES5/6. This is **not meant to replace anyone's libraries**, but merely an experiment in what can be achieved in modern browsers without the use of libraries. This code will not, for example, work in IE11. (Although you could precompile this code using Babel, etc.)

## Documentation

**This library DOES NOT support all of jQuery.** However, a lot of the most common methods are in here for traversing and manipulating HTML nodes. Note that all functions support chaining where appropriate (for example, `.html()` with no arguments returns the innerHTML of the selected nodes, not the collection of nodes). All manipulation functionality can be performed on a collection of nodes, no need to loop over them just like in jQuery (for example, `$('p').hide()` will hide all paragraphs). Lastly, note that this library uses a custom ES6 class (`Collection`) which extends the built-in JS `Array`. As such, this library does not implement the jQuery `each()` method because you can just use `.forEach()` (or `.map()` or `.filter()`, etc).

### Basic Usage

```javascript
$('[href^="https"]').addClass('secure');

$('.modal').show();

$('article')
    .addClass('reading')
    .append('<aside>Like this article? Share it!</aside>')
    .find('a.share')
        .addClass('highlight');
```

### API

These are the supported methods. Instead of re-documenting jQuery, I simply link to the jQuery API docs. However, I will note where there are significant differences. That said, you should understand that _this is not jQuery_, so there will always be differences, but mostly minor. One big difference, however, is that all methods (where appropriate) return a `Collection` (a subclass of `Array`) and not the jQuery object. You may want to check out the full [jQuery API documentation](https://api.jquery.com) for more extensive explanations!

* `$(selector [, context])` https://api.jquery.com/jQuery/  
Note that the first argument supports: String selector, Node, NodeList, Array<Node>, or String HTML. The second argument only supports String selector or an HTML Node.
* `.find(selector)` https://api.jquery.com/find/
* `.hide()` https://api.jquery.com/hide/  
Note that this version of `hide` takes no arguments, unlike jQuery proper, there is no animation. If you want animation use CSS!
* `.show()` https://api.jquery.com/show/  
Note that this version of `show` takes no arguments, unlike jQuery proper, there is no animation. If you want animation use CSS!
* `.toggle()` https://api.jquery.com/toggle/  
Note that this version of `toggle` takes no arguments, unlike jQuery proper, there is no animation. If you want animation use CSS!
* `.addClass(className)` https://api.jquery.com/addClass/  
Does not support a `function` as the argument, but does support multiple classes.
* `.removeClass(className)` https://api.jquery.com/removeClass/  
Does not support a `function` as the argument, but does support multiple classes.
* `.toggleClass(className [, state])` https://api.jquery.com/toggleClass/  
Does not support a `function` as the first argument, but does support multiple classes.
* `.on(event [, selector], function)` https://api.jquery.com/on/  
Only supports a single `event` type and no data, but does handle simple delegation.
* `.off(event)` https://api.jquery.com/off/  
Very simple, only handles removing a single event handler by event name.
* `.html([content])` https://api.jquery.com/html/  
Does not support passing in a function
* `.text([content])` https://api.jquery.com/text/  
Does not support passing in a function
* `.append(content)` https://api.jquery.com/append/  
Only supports content as an HTML String or Node
* `.appendTo(target)` https://api.jquery.com/appendTo/  
* `.prepend(content)` https://api.jquery.com/prepend/  
Only supports content as an HTML String or Node
* `.prependTo(target)` https://api.jquery.com/prependTo/  
* `.attr(property [, value])` https://api.jquery.com/attr/  
Does not support passing a `function` as the value.
* `.prop()`  
In this library, `.prop()` is just an alias for `.attr()`. That is not true in jQuery itself, but it mostly has to do with manipulating forms, so I'm letting it go for now.

## Author and LICENSE

This was created by Jordan Kasper (c) 2017, but with credit for the API to the jQuery foundation.

This library is published under the [MIT license](/LICENSE).
