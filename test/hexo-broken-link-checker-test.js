var Lab = require('lab')
var Code = require('code')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = Code.expect;

var Hexo = require('hexo');
global.hexo = new Hexo(__dirname, {silent: true});

require('..')


describe('hexo-broken-link-checker', function(){



    describe('should register', function() {
        it('register link_checker', function(done) {
            var cmd = hexo.extend.console.get('link_checker');
            expect(cmd).to.exist()

            done()
        });

        it('register post', function(done) {
            var filter = hexo.extend.filter.list();
            expect(filter).to.exist()

            done()
        });
    });

});
