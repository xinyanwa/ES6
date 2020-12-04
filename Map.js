
// JavaScript的对象，本质上是键值对的集合(Hash结构)，但是传统上只能用字符串当作键，这给他的使用带来很大限制
{
    const data = {};
    const element = document.getElementById('div');
    data[element] = 'metadata';
    data['[object HTMLDivElement]'];
    // 将一个DOM节点作为对象data的键，但是由于对象只接受字符串作为键值名，所以element自动转换为字符串[object HTMLDivElement]
}

// 为了解决这个问题，ES6提供了map数据结构，他类似于对象，也是键值对的集合，但是"键"的范围不限于字符串，各种类型的值(包括对象)都可以当作键，也就是说，Object提供是"字符串-值"，而Map结构提供了"值-值"的对应，是一种更加完善的Hash结构，如果你需要"键值对"数据结构。Map比Object更加合适
{
    const m = new Map();
    const o = { p: 'Hello World' };
    m.set(o, 'content');
    m.get(o);

    m.has(o);
    m.delete(o);
    // 使用Map结构的set方法，将对象o当作m的一个键，然后又使用get方法读取，使用has判断是否在里面，接着使用delete方法删除这个键

    const map = new Map([
        ['name', 'weiwei'],
        ['title', '3344']
    ]);
    map.size
    map.has('name');
    map.get('name');
    map.has('title');
    map.get('title');
    // 上面代码在构建时候，就指定两个键name和title

    const items = [
        ['name', 'weiwei'],
        ['title', '3344']
    ];
    const map = new Map();
    items.forEach(([key, value]) => map.set(key, value));
    // 不仅仅是数组，任何具有Iterator接口，且每个成员都是一个双元素的数据结构都可以作为Map构造函数的参数，就是说，Set和Map都剋用来生成新的Map

    const set = new Set([
        ['foo', 1],
        ['bar', 2]
    ])
    const m1 = new Map(set);
    m1.get('foo');
    const m2 = new Map([['baz', 3]]);
    const m3 = new Map(m2);
    m3.get('baz');
    // 我们使用Set和Map对象，当作Map构造函数的参数，结果都生成了新的Map对象

    // 如果对同一个键赋值多次，后面的值将会覆盖前面的值
    const map = new Map();
    map.set(1, 'weiwei').set(1, 'weiwei3344');
    map.get(1);

    // 如果读取一个位置的键，则会返回undefined
    new Map().get('assssssss')
    // undefined

    // 只有对同一个对象引用，Map结构将其视为同一个键。这点一定要注意
    const map = new Map();
    map.set(['a'], 5);
    map.get(['a']);
    // undefined
    // 上面代码set和get方法，表面上针对同一个键，但实际上是两个不同的数组实例，内存地址就是不一样1的，因此get方法无法读取该键，返回undefined

    // 同理 同样的值的两个实例，在map中也被视为两个键
    const map = new Map();
    const k1 = ['a'];
    const k2 = ['a'];
    map.set(k1, 111).set(k2, 222);
    map.get(k1); // 111
    map.get(k2); // 222
    // 变量k1和k2的值都是一样的，但是他们在map结构中被视为两个键

    //Map的键实际上是跟内存进行绑定的，只要内存地址不一样，就视为两个键，这既是很好的解决了同名属性碰撞的问题(clash)。例如：我们扩展别人库时候，如果使用对象作为键名，就不用担心在自己属性与原作者属性同名

    // 如果Map的键是一个简单的类型的值(数字，字符串，布尔值),则只要两个值严格相等，Map将视为另一个键，比如0和-0就是一个键，布尔值true和字符串true则是两个不同的键，undefined和null也是两个不同的键值，虽然NaN不严格等于自身，但Map将其视为同一个键

    let map = new Map();
    map.set(-0, 123);
    map.get(+0); // 123
    map.set(true, 1);
    map.set('true', 3);
    map.get(true); // 1
    map.set(undefined, 3);
    map.set(null, 2);
    map.get(undefined); // 3
    map.set(NaN, 1223);
    map.get(NaN); // 1234
}


// map结构的实例有下面的属性方法和操作方法
{
    // size属性返回Map结构的成员总数
    const map = new Map();
    map.set('foo', true);
    map.set('bar', false);
    map.size; // 2

    // Map.protoType.set(key,value);set方法设置键名key对应的键值为value，然后返回整个Map结构，如果key已经有值了，则键值会被更新，否则就生成新的该键,注意，set方法返回的是Map对象，因此可以采用链式写法
    let map = new Map().set(1, '2').set(2, 2).set(3, true);

    // Map.protoType.get(key);get方法读取对应key的键值，如果找不到key，则返回undefined
    const m = new Map();
    const hello = function () { console.log('helllo') }; // 这里注意，键是函数
    m.set(hello, 'Hello ES6!');
    Map.get(hello); // Hello ES6!

    // Map.protoType.has();has方法返回一个布尔值，表示某个键值是否在当前Map对象中
    const m = new Map();
    m.set('editor', 6);
    m.set(262, 'standard');
    m.set(undefined, 'nah');
    m.has('editoe'); // true
    m.has(265); // false

    // Map.protoType.delete(key);delete方法删除某个键，返回true，如果删除失败，就返回false
    const m = new Map();
    m.set(undefined, 'nah');
    m.has(undefined); // true
    m.delete(undefined);
    m.has(undefined); // false

    // Map.protoType.clear();clear方法清楚所有的成员，没有返回值
    let map = new Map();
    map.set('foo', true);
    map.set('bar', false);
    map.size; // 2
    map.clear();
    map.size; // 0
}


