
// ES6允许采用\uxxxx形式表示一个字符，其中xxxx表示字符的Unicode码点，但是，这个码点仅限于\u0000~\uFFFF之间的字符，超出这个范围，必须用两个双字节的形式表示。
{
    '\uD842\uDFB7'
    // 𠮷

    '\u20BB7'
    // ' 7',可以看到，如果直接在、u后面跟上超过0xFFFF的数值(比如\u20BB7),JavaScript会理解成\u20BB+7。由于\u20BB是一个不可打印字符，所以会显示一个空格，后面跟一个7

    //对于这个一点，只要将码点放入大括号，就能正确解读
    '\u{1F680}' === '\uD930\uDE80'
}


// ES6为字符串添加遍历接口，使得字符串可以被for...of循环遍历

{
    for (let codePoint of 'foo') {
        console.log(codePoint);
    }
    // f o o

    // String.fromCodePoint()静态方法返回使用指定的代码点序列创建的字符串，不是一个·String对象
    let text = String.fromCodePoint(0x20BB7);
    for (let i = 0; i < text.length; i++) {
        console.log(text[i]);
    }
    // “ ”   “ ”

    for (let i of text) {
        console.log(i);
    }
    // '𠮷'
}


// JavaScript字符串允许直接输入字符，以及输入字符的转义字符形式，但是，它规定了5个字符，不能在字符里面直接使用，只能使用转义形式

{
    /**
     * -U+005C:反斜杠(reverse solidus)
     * -U+000D: 回车(carriage return)
     * -U+2028: 行分隔符 (paragraph separator)
     * -u+000A: 换行符(line feed)
     * 
     * 字符串里面不能直接包含含斜杠，一定要转义成\\或者 \u005C
     */
}


// JSON.stringify()的改造，根据标准，JSON数据必须是UTF-8编码，但是，现在的JSON.stringify()方法可能返回不符合UTF-8标准的字符串；JSON.stringify()方法将一个JavaScript对象或值转换为JSON字符串，如果指定了一个replacer函数，则可以选择性地替换值，或者指定的replacer是数组，则可以选择性地包含数组指定的属性


// 模板字符串，传统的JavaScript语言，输出模板通常下面这样写

