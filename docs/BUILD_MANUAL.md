# 编译手册

本文档描述如何在当前恢复工程中完成依赖安装、构建、运行和故障排查。

## 1. 环境要求

### 必需环境

- Node.js `>= 18`
- npm
- 可访问 npm registry

当前仓库的 `package.json` 已声明：

```json
{
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 建议环境

- macOS / Linux / WSL
- Node.js 20 或以上
- 可用的网络代理环境，尤其是需要走自定义 `ANTHROPIC_BASE_URL` 时

## 2. 依赖安装

```bash
cd /Users/test/Downloads/claude-code/package/claude-code-2.1.88
npm install
```

如果 npm 缓存目录权限不稳定，建议本项目内单独使用缓存：

```bash
npm_config_cache=.npm-cache npm install
```

## 3. 构建步骤

### 标准构建

```bash
npm_config_cache=.npm-cache npm run build
```

脚本入口：

- [package.json](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/package.json)
- [scripts/build.mjs](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/scripts/build.mjs)

### 构建产物

成功后会生成：

- `dist/cli.js`
- `dist/cli.js.map`

## 4. 构建链说明

当前构建链不是官方原始流水线，而是恢复工程的重建流水线，主要由 esbuild 完成。它额外做了几件对恢复工程很关键的事情：

1. 把 `bun:bundle`、`bun:ffi` 等 Bun 相关导入映射到 shim。
2. 为 `.md`、`.txt` 文本资源注册 `text` loader。
3. 对恢复过程中仍缺失的模块注入 `missing-module` / `missing-text` 降级模块。
4. 对 `color-diff-napi` 这类原生依赖优先切换到 TS 替代实现。
5. 通过 `feature('FLAG')` 的宏替换配合 `CLAUDE_CODE_RECOVER_FEATURES` 做恢复期功能裁剪。

## 5. 运行验证

### 构建后检查版本

```bash
node dist/cli.js --version
```

期望输出类似：

```text
2.1.88 (Claude Code)
```

### 检查恢复启动器状态

```bash
npm run cli:status
```

### 非交互调用验证

```bash
npm run cli:run -- -p "Reply with exactly: OK"
```

期望输出：

```text
OK
```

### 交互模式验证

```bash
npm run cli:run
```

如果一切正常，应能进入 Claude Code 欢迎界面与主题选择界面。

## 6. 启动模式

### 模式 A：默认模式

```bash
npm run cli:run
```

默认模式会：

- 使用项目内 `.claude-recovery/` 保存运行时状态
- 自动继承 `~/.claude/settings.json` 中的 `env` 配置

适合：

- 你已经在全局配置里设置了代理
- 你要沿用已有认证和模型环境

### 模式 B：隔离模式

```bash
CLAUDE_RECOVERY_SKIP_GLOBAL_ENV=1 npm run cli:run
```

隔离模式会：

- 仍然使用项目内 `.claude-recovery/`
- 但不继承全局 `~/.claude/settings.json` 的 `env`

适合：

- 排查全局环境污染
- 验证最小化恢复环境
- 做二开或 CI 验证

## 7. 缺失模块审计

恢复源码时，建议经常运行：

```bash
npm run audit:missing
```

该脚本会输出四类信息：

- `Missing src/* imports`
- `Missing relative code imports`
- `Missing text assets`
- `Missing type-only modules`

入口脚本：

- [scripts/audit-missing.mjs](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/scripts/audit-missing.mjs)

建议解读方式：

- 前三项优先级最高，会直接影响运行或打包。
- `type-only` 缺口通常不阻塞当前打包，但会影响类型体验和后续维护质量。

## 8. 常见问题

### 8.1 `TypeError: import_chalk4.Chalk is not a constructor`

原因：

- 恢复源码使用了不兼容当前 `chalk@4` 的导入方式。

现状：

- 已在 [src/utils/theme.ts](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/src/utils/theme.ts) 修复为兼容写法。

### 8.2 交互界面启动时报 `getSyntaxTheme is not a function`

原因：

- `color-diff-napi` 被当作缺失原生模块降级，但交互主题选择流程依赖它的 `getSyntaxTheme`。

现状：

- 已在 [scripts/build.mjs](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/scripts/build.mjs) 将它映射到 [src/native-ts/color-diff/index.ts](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/src/native-ts/color-diff/index.ts)。

### 8.3 `npm` 报缓存目录权限错误

建议先尝试：

```bash
npm_config_cache=.npm-cache npm install
npm_config_cache=.npm-cache npm run build
```

如果仍然报 `EACCES`，需要修复用户目录中的 npm 缓存权限。

### 8.4 CLI 能启动但请求卡住

重点检查：

- `~/.claude/settings.json` 中是否配置了 `ANTHROPIC_BASE_URL`
- 该代理是否真的支持 `/v1/messages`
- 认证头到底是 `Bearer` 还是 `x-api-key`
- 代理是否会返回空响应

### 8.5 直连官方接口时报 `403 Request not allowed`

说明：

- 当前认证材料可能只对你的代理有效，不一定能直连官方 `api.anthropic.com`。

## 9. 构建回归建议

每次修改恢复源码后，建议至少跑下面这一组：

```bash
npm_config_cache=.npm-cache npm run build
npm run audit:missing
npm run cli:status
npm run cli:run -- -p "Reply with exactly: OK"
```

如果改动涉及交互界面，再额外验证：

```bash
npm run cli:run
```

## 10. 发布前最低检查项

- `dist/cli.js` 可以重新生成
- `cli:status` 可运行
- `cli:run -p` 可返回结果
- 交互模式不在启动阶段崩溃
- `audit:missing` 不出现新的运行时缺口
