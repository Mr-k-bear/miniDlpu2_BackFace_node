
/*
 * 依赖MD5库
 * */
const MD5Base64 = require("./MD5Base64");

/*
 * class MiniDLPUMath
 *
 * 这是一个数学库用来处理各种数学问题
 * 里面包含加密算法和签名算法的数学实现
 * */
class MiniDLPUMath{
    
    /*
     * @fun transformData(data) 自增算法
     * 这是一个特殊的自增运算
     * 用来增加数据的随机性
     *
     * @param data 自增数据
     * @return data 自增后的数据
     * */
    static transformData(data){
        let tmp0 = parseInt(data.toString().slice(-1));
        let tmp1 = parseInt(data.toString().slice(0, 1));
        return tmp0 + tmp1 + data;
    }

    /*
     * @fun creatAsciiList(seed, from, to, d10 = false) 通过种子打乱 Ascii 映射表
     *
     * @param seed 36进制种子
     * @param from 起始位置
     * @param to 结束位置
     * @param d10 强制转为10进制输入
     * @return encodeAsciiList 打乱后的映射表数组
     * */
    static creatAsciiList(seed, from, to, d10 = false){

        // 解析36进制种子
        seed = d10 ? seed : parseInt(seed, 36);

        // 创建完整映射表
        let allAscii = [];
        for (let i = from; i <= to; i++){
            allAscii.push(i);
        }

        // 加密映射表
        let listCount = allAscii.length, encodeAsciiList = [], tmp;
        for (let i = 0; i < listCount; i++){
            seed = this.transformData(seed);
            tmp = this.expandSeed(seed, 1, allAscii.length -1, true);

            // 添加映射表
            encodeAsciiList.push(allAscii[tmp[0]]);
            allAscii.splice(tmp[0], 1);
        }
        return encodeAsciiList;
    }

    /*
     * @fun expandSeed(seed, digit = 10, range = 10, d10 = false)
     * 跟据种子生成随机数列
     * 这个算法比较消耗性能，尽量减少调用次数
     *
     * @param seed 36进制种子
     * @param digit 生成数列个数
     * @param range 生成数列范围
     * @param d10 强制转为10进制输入
     * @return seedSq 生成的随机数列表
     * */
    static expandSeed(seed, digit = 10, range = 10, d10 = false){

        // 排除空数据
        if (!seed) return false;

        // 获取十进制基础数值与位数
        let seed10 = d10 ? seed : parseInt(seed, 36);
        let rangeDigit = range.toString().length + 1;

        // 对seed处理
        let seedSq = [];
        while (seedSq.length < digit) {

            // 开根号进行奇偶校验
            let tmp = "";
            while (tmp.length < 10 ) {
                seed10 = this.transformData(seed10);
                tmp = Math.sqrt(seed10).toString().replace(".", "");
                tmp = tmp.slice(0 , 10);
            }

            // 按位舍弃部分数值
            tmp = tmp.slice(-rangeDigit);
            tmp = tmp / Math.pow(10, rangeDigit) * range;
            tmp = Math.floor(tmp);
            seedSq.push(tmp);
        }
        return seedSq;
    }

    /*
     * @fun mapping(data, mod) 映射混淆
     * 跟据加密后的 Ascii 表混淆加密数据
     *
     * @param (string)data 需要处理的字符串
     * @param (array)key 混淆Ascii表
     * @param (string)mode (en|de) 模式，en表示加密 de表示解密
     * */
    static mapping(data, key, mod){

        // 排除空数据和错误选项
        if (!data) return false;
        if (mod !== 'en' && mod !== 'de') return false;

        let res = "";
        for (let i = 0; i < data.length; i++){

            let ascii = data[i].toString().charCodeAt(0), index;

            // 搜索
            if (mod === 'en') {
                index = key[ascii - 32];
            } else {
                index = key.indexOf(ascii) + 32;
            }

            // 找到了用映射数据没找到用源数据
            res += index === false ? data[i] : String.fromCodePoint(index);
        }

        return res;
    }

