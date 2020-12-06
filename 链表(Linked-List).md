
# JavaScript中算法与数据结构——链表(Linked-List) #

## 链表 ##

---

栈和队列进行存数据，他们其实都是列表的一种，底层存储数据的数据结构都是数组
但是数组不总是最佳的数据结构，因为在很多编程语言中，数组的长度都是固定的，如果数组已被数据填满，那要在加入新的元素是非常困难的。而且，对于数组的增删操作也十分繁琐，通常要将数组中的其他元素前向或者向后平移
在js数组中却不存在该问题，主要是他们都被实现为对象了。但是，与其他语言相比，js的效率会低很多
我们可以考虑用链表来代替.除了对数据的随机访问，链表几乎可在任何可以使用一维数组中。
链表分为单向链表，双向链表，单向循环链表和双向循环链表

## 链表的定义 ##

---

链表是一组节点组成的集合，每个节点都使用一个对象的引用来指向它的后一个节点，指向另一个节点的引用叫做链

![链表](https://user-gold-cdn.xitu.io/2017/9/27/a08d4dae94aa270a6039a9be276c19da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

其中，data中保存着数据，next保存下一个链表的引用，链表尾元素指向了null节点，表示结束的位置
由于链表的起始点确定有些麻烦，因此很多链表的实现都会在链表前面添加一个特殊的节点，称为头节点

![有头节点的链表](https://user-gold-cdn.xitu.io/2017/9/27/d2936b25a6d4ab86113ac788436c4c54?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

向表中插入一个节点，需要修改它前面的节点(前驱),使其指向新加入的节点，而将新节点指向原来前驱节点指向的节点即可。
![插入节点](https://user-gold-cdn.xitu.io/2017/9/27/8256b969d52687c6794de3e41a11d3c6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

从链表中删除一个节点，只需要将待删节点的前驱节点指向待删节点，同时将待删节点治安null，节点就删除成功了
![删除节点](https://user-gold-cdn.xitu.io/2017/9/27/e786a813290ea5e5082bd15562a7ea8e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 链表的设计 ##

设计链表包含两类，一个是Node表示节点，另一个是LinkedList类提供插入节点，删除节点的一个操作

### Node类 ###

Node类包含两个属性：element用来保存节点上的数据，next用来保存指向下一个节点的链接

```javascript
function Node(element){
  this.element = element
  this.next = null
}
```

### LinkedList类 ###

LinkedList类提供了对链表进行操作的方法，包括插入节点，查找给定值等。它只有一个属性，那就是使用一个Node对象来保存该链表的头节点

```javascript
function LinkedList(){
  // 头节点
  this.hear = new Node('head')
  // 查找节点
  this.find = find
  // 插入节点
  this.insert = insert
  // 删除节点
  this.remove = remove
  // 查找前一个节点
  this.findPrev = findPrev
  // 显示链表
  this.display = display
}
```

header节点的next属性初始化为null，当新元素插入时，next会指向新的元素

#### find：查找给定节点 ####

find方法展示如何让在链表上移动，先攒机按一个新节点，将链表的头节点赋给这个新攒机按的节点，然后在链表上循环，如果当前节点element属性和我们要找的信息不符合，就将当前节点移动到下一个节点，如果查找成功，该方法返回包含该数据的节点，否则就返回null

```javascript
function find(item){
  let currNode = this.head
  while(currNode.element != item){
    currNode = currNode.next
  }
  return currNode
}
```

#### insert：向链表插入一个节点 ####

想要插入一个节点，就必须明确在哪个节点的前面或者后面插入。若在一个已知节点后插入新节点，我们首先得到这个节点，一旦找到该节点，就可以将新的节点插入到链表中，将心节点的next属性设置为后面节点的next属性对应的值，然后设置后面节点的next属性对应的值，然后设置后面节点next属性指向新的节点。

```javascript
function insert(newElement, item){
  let newNode  = new Node(newElement)
  let currNode = this.find(item)
  newNode.next = newNode;
}
```

#### display：显示链表 ####

我们将头节点赋给一个新的变量，然后循环链表，知道当前节点的next属性为null时停止循环，循环过程中我们将每个节点的数据打印。

```javascript
function display(){
  let currNode = this.head
  while(!(currNode.next == null)){
    console.log(currNode.next.element)
    currNode = currNode.next
  }
}
```

#### findPrev：查找前一个节点 ####

首先遍历链表，检查每一额节点的下一个节点是否储存我我们想要的节点，如果找到，就返回该节点，

```javascript
function findPrev(item){
  let currNode = this.head
  while(!(currNode.next == null) && (currNode.next.element != item)){
    currNode = currNode.next
  }
  return currNode
}
```

#### remove：从链表中删除一个节点 ####

我们需要先找到之前的节点，修改它的next属性，这就用到了findPrev

```javascript
function remove(item){
  let prevNode = this.findPrev(item)
  if(!(prevNode.next == null)){
    prevNode.next = prevNode.next.next
  }
}
```

### 测试程序 ###

---

```javascript
let fruits  = new LinkedList()
fruits.insert('one','head')
fruits.insert('two','one')
fruits.insert('three','two')

console.log(fruits.display())
```
