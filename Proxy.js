
// Proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种元编程，即对编程语言进行编程。

// Proxy可以理解为，在目标对象之前架设一层拦截，外界对该对象访问，都必须先通过这层拦截，因此提供一种机制，可以对外界的访问进行过滤和改写。Proxy这个词的原意是代理，用在这里表示由他代理某些操作，可以译为代理器
{
    const obj = new Proxy({}, {
        get: function (target, propKey, receiver) {
            console.log(`getting ${propKey}!`);
            return Reflect.get(target, propKey, receiver);
        },
        set: function (target, propKey, value, receiver) {
            console.log(`setting ${propKey}!`);
            return Reflect.set(target, propKey, value, receiver);
            /**
             * Reflect是一个内置对象，它提供拦截JavaScript操作的方法，这些方法与proxyhandlers的方法相同，Reflect不是一个函数对象，因此我们不可以构造它
             * 
             * Reflect并非一个构造函数，所以不能通过1new运算符对其进行调用，或者将Reflect对象作为一个函数来调用1，Reflect所有的属性和方法都是静态的(例如：Math对象)
             * 
             * Reflect.apply(target,thisArgument,argumentsList)：对一个函数进行调用操作，同时可以传入一个数组作为调用参数，和function.protoType.apply()功能类似
             * 
             * Reflect.construct(target,argumentsList[,newTarget])：对构造函数进行new操作，相当于执行了new target(...args)
             * 
             * Reflact.defineProperty(target,propertyKey,attributes)：和Object.defineProperty()类似，如果设置成功就会返回true
             * 
             * Reflect.deleteProperty(target,propertyKey)：作为函数delete操作符，相当于执行了delete target[name]
             * 
             * Reflect.get(target,propertyKey[,receiver])：获取对象身上某个属性的值，类似于target[name]
             * 
             * Reflect.getOwnPropertyDescriptor(target,propertyKey)：类似于Object.getOwnPropertyDescriptor().如果1对象中存在该属性，则返回对应的属性描述符，否则返回undefined
             * 
             * Reflect.getPrototypeOf(target)：类似于Object.getPrototypeOf()
             * 
             * Reflect.has(target,propertyKey)：判断有一个对象是否存在某个属性，和in运算符的功能完全相同 
             * 
             * Reflect.isExtensible(target)：类似于Object.isExtensible()
             * 
             * Reflect.ownKeys(target)：返回一个包含所有自身属性(不包含继承属性)的数组。(类似Object。keys(),但不会受到enumerable影响)
             * 
             * Reflect.preventExtensions(taaarget)：类似Object.preventExtensions(),返回一个Boolean
             * 
             * Reflect.set(target,propertyKey,value[,receiver])：将值分配给属性的函数，返回一个Boolean，如果更新成功，则返回true
             * 
             * Reflect.setPrototypeOf(target,prototype)：设置对象原型函数，返回一个Boolean，如果更新成功，则返回true
             */
        }
    });
    obj.count = 1;
    // setting count!
    ++obj.count;
    // getting count!
    //setting count!
    // 2

    // 上面代码对一个空对象架设了一层拦截，重新定义了属性的读取(get)和设置(set)行为。对设置了拦截行为的对象obj，去读写它的属性，实际上Proxy重载了点运算符，用自己的定义语言覆盖了语言的原始定义

    // ES6原生提供了Proxy构造函数，用来生成Proxy实例
    const proxy = new Proxy(target, handler);
    // Proxy对象的所有用法，都是上面这种形式，不同的只是handler参数的写法，其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为

    const proxy = new Proxy({}, {
        get: function (target, propKey) {
            return 35;
        }
    });
    proxy.time;  // 35
    proxy.name;  // 35
    proxy.title; // 35
    // 作为构造函数，Proxy接受两个参数。第一个参数就是所要代理的目标对象(上例就是一个空对象)，如果没有Proxy的介入，操作原来要访问的就是这个对象；第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作，比如，上面代码中，配置对象有一个get方法，用来拦截对目标对象属性的访问请求，get方法的两个参数分别是目标对象和所要访问的属性，可以看到，由于拦截函数总是返回35，所以，任何访问属性都得到35

    // 注意，要是得Proxy起作用，必须针对Proxy实例(上例是Proxy对象)进行操作，而不是针对目标对象进行操作

    // 如果handler没有设置任何拦截，那就等同于直接通向原对象
    const target = {};
    const handler = {};
    const proxy = new Proxy(target, handler);
    proxy.a = 'b';
    target.a // 'b'
    // 上面例子中，handler是一个空对象，没有任何拦截效果，访问proxy就等同于访问target

    // 一个技巧是将Proxy对象，设置到object.proxy属性，从而可以在object对象上调用
    const object = { proxy: new Proxy(target, handler) };

    // Proxy实例也可以作为其他对象的原型对象
    const proxy = new Proxy({}, {
        get: function (target, propKey) {
            return 35;
        }
    });
    let obj = Object.create(proxy);
    obj.time; // 35
    // proxy都西昂是obj对象的原型，obj对象本身并没有time属性，根据原型链，会在proxy对象上读取该属性，导致被拦截

    // 同一个拦截器函数，可以设置拦截多个操作
    const handler = {
        get: function (target, name) {
            if (name === 'prototype') {
                return Object.prototype;
            }
            return 'Hello,' + name;
        },
        apply: function (target, thisBinding, args) {
            return args[0];
        },
        // constructor 是一种用于创建和初始化class创建的对象的特殊方法。
        construct: function (target, args) {
            return { value: args[1] };
        }
    };
    const fproxy = new Proxy(function (x, y) {
        return x + y;
    }, handler);
    fproxy(1, 2); // 1
    new fproxy(1, 2); // {value: 2}
    // 对于可以设置，但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果
}


