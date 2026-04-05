export type FileType = "json" | "markdown" | "unknown";

const JSON_EXTENSIONS = new Set([".json", ".jsonc", ".json5"]);
const MD_EXTENSIONS = new Set([".md", ".markdown", ".mdx"]);

/** Detect file type from extension */
export function detectByExtension(filePath: string): FileType {
	const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
	if (JSON_EXTENSIONS.has(ext)) return "json";
	if (MD_EXTENSIONS.has(ext)) return "markdown";
	return "unknown";
}

/** Detect file type by sniffing content (fallback when extension is unknown) */
export function detectByContent(content: string): FileType {
	const trimmed = content.trimStart();
	if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
	if (trimmed.startsWith("#") || trimmed.startsWith("---")) return "markdown";
	return "unknown";
}
