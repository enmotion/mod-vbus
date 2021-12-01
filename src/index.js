/*
* mod-vbus
* "author": "enmotion"
* version:1.0.0
*/
import Vue from "vue";
import * as matcher from "mqtt-match"; //mqtt topic 规则检测器
import * as R from "ramda";
const singletonBusInstance = new Vue();//bus单例

export default {
    create:function(holder,defaultSubTopics,callback){
        try{ // 尝试实例 失败则抛出错误
            var busInstance = singletonBusInstance;
            var holder = this.hasHolder(holder) ? holder : null; // 检查是否有 holder 且需为
            var defaultSubTopics = defaultSubTopics ? this.pipeOfsubTopicPathValidate(defaultSubTopics) : []; // 默认订阅
            var subTopics = [];
        }catch(err){
            throw new Error(err);
        }
        busInstance.$on("busOnTrigged",onMessage);// 开启bus的消息侦听
        function sub(topic){
            if(topic.constructor == String){
                subTopics.push(topic);
                subTopics = Array.from(new Set(subTopics));
                // console.log(subTopics)
            }else{
                throw new Error("ERROR: sub method need prop [topic] expect String,but got "+ topic);
            }
        }
        function unsub(topic){
            subTopics.splice(subTopics.indexOf(topic,1))
        }
        function pub(topic,payload){
            if(topic.constructor == String && payload.constructor == Object){
                setTimeout(function(){
                    busInstance.$emit("busOnTrigged",{sender:holder,topic:topic,payload:payload});
                })
            }
        }
        function onMessage(event){
            if(event.sender != holder){
                var subs = [...defaultSubTopics,...subTopics];
                subs = subs.filter(topic=>{return matcher(topic,event.topic);})
                if(subs.length>0){
                    console.log(holder,event,"is catch")
                }
                console.log(holder,"all message from other",event.payload)
            }
        }
        function getAllSubedTopics(){
            return [...defaultSubTopics,...subTopics]
        }
        return Object.defineProperties({},{
            $bus:{writable:false,configurable:false,enumerable:false,value:busInstance},
            getAllSubedTopics:{writable:false,configurable:false,enumerable:false,value:getAllSubedTopics},
            sub:{writable:false,configurable:false,enumerable:false,value:sub},
            unsub:{writable:false,configurable:false,enumerable:false,value:unsub},
            pub:{writable:false,configurable:false,enumerable:false,value:pub},
        })
    },
    pipeOfsubTopicPathValidate:function(path){
        if([String,Array].includes(path.constructor)){
            var needToSubTopics = path.constructor === String ? [path]:path;
            var answers = needToSubTopics.filter((topic,index)=>{
                return topic.constructor == String
            })
            var diff = R.difference(needToSubTopics,answers);
            if(diff.length>0){
                throw new Error("ERROR: topic path expect typeof String,but got "+ diff[0]);
            }
            answers = Array.from(new Set(answers))
            return answers
        }else{
            throw new Error("ERROR: topic path expect typeof Array or String,but got "+path.constructor);
        }
    },
    hasHolder:function(holder){
        if([String,Object].includes(holder.constructor)){return true}
        throw new Error("ERROR: create method must has prop [holder] as String or Array");
    },
}



// export default function(holder,defaultSubTopics,callback){
//     const bus = busInstance;
//     const subTopicRex = subTopicRex;
//     const pubTopicRex = pubTopicRex;
//     create(holder,defaultSubTopics,callback)
//     function create(holder,defaultSubTopics,callback){
//         try{
//             if(holder==null){
//                 throw new Error('ERROR: create method prop holder can not be null');
//             }
//         }catch(err){
//             throw new Error(err);
//         }
//         busInstance.$on("busOnTrigged",onMessage);// 开启bus的消息侦听
//     }
//     function onMessage(event){

//     }
// }
// export default function(){
//     var bus = busInstance;//用于通讯的bus单例
//     var instance = {}; // new 返回的实例
//     var defaultTopics = defaultSub||[]; // 创建时，添加默认订阅主题 默认主题是不可被unsub的
//     var topics = []; // 运行时订阅的主题
//     var holder = holder;// bus的实例拥有者
//     var callback = callback||function(){}; // bus的回调函数
//     function create(holder,defaultSubTopics,callback){
//         try{
//             if(holder==null){
//                 throw new Error('ERROR: create method prop holder can not be null');
//             }
//         }catch(err){
//             throw new Error(err);
//         }
//         bus.$on("busOnTrigged",topicFilter);// 开启bus的消息侦听
//     }
//     function pipeOfsubTopicPathValidate(path){
//         if([String,Array].includes(path.constructor)){
//             var needToSubTopics = path.constructor === String ? [path]:path;
//             needToSubTopics.filter(topic=>{
//                 var isCorrect = subTopicRex.test(topic);
//                 if(!isCorrect){
//                     throw new Error("ERROR: topic path ["+topic+"] is not correct");
//                 }else{
//                     return subTopicRex.test(topic);
//                 }
//             })
//             return needToSubTopics
//         }else{
//             throw new Error("ERROR: topic path expect typeof Array or String,but got "+path.constructor);
//         }
//     }

//     function topicFilter(message){
//         var topicAry = [...defaultTopics,...topics]
//         if(isTopicSubed(topicAry,message.topic) && message.publisher != holder){
//             callback({
//                 topic:message.topic,
//                 payload:message.payload
//             })
//         }
//     }
//     function isTopicSubed(topics,topic){
//         var topicary = topic.split("/")
//         var result = topics.filter(topic=>{
           
//         })
//         return true
//     }
//     function sub(topic){
//         if(!subTopicRex.test(topic)){
//             console.error("订阅主题路径不可以非'/'开头,路径中只可包含'/*/'或者数字、字母、中划线，下划线内容，结尾必须为[/,*,**]3种类型");
//             return;
//         }
//         topics.push('/root'+topic);
//     }
//     function unsub(topic){
//         topics.push(topic);
//     }
//     function pub(topic,payload){
//         if(!pubTopicRex.test(topic)){
//             console.error("发布主题路径不可以非'/'开头,路径中只可包含'/*/'或者数字、字母、中划线，下划线内容，结尾必须为[/,*,**]3种类型");
//             return;
//         }
//         setTimeout(function(){
//             bus.$emit("busOnTrigged",{publisher:holder,topic:'/root'+topic,payload:payload})
//         })
//     }
//     function setCallBack(cb){
//         callback = cb;
//     }
//     function dispose(){
//         bus.$off("busOnTrigged",topicFilter);
//         instance = null
//     }
//     Object.defineProperties(instance,{
//         $topics:{writable:false,configurable:false,enumerable:false,value:topics},
//         sub:{writable:false,configurable:false,enumerable:false,value:sub},
//         unsub:{writable:true,configurable:false,enumerable:false,value:unsub},
//         pub:{writable:false,configurable:false,enumerable:false,value:pub},
//         setCallBack:{writable:false,configurable:false,enumerable:false,value:setCallBack},
//         dispose:{writable:false,configurable:false,enumerable:false,value:dispose}
//     })
//     return instance;
// }