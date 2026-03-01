/**
 * Flintwork Token Build Pipeline
 *
 * Reads JSON token files from the three-tier token architecture
 * (global → semantic → component), resolves cross-tier references,
 * and outputs CSS custom properties with theme support.
 *
 * This is a custom pipeline — no Style Dictionary dependency.
 * The script handles:
 * - JSON token parsing with nested group support
 * - Reference resolution using {dot.notation} syntax
 * - Multi-theme output (light/dark) via data-theme attribute
 * - Flat CSS custom property generation
 *
 * Output: dist/tokens/
 *   ├── tokens.css       (all tokens, light theme default, dark via [data-theme="dark"])
 *   ├── light.css        (light theme only)
 *   └── dark.css         (dark theme only)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TokenValue {
  $value: string | number | string[];
  $type?: string;
  $description?: string;
}

interface TokenGroup {
  [key: string]: TokenValue | TokenGroup | string;
}

type FlatTokenMap = Map<string, string | number | string[]>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOKENS_DIR = resolve(import.meta.dirname, '../tokens');
const OUTPUT_DIR = resolve(import.meta.dirname, '../../dist/tokens');

const GLOBAL_DIR = join(TOKENS_DIR, 'global');
const SEMANTIC_DIR = join(TOKENS_DIR, 'semantic');
const COMPONENT_DIR = join(TOKENS_DIR, 'component');

// ---------------------------------------------------------------------------
// Token parsing
// ---------------------------------------------------------------------------

/**
 * Reads a JSON token file and returns the parsed content.
 * Throws a descriptive error if the file is missing or malformed.
 */
function readTokenFile(filePath: string): TokenGroup {
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as TokenGroup;
}

/**
 * Reads all JSON files in a directory and merges them into a single
 * token group. Files are processed alphabetically for deterministic output.
 */
function readTokenDir(dirPath: string): TokenGroup {
  if (!existsSync(dirPath)) return {};

  const files = readdirSync(dirPath)
    .filter((f) => f.endsWith('.json'))
    .sort();

  const merged: TokenGroup = {};

  for (const file of files) {
    const content = readTokenFile(join(dirPath, file));
    Object.assign(merged, content);
  }

  return merged;
}

/**
 * Flattens a nested token group into a flat map of dot-notation paths
 * to their raw values. Only entries with a `$value` key are treated
 * as tokens — everything else is a group container.
 *
 * Example:
 *   { color: { gray: { 50: { $value: "#F9FAFB" } } } }
 *   → Map { "color.gray.50" => "#F9FAFB" }
 *
 * Properties starting with $ (like $type, $description) are metadata
 * and are skipped during flattening.
 */
function flattenTokens(group: TokenGroup, prefix: string = ''): FlatTokenMap {
  const map: FlatTokenMap = new Map();

  for (const [key, value] of Object.entries(group)) {
    // Skip W3C metadata properties
    if (key.startsWith('$')) continue;

    const path = prefix ? `${prefix}.${key}` : key;

    if (isTokenValue(value)) {
      map.set(path, value.$value);
    } else if (typeof value === 'object' && value !== null) {
      const nested = flattenTokens(value as TokenGroup, path);
      for (const [nestedPath, nestedValue] of nested) {
        map.set(nestedPath, nestedValue);
      }
    }
  }

  return map;
}

/**
 * Type guard to check if a value is a token (has $value property)
 * vs. a group container.
 */
function isTokenValue(value: unknown): value is TokenValue {
  return typeof value === 'object' && value !== null && '$value' in value;
}

// ---------------------------------------------------------------------------
// Reference resolution
// ---------------------------------------------------------------------------

/**
 * Resolves token references in a value string.
 *
 * References use the format {dot.notation.path} and can point to
 * any token in the provided lookup maps. Resolution is recursive
 * to handle chains like:
 *   button.bg → {color.interactive.default} → {color.blue.500} → #217CF5
 *
 * A depth limit prevents infinite circular reference loops.
 */
function resolveValue(
  value: string | number | string[],
  lookups: FlatTokenMap[],
  depth: number = 0,
): string {
  // Arrays (like font family stacks) are joined with commas
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  // Numbers pass through as-is
  if (typeof value === 'number') {
    return String(value);
  }

  // Guard against circular references
  if (depth > 10) {
    throw new Error(`Circular reference detected while resolving: ${value}`);
  }

  // If no reference syntax, return raw value
  if (!value.includes('{')) {
    return value;
  }

  // Replace all {references} with resolved values
  return value.replace(/\{([^}]+)\}/g, (_, refPath: string) => {
    for (const lookup of lookups) {
      const resolved = lookup.get(refPath);
      if (resolved !== undefined) {
        return resolveValue(resolved, lookups, depth + 1);
      }
    }
    throw new Error(`Unresolved token reference: {${refPath}}`);
  });
}

// ---------------------------------------------------------------------------
// CSS generation
// ---------------------------------------------------------------------------

