const {join} = require('path');

module.exports = {

    /*
     * JSON解析
     * */
    jsonParse: function (e) {
        let data = null;
        try {
            data = JSON.parse(e);
        } catch (e) {
            return false;
        }
        return data;
    },

    /*
     * 统一路径
     * */
    setGlobalPath: function(e){
        MiniDLPU.GlobalPath = e;
    },
    path: function (e) {
        return join(MiniDLPU.GlobalPath, e);
    },
    require: function (e) {
        return require(MiniDLPU.tools.path(e));
    }

};