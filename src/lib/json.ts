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

/** Parse JSON, stripping JS-style comments (JSONC support) */
export function parseJson(content: string): unknown {
	const stripped = content
		.replace(/\/\/.*$/gm, "")
		.replace(/\/\*[\s\S]*?\*\//g, "");
	return JSON.parse(stripped);
}
