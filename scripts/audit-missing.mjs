import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const projectDir = process.cwd();
const roots = ['src', 'vendor']
  .map(entry => path.join(projectDir, entry))
  .filter(entry => fs.existsSync(entry));

const sourceExts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'];
const importRe =
  /(import\s+type\s+[\s\S]*?\s+from\s+|import\s+\{[\s\S]*?\}\s+from\s+|import\s+[\s\S]*?\s+from\s+|export\s+type\s+\{[\s\S]*?\}\s+from\s+|export\s+\{[\s\S]*?\}\s+from\s+|require\()\s*['"]([^'"]+)['"]/g;

function firstExisting(baseDir, candidates) {
  for (const candidate of candidates) {
    const fullPath = path.join(baseDir, candidate);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return fullPath;
    }
  }
  return null;
}

function resolveSourceFile(basePath) {
  const candidates = [basePath];

  for (const ext of sourceExts) {
    candidates.push(basePath + ext);
  }

  if (basePath.endsWith('.js') || basePath.endsWith('.jsx')) {
    const stem = basePath.replace(/\.(js|jsx)$/, '');
    for (const ext of sourceExts) {
      candidates.push(stem + ext);
    }
  }

  for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
    candidates.push(path.join(basePath, `index${ext}`));
  }

  return firstExisting(
    projectDir,
    candidates.map(candidate =>
      path.isAbsolute(candidate) ? path.relative(projectDir, candidate) : candidate,
    ),
  );
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
      continue;
    }
    if (/\.[cm]?[jt]sx?$/.test(entry.name)) {
      yield fullPath;
    }
  }
}

function recordMissing(result, kind, file, spec, target) {
  const bucket = result[kind];
  const key = `${file} -> ${spec}`;
  if (!bucket.items.has(key)) {
    bucket.items.set(key, { file, spec, target });
  }
  bucket.bySpec.set(spec, (bucket.bySpec.get(spec) ?? 0) + 1);
}

const result = {
  src: { items: new Map(), bySpec: new Map() },
  relative: { items: new Map(), bySpec: new Map() },
  text: { items: new Map(), bySpec: new Map() },
  typeOnly: { items: new Map(), bySpec: new Map() },
};

function isTypeOnlyImport(prefix) {
  const compact = prefix.replace(/\s+/g, ' ').trim();

  if (compact.startsWith('require(')) {
    return false;
  }

  if (compact.startsWith('import type ') || compact.startsWith('export type ')) {
    return true;
  }

  const braceMatch = compact.match(/^(?:import|export) \{(.*)\} from$/);
  if (!braceMatch) {
    return false;
  }

  const specifiers = braceMatch[1]
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  return specifiers.length > 0 && specifiers.every(value => value.startsWith('type '));
}

for (const root of roots) {
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, 'utf8');

    for (const match of text.matchAll(importRe)) {
      const prefix = match[1];
      const spec = match[2];
      const isTypeOnly = isTypeOnlyImport(prefix);

      if (spec.endsWith('.d.ts')) {
        continue;
      }

      if (spec.startsWith('src/')) {
        const resolved = resolveSourceFile(path.join(projectDir, spec));
        if (!resolved) {
          recordMissing(
            result,
            isTypeOnly ? 'typeOnly' : 'src',
            path.relative(projectDir, file),
            spec,
            path.normalize(path.relative(projectDir, path.join(projectDir, spec))),
          );
        }
        continue;
      }

      if (!spec.startsWith('./') && !spec.startsWith('../')) {
        continue;
      }

      const absoluteTarget = path.resolve(path.dirname(file), spec);
      const resolved = resolveSourceFile(absoluteTarget);
      if (resolved) {
        continue;
      }

      recordMissing(
        result,
        /\.(md|txt)$/.test(spec)
          ? 'text'
          : isTypeOnly
            ? 'typeOnly'
            : 'relative',
        path.relative(projectDir, file),
        spec,
        path.normalize(path.relative(projectDir, absoluteTarget)),
      );
    }
  }
}

function printBucket(label, bucket) {
  const items = [...bucket.items.values()].sort((a, b) =>
    `${a.file}\t${a.spec}`.localeCompare(`${b.file}\t${b.spec}`),
  );
  const bySpec = [...bucket.bySpec.entries()].sort((a, b) => b[1] - a[1]);

  console.log(`${label}: ${items.length}`);
  for (const item of items.slice(0, 40)) {
    console.log(`  ${item.file} -> ${item.spec} (${item.target})`);
  }
  if (items.length > 40) {
    console.log(`  ... ${items.length - 40} more`);
  }

  if (bySpec.length > 0) {
    console.log('  Most referenced:');
    for (const [spec, count] of bySpec.slice(0, 10)) {
      console.log(`    ${count}x ${spec}`);
    }
  }

  console.log('');
}

printBucket('Missing src/* imports', result.src);
printBucket('Missing relative code imports', result.relative);
printBucket('Missing text assets', result.text);
printBucket('Missing type-only modules', result.typeOnly);
