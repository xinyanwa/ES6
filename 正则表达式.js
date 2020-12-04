
// 正则表达式其实就是一门工具，目的是为了字符串模式匹配，他是一种用来描述规则的表达式


// 正则表达式的基本组成元素可以分为：字符和元字符


// 那我们从最简单的单个字符说起，最简单的正则表达式，可以由简单的数字和字母组成，没有特殊语义，如果想要匹配特殊的字符的话，就得使用我们的第一个元字符/；他是一个转义字符

/**
 *  换行符  \n
 *  换页符  \f
 *  回车符  \r
 *  空白符  \s
 *  制表符  \t
 *  垂直制表符  \v
 *  回退符  [\b]
 */


// 多个字符； 单个字符的映射关系是一对一的，即正则表达式的被用来筛选匹配的字符只有一个；在正则表达式里面，几何定义方式是使用中括号[]

/**
 * 除了换行符之外的任何字符    .
 * 单个数字，[0-9]     \d
 * 除了[0-9]       \D
 * 包括下划线在内的单个字符，[A-Za-z0-9]      \w
 * 非单字符        \W
 * 匹配空白字符，包括空格，制表符，换页符和换行符      \s
 * 匹配非空白字符      \S
 */


// 循环与重复；
/**
 * 一对一，一对多说完了，接下来，就该介绍如何匹配多个字符，根据次数，我们可以分为0次，1次，多次，特定次。
 * 
 * 0|1    元字符？代表匹配一个字符或者0个字符，如果要匹配color和colour这两个单词，就要保证u这个字符多次出现，都能被匹配到， /colou?r
 * 
 * >=0    元字符*表示用来匹配0个字符或者无数个字符，通常用来过滤某些可有可无的字符串
 * 
 * >=1    元字符+适用于匹配同个字符出现1次或者多次的情况
 */


// 特定次数；某些情况下，我们需要匹配特定的重复次数，元字符{和}用来给重复匹配设置精确的区间范围，比如
{
    //对于a想匹配3次 
    /a{3}/;
    // 至少匹配两次
    / a{ 2,} /;

    /**
     * {x}：x次
     * {min,max}：介于min和max次之间
     * {min,}：至少min次
     * {0，max}：至多max次
     */

    /**
     * 以下是元字符的用法
     * 
     * 0次或1次     ?
     * 0次或者无数次        *
     * 1次或者无数次        +
     * 特定次数     {x},{min,max}
     */
}



// 位置边界
/**
 * 单词边界     \b
 * 非单词边界       \B
 * 字符串开头       ^
 * 字符串结尾       $
 * 多行模式     m标志
 * 忽略大小写       i标志
 * 全局模式     g标志
 */



// 子表达式。通过嵌套递归和自身引用可以让正则发挥跟强大的功能，同时，也让我们读不懂

{
    // 分组；所有以(和)元字符所包含的正则表达式被分为一组，每一组都是一个子表达式，他是构成高级正则表达式的基础，要更复杂一点往往要会回溯引用的方式

    // 所谓回溯引用指的是模式的后面部分引用前面已经匹配到的字符串。可以把他类比为变量，回溯语法像\1\2一样，\1引用第一个表达式，\2引用第二个表达式！

    // 下面我们看一个例子；假设现在要在下面这个文本里面匹配两个连续相同的单词，我们应该怎么做呢

    const word = 'Hello what what is the first thing, and I am am scq000';
    word.replace(/\b(\w+)\s\1/g);
    // "Hello undefined is the first thing, and I undefined scq000"
    // 我们来尝试解释一下这个规则，首先，匹配单词边界，之后匹配包括下划线在内的单个字符[A-Za-z0-9]在匹配空白在字符，制表符换页符和换行符，之后引用前面的规则匹配

    // 回溯引用在替换字符串中非常常见，语法有些区别，当$1,$2...来引用要被替换的字符串，下面以js代码做演示
    const str = 'abc abc 123';
    str.replace(/(ab)c/g, '$1w');
    // "abw abw 123"

    // 如果我们不想子表达式被引用，可以使用非捕获正则(?:regex)这样就可以避免浪费内存
    const str = 'scq000';
    str.replace(/(scq00)(?:0)/, '$1,$2');
    // "scq00,$2"

    // 我们需要限制回溯引用的适用范围，那么通过前向查找和后向查找就可以达到这个目的

    // 前向查找(lookahead)是用来限制后缀的，凡是以(?=regex)包含的子表达式在匹配过程中都会用来限制前面的表达式的匹配。例如 happy happily这两个单词，我想获得以happ开头的副词，那么可以使用happ(?=ily)来匹配；如果想过滤所有以happ开头的副词，那么也可以采用负前向查找的正则表达式happ(?!ily)，就会匹配到happ单词的happ前缀

    // 后向查找(lookbehind)是通过指定一个子表达式，然后从符合这个子表达式的位置出发开始查找符合规则的字符串。下面单词都包含ple这个后缀
    const a = 'apple';
    const b = 'people';
    a.replace(/(?<=app)ple/); // "apple
    b.replace(/(?<=app)ple/); // "people"
    // 上面(?<=regex)的语法就是我们这里要介绍的后向查找。regex指代的子1表达式会作为限制项进行匹配，匹配到这个子表达式后，就会继续向后查找

    // 另一种被限制匹配时利用(?<!regex)语法，这里称为负后向查找，与正前向查找不同的1试试，被指定的子表达式不能被匹配到

    /**
     * 总结一下上面的内容
     * 
     * 引用     \0,\1,\2和$0,$1,$2
     * 非捕获组     (?:)
     * 向前查找     (?=)
     * 前向负查找       (?!)
     * 后向查找     (?<=)
     * 后前向查找       (?<!)
     */




     // 计算机学科时一门包含逻辑的科学；在正则表达式里面。默认的正则规则都是与的关系； 非的关系，分两种情况，一种是字符匹配，另一种时子表达式匹配。在字符匹配时候，需要使用^这个元字符，只有在[]内部使用的^在表示非的关系;或关系，通常给子表达式进行归类使用

     /**
      * 与      无
      * 非      [^regex]和！
      * 或      |
      */
}