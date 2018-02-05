
const q = window.QUnit;

if (/HeadlessChrome/.test(window.navigator.userAgent)) {
    q.config.autostart = false;
}

import $ from '../jqes6.js';
const fixture = document.getElementById('qunit-fixture');

q.module('Select function', function(hooks) {

    q.test('main select function exists', function(assert) {
        assert.ok($, 'The $ object exists');
        assert.strictEqual(typeof($), 'function', '$ is a function');
    });

    q.test('result set is correct type(s)', function(assert) {
        assert.strictEqual(typeof($()), 'object', 'result is an object');
        assert.strictEqual($().__proto__.constructor.name, 'Collection', 'result is a Collection');
        assert.ok($() instanceof Array, 'result is an Array');
    });

    q.test('bad selector results in empty set', function(assert) {
        assert.strictEqual($().length, 0, 'undefined selector');
        assert.strictEqual($(null).length, 0, 'null selector');
        assert.strictEqual($('').length, 0, 'empty string selector');
        assert.strictEqual($('asdfghjkl').length, 0, 'made up selector');
        assert.strictEqual($('dd').length, 0, 'non-existent tag selector');
        assert.strictEqual($('.foobar').length, 0, 'non-existent class selector');
        assert.strictEqual($('#foobar').length, 0, 'non-existent id selector');
    });

    q.test('single element returned with id selector', function(assert) {
        const results = $('#article');
        assert.strictEqual(results.length, 1, 'result set length is correct');
        assert.strictEqual(results[0], document.getElementById('article'), 'result is the article tag');
    });

    q.test('multiple elements returned with tag selector', function(assert) {
        const results = $('#list li');
        assert.strictEqual(results.length, 3, 'result set length is correct');
        assert.strictEqual(results[0], fixture.getElementsByTagName('li')[0], 'first result is correct');
        assert.strictEqual(results[1], fixture.getElementsByTagName('li')[1], 'second result is correct');
        assert.strictEqual(results[2], fixture.getElementsByTagName('li')[2], 'third result is correct');
    });

    q.test('selecting with node works', function(assert) {
        const results = $(document.getElementById('article'));
        assert.strictEqual(results.length, 1, 'result length is correct');
        assert.strictEqual(results[0], document.getElementById('article'), 'result node is correct');
    });

    q.test('selecting with array of nodes', function(assert) {
        const results = $([document.getElementById('article'), document.getElementById('article-paragraph')]);
        assert.strictEqual(results.length, 2, 'result length is correct');
        assert.strictEqual(results[0], document.getElementById('article'), 'first result node is correct');
        assert.strictEqual(results[1], document.getElementById('article-paragraph'), 'second result node is correct');
    });

    q.test('selecting with nodelist', function(assert) {
        const results = $(fixture.getElementsByTagName('li'));
        assert.strictEqual(results.length, 3, 'result length is correct');
        assert.strictEqual(results[0], fixture.getElementsByTagName('li')[0], 'first result is correct');
        assert.strictEqual(results[1], fixture.getElementsByTagName('li')[1], 'second result is correct');
        assert.strictEqual(results[2], fixture.getElementsByTagName('li')[2], 'third result is correct');
    });

    q.test('selecting with html produces detached element', function(assert) {
        const result = $('<time class="foobar">the time</time>');
        assert.strictEqual(typeof(result), 'object', 'result is an object');
        assert.strictEqual(result.__proto__.constructor.name, 'Collection', 'result is a Collection');
        assert.strictEqual(result.length, 1, 'result length is correct');
        assert.strictEqual(result[0].tagName, 'TIME', 'result tagName is correct');
        assert.strictEqual(result[0].innerText, 'the time', 'result content is correct');
        assert.strictEqual(result[0].classList.toString(), 'foobar', 'result class list is correct');
        assert.strictEqual(result[0].parentNode.tagName, 'DIV', 'result parent is correct (div)');
        assert.strictEqual(result[0].parentNode.parentNode, null, 'result parent of parent is correct (detached)');
    });

    q.test('selecting with non-node/array object fails with empty result', function(assert) {
        const results = $({ foo: 'bar'});
        assert.strictEqual(typeof(results), 'object', 'result is an object');
        assert.strictEqual(results.__proto__.constructor.name, 'Collection', 'result is a Collection');
        assert.strictEqual(results.length, 0, 'result length is zero');
    });

    q.test('selecting children with find works', function(assert) {
        const results = $('article').find('ul');
        assert.strictEqual(typeof(results), 'object', 'result is an object');
        assert.strictEqual(results.__proto__.constructor.name, 'Collection', 'result is a Collection');
        assert.strictEqual(results.length, 1, 'result length is correct');
        assert.strictEqual(results[0].tagName, 'UL', 'result tagName is correct');
    })

});
