import ModVbus from "../src"
// console.log(/(^\#|^\+|^(\/|[A-Za-z]){1}(\w+\/|\+{1}\/|\w)+(\w*|\+*|\#*))$/g.test('/root/test'))
// console.log(/(^\#|^\+|^(\/|[A-Za-z]){1}(\w+\/|\+{1}\/|\w)+(\w*|\+*|\#*))$/g.test('#'))
// console.log(/(^\#|^\+|^(\/|[A-Za-z]){1}(\w+\/|\+{1}\/|\w)+(\w*|\+*|\#*))$/g.test('##'))
var v001 = new ModVbus('v001',['P001'])
var v002 = new ModVbus('v002',['P002'])
var v003 = new ModVbus('v003',['P003'])
var v003 = new ModVbus('v003',['P003'])
v001.sub("chartG01/#");
v003.sub("chartG01/")
v001.on(function(msg){
    if(msg.payload.func=="hide"){
        setTimeout(function(){
            alert("v001"+'|'+msg.sender+":"+msg.payload.params.name)
        },1000)
    }
})
v002.pub("chartG01/V004",{func:"hide",params:{name:"v002 call 001"}});
v003.pub("chartG01/V004",{func:"hide",params:{name:"v003 call 001"}});