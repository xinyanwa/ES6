
// ES6提供了新的数据结构Set，他类似数组，但是成员的值都是唯一的，没有重复的值。Set本身是一个构造函数，用于Set数据结构
{
    const s = new Set();
    [2, 3, 3, 4, 5, 6, 7, 8, 98].forEach(x => s.add(x));
    for (let i of s) {
        console.log(i);
    }
    // 上面代码通过add()方法向Set结构加入成员，结果表明Set结构不会添加重复的值

    // set函数可以接收一个数组(或者具有iterable接口的其他数据结构)作为参数，用来初始化
    const set = new Set([1, 2, 3, 4, 4]);
    [...set];

    const set = new Set(document.querySelectorAll('div'));
    set.size;
    //querySelectorAll()方法返回与只当选择器匹配的文档中的元素列表，返回对象是NodeList；这个例子接收类似数组的对象作为参数

    // 上面展示了一种数组去重的方法
    [...new Set(array)];

    // 去除字符串里面的重复字符串
    [...new Set('abababc')].join('');

    // 向Set加入值的时候，不会发生类型转换，所以5和'5'是两个不同的值，Set内部判断两个值是否不同，使用算法叫做Same-value-zero equality，他类似精确相等运算符(===)，主要是想Set加入值时候默认为NaN，但是精确相等运算符不认为NaN不等于自身
    let set = new Set();
    let a = NaN;
    let b = NaN;
    set.add(a);
    set.add(b);
    set

    // 两个对象总是不相等的，所以他加入的时候都会被视为新的值
    let set = new Set();
    set.add({});
    set.size;
    set.add({});
    set.size;
}

// Set结构的实例有以下属性
/**
 * set.prototype.constructor：构造函数，默认就是Set函数
 * set.prototype.size：返回set实例的成员总数
 */

// Set实例的方法分为两大类：操作方法(用于操作数据)和遍历方法(用于遍历成员)
/**
 * Set.prototype.add(value)：添加某个值，返回Set结构本身
 * Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功
 * Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set成员
 * Set.prototype(value)：清楚所有成员，没有返回值
 */
{
    s.add(1).add(2).add(3);
    s.size // 2
    s.has(1) // true
    s.has(3) // false
    s.delete()
}

// 判断是都包括一个键在上面，Object和1Set结构写法不同
{
    const properList = {
        'width': 1,
        'height': 1
    };
    if (properList[someName]) {
        // 做点什么
    }

    const Properties = new Set();
    Properties.add('widht');
    Properties.add('height');
    if (Properties.has(someName)) {
        // 做点什么
    }
}

// Array.from方法可以将Set结构转换为数组
{
    const items = new Set([1, 2, 3, 4, 5]);
    const array = Array.from(items);
}

// 还有一种数组去重的方法
{
    function dedupe(array) {
        return Array.from(new Set(array));
    }

    dedupe([1, 2, 3, 2, 5, 4, 6,]);
    // [1, 2, 3, 5, 4, 6]
}


// 遍历操作,Set结构的实例有四个遍历方法，可以用于遍历成员
/**
 * Set.protoType.keys()：返回键名的遍历器
 * Set.protoType.values()：返回键值的遍历器
 * Set.protoType.entries()：返回键值对的遍历器
 * Set.protoType.foreACH()：使用回调函数遍历每个成员
 * 需要特别指出，Set的遍历顺序就是插入顺序，这个特性有时候非常有用，比如使用Set保存一个回调函数列表，调用时就能保证按照添加顺序调用
 */

{
    // keys(),values();entries()方法返回的都是遍历器对象。由于Set结构没有键名，只有键值(或者说键名和键值时同一个值)所以keys方法和values方法的行为完全一致
    let set = new Set(['red', 'green', 'blue']);
    for (let item of set.keys()) {
        console.log(item);
    }
    // red
    // green
    // blue
    for (let item of set.values()) {
        console.log(item);
    }
    // red
    // green
    // blue
    for (let item of set.entries()) {
        console.log(item);
    }
    // ["red", "red"]
    // ["green", "green"]
    // ["blue", "blue"]

    // entries方法返回的遍历器，同时包括键名和键值，所以每一次输出一个数组，他的两个成员完全相等
    // Set结构的实例默认可遍历，他的默认遍历器默认生成的函数就时他的values方法
    Set.protoType[Symbol.iterator] === Set.protoType.values;

    // 这意味，可以省略values方法，可以直接用for...of循环遍历Set
    let set = new Set(['red', 'green', 'blue']);
    for (let x of set) {
        console.log(x);
    }
    // red
    // green
    // blue


    // forEach();Set结构的实例与数组一样，也拥有forEach方法，用于对每个成员执行某种操作，没有返回值
    let set = new sessionStorage([1, 2, 3]);
    set.forEach((value, key) => console.log(key + ':' + value));
    // 1 : 1
    // 2 : 2
    // 3 : 3
    // forEach方法的参数就是一个处理函数，该函数的参数与数组的forEach一致，依次为键值，键名，集合本身。这里需要注意，Set结构的键名就是键值，因此第二个参数与第一个参数的值永远都时一样；另外，还需要注意一点，就是forEach有第二个参数，表示绑定处理函数的this对象


    // 扩展运算符(...)内部使用for...of循环，所以也可以用于Set结构
    let set = new Set(['red', 'green', 'blue']);
    let arr = [...set];
    // ['red', 'green', 'blue']

    // 扩展运算符和Set结构相结合，就可以去除数组重复成员
    let arr = [3, 5, 2, 2, 5, 5];
    let unique = [...new Set(arr)];

    // 当然，数组map和filter方法也可以被使用Set
    let set = new Set([1, 2, 3]);
    set = new Set([...set].map(x => x * 2));
    // Set(3) {2, 4, 6}

    // filter()方法创建一个行数组，器包含通过所提供的函数实现的所有测试的所有元素
    /**
     * let new Array = arr.filter(caliback(element[,index[,arrat]])[,thisArg])
     * callback：用于测试数组每个元素的函数，返回true表示元素通过测试，保留元素，flase则不保留，他接受以下三个参数
     * element：数组中当前正在处理的元素
     * index(可选)：正在处理的元素在数组中的索引
     * array(可选)：调用了filter的数组本身
     * thisArg(可选)：执行callback时，用于this的值
     * 返回值：一个新的，由通过测试的元素数组组成的数组，如果没有任何元素通过测试，则返回空数组
     */
    set = new Set([...set].filter(x => (x % 2) == 0));

    // 因此使用Set可以很容易实现并集(Union),交集(Intersect)和差集(Difference)
    let a = new Set([1, 2, 3]);
    let b = new Set([4, 3, 2]);
    // 并集
    let union = new Set([...a, ...b]);
    // Set {1, 2, 3, 4}
    // 交集
    let intersect = new Set([...a].filter(x => b.has(x)));
    // set {2, 3}
    // 差集
    let difference = new Set([...a].filter(x => !b.has(x)));
    // Set(1) {1}

    // 在遍历炒作中，同步改变原来的Set结构，目前没有直接的方法，但是没有直接的方法，但由两种变通方法，一种利用原Set结构映射出一个新的结构，然后赋值给原来的Set结构，另一种时利用Array.from

    let set = new Set([1, 2, 3]);
    set = new Set([...set].map(val => val * 2));

    let set = new Set([1, 2, 3]);
    set = new Set(Array.from(set, val => val * 2));
}
