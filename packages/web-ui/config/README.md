# 配置文件说明

## 概述

Web UI 项目使用配置文件来管理各种设置，支持环境变量覆盖。

## 配置文件

### `app.js` - 主配置文件

包含以下配置项：

- `port` - 服务器端口（默认：4000）
- `api.baseUrl` - 完整 API 地址，优先级最高（通过 `ROBUSTMQ_API_URL` 设置）
- `api.port` - 仅指定 API 端口，hostname 自动使用当前页面的 hostname（通过 `ROBUSTMQ_API_PORT` 设置）

## 环境变量

### 只指定端口（推荐，适合多机器访问）

hostname 自动跟随访问页面的 IP/域名，无需硬编码 IP：

```bash
ROBUSTMQ_API_PORT=58080 pnpm ui:dev
```

### 指定完整 URL（适合固定后端地址）

```bash
ROBUSTMQ_API_URL=http://192.168.1.100:58080 pnpm ui:dev
```

## 配置优先级

1. `ROBUSTMQ_API_URL` — 完整 URL，最高优先级
2. `ROBUSTMQ_API_PORT` — 仅端口，hostname 取当前页面
3. 默认 `http://localhost:58080`

## 运行时注入

`public/config.js` 在启动时自动生成，浏览器加载后挂载到 `window.__APP_CONFIG__`。
可在浏览器控制台执行 `window.__APP_CONFIG__` 查看当前生效的配置。
