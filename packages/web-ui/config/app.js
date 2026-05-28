// 应用配置文件
// 支持环境变量覆盖，优先级：环境变量 > 配置文件 > 默认值

const defaultConfig = {
  // 服务器端口配置
  port: 4000,

  // API配置
  api: {
    // HTTP API 基础地址，如果设置了则优先使用，否则使用当前页面地址
    baseUrl: null,
  },
};

const config = {
  port: defaultConfig.port,

  api: {
    // ROBUSTMQ_API_URL takes precedence (full URL), then ROBUSTMQ_API_PORT (port only)
    baseUrl: process.env.ROBUSTMQ_API_URL || defaultConfig.api.baseUrl,
    port: process.env.ROBUSTMQ_API_PORT ? Number(process.env.ROBUSTMQ_API_PORT) : null,
  },

  // 导出默认配置供参考
  defaults: defaultConfig,
};

// 同时支持 CommonJS 和 ES 模块
export default config;
export const { port, api, defaults } = config;

// CommonJS 兼容
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
  module.exports.port = port;
  module.exports.api = api;
  module.exports.defaults = defaults;
}
