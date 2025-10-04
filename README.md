# 项目：OOBE 产品介绍网站

以微软 OOBE 形式展示产品信息，支持后台动态管理页数与内容，并提供“PPT/画布式”设计器。前端包含页面切换动画与 Fluent（蓝白）风格。
> 重要必读（避免 ENOENT）
> - 请不要在项目根目录直接执行 npm run ...（根目录没有 package.json）。
> - 应分别进入 backend/ 与 frontend/ 目录执行各自的 npm 脚本。
> - 如果在根目录看到类似“ENOENT: no such file or directory, open '...\\package.json'”，请切换到对应子目录再执行命令。

## TL;DR 快速启动（开发）

后端（终端 A）
```powershell
cd .\backend
npm install
npm run start:dev
```

前端（终端 B）
```powershell
cd ..\frontend
npm install
npm run dev
```

打开
- OOBE： http://localhost:3001/oobe/1
- 管理后台： http://localhost:3001/admin

提示
- 后端固定监听 3000（见 [backend/src/main.ts](backend/src/main.ts:1)）。
- 前端如 3000 被占用，会提示并改用 3001。

## 一键开启两个终端（PowerShell，可选）

在项目根目录执行以下两行，会分别启动后端与前端的独立 PowerShell 窗口并保持打开：

```powershell
Start-Process powershell -ArgumentList '-NoExit','-Command','cd .\backend; npm install; npm run start:dev'
Start-Process powershell -ArgumentList '-NoExit','-Command','cd .\frontend; npm install; npm run dev'
```

或使用绝对路径（适用于你的当前环境）：
```powershell
Start-Process powershell -ArgumentList '-NoExit','-Command','cd C:\Users\VE\Desktop\project-welcome-xiya\backend; npm install; npm run start:dev'
Start-Process powershell -ArgumentList '-NoExit','-Command','cd C:\Users\VE\Desktop\project-welcome-xiya\frontend; npm install; npm run dev'
```

## 常见错误快速修复

- ENOENT: cannot find package.json
  - 原因：在根目录执行了 npm run ...
  - 处理：分别进入 backend/ 或 frontend/ 目录再执行命令，例如：
    ```powershell
    cd .\backend
    npm run start:dev
    ```
    ```powershell
    cd .\frontend
    npm run dev
    ```

## 技术栈
- 后端：NestJS + Prisma（SQLite），REST API，端口 3000，前缀 /api/v1
- 前端：Next.js（App Router）+ Ant Design v5，端口通常为 3001（如 3000 被占用则自动 3001）
- 语言：TypeScript

## 目录结构
```
.
├─ backend/              # NestJS 后端
│  ├─ src/               # 业务代码（控制器/服务/模块）
│  ├─ prisma/            # Prisma schema、migrations、dev.db
│  └─ .env               # 数据库连接（SQLite）
└─ frontend/             # Next.js 前端
   └─ src/app/           # App Router 页面与样式
```

关键文件：
- 后端入口与 CORS：[backend/src/main.ts](backend/src/main.ts:1)
- OOBE 资源（控制器/服务）：[backend/src/oobe/oobe.controller.ts](backend/src/oobe/oobe.controller.ts:1)、[backend/src/oobe/oobe.service.ts](backend/src/oobe/oobe.service.ts:1)
- Prisma 模型与映射：[backend/prisma/schema.prisma](backend/prisma/schema.prisma:1)
- 前端 OOBE 展示页（含动画）：[frontend/src/app/oobe/[step]/page.tsx](frontend/src/app/oobe/%5Bstep%5D/page.tsx:1)
- 前端 OOBE 设计器页：[/frontend/src/app/admin/designer/[id]/page.tsx](frontend/src/app/admin/designer/%5Bid%5D/page.tsx:1)
- 全局样式（Fluent 风格与过渡动画）：[frontend/src/app/globals.css](frontend/src/app/globals.css:1)
- 兼容层（开发警告处理）：[frontend/src/app/compat-provider.tsx](frontend/src/app/compat-provider.tsx:1)
- 布局入口：[frontend/src/app/layout.tsx](frontend/src/app/layout.tsx:1)

## 环境要求（Windows 11 推荐）
- Node.js 18.x 或 20.x
- npm 9+（或使用 pnpm/yarn，但脚本示例使用 npm）

