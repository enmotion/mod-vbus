/*
* mod-vbus
* "author": "enmotion"
* version:1.0.0
*/
import Vue from "vue";
import * as matcher from "mqtt-match"; //mqtt topic 规则检测器
import * as R from "ramda";
const singletonBusInstance = new Vue();//bus单例

export default function(holder,defaultSubTopics){
    try{ // 尝试实例 失败则抛出错误
        var busInstance = singletonBusInstance;
        var holder = hasHolder(holder) ? holder : null; // 检查是否有 holder 且需为
        var defaultSubTopics = defaultSubTopics ? pipeOfsubTopicPathValidate(defaultSubTopics) : []; // 默认订阅
        var subTopics = [];
        var callback = function(){}
    }catch(err){
        throw new Error(err);
    }
    busInstance.$on("busOnTrigged",onMessage);// 开启bus的消息侦听
    function sub(topic){
        if(topic.constructor == String){
            subTopics = Array.from(new Set([...subTopics,pipeOfsubTopicPathValidate(topic)[0]]));
        }else{
            throw new Error("ERROR: sub method need prop [topic] expect String,but got "+ topic);
        }
    }
    function unsub(topic){
        var index = subTopics.indexOf(topic);
        if(index>-1){
            subTopics.splice(index,1)
        }
    }
    function pub(topic,payload){
        if(topic.constructor == String && payload.constructor == Object){
            setTimeout(function(){
                busInstance.$emit("busOnTrigged",{sender:holder,topic:topic,payload:payload});
            })
        }
    }
    function on(cb){
        callback = cb
    }
    function onMessage(event){
        if(event.sender != holder){
            var allTopics = [...defaultSubTopics,...subTopics];
            var matchTopics = allTopics.filter(topic=>{
                return matcher(topic,event.topic);
            })
            if(matchTopics.length>0){
                callback(event)
            }
        }
    }
    function pipeOfsubTopicPathValidate(path){
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
    }
    function hasHolder(holder){
        if([String,Object].includes(holder && holder.constructor)){return true}
        throw new Error("ERROR: new method must be has prop [holder] as String or Object");
    }
    function dispose(){
        busInstance.$off("busOnTrigged",onMessage);
        busInstance = null;
        holder = null;
        defaultSubTopics = null;
        subTopics = null;
        callback = null
    }
    return Object.defineProperties({},{
        $bus:{configurable:false,enumerable:false,get:function(){return busInstance}},
        $topics:{configurable:false,enumerable:false,get:function(){return [...defaultSubTopics,...subTopics]}},
        sub:{writable:false,configurable:false,enumerable:false,value:sub},
        unsub:{writable:false,configurable:false,enumerable:false,value:unsub},
        pub:{writable:false,configurable:false,enumerable:false,value:pub},
        on:{writable:false,configurable:false,enumerable:false,value:on},
        dispose:{writable:false,configurable:false,enumerable:false,value:dispose}
    })
}