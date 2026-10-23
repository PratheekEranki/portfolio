import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
const content = JSON.parse(readFileSync(new URL('../../src/portfolio.json', import.meta.url)));
test('page, assets, resume, and metadata load without errors', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Building software.');
  await expect(page.getByRole('list', { name: 'Highlights' }).getByRole('listitem')).toHaveCount(4);
  for (const asset of [
    'Pratheek-Eranki-Resume.pdf',
    'Pratheek-Eranki-Resume.tex',
    'images/social-preview.png',
    'images/fixbot.jpg',
    'images/homesearch.jpg',
    'images/rhamba.svg',
    'evidence/stock-results.csv',
  ])
    expect((await request.get(asset)).ok(), asset).toBeTruthy();
  const pdf = await request.get('Pratheek-Eranki-Resume.pdf');
  expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://pratheekeranki.github.io/portfolio/',
  );
  await page.goto('./#project/%');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});
for (const width of [320, 375, 390, 768, 1440])
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
    ).toBeLessThanOrEqual(1);
    if (width === 1440 || width === 375)
      await page.screenshot({ path: `test-results/preview-${width}.png` });
    await page.screenshot({ path: `test-results/portfolio-${width}.png`, fullPage: true });
  });
test('filters expose selection and show the matching projects', async ({ page }) => {
  await page.goto('./#projects');
  const group = page.getByRole('group', { name: 'Filter projects by discipline' });
  const data = group.getByRole('button', { name: 'Data', exact: false });
  await data.click();
  await expect(data).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.project-grid .project-card')).toHaveCount(5);
  await expect(page.locator('.project-grid')).not.toContainText('KITTI Object Detection');
  await group.getByRole('button', { name: 'All', exact: false }).click();
  await expect(page.locator('.project-grid .project-card')).toHaveCount(18);
});
test('all case studies open, Escape closes them, and focus returns', async ({ page }) => {
  await page.goto('./');
  for (const project of content.projects) {
    const trigger = page
      .locator(project.featured ? '.featured-grid' : '.project-grid')
      .getByRole('link', { name: `Read ${project.title} case study`, exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(project.title);
    await expect(dialog.getByRole('heading', { name: 'Limitations & next steps' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  }
});
test('direct case links and browser Back work', async ({ page }) => {
  await page.goto('./#project/academic-rag');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('table')).toContainText('0.3543');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page
    .getByRole('link', { name: 'Read Stock Forecasting Comparison case study', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText('GRU');
  await page.goBack();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('mobile navigation handles Escape and breakpoint changes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('./');
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.getByRole('navigation')).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
});
test('keyboard skip link and reduced motion are supported', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
  expect(
    await page.locator('.hero-showcase').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
});

test('project search, empty state, and reset work together', async ({ page }) => {
  await page.goto('./#projects');
  const search = page.getByRole('searchbox', { name: 'Search projects' });
  await search.fill('CBraMod');
  await expect(page.locator('.project-grid .project-card')).toHaveCount(1);
  await expect(page.locator('.project-grid')).toContainText('CBraMod on ISRUC');
  await search.fill('FixBot');
  await expect(page.locator('.project-grid .project-card')).toHaveCount(1);
  await expect(page.locator('.project-grid')).toContainText('FixBot');
  await search.fill('no-project-matches-this');
  await expect(page.getByRole('heading', { name: 'No matching projects' })).toBeVisible();
  await page.getByRole('button', { name: 'Show all projects', exact: true }).click();
  await expect(page.locator('.project-grid .project-card')).toHaveCount(18);
});

test('featured preview changes accessibly and approved employment text is shown', async ({
  page,
}) => {
  await page.goto('./');
  const preview = page.getByRole('group', { name: 'Choose a featured project preview' });
  await preview.getByRole('button', { name: 'FixBot', exact: true }).click();
  await expect(preview.getByRole('button', { name: 'FixBot', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('.showcase-caption h2')).toHaveText('FixBot');
  await expect(page.locator('#experience')).toContainText(
    'legislative records obtained through LegiScan',
  );
  await expect(page.locator('#experience')).not.toContainText('Rhamba');
});
test('homepage and case study pass automated accessibility checks', async ({ page }) => {
  // Scan settled colours, not frames of the hero entrance animation.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await page.screenshot({ path: 'test-results/preview-1440.png' });
  await page
    .locator('.project-grid')
    .getByRole('link', { name: 'Read Academic RAG QA case study', exact: true })
    .click();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});

test('dark theme is the default and the light theme toggles, persists, and stays accessible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  const background = () =>
    page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  expect(await background()).toBe('rgb(17, 18, 20)');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  expect(await background()).toBe('rgb(243, 243, 240)');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
  expect(await page.locator('html').getAttribute('data-theme')).toBe('light');
  await page.screenshot({ path: 'test-results/preview-1440-light.png' });
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});

test('mobile dialog stays within the viewport and its controls remain accessible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('./#project/academic-rag');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => el.getBoundingClientRect().right)).toBeLessThanOrEqual(320);
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(dialog).toHaveCount(0);
});
