import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.addStyleTag({
    content:
      '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }',
  });
  await expect(page.getByRole('heading', { name: '共享资源' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
});

test('树筛选、查询和重置操作改变真实列表', async ({ page }) => {
  await page.getByRole('tree').getByText('图片', { exact: true }).click();
  await expect(page.getByRole('cell', { name: '共享图标', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: '组件接入指南', exact: true })).toHaveCount(0);
  await page.getByLabel('资源名称', { exact: true }).fill('不存在');
  await page.getByRole('button', { name: /查\s*询/ }).click();
  await expect(page.getByText('暂无数据，请调整筛选条件')).toBeVisible();
  await page.getByRole('button', { name: /重\s*置/ }).click();
  await expect(page.getByRole('cell', { name: '共享图标', exact: true })).toBeVisible();
});

test('收起导航后图标与展开按钮对齐', async ({ page }) => {
  await page.getByRole('button', { name: '收起导航', exact: true }).click();
  const toggle = page.getByRole('button', { name: '展开导航', exact: true });
  await expect(page.locator('.fs-sidebar')).toHaveClass(/ant-layout-sider-collapsed/);
  await expect(async () => {
    const button = await toggle.locator('svg').boundingBox();
    const icons = await page.locator('.fs-sidebar .ant-menu-item .anticon svg').all();
    expect(icons.length).toBe(3);
    for (const icon of icons) {
      const bounds = await icon.boundingBox();
      expect(
        Math.abs(bounds.x + bounds.width / 2 - button.x - button.width / 2),
      ).toBeLessThanOrEqual(1);
    }
  }).toPass();
});

test('openModal 传入 props、自定义回调，支持拖拽与全屏', async ({ page }) => {
  await page.getByRole('button', { name: '打开弹窗', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByLabel('名称', { exact: true })).toHaveValue('示例名称');
  const position = page.locator('.jcc-modal-position');
  const before = await position.boundingBox();
  const title = await page.locator('.jcc-modal-title-text').boundingBox();
  await page.mouse.move(title.x + 30, title.y + title.height / 2);
  await page.mouse.down();
  await page.mouse.move(title.x + 100, title.y + title.height / 2 + 40);
  await page.mouse.up();
  await expect(async () => {
    const after = await position.boundingBox();
    expect(after.x - before.x).toBeGreaterThan(50);
    expect(after.y - before.y).toBeGreaterThan(20);
  }).toPass();
  await dialog.getByRole('button', { name: '全屏', exact: true }).click();
  await expect(page.locator('.jcc-modal-fullscreen')).toBeVisible();
  const fullscreen = await page.locator('.ant-modal-content').boundingBox();
  expect(fullscreen.width).toBeGreaterThan(1400);
  await dialog.getByLabel('名称', { exact: true }).fill('回调成功');
  await dialog.getByRole('button', { name: '保存内容', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveText('已保存：回调成功');
});

test('窄屏分类可收起，内容不溢出视口', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.getByRole('button', { name: '切换分类', exact: true }).click();
  await expect(page.locator('.jcc-tree-table__tree-body')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(640);
});

test('默认树表与空状态 @visual', async ({ page }) => {
  await expect(page.locator('.jcc-tree-table')).toHaveScreenshot('tree-table.png');
  await page.getByLabel('资源名称', { exact: true }).fill('不存在');
  await page.getByRole('button', { name: /查\s*询/ }).click();
  await expect(page.getByText('暂无数据，请调整筛选条件')).toBeVisible();
  await expect(page.locator('.jcc-tree-table')).toHaveScreenshot('tree-table-empty.png');
});

test('收起导航与主题 @visual', async ({ page }) => {
  await page.getByRole('button', { name: '收起导航', exact: true }).click();
  await expect(page.locator('.fs-sidebar')).toHaveScreenshot('sidebar-collapsed.png');
  await page.locator('.preview-theme-select').click();
  await page.getByTitle('青绿主题', { exact: true }).click();
  await page.getByRole('heading', { name: '公共组件预览' }).click();
  await expect(page.locator('.fs-header')).toHaveScreenshot('header-green.png');
});

test('弹窗普通与全屏状态 @visual', async ({ page }) => {
  await page.getByRole('button', { name: '打开弹窗', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('.ant-modal-content')).toHaveScreenshot('modal.png');
  await dialog.getByRole('button', { name: '全屏', exact: true }).click();
  await expect(page.locator('.ant-modal-content')).toHaveScreenshot('modal-fullscreen.png');
});

test('窄屏树表 @visual', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.getByRole('button', { name: '切换分类', exact: true }).click();
  await expect(page.locator('.jcc-tree-table__tree-body')).toBeHidden();
  await expect(page.locator('.jcc-tree-table')).toHaveScreenshot('tree-table-mobile.png');
});
