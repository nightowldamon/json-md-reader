import { useCallback, useState } from "react";
import {
	detectByContent,
	detectByExtension,
	type FileType,
} from "../../lib/detect.js";

export interface FileData {
	name: string;
	content: string;
	type: FileType;
}

export function useFileReader() {
	const [file, setFile] = useState<FileData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const readFile = useCallback((f: File) => {
		setError(null);
		const reader = new FileReader();
		reader.onload = () => {
			const content = reader.result as string;
			let type = detectByExtension(f.name);
			if (type === "unknown") {
				type = detectByContent(content);
			}
			setFile({ name: f.name, content, type });
		};
		reader.onerror = () => setError("Failed to read file");
		reader.readAsText(f);
	}, []);

	const clear = useCallback(() => {
		setFile(null);
		setError(null);
	}, []);

	return { file, error, readFile, clear };
}
