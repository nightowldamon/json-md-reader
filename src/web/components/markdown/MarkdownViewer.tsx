import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
	oneDark,
	oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { parseMarkdown } from "../../../lib/markdown.js";
import { FrontmatterCard } from "./FrontmatterCard.tsx";

interface Props {
	content: string;
	dark: boolean;
}

export function MarkdownViewer({ content, dark }: Props) {
	const { content: body, frontmatter } = parseMarkdown(content);

	return (
		<div>
			{frontmatter && <FrontmatterCard data={frontmatter} />}

			<div className="prose dark:prose-invert max-w-none">
				<Markdown
					remarkPlugins={[remarkGfm]}
					components={{
						code({ className, children, ...rest }) {
							const match = /language-(\w+)/.exec(className || "");
							const codeStr = String(children).replace(/\n$/, "");

							if (match) {
								return (
									<SyntaxHighlighter
										style={dark ? oneDark : oneLight}
										language={match[1]}
										PreTag="div"
									>
										{codeStr}
									</SyntaxHighlighter>
								);
							}
							return (
								<code className={className} {...rest}>
									{children}
								</code>
							);
						},
					}}
				>
					{body}
				</Markdown>
			</div>
		</div>
	);
}