//  遍历方法；Map结构原生提供三个遍历器生成函数和一个遍历方法
/**
 * Map.protoType.keys()：返回键名的遍历器
 * Map.protoType.values()：返回键值的遍历器
 * Map.protoType.entries()：返回所以成员的遍历器
 * Map.protoType.forEach()：遍历Map的所有成员
 */

// 需要特别注意的是，Map的遍历顺序就是插入顺序
{
    const map = new Map([
        ['F', 'no'],
        ['T', 'yes']
    ]);
    for (let key of map.keys()) {
        console.log(key);
    }
    // 'F'  'T'
    for (let value of map.values()) {
        console.log(value);
    }
    // 'no' 'yes'
    for (let item of map.entries()) {
        console.log(item[0], item[1]);
    }
    // 'F' 'no'
    // 'T' 'yes'
    for (let [key, value] of map.entries()) {
        console.log(key, value);
    }
    // 'F' 'no'
    // 'T' 'yes'
    for (let [key, value] of map) {
        console.log(key, value);
    }
    // 'F' 'no'
    // 'T' 'yes'

    // 表示Map结构的默认遍历选择器接口(Symbol.iterator属性)就是entries方法
    map[Symbol.iterator] === map.entries;

    // Map结构转换为数组结构，比较快速的方法就是使用扩展运算符(...)
    const map = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three']
    ]);
    [...map.keys()];
    // [1,2,3]
    [...map.values()];
    // ['one','two','three']
    [...map.entries()];
    // [[1,'one'],[2,'two'],[3,'three']]
    [...map]
    // [[1,'one'],[2,'two'],[3,'three']]

    // 结合数组的map方法，filter方法，可以实现Map的遍历和过滤(Map本身没有map和filter方法)
    const map0 = new Map().set(1, 'a').set(2, 'b').set(3, 'c');
    const map1 = new Map(
        [...map0].filter(([k, v]) => k < 3)
    );
    // 产生Map结构 {1=>'a',2=>'b'}
    const map2 = new Map(
        [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
    // 产生Map结构(2=>'_a',4=>'_b',6=>'_c')

    // Map还有一个forEach方法，与数组forEach方法类似，也可以实现遍历
    map.forEach(function (value, key, map) {
        console.log('key: %s,value:%s', key, value);
    });
    const reporter = {
        report: function (key, value) {
            console.log('key: %s,value:%s', key, value);
        }
    }
    map.forEach(function (value, key, map) {
        this.report(key, value);
    }, reporter);
    // forEach方法的回调函数this，就指向reporter
}


// 与其它数据结构的互相转换
{
    // Map转为数组最为方便的方法，就是使用扩展运算符(...)
    const myMap = new Map().set(true, 7).set({ foo: 3 }, ['abc']);
    [...myMap];
    // [Array(2), Array(2)]

    // 数组转换为Map;将数组传入Map构造函数，就可以转换为Map
    new Map([
        [true, 7],
        [{ foo: 3 }, ['abc']]
    ])
    // Map(2) {true => 7, {…} => Array(1)}

    // Map转为对象，如果所有的Map的键都是字符串，它可以无损转为对象
    function strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k, v] of strMap) {
            obj[k] = v;
        }
        return obj;
    }
    const myMap = new Map().set('yes', true).set('no', false);
    strMapToObj(myMap);
    // {yes: true, no: false}
    // 如果有非字符串的键名，那么这个键名会被转换为字符串，在作为对象的键名

    // 对象转换为map通过Object.entries()
    let obj = { 'a': 1, 'b': 2 };
    let map = new Map(Object.entries(obj));
    // 此外也可以自己实现一个转换函数
    function objToStrMap(obj) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }
    objToStrMap({ yes: true, no: false });

    // Map转为JSON；有两种情况，一种是Map键名都是字符串，这时候可选择转换为对象JSON
    function strMapToJson(strMap) {
        return JSON.stringify(strMaptoObj(strMap));
    }
    let myMap = new Map().set('yes', true).set('no', false);
    strMapToJson(myMap);
    // '{"yes":true,"no":false}'

    // 另一种情况是，Map的键名有非字符串，这时候可以选择转换为数组JSON
    function mapToArrayJson(map) {
        return JSON.stringify([...map]);
    }
    let myMap = new Map().set(true, 7).set({ foo: 3 }, ['abc']);
    mapToArrayJson(myMap);
    // "[[true,7],[{"foo":3},["abc"]]]"

    // JSON转为Map,正常情况下，所有的键名都是字符串
    function jsonToStrMap(jsonStr) {
        return objToStrMap(JSON.parse(jsonStr));
    }
    jsonToStrMap('{"yes":true,"no":false}');
    //  Map {'yes' => true, 'no' => false}

    // 但是有种特殊情况，整个JSON就是一个数组，且每个数组成员本身，有事一个有两个成员的数组，这时，他就可以一一对应Map，这往往Map转为JSON的逆操作
    function jsonToMap(jsonStr) {
        return new Map(JSON.parse(jsonStr));
    }
    jsonToMap('[[true,7],[{"foo":3},["abc"]]]');
    // Map {true => 7, Object {foo: 3} => ['abc']}
}