/**
 * proxy支持的拦截操一共有13种
 * 
 * get(target,propKey,receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']
 * 
 * set(target,propKey,value,receiver)：拦截对象属性的设置，比如proxy.foo = v或prxy['foo'] = v
 * 
 * has(target,propKey)：拦截propKey in proxy的操作，返回一个布尔值
 * 
 * deleteProperty(target,propKey)：拦截delete proxy[proKey]的操作，返回一个布尔值
 * 
 * ownKeys(target)：拦截Object.getOwnPropertyNames(proxy),Object.getOwnPropertySymbols(proxy),Objeect.keys(proxy),for...in循环，返回一个数组，该方法返回目标对象所有的自身属性名，而Objet.keys()返回结果仅包括目标对象自身的可遍历属性
 * 
 * getOwnPropertyDescriptor(target,propKey)：拦截Object.getOwnPropertyDescriptor(proxy,propKey),返回属性的描述对象
 * 
 * defineProperty(target,propKey,propDesc)：拦截Object.defineProperty(proxy,propKey,propDesc),Object.defineProprtties(peoxy,propDescs),返回一个布尔值
 * 
 * preventExtensions(target)： 拦截Object.preventExtensions(proxy),返回一个布尔值
 * 
 * getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy),返回一个对象
 * 
 * isExtensible(target)：拦截Object.isExtensible(proxy),返回一个人布尔值
 * 
 * setPrototypeOf(target,proto)：拦截Object.setPrototypeOf(proxy,proto),返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截
 * 
 * apply(target,object,args)：拦截Proxy实例作为函数调用的操作，比如proxy(...args),proxy.call(objet,...args),proxy.apply(...)
 * 
 * construct(target,args)：拦截Proxy实例作为构造函数调用的操作,比如new Proxy(...args)
 */


