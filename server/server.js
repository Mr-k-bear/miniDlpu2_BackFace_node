module.exports = {

    /*
     * 初始化
     * */
    init: function () {
        MiniDLPU.server = {};
        this.data = null;
        this.config = null;
        this.readData();
        this.readConfig();
    },

    /*
     * 读取配置
     * */
    readConfig: function () {
        MiniDLPU.fs.read({
            url: "server/config.json",
            success: (data)=>{
                let config = MiniDLPU.tools.jsonParse(data);
                if (!config) return console.log(
                    "无法解析server配置文件:" + data
                );
                this.config = config;
            }
        });
    },

    /*
     * 读取存档
     * */
    readData: function () {
        MiniDLPU.fs.read({
            url: "server/data.json",
            success: (data)=>{
                let server = MiniDLPU.tools.jsonParse(data);
                if (!server) return console.log(
                    "无法解析total存档文件:" + data
                );
                this.data = server;
            }
        });
    },

    /*
     * 写入存档
     * */
    writeData: function(){

        // 排除空数据
        if (!this.data) return false;

        // console.log("runing writeData function");
        MiniDLPU.fs.write({
            url: "server/data.json",
            data: this.data,
            success: ()=>{}
        });
    },
};