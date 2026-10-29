# 公共库导出清单

<!-- 由 frontend-workspace/scripts/sync-skill.mjs 生成；请修改实际源码，再运行 npm run sync:skill。 -->

源码链接入口：`@jcc/shared`。在应用入口单独导入 `@jcc/shared/style.css`。组件细节以真实源码和 API 文档为准。

## 公共组件

导入路径：`@jcc/shared/components`；[导出源码](../../frontend-workspace/packages/shared/src/components/index.js)。

- `JccProvider`
- `JccTable`
- `JccPagination`
- `JccTree`
- `JccTreeSelect`
- `JccUpload`
- `JccDownload`
- `JccFormModal`
- `JccPagePanel`
- `JccQueryBar`
- `JccAppShell`

## 状态方法

导入路径：`@jcc/shared/hooks`；[导出源码](../../frontend-workspace/packages/shared/src/hooks/index.js)。

- `useTableQuery`
- `useAsyncTask`

## 公共 API

导入路径：`@jcc/shared/api`；[导出源码](../../frontend-workspace/packages/shared/src/api.js)。

- `createHttpClient`
- `HttpError`

## 公共方法

导入路径：`@jcc/shared/utils`；[导出源码](../../frontend-workspace/packages/shared/src/utils.js)。

- `listToTree`
- `normalizeTree`
- `filterTree`
- `getTreeKeys`
- `findTreeNode`
- `validateFile`
- `safeFileName`
- `getDownloadName`
- `downloadBlob`
- `formatBytes`
- `formatDate`
- `cloneQuery`
- `debounce`

## 验证规则

导入路径：`@jcc/shared/validators`；[导出源码](../../frontend-workspace/packages/shared/src/validators.js)。

- `patterns`
- `isEmail`
- `isMobileCN`
- `isPositiveInteger`

## 主题方法

导入路径：`@jcc/shared/theme`；[导出源码](../../frontend-workspace/packages/shared/src/theme/index.js)。

- `createAntTheme`

## 图片与图标 URL

导入路径：`@jcc/shared/assets`；[导出源码](../../frontend-workspace/packages/shared/src/assets.js)。

- `documentImageUrl`
- `addIconUrl`

## 静态素材

素材目录位于 `packages/shared/assets`，可直接导入：

- `@jcc/shared/assets/add.svg`
- `@jcc/shared/assets/document.svg`

新增组件或方法后先确认其公开导出与 API 文档，再运行 `npm run sync:skill`，最后运行相关测试和应用构建。
