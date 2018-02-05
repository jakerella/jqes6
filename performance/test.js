

import jqes6 from '../jqes6.js';

console.info('SETTING UP TESTS...');

const tests = [
    {
        name: 'basic select',
        fn: (lib) => {
            lib('a');
        }
    },

    {
        name: 'complex select',
        fn: (lib) => {
            lib('main .unread nav li:nth-child(2)');
        }
    },

    {
        name: 'select with find and class',
        fn: (lib) => {
            lib('article.unread').find('footer').addClass('bottom').find('a').addClass('link');
        }
    },

    {
        name: 'detached node',
        fn: (lib) => {
            lib(`<p class='red'>ksadhf kjhsdkjlfh kljdhsflkjhasdf <a href='#'>foobar</a> kjashd fkjh askjdfhlkjhasdfk. <strong>sjkdh fkjsd</strong> skjdh fkjs hdfkjhsdkjfhkjsdh kfjhsdkjf . <span style='text-transform: small-caps'>wut</span>. kjsd fksjd fklj klsdj flkjs dklfj <a href='#'>yes please</a> kfsjdfklj sdklfj lkjsdkflj kdslj flksjd fsdsd.</p>`);
        }
    },
    
    {
        name: 'add class',
        fn: (lib) => {
            lib('a').addClass('foobar');
        }
    },

    {
        name: 'append text',
        fn: (lib) => {
            lib('article h1').append('foobar');
        }
    },

    {
        name: 'append html',
        fn: (lib) => {
            lib('article section').append(`<p class='red'>ksadhf kjhsdkjlfh kljdhsflkjhasdf <a href='#'>foobar</a> kjashd fkjh askjdfhlkjhasdfk. <strong>sjkdh fkjsd</strong> skjdh fkjs hdfkjhsdkjfhkjsdh kfjhsdkjf . <span style='text-transform: small-caps'>wut</span>. kjsd fksjd fklj klsdj flkjs dklfj <a href='#'>yes please</a> kfsjdfklj sdklfj lkjsdkflj kdslj flksjd fsdsd.</p>`);
        }
    },

    {
        name: 'prepend html',
        fn: (lib) => {
            lib('article section').prepend(`<p class='red'>ksadhf kjhsdkjlfh kljdhsflkjhasdf <a href='#'>foobar</a> kjashd fkjh askjdfhlkjhasdfk. <strong>sjkdh fkjsd</strong> skjdh fkjs hdfkjhsdkjfhkjsdh kfjhsdkjf . <span style='text-transform: small-caps'>wut</span>. kjsd fksjd fklj klsdj flkjs dklfj <a href='#'>yes please</a> kfsjdfklj sdklfj lkjsdkflj kdslj flksjd fsdsd.</p>`);
        }
    },

    {
        name: 'appendTo node',
        fn: (lib) => {
            lib(`<p class='red'>ksadhf kjhsdkjlfh kljdhsflkjhasdf <a href='#'>foobar</a> kjashd fkjh askjdfhlkjhasdfk. <strong>sjkdh fkjsd</strong> skjdh fkjs hdfkjhsdkjfhkjsdh kfjhsdkjf . <span style='text-transform: small-caps'>wut</span>. kjsd fksjd fklj klsdj flkjs dklfj <a href='#'>yes please</a> kfsjdfklj sdklfj lkjsdkflj kdslj flksjd fsdsd.</p>`).appendTo('article section');
        }
    },

    {
        name: 'get attribute',
        fn: (lib) => {
            lib('article a').attr('href');
        }
    },

    {
        name: 'set single attribute',
        fn: (lib) => {
            lib('article a').attr('href', '#foobar');
        }
    },

    {
        name: 'set multiple attributes',
        fn: (lib) => {
            lib('article a').attr({'href': '#fobar', 'title': 'Foobar'});
        }
    },

    {
        name: 'hide',
        fn: (lib) => {
            lib('article footer').hide();
        }
    },

    {
        name: 'add event',
        fn: (lib) => {
            lib('article nav a').on('click', function() { console.log('handled event'); });
        }
    },

    {
        name: 'retrieve html',
        fn: (lib) => {
            lib('article p').html();
        }
    },

    {
        name: 'set html',
        fn: (lib) => {
            lib('article p').html(`ksadhf kjhsdkjlfh kljdhsflkjhasdf <a href='#'>foobar</a> kjashd fkjh askjdfhlkjhasdfk. <strong>sjkdh fkjsd</strong> skjdh fkjs hdfkjhsdkjfhkjsdh kfjhsdkjf . <span style='text-transform: small-caps'>wut</span>. kjsd fksjd fklj klsdj flkjs dklfj <a href='#'>yes please</a> kfsjdfklj sdklfj lkjsdkflj kdslj flksjd fsdsd.`);
        }
    },

    {
        name: 'retrieve text',
        fn: (lib) => {
            lib('article p').text();
        }
    },


    {
        name: 'set text',
        fn: (lib) => {
            lib('article h1').text('Foobar');
        }
    }
];


