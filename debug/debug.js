
module.exports = {

    /*
     * 初始化
     * */
    config: null,
    init: function () {
        MiniDLPU.debug = this;
        MiniDLPU.tools.require("debug/static.js")(this);
        this.readConfig();
    },

    /*
     * 读取配置
     * */
    readConfig: function () {
        MiniDLPU.fs.read({
            url: "debug/config.json",
            success: (data)=>{
                let config = MiniDLPU.tools.jsonParse(data);
                if (!config) return console.log(
                    "无法解析debug配置文件:" + data
                );
                this.config = config;
                this.config.content = Object.keys(this.config.outputContent);
            }
        });
    },

    /*
     * 事件发送
     * */
    event: function (e, c, d) {

        /*
         * debug配置文件还没有读取
         * */
        if (this.config === null) return false;

        /*
         * 检验是否开启调试
         * */
        if(!this.config.debugger.value) return false;

        /*
         * 验证输出范围
         * */
        if(!e || !this.config.outputRange[this.EVENT[e]][c]) return false;

        let data = this.conLog(Object.assign({}, d, {
            time: new Date().toLocaleString(),
            why: MiniDLPU.debug.LOGEVENT[e],
            code: MiniDLPU.debug.CODE[c]
        }));

        console.log(data);

        // 发送socket
        if (this.socket) this.socket.send(data);

    },

    /*
     * 生成日志报告
     * */
    conLog: function (d) {
        let log = "";
        this.config.content.map((e)=>{
            log += d[e] ? (d[e] + " ") : "";
        });
        return log;
    }

};
