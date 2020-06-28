
module.exports = new MiniDLPU.Page({

    /*
     * 初始化
     * */
    init: function() {
        MiniDLPU.data.static = {};
        this.readData();
    },

    /*
     * 读取静态文件
     * */
    readData: function(){
        MiniDLPU.fs.read({
            url: "config/static.json",
            success: (d)=>{

                // 解析静态文件
                let data = MiniDLPU.tools.jsonParse(d);
                if (!data) return console.log(
                    "无法解析static文件:" + data
                );

                // 更新数据
                MiniDLPU.data.static = data;
            }
        })
    },

    /*
     * 写入静态文件
     * */
    writeData: function(){},

    /*
     * 请求处理
     * */
    request: function(req, res, data){

        /*
         * 错误：没有参数
         * */
        if(!data.postData || !data.postData.d) {
            MiniDLPU.msg.fail(res, 2);
            return MiniDLPU.debug.event(
                "gr", "fail", this.commonDebug(req, "没有参数")
            );
        }

        /*
         * 错误：参数太长
         * */
        if(data.postData.d.length > 10) {
            MiniDLPU.msg.fail(res, 3);
            return MiniDLPU.debug.event(
                "gr", "fail", this.commonDebug(req, "参数太长")
            );
        }

        /*
         * 成功：收集数据
         * */
        let resData = {};
        data.postData.d.split("").map((e)=>{
            if (MiniDLPU.data.static[e] && MiniDLPU.data.static[e].get){
                resData[e] = MiniDLPU.data.static[e].data;
            }
        });
        MiniDLPU.msg.success(res, resData);
        MiniDLPU.debug.event(
            "gr", "success", this.commonDebug(req, data.postData.d)
        );
    }
});