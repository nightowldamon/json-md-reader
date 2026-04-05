import { type DragEvent, useCallback, useRef, useState } from "react";

interface Props {
	onFile: (file: File) => void;
}

export function FileDropZone({ onFile }: Props) {
	const [dragging, setDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleDrop = useCallback(
		(e: DragEvent) => {
			e.preventDefault();
			setDragging(false);
			const file = e.dataTransfer.files[0];
			if (file) onFile(file);
		},
		[onFile],
	);

	const handleDragOver = useCallback((e: DragEvent) => {
		e.preventDefault();
		setDragging(true);
	}, []);

	const handleDragLeave = useCallback(() => setDragging(false), []);

	const handleClick = useCallback(() => inputRef.current?.click(), []);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) onFile(file);
		},
		[onFile],
	);

	return (
		<div
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") handleClick();
			}}
			role="button"
			tabIndex={0}
			className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 text-center transition-colors cursor-pointer ${
				dragging
					? "border-blue-500 bg-blue-50 dark:bg-blue-950"
					: "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
			}`}
		>
			<div className="text-4xl mb-4 text-gray-400">
				{dragging ? "+" : "{}"}
			</div>
			<p className="text-lg font-medium text-gray-700 dark:text-gray-300">
				Drop a JSON or Markdown file here
			</p>
			<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
				or click to browse
			</p>
			<input
				ref={inputRef}
				type="file"
				accept=".json,.jsonc,.json5,.md,.markdown,.mdx"
				onChange={handleInputChange}
				className="hidden"
			/>
		</div>
	);
}
