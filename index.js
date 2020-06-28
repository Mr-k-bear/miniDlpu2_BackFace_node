
/*
 * 项目全局对象
 * */
const MiniDLPU = global.MiniDLPU = {};

/*
 * 引入小工具
 * */
MiniDLPU.tools = require("./common/tool.js");

/*
 * 设置全局路径
 * */
MiniDLPU.tools.setGlobalPath(__dirname);

/*
 * 文件操作
 * */
require("./common/fs.js").init();

/*
 * 初始化debug模块
 * */
require("./debug/debug.js").init();

/*
 * 初始化消息组件
 * */
MiniDLPU.msg = require("./common/msg.js");

/*
 * 初始化统计组件
 * */
require("./total/total.js").init();

/*
 * 初始从服务器管理组件
 * */
require("./server/server.js").init();

/*
* page类
* */
MiniDLPU.Page = require("./common/pageClass.js");

/*
 * 启动服务器
 * */
require("./launcher.js").init();

/*
 * 开启debug信息输出socket模块
 * */
require("./debug/socket.js").init();