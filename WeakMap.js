
// WeakMap应用的典型场合就是DOM节点作为键名
{
    let myWeakmap = new WeakMap();
    myWeakmap.set(
        document.getElementById('logo'),
        { timesClick: 0 }
    );
    document.getElementById('logo').addEventListener('click', function () {
        let logoData = myWeakmap.get(document.getElementById('logo'));
        logoData.timesClick++;
    }, false);
    // 上面代码中，document.getElementById('logo')是一个DOM节点，每当发生click时间，就更新一下状态。我们将这个状态作为键值放在WeakMap里，对应的键名就是这个节点1的对象，一旦这个DOM节点删除，该状态就会自动消失，不存在泄漏风险
}


// WeakMap的另一个用处就是部署私有属性
{
    const _counter = new WeakMap();
    const _action = new WeakMap();

    class Countdown {
        constructor(counter, action) {
            _counter.set(this, counter);
            _action.set(this, action);
        }
        dec() {
            let counter = _counter.get(this);
            if (counter < 1) return;
            counter--;
            _counter.set(this, counter);
            if (counter === 0) {
                _action.get(this)();
            }
        }
    }
    const c = new Countdown(2, () => console.log('DONE'));
    c.dec();
    c.dec();
    // VM80:19 DONE
    // 上卖弄代码中，Countdown类的两个内部属性_counter和_action，是实例的弱引用，所以如果删除实例，他们就会消失，不会造成内存泄漏
} 