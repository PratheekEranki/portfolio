import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const content = JSON.parse(readFileSync(new URL('../src/portfolio.json', import.meta.url)));
const ids = new Set(content.projects.map((p) => p.id));
test('case studies have unique IDs, complete context, and available evidence', () => {
  assert.equal(ids.size, content.projects.length);
  assert.equal(content.projects.filter((p) => p.featured).length, 3);
  for (const p of content.projects) {
    assert.match(p.id, /^[a-z0-9-]+$/);
    for (const key of ['title', 'problem', 'contribution', 'summary', 'role'])
      assert.ok(p[key]?.trim(), `${p.id}: missing ${key}`);
    assert.ok(p.links.length && p.limitations.length);
    if (p.image) assert.ok(existsSync(resolve('public', p.image)), `${p.id}: missing image`);
    for (const link of p.links) {
      if (link.url.startsWith('https://')) assert.ok(new URL(link.url).hostname);
      else assert.ok(existsSync(resolve('public', link.url)), `${p.id}: missing ${link.url}`);
    }
    if (p.evaluation.rows)
      for (const row of p.evaluation.rows) assert.equal(row.length, p.evaluation.columns.length);
  }
});
test('skill references resolve to project evidence', () => {
  for (const group of content.skills) for (const id of group.projectIds) assert.ok(ids.has(id), id);
});
test('RAG comparison agrees with downloadable results', () => {
  const results = JSON.parse(readFileSync('public/evidence/rag-results.json'));
  const mapping = {
    'BLEU-1': 'bleu1',
    'ROUGE-1': 'rouge1',
    'ROUGE-L': 'rougeL',
    'Token F1': 'token_f1',
    'Exact match': 'exact_match',
  };
  for (const [label, base, rag] of content.projects.find((p) => p.id === 'academic-rag').evaluation
    .rows) {
    assert.equal(Number(base), results.base[mapping[label]]);
    assert.equal(Number(rag), results.rag[mapping[label]]);
  }
});
test('confirmed dates and corrected stock-model ranking stay consistent', () => {
  assert.equal(
    content.experience.find((p) => p.id === 'cognizant').period,
    'October 2021 – April 2024',
  );
  assert.equal(
    content.experience.find((p) => p.id === 'memphis').period,
    'March 2025 – August 2025',
  );
  const rows = readFileSync('public/evidence/stock-results.csv', 'utf8')
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.split(','));
  assert.equal(rows.sort((a, b) => Number(a[1]) - Number(b[1]))[0][0], 'GRU');
  assert.match(content.projects.find((p) => p.id === 'stock-forecasting').signal, /GRU/);
});

test('owner-corrected experience is preserved and the removed project is absent', () => {
  const university = content.experience.find((p) => p.id === 'memphis');
  assert.equal(
    university.summary,
    'Conducted data-focused research using legislative records obtained through LegiScan.',
  );
  assert.equal(university.bullets.length, 5);
  assert.match(content.experience.find((p) => p.id === 'st-jude').summary, /sleep EEG and fMRI/);
  assert.match(
    content.experience.find((p) => p.id === 'cognizant').bullets.join(' '),
    /documented root causes/,
  );
  assert.doesNotMatch(
    JSON.stringify(content.experience),
    /Rhamba|anomaly scoring|financial reporting|model reliability/,
  );
  assert.ok(!content.projects.some((p) => p.id === 'yolo' || /KITTI/.test(p.title)));
  assert.equal(content.projects.length, 18);
});

test('experience tool chips and hero highlights are backed by existing content', () => {
  for (const job of content.experience) {
    assert.ok(existsSync(resolve('public', job.image)), `${job.id}: missing image`);
    assert.ok(job.imageAlt?.trim(), `${job.id}: missing image alt`);
  }
  for (const job of content.experience)
    for (const tool of job.stack)
      assert.match(job.bullets.join(' '), new RegExp(tool.split(' ')[0]), `${job.id}: ${tool}`);
  const values = Object.fromEntries(content.profile.highlights.map((h) => [h.label, h.value]));
  assert.equal(
    values['Project case studies with linked evidence'],
    String(content.projects.length),
  );
  assert.match(content.education[0].note, new RegExp(values['GPA, M.S. in Data Science']));
});

test('LaTeX resume follows the requested section order and contains hyperlinks', () => {
  const source = readFileSync('resume/main.tex', 'utf8');
  assert.deepEqual(
    [...source.matchAll(/\\section\*\{([^}]+)\}/g)].map((m) => m[1]),
    ['Summary', 'Education', 'Skills', 'Experience', 'Projects', 'Publications', 'Certifications'],
  );
  assert.match(source, /LegiScan/);
  assert.ok((source.match(/\\href\{/g) || []).length >= 10);
  assert.ok(existsSync('public/Pratheek-Eranki-Resume.tex'));
});

test('all reviewed public project repositories have an evidence link', () => {
  const represented = new Set(
    content.projects
      .flatMap((p) => p.links)
      .map((l) => l.url.match(/^https:\/\/github\.com\/PratheekEranki\/([^/]+)/)?.[1])
      .filter(Boolean),
  );
  for (const name of [
    'driftboard',
    'hard-rock-digital-ai-agent',
    'Multi-Level-Marketing-Database-Design',
    'segmentwise',
    'home-listings-search',
    'opsflow-saas',
    'Attention-Based-RAG-Academic-QA-System',
    'fieldverify',
    'FraudDetection',
    'demandsense-forecasting',
    'fixbot-device-agent',
    'Movie_popularity_R',
    'CBraMod-ISRUC',
    'Charity-AID',
    'Air-Qulaity-Predictions-and-Classification',
    'MovieRecomendation_R',
  ])
    assert.ok(represented.has(name), name);
});
test('resume and social preview are deployable assets', () => {
  assert.equal(readFileSync('public/Pratheek-Eranki-Resume.pdf').subarray(0, 4).toString(), '%PDF');
  const png = readFileSync('public/images/social-preview.png');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
