
module.exports = {

    /*
     * 初始化
     * */
    init: function () {
        MiniDLPU.http = this;
        MiniDLPU.data = {};
        this.Http = require('http');
        this.Querystring = require('querystring');
        this.readConfig();
        this.ss = new this.Http.Server();
        this.collect();
        this.deploy();
        this.ss.listen(this.config.port, '0.0.0.0');
    },

    /*
     * 读取配置文件
     * */
    readConfig: function () {
        this.config = MiniDLPU.tools.require("config/main.js");
    },

    /*
     * 收集页面监听器
     * */
    collect: function(){
        this.page = {};
        let config = this.config.page;

        //处理全部
        config.map((e)=>{
            this.page[e.api] = MiniDLPU.tools.require(
                "/page/"+ e.url + ".js"
            );
            this.page[e.api].config(e);
            this.page[e.api].init();
        });
    },

    /*
     * 部署
     * */
    deploy: function(){
        this.ss.on("request", (req, res)=>{

            /*
             * 统计数据
             * */
            MiniDLPU.total.event("a");

            /*
             * 通用请求头
             * */
            this.commonHeader(res);

            /*
             * 开启跨域模式
             * */
            this.originHeader(res);

            /*
             * 获取url中的api
             * */
            let urlData = req.url.split("/").filter((e)=>e);
            let url = urlData.shift();

            /*
             * 404处理
             * */
            if(!url || url.length!==1 || !this.page[url]){
                return this.notFound(
                    res, url,
                    req.connection.remoteAddress
                );
            }

            /*
             * 强制使用POST请求
             * */
            if (req.method !== this.page[url].config().method){
                return this.getRequest(
                    res, url,
                    req.connection.remoteAddress,
                    req.method
                );
            }

            if (this.page[url].config().open){

                /*
                 * 接受POST数据
                 * */
                let postData = "";
                req.on('data', (e)=>{postData += e});

                /*
                 * 页面响应
                 * */
                req.on('end', ()=>{
                    this.page[url].request(req, res, {
                        url: url,
                        par: urlData,
                        postData: this.Querystring.parse(postData),
                        config: this.page[url].config()
                    });

                });
                return false

            }

            res.end();
        })
    },

    /*
     * 404
     * */
    notFound: function (e, u, i) {
        e.statusCode = 404;
        e.end();
        MiniDLPU.debug.event("ar", "fail", {
            url: u,
            data: "无效的api",
            ip: i
        });
    },

    /*
     * 403
     * */
    getRequest: function (e, u, i, m) {
        e.statusCode = 403;
        e.end();
        MiniDLPU.debug.event("ar", "fail", {
            url: u,
            data: m + "方法被拦截",
            ip: i
        });
    },

    /*
     * 基础请求头
     * */
    commonHeader: function (e) {
        e.setHeader("server", "MiniDLPU/1.0.0");
    },

    /*
     * 跨域请求头
     *
     * 调试时使用
     * */
    originHeader: function (res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
        res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.setHeader("X-Powered-By", ' 3.2.1');
        res.setHeader("Content-Type", "application/json;charset=utf-8");
    }
};