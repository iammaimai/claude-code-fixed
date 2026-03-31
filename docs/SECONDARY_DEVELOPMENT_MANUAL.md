# 二次开发手册

本文档面向后续继续维护这份恢复工程的开发者，重点说明如何在“恢复源码”基础上继续修复、补模块、加能力，而不把工程再次带回不可编译状态。

## 1. 开发目标

这份工程的现实目标有三层：

1. 保持“可构建、可启动、可调用”。
2. 在不破坏现有运行链路的前提下补齐缺失模块。
3. 逐步把恢复工程往“可维护源码仓库”推进。

建议优先级始终是：

1. 保住构建
2. 保住交互/非交互运行
3. 再追求完整还原

## 2. 建议开发流程

### 开始修改前

先跑：

```bash
npm run audit:missing
npm run cli:status
npm run cli:run -- -p "Reply with exactly: OK"
```

目的是先知道当前基线有没有坏。

### 修改后

至少跑：

```bash
npm_config_cache=.npm-cache npm run build
npm run audit:missing
npm run cli:run -- -p "Reply with exactly: OK"
```

如果动了交互 UI，再跑：

```bash
npm run cli:run
```

## 3. 目录级开发建议

### 启动层

- [src/entrypoints/cli.tsx](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/src/entrypoints/cli.tsx)
- [src/main.tsx](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/src/main.tsx)
- [src/commands.ts](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/src/commands.ts)

建议：

- 入口代码尽量保持稳定，不要把实验性恢复逻辑直接塞进 `main.tsx`，优先放到 `utils/` 或 `scripts/`。
- 命令注册一旦动到，就补做 `/help`、`cli:run`、`-p` 三个维度验证。

### 服务层

- `src/services/api`
- `src/services/oauth`
- `src/services/mcp`
- `src/services/plugins`
- `src/services/lsp`

建议：

- 服务层尽量维持“输入输出明确”的结构。
- 恢复期如果必须降级，优先返回“明确错误/空能力”，不要让调用点直接 `throw` 到入口。

### 工具层

- `src/tools/*`

建议：

- 单个工具最好满足“可独立理解、可独立测试、可独立降级”。
- 缺失实现时，优先做最小占位工具，而不是让整个工具注册失败。

### UI 层

- `src/components/*`
- `src/ink/*`

建议：

- 交互 UI 一定要做冷启动验证。
- 主题、颜色、语法高亮相关模块最容易被恢复时的原生模块缺口影响，要优先关注。

### 基础设施层

- `src/utils/*`

建议：

- 不要在这里轻易引入新的全局副作用。
- 配置、代理、认证这类逻辑优先集中维护，不要在多处分散写环境变量分支。

## 4. 如何补齐缺失模块

### 场景 A：缺失的是运行时代码

做法：

1. 用 `npm run audit:missing` 定位缺口。
2. 找调用点，确认调用方真正依赖什么接口。
3. 先实现最小可运行版本。
4. 让调用方在缺失能力时“可降级”而不是“崩溃”。

推荐策略：

- 能返回空数组，就先返回空数组。
- 能返回 `null` 并让上层识别，就先返回 `null`。
- 如果必须抛错，报错信息要明确写“recovery stub”或“not yet restored”。

### 场景 B：缺失的是文本资源

做法：

1. 先补文件。
2. 确认 [scripts/build.mjs](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/scripts/build.mjs) 能把 `.md/.txt` 作为文本打进包。

### 场景 C：缺失的是原生模块

优先级：

1. 优先找是否已有 TS 替代实现。
2. 没有的话，再决定是否加 shim。
3. 不要第一反应就直接让所有调用点忽略错误。

当前可参考的现成方案：

- `color-diff-napi` -> [src/native-ts/color-diff/index.ts](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/src/native-ts/color-diff/index.ts)

## 5. 构建脚本维护建议

关键文件：

- [scripts/build.mjs](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/scripts/build.mjs)

建议关注点：

