/**
 * Access a nested value in an object using dot-notation path.
 * Supports array indexing: "users[0].name" or "users.0.name"
 */
export function queryJson(data: unknown, path: string): unknown {
	const segments = path
		.replace(/\[(\d+)]/g, ".$1") // convert [0] to .0
		.split(".")
		.filter(Boolean);

	let current: unknown = data;
	for (const seg of segments) {
		if (current === null || current === undefined) return undefined;
		if (typeof current !== "object") return undefined;
		current = (current as Record<string, unknown>)[seg];
	}
	return current;
}

/**
 * Remove JS-style comments, skipping over string literals so that a URL
 * such as "https://example.com" is not mistaken for a line comment.
 */
function stripComments(content: string): string {
	let out = "";
	let i = 0;

	while (i < content.length) {
		const ch = content[i];

		if (ch === '"') {
			// Copy the whole string literal verbatim, honouring escapes
			const start = i;
			i++;
			while (i < content.length) {
				if (content[i] === "\\") {
					i += 2;
					continue;
				}
				if (content[i] === '"') {
					i++;
					break;
				}
				i++;
			}
			out += content.slice(start, i);
			continue;
		}

		if (ch === "/" && content[i + 1] === "/") {
			while (i < content.length && content[i] !== "\n") i++;
			continue;
		}

		if (ch === "/" && content[i + 1] === "*") {
			const end = content.indexOf("*/", i + 2);
			i = end === -1 ? content.length : end + 2;
			continue;
		}

		out += ch;
		i++;
	}

	return out;
}

/** Parse JSON, stripping JS-style comments (JSONC support) */
export function parseJson(content: string): unknown {
	return JSON.parse(stripComments(content));
}
