interface Props {
	theme: "light" | "dark";
	onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
			title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
		>
			{theme === "dark" ? "Light" : "Dark"}
		</button>
	);
}
