# @jcc/shared 公共库

本目录以源码形式提供公共组件、样式、状态方法、请求封装、工具方法、验证规则和共享 SVG。本机 Vite 项目可按根目录 `使用说明.md` 使用 `npm link` 链接 `frontend-workspace`。Vue、Ant Design Vue 和图标库是 peer 依赖。

应用入口导入 `ant-design-vue/dist/reset.css` 与 `@jcc/shared/style.css`。JS 可从根入口按名称导入，也可从下表中的子路径按类别导入。独立 Vite 项目需将 `@jcc/shared/vite` 的 `jccLiveViteConfig()` 合入自己的配置。

各 JS 入口通过 package.json 的 `types` 条件提供 `types/*.d.ts`，无需将应用迁移为 TypeScript。JS 编辑器可提示参数、响应、组件属性与回调；`openModal` 从内容组件的 props/事件声明推导参数。Vue 组件的结构化自定义事件需在 `defineEmits` 中声明参数类型才能获得精确提示。原生 Ant 非冲突属性沿用 Ant 类型，插槽的任意透传范围仍以运行时为准。

新增 API 时同时补齐类型与文档；`check:skill` 校验每个公开 JS 入口的导出名称都有对应类型，`check:types` 编译 `tests/types/consumer.ts` 中的正确及预期错误用例。类型清单检查不能自动验证所有签名语义，修改签名还需行为测试与消费方示例。

| 子路径                   | 内容                                     | 详细契约        |
| ------------------------ | ---------------------------------------- | --------------- |
| `@jcc/shared/components` | 13 个 Jcc 组件及 `openModal`、`useModal` | `docs/ui.md`    |
| `@jcc/shared/hooks`      | 查询与异步状态方法                       | `docs/hooks.md` |
| `@jcc/shared/api`        | `createHttpClient`、`HttpError`          | `docs/utils.md` |
| `@jcc/shared/utils`      | 树、文件、格式化、防抖等方法             | `docs/utils.md` |
| `@jcc/shared/validators` | 格式验证规则与函数                       | 下文            |
| `@jcc/shared/theme`      | `createAntTheme`                         | `docs/theme.md` |
| `@jcc/shared/assets`     | 共享素材 URL                             | 下文            |

`createHttpClient` 仅提供通用请求能力，不绑定后端地址、token 或业务接口。应用负责配置 `baseURL`、权限、响应适配和错误文案。

验证规则：`patterns.email`、`patterns.mobileCN`、`patterns.positiveInteger`；对应的 `isEmail(value)`、`isMobileCN(value)`、`isPositiveInteger(value)` 返回布尔值。邮箱为通用格式初检，大陆手机号仅检查号段与位数，正整数不接受零。它们不承担号码真实性或业务权限验证。

素材：`documentImageUrl`、`addIconUrl` 可直接赋给 `<img :src>`；也可分别导入 `@jcc/shared/assets/document.svg`、`@jcc/shared/assets/add.svg`。当前只包含中性共享 SVG，不包含项目 Logo、用户照片或业务图片。

```js
import { JccTable } from '@jcc/shared/components';
import { createHttpClient } from '@jcc/shared/api';
import { isMobileCN } from '@jcc/shared/validators';
import { documentImageUrl } from '@jcc/shared/assets';
```

新增组件或方法需从 `src` 的对应分类入口公开导出，并更新对应 API 文档，然后在 Codex 输入固定指令 `同步公共组件库 skill`。这条指令会检查实际导出并运行 `npm run sync:skill`，把清单写入 `frontend-system/references/library-catalog.md`。
