
// WeakSet结构与Set类似，也不是重复的值的集合，但是，他与Set有两个区别。首先WeakSet的成员只能是对象，而不能时其他类型的值
{
    const ws = new WeakSet();
    ws.add(1);
    ws.add(Symbol());
    // Uncaught TypeError: Invalid value used in weak set
    // 上面代码试图向WeakSet添加一个数值和Symbol值，都会报错，因为WeakSet只能放对象
}

// 其次WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用，如果其他对象都不引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在WeakSet中
// 这是因为垃圾回收机制依赖引用技术，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存，结束使用该值后，有时候会忘记取消，就导致内存无法释放，进而引发内存泄漏。WeakSet里面的引用，都不计入垃圾回收机制，所以就不存在该问题。WeakSet适合临时存放一组对象，以及存放和对象绑定的信息，只要这些对象在外部消失，他就在WeakSet里面的引用就会自动消失。

// 由于上面这个特点，WeakSet的成员不适合引用，因为他会随时消失，另外，由于WeakSet内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数不一样的，而垃圾回收机制是不可预测的，因此ES6规定WeakSet不可遍历


// WeakSet是一个构造函数，可以使用new来创建WeakSet数据结构
{
    const ws = new WeakSet();

    // 作为构造函数，WeakSet可以接受一个数组或者类似数组的对象作为参数，该数组的所有成员，都会自动称为WeakSet实例对象的成员
    const a = [[1, 2], [3, 4]];
    const ws = new WeakSet(a);
    // WeakSet {Array(2), Array(2)}
    // 上面代码中，a是一个数组，他有两个成员，都是数组，将a作为WeakSet构造函数的参数，a的成员会自动成为WeakSet成员

    // 注意a数组的成员称为WeakSet的成员，而不是a数组本身，这意味着，数组成员只能是对象
    const b = [3, 4];
    const ws = new WeakSet(b);
    //上面b的成员不是对象，加入WeakSet就会报错
}

// WeakSet结构有三个方法
/**
 * WeakSet.protoType.add(value)：向WeakSet实例中添加一个新成员
 * WeakSet.protoType.delete(value)：清除weakSet实例的指定成员
 * WeakSet.protoType.has(value)：返回一个布尔值，表示某个值是否存在于WeakSet中
 */
{
    const ws = new WeakSet();
    const obj = {};
    const foo = {};
    ws.add(window);
    ws.add(obj);
    ws.has(window);
    ws.has(foo);
    ws.delete(window);

    // 注意，WeakSet没有size属性，额米有办法遍历它们的成员、
    ws.size;
    ws.forEach;


    // WeakSet不能遍历，是因为成员都是弱类型，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就读取不到了。所以WeakSet的一个用处就是，存储DOM节点，而不用担心这些节点从文档移除，会引发内存泄漏
    const foos = new WeakSet();
    class Foo{
        constructor(){
            foos.add(this);
        }
        method(){
            if(!foos.has(this)){
                throw new TypeError('Foo.protoType.method只能在Foo实例上调用');
            }
        }
    }
    // 上面代码保证看Foo实例方法，只能在Foo实例上调用，这里使用WeakSet好处是，foo对实例的引用，不会计入内存回收机制，不用考虑Foo，也不会出现内存泄漏
}