// Proxy实例的方法
{
    // get()：方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象，属性名和proxy实例本身，严格说，是操作行为所针对的对象，其中最后一个参数可选

    const person = {
        name: 'weiwei3344'
    };
    const proxy = new Proxy(person, {
        get: function (target, propKey) {
            if (propKey in target) {
                return target[propKey];
            } else {
                throw new ReferenceError(propKey + '属性不存在');
            }
        }
    });
    proxy.name; // "weiwei3344"
    proxy.age; // age属性不存在
    // 如果访问目标对象不存在的属性，会抛出一个错误，如果没有这个拦截函数，访问不存在的属性，只会返回undefined

    // get()方法可以继承
    let proto = new Proxy({}, {
        get(target, propertyKey, receiver) {
            console.log('GET' + propertyKey);
            return target[propertyKey];
        }
    });
    let obj = Object.create(proto);
    obj.foo; // "GETfoo"
    // 拦截操作定义在prototype对象上，所以如果读取obj对象继承的属性时，拦截会生效

    // 使用get拦截，实现数组读取负数的索引。如果数组的位置参数是-1，就会输出数组的倒数第一个成员
    function createArray(...elements) {
        let handler = {
            get(target, propKey, receiver) {
                let index = Number(propKey);
                if (index < 0) {
                    propKey = String(target.length + index);
                }
                return Reflect.get(target, propKey, receiver);
            }
        };
        let target = [];
        target.push(...elements);
        return new Proxy(target, handler);
    }
    let arr = createArray('a', 'b', 'c');
    arr[-1];

    // 利用Proxy，可以将读取属性的操作(get),转变为某个函数，从而实现属性的链式操作
    const pipe = function (value) {
        const funcStack = [];
        const oproxy = new Proxy({}, {
            get: function (pipeObject, fnName) {
                if (fnName === 'get') {
                    // reduce接受一个函数作为累加器，数组中的每个值(从左到右)开始缩减，最终计算为一个值
                    return funcStack.reduce(function (val, fn) {
                        return fn(val)
                    }, value);
                }
                funcStack.push(window[fnName]);
                return oproxy;
            }
        });
        return oproxy;
    }
    const double = n => n * 2;
    const pow = n => n * n;
    const reverseInt = n => n.toString().split("").reverse().join("") | 0;
    pipe(3).double.pow.reverseInt.get();

    //使用get拦截，实现生成一个各种DOM节点的通用函数dom
    const dom = new Proxy({}, {
        get(target, property) {
            return function (attrs = {}, ...children) {
                const el = document.createElement(property);
                for (let prop of Object.keys(attrs)) {
                    el.setAttribute(prop, attrs[prop]);
                }
                for (let child of children) {
                    if (typeof child === 'string') {
                        child = document.createTextNode(child);
                    }
                    el.appendChild(child);
                }
                return el;
            }
        }
    });
    const el = dom.div({}, 'Hello, my name is ', dom.a({ href: '//baidu.com' }, 'mark'), '. I like:', dom.ul({}, dom.li({}, 'WEIWEI3344'), dom.li({}, 'weiwei3344')));
    document.body.appendChild(el);
    // <div>Hello, my name is <a href="//baidu.com">mark</a>. I like:<ul><li>WEIWEI3344</li><li>weiwei3344</li></ul></div>

    // get方法指向原始的读操作所在的那个对象，一般情况下就是Proxy实例。proxy对象的getReceiver属性室友proxy对象提供，所以receiver指向proxy对象
    const proxy = new Proxy({}, {
        get: function (target, key, receiver) {
            return receiver;
        }
    });
    proxy.getReceiver === proxy
    // true

    // 我们再来看一个例子,d对象本身没有a属性，所以读取d.a的时候，会去d的原型proxy对象找，这时候，receiver就指向d，代表原始的读操作所在的那个对象
    const proxu = new Proxy({}, {
        get: function (target, key, receiver) {
            return receiver;
        }
    });
    const d = Object.create(proxy);
    d.a === d;
    // true

    // 如果一个属性不可配置且不可以写，则proxy不能修改属性，否则通过proxy对象访问该属性会报错
    const target = Object.defineProperties({}, {
        foo: {
            value: 123,
            writable: false,
            configurable: false
        },
    });

    const handler = {
        get(target, propKey) {
            return 'abc';
        }
    };
    const proxy = new Proxy(target, handler);
    proxy.foo;
    // Uncaught TypeError: 'get' on proxy: property 'foo' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected '123' but got 'abc')
}