{
    $('#result').append(
        'There are <b>' + basket.count + '</b>' + 'items in your basket, ' + '<em>' + basket.onSale + '</em> are on sale!'
    );

    // 可以看到，上面种写法相当繁琐不方便，ES6引入模板字符串解决了这个问题
    $('#result').append(`There are <b>${basket.count}</b> items in your basket, <em>${basket.onSale}</em> are on sale!`);

    // 模板字符串(template string)是增强版的字符串，用反引号(`)标识，它可以当作普通字符串使用，也可以定义多行字符串，或者在字符串种嵌入变量
    let greeting = `\`Yo\` World!`;
    console.log(greeting); // `Yo` World!

    // 如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中，如果不想要这个换行符，可以用trim方法消除它
    $('#list').html(`
    <ul>
        <li>first</li>
        <li>second</li>
    </ul>
    `.trim())
    // trim()方法会从一个字符串的两端删除空白字符，这个上下文种的空白在字符都是所有空白字符(spance tab no-break space)以及所有行终止符(LF CR)


    // 模板中也可以嵌入变量，需要将变量名写在${}中；大括号内部可以房任意的1JavaScript表达式，可以进行运算，以及引用对象属性，模板字符串还能调用函数
    function fn() {
        return 'hello word!';
    }

    `foo ${fn()} bar`
    // foo hello word! bar

    // 如果大括号中的值不是字符串，将按照一般的规则转换为字符串，比如，大括号中是一个对象，则默认调用对象的toString方法。但是，如果模板字符串中的变量没有生命，将报错。

    // 模板字符串还能嵌套，如果要引用摹本字符串本身，在需要执行时候执行，可以写成函数


    // 模板编译.下面代码在模板字符串之中，放了一个常规模板，该模板使用<% ... %>放置JavaScript代码，使用<%= ... %>输出JavaScript表达式
    let template = `
        <ul>
            <% for(let i=0;i<data.supplies.length;i++){ %>
                <li>
                    <%= data.supplies[i] %>
                </li>
            <% } %>
        </ul>
    `
    // 思考一下，怎么去编译这个模板字符串呢；目前有一种思路是将其转换为JavaScript表达式字符串
    echo('<ul>');
    for (let i = 0; i < data.supplies.length; i++) {
        echo('<li>');
        echo(data.supplies[i]);
        echo('</li>');
    };
    echo('</ul>');
    //转换使用正则表达式
    let evalExpr = /<%=(.+?)%>/g;
    let expr = /<%([\s\S]+?)%>/g;

    template = template
        .replace(evalExpr, '`); \n echo($1); \n echp(`')
        .replace(expr, '`); \n $ $1 \n echo(`');
    template = 'echo(`' + template + '`);';

    // 然后将template封装在一个函数里面返回，就可以了
    let script = `
        (function parse(data){
            let output = '';

            function echo(html){
                output += html;
            }

            ${template}

            return output;

        })
    `;

    return script;

    // 将上面的你内容拼接成一个函数compile
    function compile(template) {
        const evalExpr = /<%=(.+?)%>/g;
        const expr = /<%([\s\S]+?)%>/g;

        template = template
            .replace(evalExpr, '`); \n echo($1); \n echo(`')
            .replace(expr, '`); \n $1 \n echo(`');

        template = 'echo(`' + template + '`);';

        let script = `
            (function parse(data){
                let output = '';

                function echo(html){
                    output += html;
                }

                ${template}

                return output;
            })`

        return script;
    }

    let parse = eval(compile(template));
    div.innerHtml = parse({ supplies: ['broom', 'MessagePort', 'cleaner'] });

    // 标签模板，模板字符串的功能，不仅仅是上面这些，它可以紧跟一个函数名后面，该函数将被调用来处理这个模板字符串，这被称为标签模板的功能(tagged templaate)

    alert`hello`;
    // 等同于
    alert(['hello']);
    // 标签模板其实不是模板，而是函数调用的一种特殊形式，'标签'指的就是函数，紧跟在后面的模板字符串就是它的参数，但是，当模板字符里面有变量了，就不再是简单的调用了，而是会将模板字符串先处理成多个参数，在调用参数。
    let a = 5;
    let b = 10;
    tag`Hello ${a + b} word ${a * b}`;
    // 等同于
    tag(['Hello', 'world', ''], 15, 50);

    //模板字符串前面有一个标识名tag，他是一个函数，整个表达式的返回值，就是tag函数模板字符串后的返回值。函数tag依次会接收到多个参数

    function tag(stringArr, value1, value2) {

    }
    // 等同于
    function tag(StringArr, ...values) {

    }
    // tag函数的第一个参数是一个数组，该数组的成员是模板字符串中那些没有变量替换的部分，也就是说，变量替换只发生在数组第一个成员与第二个成员之间，第二个人成员与第三个成员之间，以此类推；tag函数的其他参数，都是模板字符串各个变量被替换的值，

    tag(['Hello', 'word', ''], 15, 50);
    // 模板字符串有两个变量，所以，tag会接收到value,和value两个参数，我们可以按照需求编写tag函数的代码，下面是tag函数的一种写法，以及运行结果
    let a = 5;
    let b = 10;
    function tag(s, v1, v2) {
        console.log(s[0]);
        console.log(s[1]);
        console.log(s[2]);
        console.log(v1);
        console.log(v2);

        return 'ok';
    }

    tag`Hello ${a + b} word ${a * b}`;
    // Hello 
    // word 
    // 
    // 15
    // 50
    // "ok"

    // 下面的例子展示了如何将个参数按照原来的位置拼合回去
    let total = 30;
    let msg = passthru`The total is ${total} (${total * 1.05} with tax)`;

    function passthru(literals) {
        let result = '';
        let i = 0;

        while (i < literals.length) {
            result += literals[i++];
            if (i < arguments.length) {
                result += arguments[i];
            }
        }

        return result;
    }
    msg // The total is 30 (31.5 with tax)

    // 诺passthru函数采用rest参数的写法如下
    function passthru(literals, ...values) {
        let output = '';
        let index;
        for (index = 0; index < values.length; index++) {
            output += literals[index] + values[index];
        }
        output += literals[index];
        return output;
    }

    // 模板标签的一个重要应用，就是要过滤HTML字符串，防止用户输入恶意内容
    let message = SaferHTML`<p>${sender} has sent you a message</p>`

    function SaferHTML(templateData) {
        let s = templateDate[0];
        for (let i = 1; i < arguments.length; i++) {
            let arg = String(arguments[i]);
            s += arg
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            s += templateData[i];
        }
        return s;
    }

    // sender变量往往是用户提供的，经过safer HTML函数处理，里面的特殊字符会被转义
    let sender = `<script>alert('abc')</script>`;
    let message = SaferHtml`<p>${sender} has sent you a message.</p>`
    message;

    // 标签模板的另一个应用，就是多语言转换(国际化处理)；模板字符串本身不能取代Mustache之类的模板库，因为没有条件判断和循环处理功能，但是通过标签函数，你可以自已添加这个功能。
    i18n`Welcome to ${siteName}, you are visitor number ${visitorNumber}!`;

    let libraryHtml = hashTemplate`
        <ul>
            #for book in ${myBooks}
            <li><i>#{book.title}</i> by #{book.author}</li>
            #end
        </ul>
    `;
    // 你甚至使用标签模板，JavaScriopt语言之中嵌入其他语言,将一个DOM字符串转为React对象
    jsx`
        <div>
            <input
                ref = 'input'
                onChange = '${this.handleChange}'
                defaultValue = '${this.StaticRange.value}'
            />
            ${this.StaticRange.value}
        </div>
    `;

    // 下面例子，通过java函数，在JavaScript代码中运行java代码
    java`
    class HelloWorldApp{
        public static vois main(String[] args){
            System.out.println('Hello World!');       
        }
    }
    `;
    HelloWorldApp.main();

    // 模板处理函数的第一个参数(模板字符串数组)，还有一个raw属性.console.log接收的参数，实际上是一个数组,该数组有一个raw属性，保存后是转义的后的原字符串。
    console.log`123`
    // ["123", raw: Array(1)]

    // tag函数的第一个参数string，有一个raw属性，也指向一个数组。该数组的成员与string数组完全一致。比如，string数组是['First line\nSecond line'],/那么string.raw数组就是['First line \\ nSecond line']，两者唯一区别是字符串里面的斜杠被转义了，strings.raw数组将会被\n视为1\\ 和 n,这是为了方便之前原始模板设计的

    // 为解决这个问题，ES2018放松了对标签模板里面的字符串转义的限制，如果遇到不合法的字符串转义，就返回undefined，而不是报错
    


}