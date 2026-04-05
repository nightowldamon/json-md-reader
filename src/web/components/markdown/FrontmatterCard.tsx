interface Props {
	data: Record<string, unknown>;
}

export function FrontmatterCard({ data }: Props) {
	return (
		<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 mb-4">
			<p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
				Frontmatter
			</p>
			<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
				{Object.entries(data).map(([key, value]) => (
					<div key={key} className="contents">
						<dt className="font-mono text-gray-500 dark:text-gray-400">
							{key}
						</dt>
						<dd className="font-mono text-gray-900 dark:text-gray-100">
							{Array.isArray(value) ? value.join(", ") : String(value)}
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
}