// set(),set方法用来拦截某个属性的赋值操作，可以接受4个参数，依次为目标对象，属性名，属性值和Proxy实例本身，其中最后一个参数可选
{
    // 假定Proxy对象有一个age属性，该属性应该是一个不大于200的整数，那么可以使用Proxy保证age的属性值符合要求。
    let validator = {
        set: function (obj, prop, value) {
            if (prop === 'age') {
                if (!Number.isInteger(value)) {
                    throw new TypeError('age属性值不是Number类型');
                }
                if (value > 200) {
                    throw new TypeError('age属性值大于200');
                }
            }
            // 对于满足条件的值，我们将其保存 
            obj[prop] = value;
        }
    };
    let person = new Proxy({}, validator);
    person.age = 100;
    person.age; // 100
    person.age = 'weiwei3344';
    // VM98:5 Uncaught TypeError: age属性值不是Number类型
    person.age = 300;
    // VM98:8 Uncaught TypeError: age属性值大于200
    // 由于设置的存值函数set，任何不符合要求的age属性赋值，都会抛出一个错误，这是数据验证的一种实现方法，利用set方法，还可以数据绑定，即每当对象发生变化，会自动更新DOM


    // 我们会在对象上面设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性应该不被外部使用，结合get和set方法，就可以做到防止这些内部属性被外部读写
    const handler = {
        get: function (target, key) {
            invariant(key, 'get');
            return target[key];
        },
        set: function (target, key, value) {
            invariant(key, 'set');
            target[key] = value;
            return true;
        }
    };
    function invariant(key, action) {
        if (key[0] === '_') {
            throw new TypeError(`操作${action}不能对内部属性赋值`);
        }
    }
    const target = {};
    const proxy = new Proxy(target, handler);
    proxy._weiwei; // Uncaught TypeError: 操作get不能对内部属性赋值
    proxy._weiwei = 3344; // Uncaught TypeError: 操作set不能对内部属性赋值
    // 只要读写属性名的第一个字符为下划线，都不通过，从而达到禁止读写内部属性的目的

    // set方法的第四个参数receiver，指的是原始的操作行为所在的那个对象，一般情况下是proxy实例本身
    handler = {
        set(obj, prop, value, receiver) {
            obj[prop] = receiver;
        }
    };
    const proxy = new Proxy({}, handler);
    proxy.weiwei = 'weiwei3344';
    proxy.weiwei === proxy;  // true

    const handler = {
        set: function (obj, prop, value, receiver) {
            obj[prop] = receiver;
        }
    };
    const proxy = new Proxy({}, handler);
    const myObj = {};
    Object.setPrototypeOf(myObj, proxy);
    myObj.weiwei = 'weiwei3344';
    myObj.weiwei === myObj; // true
    // 设置myObje.weiwei属性值时候，MyObje并没有weiwei属性，因此引擎会去myObje的原型链中去找weiwei属性，myObj的原型对象proxy是一个Proxy实例，设置它的weiwei属性会触发set方法，这时候，第四个参数receiver就指向原始赋值行为所在的对象myObj

    // 注意，如果目标对象自身的某个属性，不可读写且不可配置，那么set方法将不起作用
    const obj = {};
    Object.defineProperty(obj, 'weiwei', {
        value: 'weiwei',
        writable: false,
    });
    const handler = {
        set: function (obj, prop, value, receiver) {
            obj[prop] = 'weiwei3344';
        }
    };
    const proxy = new Proxy(obj, handler);
    proxy.weiwei = 'weiwei3344';
    proxy.weiwei; // weiwei

    // 注意严格模式下，set代理如果没有返回true，就会报错
    'use strict';
    const handler = {
        set: function (obj, prop, value, receiver) {
            obj[prop] = receiver;
            return false;
        }
    };
    const proxy = new Proxy({}, handler);
    proxy.foo = 'weiwei3344';
    // VM53:9 Uncaught TypeError: 'set' on proxy: trap returned falsish for property 'foo'
    // 严格模式下，set代理返回false或者undefined，都会报错。
    // 严格模式下，set代理返回false或者undefined，都会报错。
}


// apply()方法拦截函数的调用，call和apply操作。apply方法可以接受三个参数，分别是目标对象，目标对象的上下文(this)和目标对象的参数数组
{
    const handler = {
        apply(target, ctx, args) {
            // Reflect是一个内置对象，它提供拦截JavaScript操作的方法。apply对一个函数进行调用操作，同时可以传入一个数组作为调用参数
            return Reflect.apply(...arguments);
        }
    }

    // 例
    const target = function () {
        return 'I am the target';
    };
    const handler = {
        apply() {
            return 'I am the proxy';
        }
    };
    const p = new Proxy(target, handler);
    p();
    // "I am the proxy"
    // 变量p是Proxy的实例，当他作为函数调用时(p())，就会被apply方法拦截，返回一个字符串

    const twice = {
        apply: function (target, ctx, args) {
            return Reflect.apply(...arguments) * 2;
        }
    };
    function sum(left, right) {
        return left + right;
    };
    const proxy = new Proxy(sum, twice);
    proxy(1, 2); // 6
    proxy.call(null, 5, 6); // 22
    proxy.apply(null, [7, 8]); //30
    // 每当执行proxy函数(直接调用或者call和apply调用)，就会被apply方法拦截；另外，直接调用Reflect.aooly方法，也会被拦截
    Reflect.apply(proxy, null, [9, 10]); //38
}


