import { expect, test } from '@playwright/test';

test('收起导航时按钮和菜单图标共用侧栏中线', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '收起导航' }).click();

  const sidebar = page.locator('.fs-sidebar');
  const button = page.getByRole('button', { name: '展开导航' });
  const icon = sidebar.locator('.ant-menu-item-icon').first();
  await expect(sidebar).toHaveClass(/ant-layout-sider-collapsed/);
  await expect(icon).toBeVisible();

  const [sidebarBox, buttonBox, iconBox] = await Promise.all([
    sidebar.boundingBox(),
    button.boundingBox(),
    icon.boundingBox(),
  ]);
  const center = (box) => box.x + box.width / 2;
  expect(Math.abs(center(buttonBox) - center(sidebarBox))).toBeLessThan(2);
  expect(Math.abs(center(iconBox) - center(sidebarBox))).toBeLessThan(2);

  await expect(sidebar).toHaveScreenshot('sidebar-collapsed.png');
  await button.click();
  await expect(page.getByRole('button', { name: '收起导航' })).toBeVisible();
});

test('工作台保持共享主题和移动端宽度', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.fs-header')).toHaveScreenshot('header.png');
  await expect(page).toHaveScreenshot('workbench.png', { fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.fs-sidebar')).toBeHidden();
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
});

test('独立组件项目加载相同主题', async ({ page }) => {
  await page.goto('http://127.0.0.1:5175/');
  await expect(page.getByText('共享组件与交互验证')).toBeVisible();
  await expect(page).toHaveScreenshot('component-lab.png', { fullPage: true });
});
