<?php
/*
 * class MiniDLPUMath
 *
 * 这是一个数学库用来处理各种数学问题
 * 里面包含加密算法和签名算法的数学实现
 * */
class MiniDLPUMath{

    /*
     * @array $E_CODE_LIST 密文映射列表
     * 这个数组不用手动写入
     * 由 creatAsciiList 创建
     * 用于混淆加密数据
     * */
    public static $E_CODE_LIST = [];

    /*
     * @fun transformData($data) 自增算法
     * 这是一个特殊的自增运算
     * 用来增加数据的随机性
     *
     * @param $data 自增数据
     * @return $data 自增后的数据
     * */
    private static function transformData($data){
        $tmp0 = (int)substr((string)$data, -1);
        $tmp1 = (int)substr((string)$data, 0, 1);
        return $tmp0 + $tmp1 + $data;
    }

    /*
     * @fun creatAsciiList($seed, $from, $to, $d10 = false) 通过种子打乱 Ascii 映射表
     *
     * @param $seed 36进制种子
     * @param $from 起始位置
     * @param $to 结束位置
     * @param $d10 强制转为10进制输入
     * @return $encodeAsciiList 打乱后的映射表数组
     * */
    public static function creatAsciiList($seed, $from, $to, $d10 = false){

        // 解析36进制种子
        $seed = $d10 ? $seed : base_convert($seed, 36, 10);

        // 创建完整映射表
        $allAscii = [];
        for ($i = $from; $i <= $to; $i++){
            array_push($allAscii, $i);
        }

        // 加密映射表
        $listCount = count($allAscii); $encodeAsciiList = [];
        for ($i = 0; $i < $listCount; $i++){
            $seed = self::transformData($seed);
            $tmp = self::expandSeed($seed, 1, count($allAscii) -1, true);

            // 添加映射表
            array_push($encodeAsciiList, $allAscii[$tmp[0]]);
            array_splice($allAscii, $tmp[0], 1);
        }
        return $encodeAsciiList;
    }

    /*
     * @fun expandSeed($seed, $digit = 10, $range = 10, $d10 = false)
     * 跟据种子生成随机数列
     * 这个算法比较消耗性能，尽量减少调用次数
     *
     * @param $seed 36进制种子
     * @param $digit 生成数列个数
     * @param $range 生成数列范围
     * @param $d10 强制转为10进制输入
     * @return $seedSq 生成的随机数列表
     * */
    private static function expandSeed($seed, $digit = 10, $range = 10, $d10 = false){

        // 排除空数据
        if (!$seed) return false;

        // 获取十进制基础数值与位数
        $seed10 = $d10 ? $seed : base_convert($seed, 36, 10);
        $rangeDigit = strlen((string)$range) + 1;

        // 对seed处理
        $seedSq = [];
        while (count($seedSq) < $digit) {

            // 开根号进行奇偶校验
            $tmp = "";
            while (strlen($tmp) < 10 ) {
                $seed10 = self::transformData($seed10);
                $tmp = str_replace(".", "", (string)sqrt($seed10));
                $tmp = substr($tmp, 0 , 10);
            }

            // 按位舍弃部分数值
            $tmp = substr($tmp, -$rangeDigit);
            $tmp = $tmp / pow(10, $rangeDigit) * $range;
            $tmp = intval($tmp);
            array_push($seedSq, $tmp);
        }
        return $seedSq;
    }

    /*
     * @fun mapping($data, $mod) 映射混淆
     * 跟据加密后的 Ascii 表混淆加密数据
     *
     * @param (string)$data 需要处理的字符串
     * @param (array)$key 混淆Ascii表
     * @param (string)$mode (en|de) 模式，en表示加密 de表示解密
     * */
    public static function mapping($data, $key, $mod){

        // 排除空数据和错误选项
        if (!$data) return false;
        if ($mod != 'en' && $mod != 'de') return false;

        $res = "";
        for ($i = 0; $i < strlen($data); $i++){

            $ascii = ord($data[$i]);

            // 搜索
            if ($mod == 'en') {
                $index = $key[$ascii - 32];
            } else {
                $index = array_search($ascii, $key) + 32;
            }

            // 找到了用映射数据没找到用源数据
            $res .= $index === false ? $data[$i] : chr($index);
        }

        return $res;

    }