const suite = new Benchmark.Suite();
const libs = { jqes6: jqes6, jquery: window.jQuery };
tests.sort(() => Math.random() - 0.5);
tests.forEach((t) => {
    let first = 'jqes6';
    let second = 'jquery';
    if (Math.random() > 0.5) {
        first = 'jquery';
        second = 'jqes6';
    }
    suite.add(`${t.name}#${first}`, () => t.fn(libs[first]));
    suite.add(`${t.name}#${second}`, () => t.fn(libs[second]));
});

suite
    .on('cycle', (event) => {
        console.log(String(event.target));
        document.querySelector('.fixture').innerHTML = cleanHtml;
    })
    .on('start', () => console.info('TEST STARTED...'))
    .on('complete', function() {
        for (let i=0; i<this.length; i+=2) {
            const hex = {0:0,1:1}
            let multiplier = 0;
            let es6Index = i;
            let jqIndex = i+1;
            if (this[i].name.split('#')[1] === 'jquery') {
                es6Index = i+1;
                jqIndex = i;
            }

            if (this[es6Index].compare(this[jqIndex]) < 0) {
                multiplier = Math.round(this[jqIndex].hz / this[es6Index].hz);
                console.log(`%cjQuery beat me in ${this[i].name.split('#')[0]} (${multiplier}x faster)`, `background: #${Number(Math.min(9, multiplier)+6).toString(16)}66; color: #fff`);
            } else if (this[es6Index].compare(this[jqIndex]) > 0) {
                multiplier = Math.round(this[es6Index].hz / this[jqIndex].hz);
                console.log(`%cI beat jQuery in ${this[i].name.split('#')[0]}  (${multiplier}x faster)`, `background: #6${Number(Math.min(9, multiplier)+6).toString(16)}6; color: #fff`);
            } else {
                console.log(`%c${this[i].name.split('#')[0]} didn't have a clear winner`, 'background: #0be; color: #fff');
            }
        }
    })
    .run({
        async: true
    });