// has()方法用来拦截HasProperty操作，即判断对象是否具有某个属性时候，这个方法会生效，典型的操作就是in运算符.has()方法可以接受两个参数，分别是目标对象，需查询的属性名
{
    // 下面例子使用has(方法隐藏某些属性，不被in运算符发现)
    const handler = {
        has(target, key) {
            if (key[0] === '_') {
                return false;
            }
            return key in target;
        }
    };
    const target = { _prop: 'foo', prop: 'foo' };
    const proxy = new Proxy(target, handler);
    // 如果指定的属性在指定的对象或者其原型链中，则in运算符返回true
    '_prop' in proxy; // false
    // 如果原对象的属性名的第一个字符时下划线，proxy.has()就会返回false,从而不被in运算符发现

    //如果原对象不可配置或者禁止扩展，这时hsa()会拦截报错
    const obj = { a: 10 };
    // preventExtensions()方法让一个对象变的不可扩展，也就是永远不能添加新的属性
    Object.preventExtensions(obj);
    const p = new Proxy(obj, {
        has(target, prop) {
            return false;
        }
    });
    'a' in p;
    // Error: 'has' on proxy: trap returned falsish for property 'a' but the proxy target is not extensible
    // obj对象禁止扩展，结果使用has拦截就会报错，也就是说，如果某个属性不可配置(或者目标对象不可扩展)，则has()方法就不得"隐藏"(即返回false)目标对象的该属性

    // 值得注意的时，has()方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has()方法不判断一个属性是对象自身的属性，还是继承的属性.另外，虽然for...in循环也用到了in运算符，但是hsa()拦截对for...in循环生效
    let stu1 = { name: 'weiwei', score: 59 };
    let stu2 = { name: 'weiwei3344', score: 99 };
    let handler = {
        has(target, prop) {
            if (prop === 'score' && target[prop] < 60) {
                console.log(`${target.name}不及格`);
                return false;
            } else {
                console.log(`${target.name}很棒，给你买糖`);
            }
            return prop in target;
        }
    };
    let oproxy1 = new Proxy(stu1, handler);
    let oproxy2 = new Proxy(stu2, handler);
    'score' in oproxy1;
    //  "weiwei不及格" 
    'score' in oproxy2;
    // "weiwei3344很棒，给你买糖"
    for (let a in oproxy1) {
        console.log(oproxy1[a]);
    }
    // "weiwei" 59
    for (let b in oproxy2) {
        console.log(oproxy2[b]);
    }
    //  "weiwei3344" 99
    // 上面代码中，has()拦截支队in运算符生效，对for...in循环不生效，导致不符合要求的属性没有被for...in循环所排除
}