## 快速启动（开发环境）

1) 安装依赖

在两个终端分别执行：

后端（终端 A）

```
cd .\backend
npm install
```

前端（终端 B）

```
cd ..\frontend
npm install
```

2) 启动服务

后端（终端 A）

```
npm run start:dev
```

前端（终端 B）

```
npm run dev
```

3) 打开页面
- 产品 OOBE： http://localhost:3001/oobe/1
- 管理后台： http://localhost:3001/admin

注意：如果前端占用端口 3000，则 Next.js 会自动使用 3001；后端固定监听 3000。

## 后端配置说明

- 数据库连接位于 [.env](backend/.env:1)，默认 SQLite，例如：

```
DATABASE_URL="file:./prisma/dev.db"
```

- 初次或更新 Prisma 模型后，可运行：

```
cd .\backend
npx prisma migrate dev
npx prisma generate
```

- API 基础地址（前端使用）： http://localhost:3000/api/v1

- 已启用 CORS，默认允许 http://localhost:3001 访问（见 [main.ts](backend/src/main.ts:1)）。

## 前端功能与配置

- OOBE 展示页会解析后端的 content 字段：
  - 新结构：`{ canvas: { width, height, backgroundUrl }, blocks: Block[] }`
  - 旧结构：`Block[]`（仅块数组，向后兼容）
- 画布宽高与背景图在展示页生效：
  - 卡片宽度遵循 `canvas.width` 像素，且 `max-width: 95vw`，以适配不同屏幕。
  - 内部画布按 `aspect-ratio: canvas.width / canvas.height` 保持比例，背景图 `cover + center`。
- 页面切换动画：
  - 点击 Next 时：当前页“向左滑出”，新页“从右滑入”。
  - 点击 Previous 时：当前页“向右滑出”，新页“从左滑入”。
  - 动画样式定义见 [globals.css](frontend/src/app/globals.css:170)；逻辑触发见 [OOBE 页面](frontend/src/app/oobe/%5Bstep%5D/page.tsx:80,frontend/src/app/oobe/%5Bstep%5D/page.tsx:125)。
- Fluent UI 风格调优：全局字体、卡片、按钮样式见 [globals.css](frontend/src/app/globals.css:1)。

## 管理后台使用指南

- 入口： http://localhost:3001/admin
- 列表页支持增删改查 OOBE 页面：
  - 新建/编辑时填写：pageNumber（页码）、title（标题）、content（文本或 JSON）。
  - “Design” 按钮可打开设计器。
- 设计器（画布式）：
  - 访问示例：`/admin/designer/1`（将 1 替换为具体页面 id）
  - 支持拖拽块（title/text/image）、编辑文本（contentEditable）、调整属性（x/y/w/h/image URL）。
  - Canvas 面板可设置画布宽度、高度与背景图片 URL。
  - 保存后后端 content 字段会存储为 JSON：`{ canvas, blocks }`。
- 展示页会按百分比渲染块的位置与尺寸，确保不同设备下视觉一致。

## 常见问题与排查

1) 前端端口不是 3001？
   - Next.js 默认 3000，如被后端占用会自动切换到 3001。请以终端提示为准。

2) CORS 报错（跨域）？
   - 确认后端已允许前端来源（见 [backend/src/main.ts](backend/src/main.ts:1)）。
   - 如前端端口不是 3001，请调整后端 CORS origin。

3) 内容保存后展示不生效？
   - 确认设计器保存后 content 为新结构：`{ canvas, blocks }`。
   - 刷新页面或检查浏览器网络请求是否成功。

4) AntD 兼容提示（React 19）？
   - 开发环境已通过 [compat-provider.tsx](frontend/src/app/compat-provider.tsx:1) 过滤特定警告。
   - 可按官方指南升级兼容包以彻底移除提示。

5) 开发覆盖样式导致卡片宽度固定？
   - 全局 `.oobe-card` 已改为 `width: auto; max-width: 95vw`，具体宽度由展示页内联样式控制。

## 常用脚本

后端：
```
cd .\backend
npm run start:dev
npm run build
npm run start:prod
```

前端：
```
cd .\frontend
npm run dev
npm run build
npm run start
```

## 部署建议（概述）

