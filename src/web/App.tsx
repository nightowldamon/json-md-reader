import { FileDropZone } from "./components/FileDropZone.tsx";
import { JsonViewer } from "./components/json/JsonViewer.tsx";
import { MarkdownViewer } from "./components/markdown/MarkdownViewer.tsx";
import { ThemeToggle } from "./components/ThemeToggle.tsx";
import { useFileReader } from "./hooks/useFileReader.ts";
import { useTheme } from "./hooks/useTheme.ts";

export default function App() {
	const { theme, toggle } = useTheme();
	const { file, error, readFile, clear } = useFileReader();

	return (
		<div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
			<header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
				<div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-3">
					<div className="flex items-center gap-3">
						<h1 className="text-lg font-bold tracking-tight">jmd</h1>
						{file && (
							<>
								<span className="text-gray-300 dark:text-gray-600">/</span>
								<span className="text-sm font-mono text-gray-500 dark:text-gray-400">
									{file.name}
								</span>
								<span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase">
									{file.type}
								</span>
							</>
						)}
					</div>
					<div className="flex items-center gap-2">
						{file && (
							<button
								type="button"
								onClick={clear}
								className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
							>
								Close
							</button>
						)}
						<ThemeToggle theme={theme} onToggle={toggle} />
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-6 py-8">
				{error && (
					<div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
						{error}
					</div>
				)}

				{!file ? (
					<div className="mt-24">
						<FileDropZone onFile={readFile} />
						<p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
							Supports .json, .jsonc, .json5, .md, .markdown, .mdx
						</p>
					</div>
				) : file.type === "json" ? (
					<JsonViewer content={file.content} dark={theme === "dark"} />
				) : file.type === "markdown" ? (
					<MarkdownViewer content={file.content} dark={theme === "dark"} />
				) : (
					<pre className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 text-sm font-mono overflow-auto">
						{file.content}
					</pre>
				)}
			</main>
		</div>
	);
}
