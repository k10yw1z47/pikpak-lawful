# 公开资源索引（Cloudflare Workers + D1）

这是一个合规优先的公开分享目录：接受人工提交，记录分享网址、来源、内容说明、标签与授权依据；所有条目先审核再公开。项目不会自动抓取网盘资源、解析密码或绕过访问控制。

## 部署
1. 安装依赖：`npm install`
2. 登录：`npx wrangler login`
3. 创建 D1：`npx wrangler d1 create pikpak-lawful-index`
4. 将返回的 database_id 填入 `wrangler.jsonc`
5. 初始化数据库：`npm run db:init:remote`
6. 设置管理员密钥：`npx wrangler secret put ADMIN_TOKEN`
7. 删除 wrangler.jsonc 中 vars.ADMIN_TOKEN 示例项，避免明文密钥
8. 部署：`npm run deploy`

## 审核 API
- `GET /api/admin/pending`，Header：`Authorization: Bearer <ADMIN_TOKEN>`
- `PATCH /api/admin/resources/:id`，同上，JSON：`{"status":"approved"}` 或 `{"status":"rejected"}`

可使用 curl、Postman 或自行增加管理后台。生产环境建议添加 Cloudflare Access、Turnstile、速率限制、举报与下架流程。
# pikpak-lawful
# pikpak-lawful
# pikpak-lawful
