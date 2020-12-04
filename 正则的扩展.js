
// RegExp构造函数

{
    // 在ES5中，RegExp构造函数的参数由两种情况，第一种情况是，参数是字符串，这时候第二个参数表示的是正则表达式的修饰符(flag)
    const regex = new RegExp('xyz', 'i');
    const regex = /xyz/i;
    // 意思表示是匹配xyz字符

    // 第二种情况是，参数是一个正则表达式，这时候会返回一个原有正则表达式的拷贝
    const rgex = new RegExp(/xyz/i);
    const regx = /xyz/i
    // 还是和上面一样的匹配规则

    // 但是，ES5不允许此时使用第二个参数添加修饰符，否则会报错
    const regex = new RegExp(/xyz/, 'i');
    // 但是ES6改变了这种行为，如果RegExp构造函数的第一个参数是一个正则表达式，那么就可以使用第二个参数指定修饰符，而且，返回的正则表达式会忽略原有的正则表达式的修饰符，只使用新指定的修饰符
    new RegExp(/abc/ig, 'i').flags
    // 上面代码中，原有正则对象是ig，它会被第二个参数i覆盖
}


// 字符串的正则方法
{
    // 字符串对象共有4个方法，可以使用正则表达式：match(),repace(),search()和split()

    String.prototype.match();
    /**
     * 调用
     * 
     * match()方法可以在字符串内检索指定的指，或找到一个或多个正则表达式的匹配
     * str.match(regexp)；regexp是一个正则表达式对象，如果传入一个非正则表达式对象，则会隐式的使用new RegExp(obj)转换为一个RegExp。如果你没有给出任何参数并直接使用match()方法，你将会得到一个空字符串的Array:['']
     * 
     * 返回值：如果使用g标志，则将返回完整正则表达式匹配的所有结果，但不会返回捕获组；如果为使用g标志，则仅返回第一个完整匹配及其相关的捕获组(Array),这种情况下，返回的项目将会有如下的附加特性
     * groups：一个捕获或undefined(如果没有定义命名捕获组)
     * index：匹配的结果的开始位置
     * input：搜索的字符串
     * 
     * 如果正则表达式不包含g标志，str.match()将返回与RegExp.exec()相同的结果
     * 
     * 如果你需要知道一个字符串是否与一个正则表达式匹配RegExp，可以使用RegExp.test();如果你只想需要第一个匹配结果，你也可以使用RegExp.test();如果你想获得捕获组，并设置了全局标志，你需要用RegExp.exec()或者String.prototype.matchAll()
     */
    RegExp.prototype[Symbol.match];

    String.prototype.replace();
    /** 
     * 调用
     * replace()方法返回一个由替换值(replacement)替换部分或者所有的模式(pattern)匹配项后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。如果pattern是字符串，则仅替换第一个匹配项
     * 
     * str.replace(regexp|substr,newSubStr|function)
     * regex(pattern)：一个RegExp对象或者其字面量，该正则匹配的内容会被第二个参数的返回值替换。
     * substr(pattern)：一个将被newSubStr替换的字符串，将被视为一整个字符串，而不是一个正则表达式，仅第一项会被替换
     * newSubStr(replacement)：用于替换掉第一个参数在原字符的字符串，该字符串可以插入一些特殊的变量名
     * functionb(replacement)：一个用来创建新子字符串的参数，该函数的返回值将替换掉第一个参数匹配到的结果
     * 
     * 返回值是一个部分或者全部匹配由替代模式取代的新的字符串
     * 
     * 该方法并不改变调用他的字符串本身，而是返回一个新的替换后的字符串
     * 
     * 在进行全局搜索的时候，正则表达式需包含g标志
     * 
     * 使用字符串作为参数时候，可以插入下面特殊变量名
     * $$       插入一个$
     * $&       插入匹配的子串
     * $`       插入当前匹配的子串左边的内容
     * $'       插入当前匹配的子串右边的内容
     * $n       加入第一个参数是RegExp对象，并且是n个小于100的非负整数，那么插入第n个括号匹配的字符串。
     * 
     * 
     * 指定一个参数作为参数，当匹配执行后，该函数就会执行，桉树的返回值作为替换字符串
     * match        匹配的子串
     * p1,p2,...        加入replace()方法的第一个参数是一个RegExp对象，则代表第n个括号匹配的字符串。例如，如果是用/(\a+)(\b+)/来匹配，p1匹配\a+,p2匹配\b+
     * offset       匹配的字符串在原字符串种的偏移量(比如，原字符是'abcd'，如果匹配的子字符窜是'bc',偏移量就是1)
     * string       被匹配到的原字符串
     */
    {
        function replacer(match, p1, p2, p3, offset, string) {
            return [p1, p2, p3].join('-');
        }
        const newString = 'abc1234#$*%'.replace(/([^\d]*)(\d*)([^\w])/, replacer);
        console.log(newString);
        // abc-1234-#$*%
        // 我们尝试解释一下这个规则；匹配单个数字开头0次或者无数次，匹配单个数字0次或者无数次；匹配包括下划线单个字符[A-Za-z0-9]
    }
    RegExp.prototype[Symbol.replace];

    String.prototype.search();
    /** 
     * 调用
     * 
     * str.search(regexp)
     * 
     * 参数：regexp，一个正则表达式对象；如果传入一个非正则表达式对象regexp，则会使用new RegExp(regexp)隐式将其转换为正则表达式对象
     * 
     * 如果匹配成功，则search()返回正则表达式在字符串种首次匹配项的索引，否则返回-1
     */
    RegExp.prototype[Symbol.search];

    String.prototype.split();
    /** 
     * 调用
     * 
     * split()方法使用指定的分隔符字符串将一个String对象分割成子字符串数组，以一个指定的分割字符串来决定每个拆分的位置
     * 
     * str.split([separator[,limit]])
     * separator：指定表示每个拆分应发生的点的字符串，separtator可以是一个字符串或一个正则表达式。如果纯文本分隔符包含多个字符，则必须找到整个字符串来表示分割点，如果分隔符为空字符串，则将str原字符每个字符串的数组形式返回
     * limit：一个整数，限定返回的风格段数量，当提供此参数时候，split方法会在指定分隔符的每次出现时候分割该字符，但限制条目以放入数组停止，如果在达到指定限制之前达到字符串1的末尾，他可能仍然包含少于限制的条目。则新数组中不在返回剩下的文本
     * 
     * 返回原字符串以风格符出现位置分隔而成一个Array
     */
    {
        const names = 'Harry Trump;Fred Barney;WeiWei; Helen Rigby;';
        console.log(names);
        const re = /\s*(?:;|$)\s*/;
        const nameList = names.split(re);
        console.log(nameList);
        // Harry Trump;Fred Barney;WeiWei; Helen Rigby;
        //["Harry Trump", "Fred Barney", "WeiWei", "Helen Rigby", ""]
        // split()方法会查找0或者多个空白符接着封号，在接着0或多个空白符模式的字符串，找到后，九江空白符从字符串中移除，nameList是split的返回数组
    }
    RegExp.prototype[Symbol.split];
}