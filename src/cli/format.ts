import chalk from "chalk";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";

marked.use(
	markedTerminal({
		heading: chalk.bold.underline,
		strong: chalk.bold,
		em: chalk.italic,
		codespan: chalk.cyan,
		code: chalk.gray,
		listitem: chalk.white,
		showSectionPrefix: true,
	}),
);

/** Syntax-highlight JSON for terminal output */
export function highlightJson(value: unknown, compact = false): string {
	const raw = JSON.stringify(value, null, compact ? 0 : 2);
	if (raw === undefined) return chalk.gray("undefined");

	return raw.replace(
		/("(?:\\.|[^"\\])*")\s*(:)?|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
		(match, str: string | undefined, colon: string | undefined, bool: string | undefined, num: string | undefined) => {
			if (str) {
				return colon ? chalk.cyan(str) + chalk.white(":") : chalk.green(str);
			}
			if (bool) return chalk.yellow(bool);
			if (num) return chalk.magenta(num);
			return match;
		},
	);
}

/** Render markdown for terminal display */
export function renderMarkdown(content: string): string {
	return marked(content) as string;
}
