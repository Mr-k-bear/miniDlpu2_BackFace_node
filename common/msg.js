module.exports = {

    /*
     * 成功
     * */
    success: function (e, d, m = "") {

        /*
         * 统计数据
         * */
        MiniDLPU.total.event("s");
        e.end(JSON.stringify({
            code: 1,
            msg: m,
            data: d
            }
        ));
    },

    /*
     * 失败
     * */
    fail: function (e, c, m = "") {

        /*
         * 统计数据
         * */
        MiniDLPU.total.event("f");
        e.end(JSON.stringify({
                code: c,
                msg: m
            }
        ));
    }

};