// construct()方法用于拦截new命令，下面是拦截对象写法
{
    const handler = {
        construct(target, args, newTarget) {
            return new target(...args);
        }
    };

    // construct()方法可以接受三个参数；target：目标对象；args：构造函数达到参数数组；newTarget：创造实例对象时，new命令作用的构造函数
    const p = new Proxy(function () { }, {
        construct: function (target, args) {
            // join()方法将一个数组或者一个数组对象的所有元素连接成一个字符串并返回这个字符串，如果数组只有一个项目，那么将返回该项目而不使用分隔符
            console.log('called:' + args.join(','));
            return { value: args[0] * 10 };
        }
    });
    (new p(1)).value;
    // called: 1       10

    // construct()方法返回的必须是一个对象，否则会报错
    const p = new Proxy(function () { }, {
        construct: function (target, argumentList) {
            return 1;
        }
    });
    new p();
    // Error: 'construct' on proxy: trap returned non-object ('1')

    // 由于construct()拦截的是构造函数，所以它的目标对象必须是函数，否则就报错
    const p = new Proxy({}, {
        construct(target, argumentList) {
            return {};
        }
    });
    new p();
    // Error: p is not a constructor
    // 拦截目标对象不是一个函数，而是一个都西昂(new Proxy()的第一个参数)，就会报错


    // 注意，construct()方法中的this指向的是handler，而不是实例对象
    const handler = {
        construct: function (target, args) {
            console.log(this === handler);
            return new target(...args);
        }
    };
    let p = new Proxy(function () { }, handler);
    new p(); // true 

    // deleteProperty();deleteProperty方法用于拦截delete操作，如果这个方法抛出错误或者返回fasle，当前属性就无法被delete命令删除
    const handler = {
        deleteProperty: function (target, key) {
            invariant(key, 'delete');
            delete target[key];
            return true;
        }
    };
    function invariant(key, action) {
        if (key[0] === '_') {
            throw new Error(`尝试${action} ${key}属性无效`);
        }
    }
    const target = { _prop: 'foo' };
    const proxy = new Proxy(target, handler);
    delete proxy._weiwei;
    // Error: 尝试delete _weiwei属性无效


    // defineProperty()方法拦截Object.defineProperty()操作
    const handler = {
        defineProperty(target, key, descriptor) {
            return false;
        }
    };
    const target = {};
    const proxy = new Proxy(target, handler);
    proxy.foo = 'bar'
    // 不会生效
    // defineProperty()方法内部没有任何操作，只返回fasle，导致新添加属性总是无效的，这里false只是用来提示操作失败，本身不能阻止添加新属性。注意，如果目标对象不可扩展(non-extensible)，则defineProperty()不能增加目标对象上不存在的属性，否则会报错，另外，如果目标对象的某个属性不可写或者不可以配置，则defineProperty()方法不得改变这两个设置


    // getOwnPropertyDescriptor()方法拦截Object.getOwnPropertyDescriptor(),返回一个属性描述对象或者undefined
    const handler = {
        getOwnPropertyDescriptor(target, key) {
            if (key[0] === '_') {
                return;
            }
            return Object.getOwnPropertyDescriptor(target, key);
        }
    };
    const target = { _foo: 'weiwei', baz: 'tar' };
    const proxy = new Proxy(target, handler);
    Object.getOwnPropertyDescriptor(proxy, 'wat');
    // undefined
    Object.getOwnPropertyDescriptor(proxy, '_foo');
    // undefined
    Object.getOwnPropertyDescriptor(proxy, 'baz');
    // {value: "tar", writable: true, enumerable: true, configurable: true}
    // 上面代码中，handler.getOwnPropertyDescscriptor()方法对于第一个字符为下划线的属性名会返回undefined
}


// getPrototypeOf()方法主要是用来拦截获取对象原型，具体来说，拦截以下操作
{
    /**
     * Object.prototype._proto_
     * Object.prototype.isPrototypeOf()
     * Object.getPrototypeOf()
     * Reflect.getPrototypeOf()
     * instanceof
     */
    const proto = {};
    const p = new Proxy({}, {
        getPrototypeOf(target) {
            return proto;
        }
    });
    Object.getPrototypeOf(p) === proto; // true
    // getPrototypeOf()方法拦截Object.getPrototypeOf(),返回proto对象
    // 注意，getPrototypeOf()方法返回值碧血是都对象或者null，否则报错，另外，如果目标对象不可扩展(non-extensible)，getPrototypeOf()方法必须返回目标对象的原型对象
}


// isExtensible()方法拦截Object.isExtensible()操作
{
    const p = new Proxy({}, {
        isExtensible(target) {
            console.log('weiwei3344');
            return true;
        }
    });
    Object.isExtensible(p);
    // "weiwei3344"
    // 由于设置了isExtensible()方法，在调用Object.isExtensible时会输出called;注意，该方法只能返回布尔值，否则返回值会被自动转换为布尔值

    // 这个方法有一个强限制，它的返回值必须与目标对象的isExtensible属性保持一致，否则就会抛出错误
    Object.isExtensible(proxy) === Object.isExtensible(target);

    const p = new Proxy({}, {
        isExtensible(target) {
            return false;
        }
    });
    Object.isExtensible(p);
    // Error: 'isExtensible' on proxy: trap result does not reflect extensibility of proxy target (which is 'true')
}