- 后端：
  - 数据库可换为 PostgreSQL/MySQL 并更新 [schema.prisma](backend/prisma/schema.prisma:1) 与 .env。
  - 生产环境建议开启 HTTPS 与严格 CORS。
- 前端：
  - 将 API 基础地址改为环境变量（例如 `NEXT_PUBLIC_API_BASE`），并在构建时注入。
  - 使用静态资源 CDN 提升背景图片加载速度。

## 访问入口一览
- OOBE 第 1 页： http://localhost:3001/oobe/1
- 管理后台： http://localhost:3001/admin
- 设计器（示例）： http://localhost:3001/admin/designer/1

## 许可

本项目用于演示与内部评估，无特殊开源许可声明。请在生产环境遵循相关合规与安全要求。
## 部署环境需求（生产，详细）

为确保在生产环境稳定运行，建议按以下要求规划服务器与软件版本。以下内容以 Windows Server 2022/Windows 11 23H2 为重点，并兼顾 Linux（Ubuntu 22.04 LTS）参考。

### 1. 操作系统与硬件
- 操作系统（其一即可）：
  - Windows Server 2022（推荐）或 Windows 11 23H2（Build 22631）
  - Ubuntu Server 22.04 LTS（参考配置）
- CPU/RAM/磁盘（最小/建议）：
  - 最小：2 vCPU，4 GB RAM，NVMe SSD ≥ 20 GB（含应用与日志；数据库单独评估）
  - 建议：4 vCPU，8–16 GB RAM，NVMe SSD ≥ 50 GB（更佳 I/O 与并发）
- 网络与端口：
  - 外部端口：80（HTTP）、443（HTTPS）
  - 内部应用端口（默认）：后端 3000、前端 3001（也可同为 3000/3001，自行统一）
  - 生产推荐通过反向代理将外网请求统一到 80/443，然后转发到内部 3000/3001

### 2. 运行时与包管理
- Node.js：v20 LTS（推荐）或 v18 LTS
- npm：v9+（或 pnpm/yarn，示例使用 npm）
- Python ≥ 3.8（可选，用于某些构建场景或 CI 环境）
- 证书工具：OpenSSL（或系统证书管理），用于生成/安装 TLS 证书

### 3. 数据库（生产）
- 生产不建议使用 SQLite（在 [backend/prisma/schema.prisma](backend/prisma/schema.prisma:1) 默认是 SQLite 便于开发）
- 推荐使用：
  - PostgreSQL 14+/15+（首选）
  - 或 MySQL 8.0+/MariaDB 10.6+
- Prisma datasource（示例 Postgres）：
  ```
  // schema.prisma 中 datasource（示例）
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```
- 生产 .env（后端）示例（见 [.env](backend/.env:1)）：
  ```
  # PostgreSQL 示例
  DATABASE_URL="postgresql://user:password@db-host:5432/oobe?schema=public"
  # 后端端口（可选，如不设则用代码内默认）
  PORT=3000
  # 允许的前端来源（CORS）
  FRONTEND_ORIGIN="https://your-frontend-domain.com"
  ```
- 迁移与生成（部署机首次）：
  ```
  cd .\backend
  npx prisma migrate deploy
  npx prisma generate
  ```

### 4. 后端服务（NestJS）
- 构建与启动（生产模式）：
  ```
  cd .\backend
  npm ci
  npm run build
  # Windows 设置环境变量（PowerShell）
  $env:PORT=3000
  npm run start:prod
  ```
- CORS 与全局前缀（见 [backend/src/main.ts](backend/src/main.ts:1)）：
  - 默认允许开发源 http://localhost:3001
  - 生产需改为你的正式域名（FRONTEND_ORIGIN 环境变量或直接在代码中替换）
- 进程管理：
  - Windows：PM2（Node 进程常驻），安装 `npm i -g pm2`
    ```
    pm2 start "npm run start:prod" --name "oobe-backend" --cwd "C:\Users\VE\Desktop\project-welcome-xiya\backend"
    pm2 save
    pm2 startup
    ```
  - Linux：systemd（或 PM2），建议启用重启策略与日志切割

### 5. 前端服务（Next.js）
- 构建与启动（SSR）：
  ```
  cd .\frontend
  npm ci
  npm run build
  # Next 默认端口 3000；如需 3001：
  $env:PORT=3001
  npm run start
  ```
