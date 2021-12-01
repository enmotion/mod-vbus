import ModVbus from "../src"
// console.log(/(^\#|^\+|^(\/|[A-Za-z]){1}(\w+\/|\+{1}\/|\w)+(\w*|\+*|\#*))$/g.test('/root/test'))
// console.log(/(^\#|^\+|^(\/|[A-Za-z]){1}(\w+\/|\+{1}\/|\w)+(\w*|\+*|\#*))$/g.test('#'))
// console.log(/(^\#|^\+|^(\/|[A-Za-z]){1}(\w+\/|\+{1}\/|\w)+(\w*|\+*|\#*))$/g.test('##'))
var v001 = ModVbus.create('v001',['P001'])
var v002 = ModVbus.create('v002',['P002'])
var v003 = ModVbus.create('v003',['P003'])
v001.sub("test");
v002.pub("P003",{test:"haha"});
// console.log(v001.getAllSubedTopics())
v001.unsub("test");
// console.log(v001.getAllSubedTopics())