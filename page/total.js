
module.exports = new MiniDLPU.Page({

    /*
     * 初始化
     * */
    init: function() {

    },

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
                "sr", "fail", this.commonDebug(req, "没有参数")
            );
        }

        /*
         * 错误：参数太长
         * */
        if(data.postData.d.length > 10) {
            MiniDLPU.msg.fail(res, 3);
            return MiniDLPU.debug.event(
                "sr", "fail", this.commonDebug(req, "参数太长")
            );
        }

        /*
         * 成功
         * */
        data.postData.d.split("").map((e)=>{
            MiniDLPU.total.event(e);
        });
        MiniDLPU.msg.success(res, "ok");
        MiniDLPU.debug.event(
            "sr", "success", this.commonDebug(req, data.postData.d)
        );

    }

});