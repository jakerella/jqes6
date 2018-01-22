
(function(q, $) {
    q.config.autostart = false;

    const fixture = document.getElementById('qunit-fixture');

    q.module('Main function', function(hooks) {

        q.test('library exists', function(assert) {
            assert.ok(window.$, 'The $ object exists');
            assert.strictEqual(typeof(window.$), 'function', '$ is a function');
        });

        q.test('result set is correct type(s)', function(assert) {
            assert.strictEqual(typeof($()), 'object', 'object');
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

    });

})(QUnit, window.$);