    /*
     * @fun sign(para, key, d10 = false) 签名算法
     * @param para 签名计算数据 注意顺序
     * @param key 密钥
     * @param d10 强制转为10进制输入
     * */
    static sign(paras, key, d10 = false){

        // 排除无参情况
        if(paras.length===0) return false;

        // 生成签名链表
        key = this.expandSeed(key, paras.length, 1024, d10);

        // 遍历连接
        let res="";
        for(let i = 0; i < paras.length; i++){

            // 对象转json
            if (typeof paras[i] === "object"){
                paras[i] = JSON.stringify(paras[i]);
            }

            // 混合密钥列表
            res += MD5Base64.hex_md5(paras[i].toString());
            res += "(-Mini-" + key[i] + "-Dlpu-)";
        }

        // MD5处理
        return MD5Base64.hex_md5(res);
    }

    /*
     * @fun ectopicCore(data, len, key) 异位加密的核心算法
     *
     * @param data 数据
     * @param len 键长
     * @param key 密钥
     * */
    static ectopicCore(data, len, key){
        let res = "";
        for (let i = 0; i < data.length; i++) {
            let k = i % len;
            res += String.fromCharCode(data[i].charCodeAt(0) ^ key[k].charCodeAt(0));
        }
        return res;
    }

    /*
     * @fun ectopic(data, key, mod, base64 = false) 异位加密算法
     * 这个算法用来异位加密处理数据
     *
     * @param (string)data 要处理的数据
     * @param (string)key 密钥
     * @param (en|de)mod 模式
     * @param (bool)base64 是否转为base64输出
     * */
    static ectopic(data, key, mod, base64 = false){

        // 排除空数据和错误选项
        if (!data || !key) return false;
        if (mod !== 'en' && mod !== 'de') return false;

        // 混入一些奇奇怪怪的东西 增加算法强度
        key += "MiniDlpu666";
        key += "nkusgd2jhbkjh4b509dfhnk*&%jbk3(*Yj{};l'";

        // 计算密钥签名
        let tmp = data;
        key = MD5Base64.hex_md5(key);
        let len = key.length;

        // 映射混淆表
        if (mod === 'en') {
            if (base64) tmp = MD5Base64.base64_encode(data);
            tmp = this.ectopicCore(tmp, len, key);
            if (base64) tmp = MD5Base64.base64_encode(tmp);
        } else {
            if (base64) tmp = MD5Base64.base64_decode(data);
            tmp = this.ectopicCore(tmp, len, key);
            if (base64) tmp = MD5Base64.base64_decode(tmp);
        }

        return tmp;
    }

    /*
     * @fun pack (data, key, mod) 数据包封包与解包
     * 这个函数用于将数据封装成数据包
     * 和反向解包的运算
     *
     * @param (string)data 要处理的数据
     * @param (array)key 混淆表
     * @param (string)keys 异位密钥
     * @param (en|de)mod 模式
     * */
    static pack(data, key, keys, mod){

        // 排除空数据和错误选项
        if (!data || !key) return false;
        if (mod !== 'en' && mod !== 'de') return false;

        // 映射混淆表
        let tmp;
        if (mod === 'en') {
            tmp = MD5Base64.base64_encode(data);
            tmp = this.mapping(tmp, key, 'en');
            tmp = this.ectopic(tmp, keys, 'en');
            tmp = MD5Base64.base64_encode(tmp);
        } else {
            tmp = MD5Base64.base64_decode(data);
            tmp = this.ectopic(tmp, keys, 'de');
            tmp = this.mapping(tmp, key, 'de');
            tmp = MD5Base64.base64_decode(tmp);
        }

        return tmp;
    }

    /*
     * @fun checkMD5 (data, initial = 126) md5加权校验算法
     * 这个算法用来校验一个MD5值的真伪
     * 但是由于验证位数的局限性
     * 有1/255的概率让假的MD5通过算法
     * 这个算法里使用16进制是为了混淆真正的MD5值
     *
     * @param data 要验证的MD5
     * @param initial 起始相位
     * */
    static checkMD5 (data, initial = 126){

        // 排除空选项
        if (!data) return false;

        // 固定相位
        initial += 113;

        // 加权求和
        for (let i = 0; i < data.length; i++){
            let tmp = parseInt(data[i], 16);
            initial += Math.pow(tmp, 2) - 13;
        }

        initial = initial.toString(16);
        return initial.slice(-2);
    }
}

module.exports = MiniDLPUMath;