- 环境变量（推荐将 API 基址参数化）：
  - 在前端添加 `NEXT_PUBLIC_API_BASE="https://your-backend-domain.com/api/v1"`
  - 代码中替换 axios 基础地址，或集中封装（参考 [frontend/src/app/oobe/[step]/page.tsx](frontend/src/app/oobe/%5Bstep%5D/page.tsx:1)）
- 进程管理：
  - Windows：PM2
    ```
    pm2 start "npm run start" --name "oobe-frontend" --cwd "C:\Users\VE\Desktop\project-welcome-xiya\frontend" --env "PORT=3001"
    pm2 save
    pm2 startup
    ```

### 6. 反向代理（HTTPS）
- 推荐统一由 Nginx/Apache/IIS 做 80/443 的终端，反向代理到内部端口
- Nginx（示例，Windows 或 Linux）：
  ```
  server {
    listen 80;
    server_name your-domain.com;

    location /.well-known/acme-challenge/ { root /var/www/html; } # 证书验证（可选）

    location /api/ {
      proxy_pass http://127.0.0.1:3000/api/;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
      proxy_pass http://127.0.0.1:3001/;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
  ```
  - 将证书安装到 443 server 块（ssl_certificate/ssl_certificate_key）
- IIS（Windows）：
  - 安装 Application Request Routing（ARR）与 URL Rewrite
  - 创建站点绑定 80/443（安装证书）
  - 建立两条反向代理规则：
    - /api/ -> http://127.0.0.1:3000/api/
    - / -> http://127.0.0.1:3001/
  - 勾选“允许代理”，保留 Host 头并设置 X-Forwarded-* 头

### 7. 安全与合规
- TLS/SSL：强制 HTTPS；关闭纯 HTTP 或将 HTTP 自动 301 跳转至 HTTPS
- CORS：严格限制前端来源，生产不要使用 `*`
- HTTP 安全头：在反向代理或应用层添加（HSTS、X-Content-Type-Options、X-Frame-Options、Referrer-Policy 等）
- 身份认证（后续）：为管理后台添加登录鉴权与角色控制
- 日志与审计：后端/前端输出日志持久化，配置日志切割与保留期

### 8. Windows 防火墙（示例）
- 放行外网端口（由反向代理使用）：
  ```powershell
  New-NetFirewallRule -DisplayName "HTTP 80" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
  New-NetFirewallRule -DisplayName "HTTPS 443" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
  ```
- 内部端口（仅本机访问，建议不对公网放行）：
  ```powershell
  New-NetFirewallRule -DisplayName "Node Backend 3000 (Local)" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
  New-NetFirewallRule -DisplayName "Node Frontend 3001 (Local)" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
  ```
  - 更严格做法：绑定 127.0.0.1，仅反向代理访问

### 9. 备份与运维
- 数据库：每日备份（快照/逻辑备份），保留 7–30 天
- 应用构建产物：保留最近 3 个版本，可快速回滚
- 监控：CPU/RAM/磁盘/响应时间；错误日志告警（邮件/Teams）
- 灰度/回滚：支持快速切换到上一版本；PM2 或 systemd 滚动重启

### 10. 部署流程（示例，总结）
1) 准备服务器与域名、TLS 证书；安装 Node.js 20 LTS、Nginx/IIS
2) 配置数据库（PostgreSQL/MySQL），设好 [.env](backend/.env:1) 的 `DATABASE_URL` 与 `FRONTEND_ORIGIN`
3) 后端：
   - `npm ci && npm run build && npm run start:prod`
   - `npx prisma migrate deploy && npx prisma generate`
4) 前端：
   - `npm ci && npm run build && (set PORT=3001 && npm run start)`（Windows）
5) 反向代理：
   - /api -> 127.0.0.1:3000/api
   - / -> 127.0.0.1:3001
6) 防火墙规则与健康检查，监控与日志配置
7) 验证页面：OOBE 与 Admin，设计器保存后展示一致
8) 启用 PM2/systemd 常驻并设置开机自启，记录部署版本与变更说明

以上部署环境需求与流程可直接用于 Windows 生产部署；Linux 服务器部署亦可参考同样的端口、反向代理与进程管理方法。结合你的实际资源和合规要求（证书、审计、访问控制），进一步完善安全与备份策略。