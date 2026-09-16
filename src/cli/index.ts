import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import { program } from "commander";
import { detectByContent, detectByExtension } from "../lib/detect.js";
import { parseJson, queryJson } from "../lib/json.js";
import { parseMarkdown } from "../lib/markdown.js";
import { highlightJson, renderMarkdown } from "./format.js";
import { readStdin } from "./stdin.js";

program
	.name("jmd")
	.description("Beautiful CLI reader for JSON and Markdown files")
	.version("1.0.0")
	.argument("[file]", "Path to .json or .md file (omit to read stdin)")
	.argument("[query]", "Dot-notation path to query JSON (e.g. .users[0].name)")
	.option("-r, --raw", "Show raw content without formatting")
	.option("-c, --compact", "Minified JSON output")
	.option("-f, --frontmatter", "Extract and display YAML frontmatter as JSON")
	.option("--json", "Force treat input as JSON (useful with stdin)")
	.option("--md", "Force treat input as Markdown (useful with stdin)")
	.action(
		async (
			filePath: string | undefined,
			query: string | undefined,
			options: {
				raw?: boolean;
				compact?: boolean;
				frontmatter?: boolean;
				json?: boolean;
				md?: boolean;
			},
		) => {
			try {
				let content: string;
				let fileType: ReturnType<typeof detectByExtension>;

				if (filePath) {
					const absPath = path.resolve(filePath);
					content = await fs.readFile(absPath, "utf-8");
					fileType = detectByExtension(absPath);

					if (fileType === "unknown") {
						fileType = detectByContent(content);
					}
				} else {
					content = await readStdin();
					if (!content) {
						program.help();
						return;
					}
					fileType = "unknown";
				}

				if (options.json) fileType = "json";
				if (options.md) fileType = "markdown";

				if (fileType === "unknown") {
					fileType = detectByContent(content);
				}

				if (fileType === "json") {
					handleJson(content, query, options);
				} else if (fileType === "markdown") {
					handleMarkdown(content, options);
				} else {
					console.log(chalk.yellow("Unknown file type. Showing raw content:"));
					console.log(content);
				}
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				console.error(chalk.red("Error:"), msg);
				process.exit(1);
			}
		},
	);

function handleJson(
	content: string,
	query: string | undefined,
	options: { raw?: boolean; compact?: boolean },
) {
	const parsed = parseJson(content);
	const target = query ? queryJson(parsed, query) : parsed;

	if (target === undefined && query) {
		console.error(chalk.red(`No value found at path: ${query}`));
		process.exit(1);
	}

	if (options.raw) {
		console.log(JSON.stringify(target, null, options.compact ? 0 : 2));
	} else {
		console.log(highlightJson(target, options.compact));
	}
}

function handleMarkdown(
	content: string,
	options: { raw?: boolean; frontmatter?: boolean },
) {
	const { content: body, frontmatter } = parseMarkdown(content);

	if (options.frontmatter) {
		if (frontmatter) {
			console.log(highlightJson(frontmatter));
		} else {
			console.log(chalk.yellow("No frontmatter found."));
		}
		return;
	}

	// --raw echoes the source verbatim, frontmatter block included — printing
	// the parsed body here would silently drop it.
	if (options.raw) {
		console.log(content);
		return;
	}

	if (frontmatter) {
		console.log(chalk.dim("--- frontmatter ---"));
		console.log(highlightJson(frontmatter));
		console.log(chalk.dim("---\n"));
	}

	console.log(renderMarkdown(body));
}

program.parse();