- `unavailablePackagePrefixes`
- `onResolve` 的 shim 路由
- 文本资源 loader
- Bun 兼容 shim
- 原生模块 fallback 映射

修改原则：

- 新加 fallback 时，优先做“精确映射”，不要把一类包全部打到通用空模块。
- 如果某个包已有 TS 替代实现，应该单独 `onResolve` 到真实文件。

## 6. 运行器维护建议

关键文件：

- [scripts/run-recovered-cli.mjs](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/scripts/run-recovered-cli.mjs)

当前策略：

- 默认继承全局 `~/.claude/settings.json` 的 `env`
- 项目状态写入 `.claude-recovery/`
- `CLAUDE_RECOVERY_SKIP_GLOBAL_ENV=1` 可切换到隔离模式

维护建议：

- 运行器只做环境装配，不要在里面堆业务逻辑。
- 如果未来要支持多代理/多配置模式，优先通过环境变量开关扩展。

## 7. 添加新命令的建议

步骤：

1. 在 `src/commands/<name>/` 下新增命令目录或文件。
2. 在 [src/commands.ts](/Users/test/Downloads/claude-code/package/claude-code-2.1.88/src/commands.ts) 注册。
3. 跑 `npm run cli:run -- --help` 确认注册成功。
4. 跑命令本身的最小验证。

建议：

- 面向用户的命令要有明确描述。
- 若是恢复期占位命令，说明“当前为恢复版简化实现”。

## 8. 添加新工具的建议

步骤：

1. 在 `src/tools/<ToolName>/` 下建立工具目录。
2. 明确输入 schema、输出格式和失败行为。
3. 确保工具未启用时不会影响整个工具列表装载。

建议：

- 工具必须能在非理想环境下优雅失败。
- 工具相关 prompt、常量、helper 尽量和工具本体同目录放置。

## 9. 添加新服务的建议

适用场景：

- 新增独立网络客户端
- 新增索引/缓存/同步逻辑
- 新增跨模块共享业务能力

建议：

- 服务层应避免直接依赖 UI。
- 服务尽量保持“纯输入 -> 输出/副作用”的风格，方便后续替换恢复 stub。

## 10. 恢复工程特有风险

### 风险 A：源码存在“看起来完整，实际是误还原”

处理方式：

- 看调用链是否真的走到该代码。
- 看接口签名是否与调用方一致。
- 用运行验证代替“我觉得这段像对的”。

### 风险 B：构建通过，但交互启动时崩

典型原因：

- 原生模块 shim 不完整
- 主题/高亮/终端能力在交互分支才会触发

处理方式：

- 不能只验证 `--help` 和 `--version`
- 必须至少验证一次 `npm run cli:run`

### 风险 C：认证正常，但代理协议不通

典型表现：

- `auth status` 显示已登录
- 实际请求卡住或代理返回空响应

处理方式：

- 区分“CLI 代码问题”和“外部代理问题”
- 先用 `-p "Reply with exactly: OK"` 做最小调用验证

## 11. 推荐开发检查清单

每次提交前建议自查：

- 是否新增了运行时缺失模块
- 是否破坏了 `npm run build`
- 是否破坏了 `npm run cli:run -- -p "Reply with exactly: OK"`
- 是否破坏了 `npm run cli:run`
- 是否把恢复期逻辑写进了不该污染的公共模块

## 12. 建议的恢复优先级

如果后续继续恢复更完整源码，建议按下面顺序推进：

1. 入口必经路径
2. 常用命令
3. 交互 UI 必经组件
4. API / MCP / OAuth 主路径
5. 高频工具
6. 高频服务
7. 低频内部命令
8. 纯 type-only 缺口

## 13. 结论

当前这份恢复工程已经适合作为“继续修”的基础仓库，而不是一次性的反编译快照。  
后续二次开发最重要的不是“立刻补齐所有模块”，而是始终维持：

- 可构建
- 可启动
- 可验证
- 可定位问题

只要这四点一直守住，这个恢复工程就可以持续演进。