// ownKeys()方法用来拦截对象自身属性的读取操作，拦截以下操作
{
    /**
     * Object.getOwnPropertyNames()
     * Object.getOwnPropertySymbols()
     * Object.keys()
     * for...in循环
     */

    let target = {
        a: 1,
        b: 2,
        c: 3
    };
    let handler = {
        ownKeys(target) {
            return ['c'];
        }
    };
    let proxy = new Proxy(target, handler);
    Object.keys(proxy);
    // ['c']
    // 拦截了对于target对象的Object.keys()操作，只返回a，b，c三个属性中的c属性

    // 拦截第一个字符为下划线的属性名
    let target = {
        _bar: 'foo',
        _prop: 'bar',
        prop: 'baz'
    };
    let handler = {
        ownKeys(target) {
            return Reflect.ownKeys(target).filter(key => key[0] !== '_');
        }
    };
    let proxy = new Proxy(target, handler);
    for (let key of Object.keys(proxy)) {
        console.log(target[key]);
    }
    // baz

    // 注意，使用Object.keys()方法时，有三类属性会被ownKeys()方法自动过滤，不会返回
    /**
     * 目标对象上不存在的属性
     * 属性名为Symbol值
     * 不可遍历(enumerable)的属性
     */
    let target = {
        a:1,
        b:2,
        c:3,
        [Symbol.for('secret')]: '4'
    };
    Object.defineProperty(target,'key',{
        enumerabkle:false,
        configurable: true,
        writable: true,
        value: 'static'
    });
    let handler = {
        ownKeys(target){
            return ['a','d',Symbol.for('secret'),'key'];
        }
    };
    let proxy = new Proxy(target,handler);
    Object.keys(proxy);
    // ["a"]
    // ownKeys()方法之中，显示返回不存在的属性(d),Symbol值(Symbol.for('secret'))，不可遍历的属性key，结果都被自动过滤了

    // ownKeys()方法还可以拦截Object.getOwnPropertyNames()
    const p = new Proxy({},{
        ownKeys:function(target){
            return ['a','b','c'];
        }
    });
    Object.getOwnPropertyNames(p);
    // (3) ["a", "b", "c"]

    // for...in循环也收到了ownKeys()方法的拦截
    const obj = {hello:'world'};
    const proxy = new Proxy(obj,{
        ownKeys:function(){
            return ['a','b'];
        }
    });
    for(let key in proxy){
        console.log(key);
    }
    // 上面代码中，ownKeys()指定返回a和b属性，由于obj没有这两个属性，因此for...in循环不会有任何输出

    // ownKeys()方法返回的数组成员，只能是字符串或者Symbol值，如果有其他类型的值，或者返回的根本不是数组，就会报错
    const obj = {};
    const p = new Proxy(obj,{
        ownKeys(target){
            return [123,true,undefined,null,{},[]];
        }
    });
    Object.getOwnPropertyNames(p);
    // VM452:7 Uncaught TypeError: 123 is not a valid property name

    // 如果目标对象自身包含不可配置的属性，该属性必须被ownKeys()方法返回，否则报错
    const obj = {};
    Object.defineProperty(obj,'a',{
        configurable: false,
        enumerable:true,
        value: 10
    });
    const p = new Proxy(obj,{
        ownKeys(target){
            return ['b'];
        }
    });
    Object.getOwnPropertyNames(p);
    // VM526:12 Uncaught TypeError: 'ownKeys' on proxy: trap result did not include 'a'
    // 上面代码中，obj对象的a属性不可配置的，这时候ownKeys()方法返回的数组之中，必须包含a，否则会报错

    // 另外，如果目标对象时不可扩展的，这时ownKeys()方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余属性，否则就会报错
    const obj = {
        a: 1
    };
    Object.preventExtensions(obj);
    const p = new Proxy(obj,{
        ownKeys(target){
            return ['a','b'];
        }
    });
    Object.getOwnPropertyNames(p);
    // VM600:10 Uncaught TypeError: 'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible
    // 上面代码中，obj对象是不可扩展的，这时ownKeys()方法返回的数组中，包含了obj对多余属性b，所有导致报错
}
