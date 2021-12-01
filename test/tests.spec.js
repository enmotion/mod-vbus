import Mcrypto from "../src"
var assert = require ('assert');

describe('mod-crypto 测试',function(){    
    describe("创建实例 new",function(){
        it("入参key 缺失,返回对象 hasCryptoKey == false",function(){            
            var C = new Mcrypto()
            assert.equal(C.hasCryptoKey,false)
        })
        it("入参key:'qwerasdf1234' 位数错误,返回对象 hasCryptoKey == false",function(){
            var C = new Mcrypto("qwerasdf1234")
            assert.equal(C.hasCryptoKey,false)
        })
        it("入参key:'qwerasdfzxc你!@#$' 携带中文错误,返回对象 hasCryptoKey == false",function(){
            var C = new Mcrypto("qwerasdfzxc你!@#$")
            assert.equal(C.hasCryptoKey,false)
        }) 
        it("入参key:'qwerasdfzxcv!@#$' 正确,返回对象 hasCryptoKey == true",function(){
            var C = new Mcrypto("qwerasdfzxcv!@#$")
            assert.equal(C.hasCryptoKey,true)
        })        
    })
    describe("字符加解密",function(){
        it("加密KEY错误，加密无效，原字符 'mod enmotion', orgStr == crpStr",function(){            
            var C = new Mcrypto()
            var orgStr = "mod enmotion"
            var crpStr = C.deCryptoStr(C.enCryptoStr(orgStr));
            assert.equal(crpStr,orgStr)
        })
        it("加解密 'hello world 2222', orgStr == crpStr",function(){            
            var C = new Mcrypto("qwerasdfzxcv!@#$")
            var orgStr = "hello world 2222"
            var crpStr = C.deCryptoStr(C.enCryptoStr(orgStr));
            assert.equal(orgStr,crpStr)
        })          
    })    
    describe("对象 加解密",function(){
        it("加解密 非对象 'jhe' ,返回对象 result == null",function(){            
            var C = new Mcrypto("qwerasdfzxcv!@#$")
            var target="jhe"
            var result = C.deCryptoStrToData(C.enCryptoDataToStr(target));
            assert.deepEqual(result,null)
        })
        it("加解密 非对象 undefined ,返回对象 result == null",function(){            
            var C = new Mcrypto("qwerasdfzxcv!@#$")
            var target={"name":{"v":"enmotion","m":"l","t":1609070531}};
            var result = C.deCryptoStrToData(C.enCryptoDataToStr(target));
            assert.deepEqual(result,target)
        })
        it("加解密 Obejct ,返回对象 target == result",function(){            
            var C = new Mcrypto("qwerasdfzxcv!@#$")
            var target = {name:"mod",hoppy:["swiming"]}
            var result = C.deCryptoStrToData(C.enCryptoDataToStr(target));
            assert.deepEqual(target,result)
        })
        it("加密与解密密钥不同 Obejct ,返回对象 target != result",function(){            
            var C = new Mcrypto("qwerasdfzxcv!@#$")
            var D = new Mcrypto("qwerasdfzxcv!@#w")
            var target = {name:"mod",hoppy:["swiming"]}
            var result = D.deCryptoStrToData(C.enCryptoDataToStr(target));
            assert.notDeepEqual(target,result)
        })            
    })
})