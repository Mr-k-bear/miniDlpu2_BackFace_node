<?php

/*
 * 引入数据处理库
 * */
include "MiniDLPUMath.php";

/*
 * 假设这是通信的数据
 * */
$data = json_encode(array("key1" => "data1", "key2" => "中文"));

/*
 * 随机数生成密钥本
 * */
$key = MiniDLPUMath::creatAsciiList('j9d', 32, 126);

echo "--混合加密算法--</br>";
echo "密文：".MiniDLPUMath::pack($data, $key, 'j9d', 'en');
echo "</br>";
echo "明文：".MiniDLPUMath::pack("cz1cJWdBHnZlKBBCYXZZHUcJBRgJSFdwZRBAO2VzER5DOABNZwgDTU44WlxbBy13aGoYOQ==", $key, 'j9d', "de");

echo "</br></br></br>";

echo "--异位加密算法--</br>";
echo "密文：".MiniDLPUMath::ectopic("1234qwe12398*.sdf", "ki9", 'en', true);
echo "</br>";
echo "明文：".MiniDLPUMath::ectopic("LGNwSy94JFE+bXcaehlTDS1dDBs/JW9Z", "ki9", 'de', true);

echo "</br></br></br>";

echo "--混淆加密算法--</br>";
echo "密文：".MiniDLPUMath::mapping("1234qwe12398*.sdf", $key, 'en');
echo "</br>";
echo "明文：".MiniDLPUMath::mapping("BdEt 5FBdEL=bpVP+", $key, 'de');

echo "</br></br></br>";

echo "--签名算法--</br>";
echo MiniDLPUMath::sign(["a", "b", "ccc", "dd", "***.", "123"], "ju8");

echo "</br></br></br>";

echo "--签名校验--</br>";
echo MiniDLPUMath::checkMD5("3e80c7d970204c2fc0032e44c5785943");