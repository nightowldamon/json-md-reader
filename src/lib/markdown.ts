export interface MarkdownResult {
	content: string;
	frontmatter: Record<string, unknown> | null;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Minimal YAML frontmatter parser — handles scalars, lists, and simple nesting */
function parseYaml(yaml: string): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	let currentKey = "";

	for (const line of yaml.split("\n")) {
		// List item under current key: "  - value"
		const listMatch = line.match(/^\s+-\s+(.*)/);
		if (listMatch && currentKey) {
			if (!Array.isArray(result[currentKey])) {
				result[currentKey] = [];
			}
			(result[currentKey] as unknown[]).push(coerce(listMatch[1].trim()));
			continue;
		}

		// Key-value pair: "key: value"
		const kvMatch = line.match(/^(\w[\w\s-]*):\s*(.*)/);
		if (kvMatch) {
			currentKey = kvMatch[1].trim();
			const val = kvMatch[2].trim();
			result[currentKey] = val === "" ? null : coerce(val);
		}
	}

	return result;
}

function coerce(val: string): unknown {
	if (val === "true") return true;
	if (val === "false") return false;
	if (val === "null" || val === "") return null;
	const num = Number(val);
	if (!Number.isNaN(num) && val !== "") return num;
	// Strip surrounding quotes
	if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
		return val.slice(1, -1);
	}
	return val;
}

/** Parse markdown, separating frontmatter from body */
export function parseMarkdown(raw: string): MarkdownResult {
	const match = raw.match(FRONTMATTER_RE);

	if (!match) {
		return { content: raw, frontmatter: null };
	}

	const yamlStr = match[1];
	const content = raw.slice(match[0].length);
	const frontmatter = parseYaml(yamlStr);

	return {
		content,
		frontmatter: Object.keys(frontmatter).length > 0 ? frontmatter : null,
	};
}
