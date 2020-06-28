module.exports = {

    /*
     * 初始化
     * */
    init: function () {
        MiniDLPU.total = this;
        this.data = null;
        this.config = null;
        this._writing = false;
        this.readConfig();
        this.readData();
    },

    /*
     * 定时器
     * */
    timeOut: function() {

        // 正在写入
        if (this._writing) return false;
        this._writing = true;

        setTimeout(() => {
            this.writeData();
        }, 1000);
    },

    /*
     * 读取配置
     * */
    readConfig: function () {
        MiniDLPU.fs.read({
            url: "total/config.json",
            success: (data)=>{
                let config = MiniDLPU.tools.jsonParse(data);
                if (!config) return console.log(
                    "无法解析total配置文件:" + data
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
            url: "total/data.json",
            success: (data)=>{
                let total = MiniDLPU.tools.jsonParse(data);
                if (!total) return console.log(
                    "无法解析total存档文件:" + data
                );
                this.data = total;
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
            url: "total/data.json",
            data: this.data,
            success: ()=>{
                this._writing = false;
            }
        });
    },

    /*
     * 事件响应
     * */
    event: function (e) {

        // 存档或配置还没读取
        if (!this.config || !this.data) return false;

        // 存在且打开
        if (!this.config.project[e] || !this.config.project[e].open) return false;

        // 判断data是否有该键
        if (!this.data[e]) this.data[e] = 0;

        // 计算
        this.data[e]++;

        // 存档
        this.timeOut();
    }
};