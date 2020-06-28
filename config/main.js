module.exports = {

    /*
     * 监听端口
     * */
    port: 8888,

    /*
     * 页面
     * */
    page: [
        {
            open: true,
            url: "getStatic",
            api: "v",
            intro: "静态信息获取",
            method: "POST"
        },
        {
            open: true,
            url: "crawler",
            api: "b",
            intro: "静态信息获取",
            method: "POST"
        },
        {
            open: true,
            url: "total",
            api: "c",
            intro: "行为统计",
            method: "POST"
        }
    ]
};