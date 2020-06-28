
/*
 * 依赖MD5库
 * */
const MiniDLPUMath = require("./MiniDLPUMath");

/*
 * 假设这是通信的数据
 * */
let data= JSON.stringify({key1: "data1", key2: "中文"});

/*
 * 随机数生成密钥本
 * */
let key = MiniDLPUMath.creatAsciiList('j9d', 32, 126);

console.log("--混合加密算法--");
console.log("密文："+MiniDLPUMath.pack(data, key, 'j9d', 'en'));
console.log("明文："+MiniDLPUMath.pack("cz1cJWdBHnZlKBBCYXZZHUcJBRgJSFdwZRBAO2VzER5DOABNZwgDTU44WlxbBy13aGoYOQ==", key, 'j9d', "de"));

console.log("\n");

console.log("--异位加密算法--");
console.log("密文："+MiniDLPUMath.ectopic("1234qwe12398*.sdf", "ki9", 'en', true));
console.log("明文："+MiniDLPUMath.ectopic("LGNwSy94JFE+bXcaehlTDS1dDBs/JW9Z", "ki9", 'de', true));

console.log("\n");

console.log("--混淆加密算法--");
console.log("密文："+MiniDLPUMath.mapping("1234qwe12398*.sdf", key, 'en'));
console.log("明文："+MiniDLPUMath.mapping("BdEt 5FBdEL=bpVP+", key, 'de'));

console.log("\n");

console.log("--签名算法--");
console.log(MiniDLPUMath.sign(["a", "b", "ccc", "dd", "***.", "123"], "ju8"));

console.log("\n");

console.log("--签名校验--");
console.log(MiniDLPUMath.checkMD5("3e80c7d970204c2fc0032e44c5785943"));