const cleanHtml = `<header>
    <h1>jQuery in ES6/5</h1>

    <nav>
        <ul>
            <li><a href='/foo'>foo</a></li>
            <li><a href='/bar'>bar</a></li>
            <li><a href='http://bat'>bat</a></li>
            <li><a href='/baz'>baz</a></li>
        </ul>
    </nav>
</header>

<main>

    <article class='unread'>
        <h1>I bet you're still using Bootstrap too...</h1>

        <section>
            <p>Ethical taiyaki vexillologist YOLO, shaman before they sold out small batch. Meditation <a href='https://vaporware'>vaporware tbh</a> pug roof party raclette cardigan mumblecore everyday carry hexagon chia hoodie knausgaard.</p>
            <p>Taiyaki flannel typewriter af lo-fi, snackwave 3 wolf moon twee heirloom pabst master cleanse meh health goth knausgaard artisan.</p>
            <p>Air plant trust fund master cleanse, activated charcoal marfa offal <a href='http://craftypopbeer'>craft beer pop-up</a> flexitarian biodiesel meditation listicle food truck. Pok pok polaroid mumblecore, palo santo crucifix gentrify affogato bicycle rights af hexagon biodiesel hell of pickled vice occupy.</p>
        </section>

        <footer>
            <cite>YOLO 8-bit</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Hot chicken deep v cornhole</h1>

        <section>
            <p>Messenger bag single-origin coffee tattooed +1. Ethical fixie blue bottle <a href='https://iphone'>iPhone</a>, lo-fi migas semiotics aesthetic bushwick put a bird on it iceland. Keffiyeh squid cloud bread cardigan snackwave fam.</p>
            <p>Pop-up four loko lomo squid roof party 8-bit small batch before they <a href='/sold-out'>sold out</a> forage vice post-ironic polaroid mixtape you probably haven't heard of them. YOLO microdosing pok pok iceland iPhone offal.</p>
        </section>

        <footer>
            <cite>Hippo Foobar</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Kickstarter shabby chic</h1>

        <section>
            <p>Tacos food truck semiotics tumeric williamsburg. Bicycle rights banh mi williamsburg forage tousled gochujang hot chicken letterpress actually YOLO etsy glossier umami VHS. Iceland kombucha jianbing dreamcatcher bicycle rights pug.</p>
            <p>Aesthetic pop-up church-key four loko marfa microdosing. Taxidermy ennui wolf butcher yr, tofu pickled photo booth dreamcatcher brooklyn PBR&B biodiesel austin. Freegan listicle VHS, humblebrag hashtag before they sold out master cleanse vape.</p>
        </section>

        <footer>
            <cite>Tumblr chicharrone</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Craft beer fanny pack</h1>

        <section>
            <p>Umami schlitz hexagon live-edge man braid wayfarers pitchfork <a href='/squid'>vexillologist intelligentsia squid</a>, brunch whatever unicorn lumbersexual coloring book. Pinterest ethical selfies aesthetic narwhal viral DIY. Bicycle rights normcore single-origin coffee, offal chicharrones synth vice. Vegan scenester pug vice keytar 3 wolf moon gentrify disrupt. Truffaut sriracha drinking vinegar snackwave. Literally raclette green juice, pork belly chia selvage cred af distillery blue bottle synth cloud bread mlkshk meggings. Everyday carry keytar literally meggings 8-bit health <a href='https://goth'>goth godard direct trade</a> selvage shoreditch seitan pickled.</p>
        </section>

        <footer>
            <cite>Twee marfa</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article class='unread'>
        <h1>I bet you're still using Bootstrap too...</h1>

        <section>
            <p>Ethical taiyaki vexillologist YOLO, shaman before they sold out small batch. Meditation <a href='https://vaporware'>vaporware tbh</a> pug roof party raclette cardigan mumblecore everyday carry hexagon chia hoodie knausgaard.</p>
            <p>Taiyaki flannel typewriter af lo-fi, snackwave 3 wolf moon twee heirloom pabst master cleanse meh health goth knausgaard artisan.</p>
            <p>Air plant trust fund master cleanse, activated charcoal marfa offal <a href='http://craftypopbeer'>craft beer pop-up</a> flexitarian biodiesel meditation listicle food truck. Pok pok polaroid mumblecore, palo santo crucifix gentrify affogato bicycle rights af hexagon biodiesel hell of pickled vice occupy.</p>
        </section>

        <footer>
            <cite>YOLO 8-bit</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Hot chicken deep v cornhole</h1>

        <section>
            <p>Messenger bag single-origin coffee tattooed +1. Ethical fixie blue bottle <a href='https://iphone'>iPhone</a>, lo-fi migas semiotics aesthetic bushwick put a bird on it iceland. Keffiyeh squid cloud bread cardigan snackwave fam.</p>
            <p>Pop-up four loko lomo squid roof party 8-bit small batch before they <a href='/sold-out'>sold out</a> forage vice post-ironic polaroid mixtape you probably haven't heard of them. YOLO microdosing pok pok iceland iPhone offal.</p>
        </section>

        <footer>
            <cite>Hippo Foobar</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Kickstarter shabby chic</h1>

        <section>
            <p>Tacos food truck semiotics tumeric williamsburg. Bicycle rights banh mi williamsburg forage tousled gochujang hot chicken letterpress actually YOLO etsy glossier umami VHS. Iceland kombucha jianbing dreamcatcher bicycle rights pug.</p>
            <p>Aesthetic pop-up church-key four loko marfa microdosing. Taxidermy ennui wolf butcher yr, tofu pickled photo booth dreamcatcher brooklyn PBR&B biodiesel austin. Freegan listicle VHS, humblebrag hashtag before they sold out master cleanse vape.</p>
        </section>

        <footer>
            <cite>Tumblr chicharrone</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Craft beer fanny pack</h1>

        <section>
            <p>Umami schlitz hexagon live-edge man braid wayfarers pitchfork <a href='/squid'>vexillologist intelligentsia squid</a>, brunch whatever unicorn lumbersexual coloring book. Pinterest ethical selfies aesthetic narwhal viral DIY. Bicycle rights normcore single-origin coffee, offal chicharrones synth vice. Vegan scenester pug vice keytar 3 wolf moon gentrify disrupt. Truffaut sriracha drinking vinegar snackwave. Literally raclette green juice, pork belly chia selvage cred af distillery blue bottle synth cloud bread mlkshk meggings. Everyday carry keytar literally meggings 8-bit health <a href='https://goth'>goth godard direct trade</a> selvage shoreditch seitan pickled.</p>
        </section>

        <footer>
            <cite>Twee marfa</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article class='unread'>
        <h1>I bet you're still using Bootstrap too...</h1>

        <section>
            <p>Ethical taiyaki vexillologist YOLO, shaman before they sold out small batch. Meditation <a href='https://vaporware'>vaporware tbh</a> pug roof party raclette cardigan mumblecore everyday carry hexagon chia hoodie knausgaard.</p>
            <p>Taiyaki flannel typewriter af lo-fi, snackwave 3 wolf moon twee heirloom pabst master cleanse meh health goth knausgaard artisan.</p>
            <p>Air plant trust fund master cleanse, activated charcoal marfa offal <a href='http://craftypopbeer'>craft beer pop-up</a> flexitarian biodiesel meditation listicle food truck. Pok pok polaroid mumblecore, palo santo crucifix gentrify affogato bicycle rights af hexagon biodiesel hell of pickled vice occupy.</p>
        </section>

        <footer>
            <cite>YOLO 8-bit</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Hot chicken deep v cornhole</h1>

        <section>
            <p>Messenger bag single-origin coffee tattooed +1. Ethical fixie blue bottle <a href='https://iphone'>iPhone</a>, lo-fi migas semiotics aesthetic bushwick put a bird on it iceland. Keffiyeh squid cloud bread cardigan snackwave fam.</p>
            <p>Pop-up four loko lomo squid roof party 8-bit small batch before they <a href='/sold-out'>sold out</a> forage vice post-ironic polaroid mixtape you probably haven't heard of them. YOLO microdosing pok pok iceland iPhone offal.</p>
        </section>

        <footer>
            <cite>Hippo Foobar</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Kickstarter shabby chic</h1>

        <section>
            <p>Tacos food truck semiotics tumeric williamsburg. Bicycle rights banh mi williamsburg forage tousled gochujang hot chicken letterpress actually YOLO etsy glossier umami VHS. Iceland kombucha jianbing dreamcatcher bicycle rights pug.</p>
            <p>Aesthetic pop-up church-key four loko marfa microdosing. Taxidermy ennui wolf butcher yr, tofu pickled photo booth dreamcatcher brooklyn PBR&B biodiesel austin. Freegan listicle VHS, humblebrag hashtag before they sold out master cleanse vape.</p>
        </section>

        <footer>
            <cite>Tumblr chicharrone</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Craft beer fanny pack</h1>

        <section>
            <p>Umami schlitz hexagon live-edge man braid wayfarers pitchfork <a href='/squid'>vexillologist intelligentsia squid</a>, brunch whatever unicorn lumbersexual coloring book. Pinterest ethical selfies aesthetic narwhal viral DIY. Bicycle rights normcore single-origin coffee, offal chicharrones synth vice. Vegan scenester pug vice keytar 3 wolf moon gentrify disrupt. Truffaut sriracha drinking vinegar snackwave. Literally raclette green juice, pork belly chia selvage cred af distillery blue bottle synth cloud bread mlkshk meggings. Everyday carry keytar literally meggings 8-bit health <a href='https://goth'>goth godard direct trade</a> selvage shoreditch seitan pickled.</p>
        </section>

        <footer>
            <cite>Twee marfa</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article class='unread'>
        <h1>I bet you're still using Bootstrap too...</h1>

        <section>
            <p>Ethical taiyaki vexillologist YOLO, shaman before they sold out small batch. Meditation <a href='https://vaporware'>vaporware tbh</a> pug roof party raclette cardigan mumblecore everyday carry hexagon chia hoodie knausgaard.</p>
            <p>Taiyaki flannel typewriter af lo-fi, snackwave 3 wolf moon twee heirloom pabst master cleanse meh health goth knausgaard artisan.</p>
            <p>Air plant trust fund master cleanse, activated charcoal marfa offal <a href='http://craftypopbeer'>craft beer pop-up</a> flexitarian biodiesel meditation listicle food truck. Pok pok polaroid mumblecore, palo santo crucifix gentrify affogato bicycle rights af hexagon biodiesel hell of pickled vice occupy.</p>
        </section>

        <footer>
            <cite>YOLO 8-bit</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Hot chicken deep v cornhole</h1>

        <section>
            <p>Messenger bag single-origin coffee tattooed +1. Ethical fixie blue bottle <a href='https://iphone'>iPhone</a>, lo-fi migas semiotics aesthetic bushwick put a bird on it iceland. Keffiyeh squid cloud bread cardigan snackwave fam.</p>
            <p>Pop-up four loko lomo squid roof party 8-bit small batch before they <a href='/sold-out'>sold out</a> forage vice post-ironic polaroid mixtape you probably haven't heard of them. YOLO microdosing pok pok iceland iPhone offal.</p>
        </section>

        <footer>
            <cite>Hippo Foobar</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Kickstarter shabby chic</h1>

        <section>
            <p>Tacos food truck semiotics tumeric williamsburg. Bicycle rights banh mi williamsburg forage tousled gochujang hot chicken letterpress actually YOLO etsy glossier umami VHS. Iceland kombucha jianbing dreamcatcher bicycle rights pug.</p>
            <p>Aesthetic pop-up church-key four loko marfa microdosing. Taxidermy ennui wolf butcher yr, tofu pickled photo booth dreamcatcher brooklyn PBR&B biodiesel austin. Freegan listicle VHS, humblebrag hashtag before they sold out master cleanse vape.</p>
        </section>

        <footer>
            <cite>Tumblr chicharrone</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Craft beer fanny pack</h1>

        <section>
            <p>Umami schlitz hexagon live-edge man braid wayfarers pitchfork <a href='/squid'>vexillologist intelligentsia squid</a>, brunch whatever unicorn lumbersexual coloring book. Pinterest ethical selfies aesthetic narwhal viral DIY. Bicycle rights normcore single-origin coffee, offal chicharrones synth vice. Vegan scenester pug vice keytar 3 wolf moon gentrify disrupt. Truffaut sriracha drinking vinegar snackwave. Literally raclette green juice, pork belly chia selvage cred af distillery blue bottle synth cloud bread mlkshk meggings. Everyday carry keytar literally meggings 8-bit health <a href='https://goth'>goth godard direct trade</a> selvage shoreditch seitan pickled.</p>
        </section>

        <footer>
            <cite>Twee marfa</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article class='unread'>
        <h1>I bet you're still using Bootstrap too...</h1>

        <section>
            <p>Ethical taiyaki vexillologist YOLO, shaman before they sold out small batch. Meditation <a href='https://vaporware'>vaporware tbh</a> pug roof party raclette cardigan mumblecore everyday carry hexagon chia hoodie knausgaard.</p>
            <p>Taiyaki flannel typewriter af lo-fi, snackwave 3 wolf moon twee heirloom pabst master cleanse meh health goth knausgaard artisan.</p>
            <p>Air plant trust fund master cleanse, activated charcoal marfa offal <a href='http://craftypopbeer'>craft beer pop-up</a> flexitarian biodiesel meditation listicle food truck. Pok pok polaroid mumblecore, palo santo crucifix gentrify affogato bicycle rights af hexagon biodiesel hell of pickled vice occupy.</p>
        </section>

        <footer>
            <cite>YOLO 8-bit</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Hot chicken deep v cornhole</h1>

        <section>
            <p>Messenger bag single-origin coffee tattooed +1. Ethical fixie blue bottle <a href='https://iphone'>iPhone</a>, lo-fi migas semiotics aesthetic bushwick put a bird on it iceland. Keffiyeh squid cloud bread cardigan snackwave fam.</p>
            <p>Pop-up four loko lomo squid roof party 8-bit small batch before they <a href='/sold-out'>sold out</a> forage vice post-ironic polaroid mixtape you probably haven't heard of them. YOLO microdosing pok pok iceland iPhone offal.</p>
        </section>

        <footer>
            <cite>Hippo Foobar</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Kickstarter shabby chic</h1>

        <section>
            <p>Tacos food truck semiotics tumeric williamsburg. Bicycle rights banh mi williamsburg forage tousled gochujang hot chicken letterpress actually YOLO etsy glossier umami VHS. Iceland kombucha jianbing dreamcatcher bicycle rights pug.</p>
            <p>Aesthetic pop-up church-key four loko marfa microdosing. Taxidermy ennui wolf butcher yr, tofu pickled photo booth dreamcatcher brooklyn PBR&B biodiesel austin. Freegan listicle VHS, humblebrag hashtag before they sold out master cleanse vape.</p>
        </section>

        <footer>
            <cite>Tumblr chicharrone</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Craft beer fanny pack</h1>

        <section>
            <p>Umami schlitz hexagon live-edge man braid wayfarers pitchfork <a href='/squid'>vexillologist intelligentsia squid</a>, brunch whatever unicorn lumbersexual coloring book. Pinterest ethical selfies aesthetic narwhal viral DIY. Bicycle rights normcore single-origin coffee, offal chicharrones synth vice. Vegan scenester pug vice keytar 3 wolf moon gentrify disrupt. Truffaut sriracha drinking vinegar snackwave. Literally raclette green juice, pork belly chia selvage cred af distillery blue bottle synth cloud bread mlkshk meggings. Everyday carry keytar literally meggings 8-bit health <a href='https://goth'>goth godard direct trade</a> selvage shoreditch seitan pickled.</p>
        </section>

        <footer>
            <cite>Twee marfa</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article class='unread'>
        <h1>I bet you're still using Bootstrap too...</h1>

        <section>
            <p>Ethical taiyaki vexillologist YOLO, shaman before they sold out small batch. Meditation <a href='https://vaporware'>vaporware tbh</a> pug roof party raclette cardigan mumblecore everyday carry hexagon chia hoodie knausgaard.</p>
            <p>Taiyaki flannel typewriter af lo-fi, snackwave 3 wolf moon twee heirloom pabst master cleanse meh health goth knausgaard artisan.</p>
            <p>Air plant trust fund master cleanse, activated charcoal marfa offal <a href='http://craftypopbeer'>craft beer pop-up</a> flexitarian biodiesel meditation listicle food truck. Pok pok polaroid mumblecore, palo santo crucifix gentrify affogato bicycle rights af hexagon biodiesel hell of pickled vice occupy.</p>
        </section>

        <footer>
            <cite>YOLO 8-bit</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Hot chicken deep v cornhole</h1>

        <section>
            <p>Messenger bag single-origin coffee tattooed +1. Ethical fixie blue bottle <a href='https://iphone'>iPhone</a>, lo-fi migas semiotics aesthetic bushwick put a bird on it iceland. Keffiyeh squid cloud bread cardigan snackwave fam.</p>
            <p>Pop-up four loko lomo squid roof party 8-bit small batch before they <a href='/sold-out'>sold out</a> forage vice post-ironic polaroid mixtape you probably haven't heard of them. YOLO microdosing pok pok iceland iPhone offal.</p>
        </section>

        <footer>
            <cite>Hippo Foobar</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Kickstarter shabby chic</h1>

        <section>
            <p>Tacos food truck semiotics tumeric williamsburg. Bicycle rights banh mi williamsburg forage tousled gochujang hot chicken letterpress actually YOLO etsy glossier umami VHS. Iceland kombucha jianbing dreamcatcher bicycle rights pug.</p>
            <p>Aesthetic pop-up church-key four loko marfa microdosing. Taxidermy ennui wolf butcher yr, tofu pickled photo booth dreamcatcher brooklyn PBR&B biodiesel austin. Freegan listicle VHS, humblebrag hashtag before they sold out master cleanse vape.</p>
        </section>

        <footer>
            <cite>Tumblr chicharrone</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Craft beer fanny pack</h1>

        <section>
            <p>Umami schlitz hexagon live-edge man braid wayfarers pitchfork <a href='/squid'>vexillologist intelligentsia squid</a>, brunch whatever unicorn lumbersexual coloring book. Pinterest ethical selfies aesthetic narwhal viral DIY. Bicycle rights normcore single-origin coffee, offal chicharrones synth vice. Vegan scenester pug vice keytar 3 wolf moon gentrify disrupt. Truffaut sriracha drinking vinegar snackwave. Literally raclette green juice, pork belly chia selvage cred af distillery blue bottle synth cloud bread mlkshk meggings. Everyday carry keytar literally meggings 8-bit health <a href='https://goth'>goth godard direct trade</a> selvage shoreditch seitan pickled.</p>
        </section>

        <footer>
            <cite>Twee marfa</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article class='unread'>
        <h1>I bet you're still using Bootstrap too...</h1>

        <section>
            <p>Ethical taiyaki vexillologist YOLO, shaman before they sold out small batch. Meditation <a href='https://vaporware'>vaporware tbh</a> pug roof party raclette cardigan mumblecore everyday carry hexagon chia hoodie knausgaard.</p>
            <p>Taiyaki flannel typewriter af lo-fi, snackwave 3 wolf moon twee heirloom pabst master cleanse meh health goth knausgaard artisan.</p>
            <p>Air plant trust fund master cleanse, activated charcoal marfa offal <a href='http://craftypopbeer'>craft beer pop-up</a> flexitarian biodiesel meditation listicle food truck. Pok pok polaroid mumblecore, palo santo crucifix gentrify affogato bicycle rights af hexagon biodiesel hell of pickled vice occupy.</p>
        </section>

        <footer>
            <cite>YOLO 8-bit</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Hot chicken deep v cornhole</h1>

        <section>
            <p>Messenger bag single-origin coffee tattooed +1. Ethical fixie blue bottle <a href='https://iphone'>iPhone</a>, lo-fi migas semiotics aesthetic bushwick put a bird on it iceland. Keffiyeh squid cloud bread cardigan snackwave fam.</p>
            <p>Pop-up four loko lomo squid roof party 8-bit small batch before they <a href='/sold-out'>sold out</a> forage vice post-ironic polaroid mixtape you probably haven't heard of them. YOLO microdosing pok pok iceland iPhone offal.</p>
        </section>

        <footer>
            <cite>Hippo Foobar</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Kickstarter shabby chic</h1>

        <section>
            <p>Tacos food truck semiotics tumeric williamsburg. Bicycle rights banh mi williamsburg forage tousled gochujang hot chicken letterpress actually YOLO etsy glossier umami VHS. Iceland kombucha jianbing dreamcatcher bicycle rights pug.</p>
            <p>Aesthetic pop-up church-key four loko marfa microdosing. Taxidermy ennui wolf butcher yr, tofu pickled photo booth dreamcatcher brooklyn PBR&B biodiesel austin. Freegan listicle VHS, humblebrag hashtag before they sold out master cleanse vape.</p>
        </section>

        <footer>
            <cite>Tumblr chicharrone</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

    <article>
        <h1>Craft beer fanny pack</h1>

        <section>
            <p>Umami schlitz hexagon live-edge man braid wayfarers pitchfork <a href='/squid'>vexillologist intelligentsia squid</a>, brunch whatever unicorn lumbersexual coloring book. Pinterest ethical selfies aesthetic narwhal viral DIY. Bicycle rights normcore single-origin coffee, offal chicharrones synth vice. Vegan scenester pug vice keytar 3 wolf moon gentrify disrupt. Truffaut sriracha drinking vinegar snackwave. Literally raclette green juice, pork belly chia selvage cred af distillery blue bottle synth cloud bread mlkshk meggings. Everyday carry keytar literally meggings 8-bit health <a href='https://goth'>goth godard direct trade</a> selvage shoreditch seitan pickled.</p>
        </section>

        <footer>
            <cite>Twee marfa</cite>
            <nav>
                <ul>
                    <li><a href='#like'>like</a></li>
                    <li><a href='#love'>love</a></li>
                    <li><a href='#share'>share</a></li>
                </ul>
            </nav>
        </footer>
    </article>

</main>

<footer>
    <aside class='legal'>
        <p>&copy; Jordan Kasper 2018</p>
        <p>Privacy policy: I don't collect anything on you.</p>
    </aside>

    <aside class='links'>
        <ul>
            <li><a href='https://github'>GitHub</a></li>
            <li><a href='https://twitter'>Twitter</a></li>
            <li><a href='/blog'>Blog</a></li>
        </ul>
    </aside>
</footer>`;