/**
 * Converts a dot-notation token path to a CSS custom property name.
 *
 * Example: "color.text.primary" → "--flintwork-color-text-primary"
 *
 * The prefix avoids collisions with other CSS custom properties
 * in consumer applications.
 */
function tokenPathToCssVar(path: string): string {
  return `--fw-${path.replace(/\./g, '-')}`;
}

/**
 * Generates CSS custom property declarations from a flat token map.
 * Each token is resolved against the provided lookup maps before output.
 */
function generateCssDeclarations(
  tokens: FlatTokenMap,
  lookups: FlatTokenMap[],
): string {
  const lines: string[] = [];

  for (const [path, rawValue] of tokens) {
    const cssVar = tokenPathToCssVar(path);
    const resolved = resolveValue(rawValue, lookups);
    lines.push(`  ${cssVar}: ${resolved};`);
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Build pipeline
// ---------------------------------------------------------------------------

/**
 * Main build function. Reads all token tiers, resolves references,
 * and writes CSS files for each theme and a combined output.
 */
function build(): void {
  console.log('🔨 Flintwork: Building tokens...\n');

  // Read global tokens (Tier 1)
  const globalGroup = readTokenDir(GLOBAL_DIR);
  const globalTokens = flattenTokens(globalGroup);
  console.log(`  Global tokens: ${globalTokens.size}`);

  // Read semantic tokens per theme (Tier 2)
  const lightGroup = readTokenFile(join(SEMANTIC_DIR, 'light.json'));
  const darkGroup = readTokenFile(join(SEMANTIC_DIR, 'dark.json'));
  const typographyGroup = readTokenFile(join(SEMANTIC_DIR, 'typography.json'));

  const lightTokens = flattenTokens(lightGroup);
  const darkTokens = flattenTokens(darkGroup);
  const typographyTokens = flattenTokens(typographyGroup);

  console.log(`  Semantic tokens (light): ${lightTokens.size}`);
  console.log(`  Semantic tokens (dark): ${darkTokens.size}`);
  console.log(`  Semantic tokens (typography): ${typographyTokens.size}`);

  // Read component tokens (Tier 3)
  const componentGroup = readTokenDir(COMPONENT_DIR);
  const componentTokens = flattenTokens(componentGroup);
  console.log(`  Component tokens: ${componentTokens.size}`);

  // Build lookup chains for reference resolution
  // Order matters: component → semantic → global (most specific first)
  const lightLookups: FlatTokenMap[] = [componentTokens, lightTokens, typographyTokens, globalTokens];
  const darkLookups: FlatTokenMap[] = [componentTokens, darkTokens, typographyTokens, globalTokens];

  // Generate CSS declarations
  const globalCss = generateCssDeclarations(globalTokens, [globalTokens]);
  const lightSemanticCss = generateCssDeclarations(lightTokens, lightLookups);
  const darkSemanticCss = generateCssDeclarations(darkTokens, darkLookups);
  const typographyCss = generateCssDeclarations(typographyTokens, lightLookups);
  const componentLightCss = generateCssDeclarations(componentTokens, lightLookups);
  const componentDarkCss = generateCssDeclarations(componentTokens, darkLookups);

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write combined tokens file
  const combinedCss = [
    '/* Flintwork Design Tokens — Auto-generated. Do not edit manually. */',
    '/* Run `pnpm build:tokens` to regenerate from source JSON files.   */\n',
    ':root {',
    '  /* Global primitives */',
    globalCss,
    '',
    '  /* Semantic tokens — light (default) */',
    lightSemanticCss,
    '',
    '  /* Typography tokens */',
    typographyCss,
    '',
    '  /* Component tokens — light */',
    componentLightCss,
    '}',
    '',
    '[data-theme="dark"] {',
    '  /* Semantic tokens — dark */',
    darkSemanticCss,
    '',
    '  /* Component tokens — dark */',
    componentDarkCss,
    '}',
  ].join('\n');

  writeFileSync(join(OUTPUT_DIR, 'tokens.css'), combinedCss);
  console.log(`\n  ✓ dist/tokens/tokens.css`);

  // Write theme-specific files
  const lightCss = [
    '/* Flintwork — Light theme tokens */',
    ':root {',
    globalCss,
    lightSemanticCss,
    typographyCss,
    componentLightCss,
    '}',
  ].join('\n');

  const darkCss = [
    '/* Flintwork — Dark theme tokens */',
    ':root {',
    globalCss,
    darkSemanticCss,
    typographyCss,
    componentDarkCss,
    '}',
  ].join('\n');

  writeFileSync(join(OUTPUT_DIR, 'light.css'), lightCss);
  writeFileSync(join(OUTPUT_DIR, 'dark.css'), darkCss);

  console.log(`  ✓ dist/tokens/light.css`);
  console.log(`  ✓ dist/tokens/dark.css`);
  console.log('\n🔨 Flintwork: Token build complete.\n');
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

build();
