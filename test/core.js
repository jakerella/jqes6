
(function(q, $) {

    q.test('library exists', function(assert) {
        let done = assert.async();
        assert.ok(window.$);
        done();
    });

})(QUnit, $);
