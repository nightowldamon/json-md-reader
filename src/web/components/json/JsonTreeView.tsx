import { JsonView, darkStyles, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

interface Props {
	data: unknown;
	dark: boolean;
}

export function JsonTreeView({ data, dark }: Props) {
	return (
		<div className="overflow-auto text-sm">
			<JsonView
				data={data as object}
				style={dark ? darkStyles : defaultStyles}
			/>
		</div>
	);
}
