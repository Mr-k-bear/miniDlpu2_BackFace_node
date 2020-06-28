const page = function (e) {
    Object.assign(this, e)
};

page.prototype = {

    /*
     * 设置配置
     * */
    config: function (e = false) {
        if (e) this.__config = e;
        return this.__config;
    },

    /*
    * 共用调试信息
    * */
    commonDebug: function(req, d){
        return {
            url: this.config().url,
            ip: req.connection.remoteAddress,
            data: d
        }
    },

};

module.exports = page;