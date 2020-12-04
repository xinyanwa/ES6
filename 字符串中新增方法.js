

// 本节介绍字符串中新增方法

{
    // String.fromCodePoint();ES5中提供了String.fromCharCode()方法，用于从Unicode码点返回对应的字符，但是这个方法不能识别码点大于0xFFFF的字符
    String.fromCharCode(0x20BB7)
    // "ஷ";     可以廊道，String.fromCharCode()方法不能识别码点大于0xFFFF，所以0x2BB7就发生了溢出，最高两位被舍去了，最后返回码点U+0BB7对应的字符，而不是码点U+20BB7对应的字符

    // 针对这个问题，ES6提供了String.fromCodePoint()方法，可以识别大于0xFFFF的字符1码点，弥补了String.fromCharCode()方法的不足，作用与codePoint()方法相反。codePoint()方法是返回一个Unicode编码点值的非负整数；如果Stiring.fromCodePoint()方法有多个参数，则他们会被合并成一个字符串返回。有一点需要注意的是：fromCodePoint()方法定义在String对象上，而codePointAt方法定义在字符串的实例对象上。


    // String.raw()
    // ES6为原生的String对象，提供了一个raw()方法，该方法返回一个斜杠都被转义(即斜杠前面加一个斜杠)的字符串，往往用于模板字符串的处理方法。
    String.raw`Hi \n ${2 + 3}`;
    // Hi \n 5 ;实际返回的是'Hi \\n5!'，但是显示的是转义后的结果'Hi\n5'

    //如果原字符串已经转义，那么String.raw()会进行再次转义.
    String.raw`Hi\\n`;
    // "Hi\\n"  String.raw()方法可以作为处理模板字符串的基本方法，他会将所有变量替换，而且对斜杠进行转义，方便下一步走位字符串来使用。String.raw()本质上是一个正常的函数，值是专用于模板字符串的标签函数，如果写成正常函数的形式，他的第一个参数，应该是一个具有raw属性的对象，且raw属性的值应该也是一个数组，对应模板字符串解析后的值
    String.raw({ raw: ['foo', 'aaaa', 'bar', 'aaaa'] }, 1 + 2);
    // foo3bar

    //String.raw()的代码实现基本如下
    String.raw = function (strings, ...values) {
        let output = '';
        let index;
        for (index = 0; index < values.length; index++) {
            output += strings.raw[index] + values[index];
        }
        output += strings.raw[index];
        return output;
    }

    // codePointAt()
    // JavaScript内部，字符以UTF-8的格式储存，每个字符固定为2个字节，对于那些需要4个字节储存的字符(Unicode码点大于0xFFFF的字符)，JavaScript会认为他们是两个字符。

    const s = '𠮷'
    s.length; // 2
    s.charAt(0);
    s.charAt(1);
    s.charCodeAt(0);
    s.charCodeAt(1);
    // charAt()方法无法读取整个字符，charCodeAt()方法只能返回前两个字节和后两个字节的值；针对这一点，ES6提供了codePointAt()方法，能够正确处理4个字节存储的字符，返回一个字符的码点

    // codePointAt()方法返回的是码点的十进制，如果想要十六进制的值，可以使用toString()方法转换一下；还有一个方法是使用for... of 循环，因为他会正确识别32位的UTF-16的字符
    let s = '𠮷a'
    for (let ch of s) {
        console.log(ch.codePointAt(0).toString(16));
    }

    // 另一种方法，也可以使用扩展运算符(...)进行展开运算
    let arr = [...'𠮷a'];
    arr.forEach(ch => {
        console.log(ch.codePointAt(0).toString(16));
    });
    // 总之codePointAt()方法是测试一个字符由两个字节还是四个字节组成的最简单的方法


    // normalize()；用来将字符的不同表示方法同意为同样的形式。称为Unicode正规化！normalize()方法可以接收一个额参数来指定normalize的方式，参数由4个值可选
    /**
     * NFC 默认参数，表示标准等价合成，返回多个简单字符的合成字符，所谓的标准等价指的是视觉和语义上的等价
     * 
     * NFD， 表示标准等价分解，即在标准前提下，返回合成字符分解的多个简单字符
     * 
     * NFKC， 表示兼容等价合成，返回和成字符，只能说是语义上存在等价，当视觉上不等价，比如 喜喜 和 囍
     * 
     * NFKD 表示兼容等价分解，即在兼容等价的前提下，返回合成字符分解的多个简单字符
     */
    '\u004F\u030C'.normalize('NFC').length
    '\u004F\u030C'.normalize('NFD').length

    // NFC表示参数返回字符的合成形式，NFD表示参数返回字符的分解形式


    // 传统上，JavaScript只有inexOF()方法，可以用来确定一个字符串是都包含在另一个字符串中，ES6又提供了3种新的方法
    /**
     *  includes()返回布尔值，表示是都找到了参数字符串
     * 
     *  startsWith()返回不然通知，表示参数字符串是都在原字符串的头部
     * 
     * endsWith()返回布尔值，表示参数字符串上是否在原字符串尾部
     */

    let s = 'Hello World!'
    s.startsWith('world', 6);
    s.endsWith('Hello', 6);
    s.includes('Hello', 6);
    // 这三个方法都支持第二个参数，宝石开始搜索的位置，只不过，endsWith的行为与其他两个方法有所不同，他针对n个字符，器发两个方法针对从第n个位置到字符串结束


    // repeat()；返回一个新字符串，表示将原字符重复n次
    'weiwei'.repeat(3);
    // "weiweiweiweiweiwei"
    // 如果是小鼠，则会被取整；如果是附属或者infinty，会报错；如果参数是0到-1之间的小鼠，则等同于0，这是因为会先进行取整运算，0到-1之间的小鼠，取证以后-0，repeat视同于0；参数NaN等同于0.如果参数repeat的参数是字符串，则会先转换成数字


    // padStart(),padEnd();有时候我们会遇见字符串不够指定长度，则会在头部或者尾部补全。padStart()用于补全头部，padEnd()则用于尾部补全
    'x'.padStart(10,'ab'); // "ababababax"
    'x'.padEnd(5,'ab'); // "xabab"
    // 两个函数都接收两个参数，第一个参数就是字符补全生效的最大长度，第二个参数就是用来补全字符串

    'xxxx'.padStart(2,'ab'); // "xxxx"
    // 但是，如果源字符串的长度，等于或者大于最大长度，则字符串补全不生效，会返回源字符串

    'abc'.padStart(10,'0123456789'); // "0123456abc"
    // 如果补全的字符串与原字符串，两者之和超过了最大长度，则会截去超出位数的补全字符串；如果省略第二个参数，默认使用空格补全长度
    // padStart()最常见的用法是为数值补全自定位数，还有另一个涌入是提示字符串格式
    '12'.padStart(10,'YYYY-MM-DD');

    // trimStart(),trimEnd()这两个方法，他们的行为与trim()一致，trimStart()消除字符串头部的空格，trimEnd()消除尾部的空格，他们返回的都是新字符串，不会修改原始字符串。
    const s = '   abc  ';
    s.trim() // "abc"
    s.trimStart() // “abc   ”
    s.trimEnd() // "  abc"
    // 上面几个方法中，trimStart()只消除头部的空格，保留尾部的空格。trimEnd()也是类似行为。除了空格将，这两个方法对字符串头部(尾部)的tab键，换行等不可见的空白符号也有效。除此之外，trimLeft()是trimStart()的别名，trimRight()是trimEnd()的别名


    // matchAll();方法返回一个正则表达式在当前字符串的所有匹配


    // replaceAll();历史上，字符串的实例方法replace()只能替换第一个字符
    'aabbcc'.replace('b','_') //"aa_bcc"
    // 上面例子中，replace()只是将第一个b替换成下划线；如果要替换所有的匹配，不得不使用正则表达式的g来修饰

    // 这则表达式毕竟不是那么方便和直观，所以引入了replaceAll()方法，可以一次性替换所有匹配
    'aabbcc'.replaceAll('c','_'); // "aabb__"
    // 他的用法与replace()相同，返回一个新的字符串，不会改变原字符串

    String.prototype.replaceAll(searchValue,replacement);
    // 上面代码中，serachValue是搜索1模式，可以是一个字符串，也可以是一个全局的正则表达式

    // replaceAll()的第二个参数replacement是一个字符串，表示替换的文本，其中可以使用一些特殊的字符串
    /**
     *  $&: 匹配的子字符串
     *  '$': 匹配结果前面的文本
     *   $': 匹配结果后面的文本
     *   $n: 匹配成功后的第n组内容，n是从1开始的自然数
     *   $$: 指代美元符号$
     */

     // 除了上述一些情况下，replaceAll()第二个参数也可以是一个函数，该函数的返回值会替换掉所有b的匹配！

}