import { useCallback, useState } from "react";
import { parseJson } from "../../../lib/json.js";
import { JsonQueryBar } from "./JsonQueryBar.tsx";
import { JsonTreeView } from "./JsonTreeView.tsx";

interface Props {
	content: string;
	dark: boolean;
}

export function JsonViewer({ content, dark }: Props) {
	const [queryResult, setQueryResult] = useState<{
		result: unknown;
		path: string;
	} | null>(null);

	let parsed: unknown;
	let parseError: string | null = null;
	try {
		parsed = parseJson(content);
	} catch (e) {
		parseError = e instanceof Error ? e.message : "Invalid JSON";
	}

	const handleQueryResult = useCallback((result: unknown, path: string) => {
		setQueryResult({ result, path });
	}, []);

	if (parseError) {
		return (
			<div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4">
				<p className="text-red-700 dark:text-red-300 font-medium">
					Invalid JSON
				</p>
				<p className="text-red-600 dark:text-red-400 text-sm mt-1 font-mono">
					{parseError}
				</p>
				<pre className="mt-4 text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-64">
					{content}
				</pre>
			</div>
		);
	}

	const displayData = queryResult ? queryResult.result : parsed;

	return (
		<div className="flex flex-col gap-4">
			<JsonQueryBar data={parsed} onResult={handleQueryResult} />

			{queryResult && (
				<div className="flex items-center gap-2 text-sm">
					<span className="font-mono text-gray-500 dark:text-gray-400">
						{queryResult.path}
					</span>
					{queryResult.result === undefined && (
						<span className="text-amber-600 dark:text-amber-400">
							— no match
						</span>
					)}
					<button
						type="button"
						onClick={() => setQueryResult(null)}
						className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						Clear
					</button>
				</div>
			)}

			<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 overflow-auto max-h-[70vh]">
				{displayData !== undefined ? (
					typeof displayData === "object" && displayData !== null ? (
						<JsonTreeView data={displayData} dark={dark} />
					) : (
						<pre className="font-mono text-sm text-gray-900 dark:text-gray-100">
							{JSON.stringify(displayData, null, 2)}
						</pre>
					)
				) : (
					<p className="text-gray-400 italic">undefined</p>
				)}
			</div>
		</div>
	);
}
