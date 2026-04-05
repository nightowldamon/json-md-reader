import { useCallback, useState } from "react";
import { queryJson } from "../../../lib/json.js";

interface Props {
	data: unknown;
	onResult: (result: unknown, path: string) => void;
}

export function JsonQueryBar({ data, onResult }: Props) {
	const [path, setPath] = useState("");

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const result = queryJson(data, path);
			onResult(result, path);
		},
		[data, path, onResult],
	);

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<input
				type="text"
				value={path}
				onChange={(e) => setPath(e.target.value)}
				placeholder=".users[0].name"
				className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-mono text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				type="submit"
				className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
			>
				Query
			</button>
		</form>
	);
}
