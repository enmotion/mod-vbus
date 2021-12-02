import ModVbus from "../src" // 引入模块
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
setTimeout(function(){
    componentB.dispose()
    componentA.pub('/compos/componentB',{msg:"hello componentB2"});
})
