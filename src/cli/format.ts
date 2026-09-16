import chalk from "chalk";
import { type MarkedExtension, marked } from "marked";
import { markedTerminal } from "marked-terminal";

// @types/marked-terminal@6 is typed against marked <12; this project is on
// marked 15, so the renderer needs a cast. Runtime behaviour is unaffected.
marked.use(
	markedTerminal({
		heading: chalk.bold.underline,
		strong: chalk.bold,
		em: chalk.italic,
		codespan: chalk.cyan,
		code: chalk.gray,
		listitem: chalk.white,
		showSectionPrefix: true,
	}) as MarkedExtension,
);

/** Syntax-highlight JSON for terminal output */
export function highlightJson(value: unknown, compact = false): string {
	const raw = JSON.stringify(value, null, compact ? 0 : 2);
	if (raw === undefined) return chalk.gray("undefined");

	return raw.replace(
		/("(?:\\.|[^"\\])*")(\s*)(:)?|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
		(
			match,
			str: string | undefined,
			gap: string | undefined,
			colon: string | undefined,
			bool: string | undefined,
			num: string | undefined,
		) => {
			if (str) {
				// `gap` is the whitespace the pattern had to consume to look for a
				// colon — always put it back, or indentation collapses.
				return colon
					? chalk.cyan(str) + gap + chalk.white(":")
					: chalk.green(str) + gap;
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
