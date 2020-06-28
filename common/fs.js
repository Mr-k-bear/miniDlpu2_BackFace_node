module.exports = {

    /*
     * 初始化
     * */
    init: function () {
        MiniDLPU.fs = this;
        this.Fs = require("fs");
    },

    /*
     * 读
     * */
    read: function (e) {

        if (!e.url) return false;

        /*
         * 收集数据
         * */
        let option = {
            success: e.success || (()=>{}),
            fail: e.fail || (()=>{}),
            url: MiniDLPU.tools.path(e.url)
        };

        MiniDLPU.fs.Fs.readFile(
            option.url,
            "utf-8",
            (error, data) => {

                // 失败
                if (error){
                    option.fail(error);
                    return MiniDLPU.debug.event("fr", "fail", {
                        url: e.url,
                        data: error
                    })
                }

                // 成功
                option.success(data);
                return MiniDLPU.debug.event("fr", "success", {
                    url: e.url,
                })
            }
        );
    },

    /*
     * 写
     * */
    write: function (e) {

        if (!e.url || !e.data) return false;

        /*
         * 收集数据
         * */
        let option = {
            success: e.success || (()=>{}),
            fail: e.fail || (()=>{}),
            data: e.data || {},
            url: MiniDLPU.tools.path(e.url)
        };

        MiniDLPU.fs.Fs.writeFile(
            option.url,
            JSON.stringify(option.data),
            {flag:'w',encoding:'utf-8'},
            (error) => {

                // 失败
                if (error){
                    option.fail(error);
                    return MiniDLPU.debug.event("fw", "fail", {
                        url: e.url,
                        data: error
                    })
                }

                // 成功
                option.success();
                return MiniDLPU.debug.event("fw", "success", {
                    url: e.url,
                })
            }
        );
    }
};