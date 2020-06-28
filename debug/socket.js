module.exports = {

    /*
     * 初始化
     * */
    init: function () {
        MiniDLPU.debug.socket = this;
        this.Socket = require('ws');
        this.ws = new this.Socket.Server(
            { server: MiniDLPU.http.ss }
        );
    },

    /*
     * 群发
     * */
    send: function (data) {

        // 初始化之前
        if (!this.ws) return false;

        this.ws.clients.forEach((client)=>{
            if (client.readyState === this.Socket.OPEN) {
                client.send(data);
            }
        });
    }
};