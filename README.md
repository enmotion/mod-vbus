# mod-vbus
based on mqtt topic sub&amp;pub principle, eventbus design for components

基于mqtt主题 sub & pub 规则的组件通讯模块
针对大量多层级组件间需要灵活动态通讯需求时,常规的vue-bus在消息管理，分发方面将会面临非常繁琐的操作。而vuebus将

>特点
>1. 基于vue-bus原理的单例实现消息总线功能
>2. 基于mqtt Topic规则的消息订阅与分发
>3. 基于【发布者，主题，负载】的消息格式
>4. 便于多单组件之间，多群组件之间的灵活通讯需要



#### install
```
npm i mod-vbus --save
```

#### usage

```
import ModVbus from "mod-vbus" // 引入模块
// 创建实例 设置 【holder,默认消息主题组】
var v001 = new ModVbus('v001',['/compos/P001']) 
var v002 = new ModVbus('v002',['/compos/P002'])
var v003 = new ModVbus('v003',['/compos/P003'])
var v004 = new ModVbus('v004',['/compos/P004'])
// 订阅临时主题
v002.sub("/group01/#");
v003.sub("/group01/elements/v003");
v004.sub("/group02/elements/v003");

v001.pub("/group01/elements/v003",{action:"hide",params:true});

v002.on(function(msg){
    console.log(msg,'v002')
    //{
        //"sender":"v001", //发布holder
        //"topic":"/group01/elements/v003", //主题地址
        //"payload":{"action":"hide","params":true} //消息负载
    
    //} 
    //v002
})
v003.on(function(msg){
    console.log(msg,'v003')
    //{
        //"sender":"v001",
        //"topic":"/group01/elements/v003",
        //"payload":{"action":"hide","params":true}
    
    //} 
    //v002
})
v004.on(function(msg){
    console.log(msg,'v004') // 不会被触发
})


```

### Propties & Methods & Events
所有的 Propties & methods & events 都挂载在 mod-vbus的实例上  

##### new ModVbus(holder,defaultTopics); 创建实例
holder: String 【必填】 
在主题消息的分发中，讲自动过滤接受者根发布者都为同一 hodler的情况；  
defaultTopics : String,String[]  【可选】 默认订阅主题，实例后，将不可再次修改默认主题，实例时可为空

```
// 范例：
// new(holder,defaultTopics);
// holder: String 
// 在主题消息的分发中，讲自动过滤接受者根发布者都为同一 hodler的情况；
// defaultTopics : String[]
// 默认订阅主题，实例后，将不可再次修改默认主题，实例时可为空

import ModVbus from "mod-vbus" // 引入模块
var componentA = new ModVbus("mbus",["/root/item/componentA"]);
var componentB = new ModVbus() // 抛出报错 缺失 holder 
// new 方法 入参说明
```
##### Propties

[instance].$bus 获取当前消息总线的vue-bus单例对象 【只读】  

PS：该属性建议只做单例检测，请不要直接通过$bus操作
```
import ModVbus from "mod-vbus" // 引入模块

var componentA = new ModVbus('mbus',['/compos/P001'])
console.log(componentA.$bus)
```
[instance].$topics 获取当前实例订阅的所有主题 【只读】

PS：该属性将会显示所有订阅的主题，默认+临时
```
import ModVbus from "mod-vbus" // 引入模块

var componentA = new ModVbus('mbus',['/compos/P001'])
componentA.sub("dynamic/item/top")
console.log(componentA.$topics)
//['/compos/P001', 'dynamic/item/top']
```

##### Methods

[instance].sub(topic)  添加订阅主题  
topic:Stirng 需添加的主题地址  
PS：sub方法仅添加临时主题，可通过unsub方式来取消
```
import ModVbus from "mod-vbus" // 引入模块

var componentA = new ModVbus('mbus',['/compos/P001'])
componentA.sub("dynamic/item/top")
console.log(componentA.$topics) 
//'compos/P001, dynamic/item/top

componentA.sub("dynamic/item/top2")
console.log(componentA.$topics)
//'/compos/P001', 'dynamic/item/top', 'dynamic/item/top2'
```
[instance].unsub(topic) 取消订阅主题  
topic:Stirng 需移除的主题地址  
PS：new 创建时的默认主题不会被unsub方式移除
```
import ModVbus from "mod-vbus" // 引入模块

var componentA = new ModVbus('mbus',['/compos/P001'])
componentA.sub("dynamic/item/top")
console.log(componentA.$topics) 
//'compos/P001, dynamic/item
componentA.unsub("dynamic/item/top")
console.log(componentA.$topics)
// compos/P001
componentA.unsub("/compos/P001")
console.log(componentA.$topics) 
// compos/P001 new 创建时的默认主题不会被unsub方式移除
```
[instance].pub(topic,payload) 发布主题  
topic:String 发布消息所用主题地址  
payload:any 收到的消息内容  
```
import ModVbus from "mod-vbus" // 引入模块

var componentA = new ModVbus('mAus',['/compos/componentA'])
var componentB = new ModVbus('mBus',['/compos/componentB'])

componentA.pub('/compos/componentB',{msg:"hello componentB"});
componentB.on(function(event){
    console.log('componentB',event.payload)
})
componentA.on(function(event){
    console.log('componentA',event.payload)
})
//componentB {msg: 'hello componentB'}
```

[instance].dispose() 销毁实例
```
import ModVbus from "mod-vbus" // 引入模块
var componentA = new ModVbus('mAus',['/compos/componentA'])
var componentB = new ModVbus('mBus',['/compos/componentB'])

componentA.pub('/compos/componentB',{msg:"hello componentB"});
componentB.on(function(event){
    console.log('componentB',event.payload)
})
componentA.on(function(event){
    console.log('componentA',event.payload)
})
// 组件移除时，记得一定要销毁相关实例
componentA.dispose();
componentB.dispose();
```
##### Events
[instance].on(handler) 消息  
handler:Function  
handler会接受到一个event实体，包括  
{  
    sender:String 发布主题消息的holder  
    topic:String 主题的地址  
    payload:any 主题消息的负载数据  
}
```
var componentA = new ModVbus('mAus',['/compos/componentA'])
var componentB = new ModVbus('mBus',['/compos/componentB'])

componentA.pub('/compos/componentB',{msg:"hello componentB"});
componentB.on(function(event){
    console.log('componentB',event)
    // componentB {sender: 'mAus', topic: '/compos/componentB', payload: {…}}
})
componentA.on(function(event){
    console.log('componentA',event)
})
```

#### 有关topic规则

此模块集成了 mqtt 主题匹配规则，简要说明如下：  
/ 分层符号 sub&pub  
\# 多层通配符 sub 该层至之后皆通配  
\+ 单层通配符 sub 该层通配 

```
subTopic1: # 
subTopic2: /root/elements/#
subTopic3: /root/control/#
subTopic4: +
subTopic5: /root/+/chart/group/item/A001
subTopic6: /root/control/+

pubTopic1: /root/elements/chart/group/item/A001
pubTopic2: /root/control/topmenu

```