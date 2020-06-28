
module.exports = (e)=>{

    /*
     * 静态数据定义
     * */
    e.EVENT = {
        fr: "fileRead",
        fw: "fileWrite",
        ar: "apiRequest",
        gr: "getRequest",
        cr: "crawlerRequest",
        sr: "statisticsRequest",
        rr: "rootRequest"
    };

    /*
     * 中文
     * */
    e.LOGEVENT = {
        fr: "文件读取",
        fw: "文件写入",
        ar: "网络请求",
        gr: "内容获取请求",
        cr: "爬虫业务",
        sr: "统计请求",
        rr: "后台请求"
    };

    e.CODE = {
        success: "成功",
        fail: "失败"
    }

};