    /*
     * @fun sign($para, $key, $d10 = false) 签名算法
     * @param $para 签名计算数据 注意顺序
     * @param $key 密钥
     * @param $d10 强制转为10进制输入
     * */
    static function sign($paras, $key, $d10 = false){

        // 排除无参情况
        if(count($paras)==0) return false;

        // 生成签名链表
        $key = self::expandSeed($key, count($paras), 1024, $d10);

        // 遍历连接
        $res="";
        for($i = 0; $i < count($paras); $i++){

            // 对象转json
            if (is_object($paras[$i]) || is_array($paras[$i])) {
                $paras[$i] = json_encode($paras[$i]);
            }

            // 混合密钥列表
            $res .= md5((string)$paras[$i]);
            $res .= "(-Mini-".$key[$i]."-Dlpu-)";
        }

        // MD5处理
        return md5($res);
    }

    /*
     * @fun ectopicCore($data, $len, $key) 异位加密的核心算法
     *
     * @param $data 数据
     * @param $len 键长
     * @param $key 密钥
     * */
    private static function ectopicCore($data, $len, $key){
        $res = "";
        for ($i = 0; $i < strlen($data); $i++) {
            $k = $i % $len;
            $res .= $data [$i] ^ $key [$k];
        }
        return $res;
    }

    /*
     * @fun ectopic($data, $key, $mod, $base64 = false) 异位加密算法
     * 这个算法用来异位加密处理数据
     *
     * @param (string)$data 要处理的数据
     * @param (string)$key 密钥
     * @param (en|de)$mod 模式
     * @param (bool)$base64 是否转为base64输出
     * */
    public static function ectopic($data, $key, $mod, $base64 = false){

        // 排除空数据和错误选项
        if (!$data || !$key) return false;
        if ($mod != 'en' && $mod != 'de') return false;

        // 混入一些奇奇怪怪的东西
        $key .= "MiniDlpu666";
        $key .= "nkusgd2jhbkjh4b509dfhnk*&%jbk3(*Yj{};l'";

        // 计算密钥签名
        $tmp = $data;
        $key = md5($key);
        $len = strlen($key);

        // 映射混淆表
        if ($mod == 'en') {
            if ($base64) $tmp = base64_encode($data);
            $tmp = self::ectopicCore($tmp, $len, $key);
            if ($base64) $tmp = base64_encode($tmp);
        } else {
            if ($base64) $tmp = base64_decode($data);
            $tmp = self::ectopicCore($tmp, $len, $key);
            if ($base64) $tmp = base64_decode($tmp);
        }

        return $tmp;
    }

    /*
     * @fun pack ($data, $key, $mod) 数据包封包与解包
     * 这个函数用于将数据封装成数据包
     * 和反向解包的运算
     *
     * @param (string)$data 要处理的数据
     * @param (array)$key 混淆表
     * @param (string)$keys 异位密钥
     * @param (en|de)$mod 模式
     * */
    public static function pack ($data, $key, $keys, $mod){

        // 排除空数据和错误选项
        if (!$data || !$key) return false;
        if ($mod != 'en' && $mod != 'de') return false;

        // 映射混淆表
        if ($mod == 'en') {
            $tmp = base64_encode($data);
            $tmp = self::mapping($tmp, $key, 'en');
            $tmp = self::ectopic($tmp, $keys, 'en');
            $tmp = base64_encode($tmp);
        } else {
            $tmp = base64_decode($data);
            $tmp = self::ectopic($tmp, $keys, 'de');
            $tmp = self::mapping($tmp, $key, 'de');
            $tmp = base64_decode($tmp);
        }

        return $tmp;
    }

    /*
     * @fun checkMD5 ($data, $initial = 126) md5加权校验算法
     * 这个算法用来校验一个MD5值的真伪
     * 但是由于验证位数的局限性
     * 有1/255的概率让假的MD5通过算法
     * 这个算法里使用16进制是为了混淆真正的MD5值
     *
     * @param $data 要验证的MD5
     * @param $initial 起始相位
     * */
    public static function checkMD5 ($data, $initial = 126){

        // 排除空选项
        if (!$data) return false;

        // 固定相位
        $initial += 113;

        // 加权求和
        for ($i = 0; $i < strlen($data); $i++){
            $tmp = base_convert($data[$i], 16, 10);
            $initial += pow((int)$tmp, 2) - 13;
        }

        $initial = (string)base_convert($initial, 10, 16);
        return substr($initial, -2);
    }
}