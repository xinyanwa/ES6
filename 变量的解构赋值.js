
const JQuery = request('https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js')

// ES6允许按照一定的模式，从数组和对象中提取值，对变量进行赋值，这被称为解构

// 可以从数组中提取值，按照对应的位置，对变量赋值
let [a, b, c] = [1, 2, 3];


// 本质上，这些写法属于"模式匹配",也就是说只要等号的模式相同，左边的变量就会被赋予对应的值

{
    let [foo, [[bar], baz]] = [1, [[2], 3]];
    foo // 1
    bar // 2
    baz // 3

    let [, , third] = ['foo', 'bar', 'baz'];
    third // baz

    let [x, , y] = [1, 2, 3];
    x //1
    y //3

    // 涉及浅拷贝
    let [head, ...tail] = [1, 2, 3, 4];
    head // 1
    tail // [2,3,4]

    let [x, y, ...z] = ['a'];
    x // 'a'
    y // undefined
    z // []
}

// 如果解构不成功，变量的值就会变为undefined

{
    let [foo] = [];
    foo // undefined

    let [bar, foo] = [1];
    bar // 1
    foo // undefined
}

// 还有一种情况是不完全解构，即等号左边的模式，总指挥匹配一部分右边的等号右边的数组，这种情况下，解构依然可以成功

{
    let [x, y] = [1, 2, 3];
    x //1
    y // 2

    let [a, [b], c] = [1, [2, 3], 4];
    a // 1
    b // 2
    c // 4
}

// 但是如果等号的右边不是数组（或者严格来说，是不可遍历的解构）将会报错，下面例子中，前五个表达式转换为对象后不具备iterator接口，最后一个不具备Iterator接口

{
    let [foo] = 1;
    let [foo] = false;
    let [foo] = NaN;
    let [foo] = undefined;
    let [foo] = null;
    let [foo] = {};
}

// 对于Set结构，也可以使用数组的解构赋值

{
    let [x, y, z] = new Set(['a', 'b', 'c']);

    // set方法还可以用来去除重复元素
    const numbers = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8]
    console.log([...new Set(numbers)])
    // [2, 3, 4, 5, 6, 7, 8]
}

// 只要数据结构具备iterator接口，都可以采用数组形式的解构赋值;*fibs是一个Generator函数，原生具有iterator接口，解构赋值会依次从这个接口获取

{
    function* fibs() {
        let a = 0;
        let b = 1;
        while (true) {
            // yield关键字使生成器函数执行暂停，一旦遇到yield表达式，生成器的代码将会被暂停运行，直到生成器的next()方法被调用，每次调用生成器的next()方法时，生成器都会恢复执行，直到达到以下某个值
            yield a;
            [a, b] = [b, a + b];
        }
    }

    let [first, second, third, fourth, first, sixth] = fibs();
    console.log(sixth); // 5
}

// 解构赋值允许指定默认值;ES6内部使用严格相等运算符(===)，判断一个位置是不是有值。所以，只有当一个数组成员严格等于undefined，默认值才会生效

{
    let [foo = true] = [];
    foo // true

    let [x, y = 'b'] = ['a'];
    x // a
    y // b

    let [x, y = 'b'] = ['a', undefined];
    x // a
    y // b

    let [x = 1] = [undefined];
    x // 1
    let [x = 1] = [null];
    x // null
    // 上述表达式，一个数组成员等于null，默认值就不会生效，因为null不严格等于undefined
}

// 如果默认值是一个表达式，那么这个表达式就是惰性求值，只有用到的时候才会求值

{
    function f() {
        console.log('aaa');
    }
    let [x = f()] = [1];
}


// 对象解构和数组解构有一个重要的不同，就是，数组元素是按照次序来排列的，变量的取值由它的位置决定，而对象的属性没有次序，变量的必须与属性同名，才能取到正确的值

{
    let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
    bar // 'bbb'
    foo // 'aaa'

    let { baz } = { foo: 'aaa' };
    baz // undefined
}

// 如果要将一个已经声明的变量用于解构赋值，注意不要将大括号写在行首，解释器会将其解释为代码块，可以在前面加上括号（）


// 字符串也能被解构赋值，字符串转换为一个类似数组的对象

{
    const [a, b, c, d, e] = 'hello';
    a // 'h'
    b // 'e'
    c // 'l'
    d // 'l'
    e // 'o'

    let { length: len } = 'hello';
    len // 5
}

// 数值和布尔型的解构赋值；如果等号右边是数值和布尔值，则会想转为对象。只要右边不是对象或者数组，就会先转为对象，由于undefined和null无法转化为对象，所以对他们进行解构赋值，都会报错

{
    // 报错
    let { prop: x } = undefined;
    let { prop: y } = null;
}


// 函数的参数也可以使用解构赋值,函数add的参数是一个数组，但在传入参数的那一刻，数组参数就被解构成了变量x和y，对于函数内部代码来说，他们能感受的参数就是x和y

{

    function add([x, y]) {
        return x + y;
    }

    add([1, 2]);
    // 3
}


// 建议只要有可能，就不要在模式中放置圆括号。以下3种情况下不得使用圆括号

{
    //变量声明语句
    // let [(a)] =[1];

    // 函数参数、也属于变量声明，因此不能带有圆括号
    function f([z]) { return z; }

    // 赋值语句模式
    ({ p: a }) = { p: 42 };
}


// 可以使用圆括号的情况，只有一种：赋值语句非模式部分，可以使用圆括号,下列语句都是赋值语句，不是声明语句，他们的圆括号都不属于模式的一部分

{
    [(b)] = [3];
    ({ p: (d) } = {});
}


// 解构用途
{
    // 交换变量的值
    let x = 1;
    let y = 2;
    [x, y] = [y, x];

    // 从函数返回多个值，函数只能返回一个值，如果要返回多个值，只能将他们放入数组或者对象返回，有了解解构赋值，取出这些值就非常方便
    function example() {
        return [1, 2, 3];
    }
    let [a, b, c] = example();

    function example() {
        return {
            foo: 1,
            bar: 2,
        };
    }
    let [foo, bar] = example();

    // 函数参数的定义；解构赋值可以很方便的将一组参数与变量名对应起来
    function f([x, y, x]) { }
    f([1, 2, 3]);

    function f([x, y, x]) { }
    f({ z: 1, x: 2, y: 3 });

    // 提取JSON数据；解构赋值对提取JSON对象种的的数据，尤其有用
    let jsonData = {
        id: 3344,
        status: 200,
        data: [33, 44],
    };

    let { id, status, data } = jsonData;
    console.log(id, status, data);
    // 3344 200  [33, 44]

    // 函数参数的默认值，指定函数参数没默认值，避免了在函数体内部写 let foo = config.foo || 'default foo'
    JQuery.ajax = function (url, {
        async = true,
        beforeSend = function () { },
        cache = true,
        complete = function () { },
        crossDomain = false,
        global = true,
    } = {}) {

    };

    // 遍历Map解构
    const map = new Map();
    map.set('firast', 'hello');
    map.set('second', 'world');

    for (let [key, value] of map) {
        console.log(key + ' is ' + value);
    }
    // firast is hello
    // second is world

    // 输入模块指定方法；加载模块时候，往往需要指定出入那些方法，解构赋值变得很清晰
    const {map} = require('jq')
}