import { describe, expect, it } from "vitest";
import { highlightJson } from "../src/cli/format.js";
import { parseJson, queryJson } from "../src/lib/json.js";

describe("parseJson", () => {
	it("parses valid JSON", () => {
		const result = parseJson('{"a": 1}');
		expect(result).toEqual({ a: 1 });
	});

	it("strips single-line comments (JSONC)", () => {
		const input = `{
      // comment
      "a": 1
    }`;
		expect(parseJson(input)).toEqual({ a: 1 });
	});

	it("strips multi-line comments", () => {
		const input = `{
      /* comment
         here */
      "a": 1
    }`;
		expect(parseJson(input)).toEqual({ a: 1 });
	});

	it("throws on invalid JSON", () => {
		expect(() => parseJson("not json")).toThrow();
	});
});

describe("queryJson", () => {
	const data = {
		users: [
			{ name: "Alice", meta: { age: 30 } },
			{ name: "Bob", meta: { age: 25 } },
		],
		config: { debug: false },
	};

	it("returns full object for empty path", () => {
		expect(queryJson(data, "")).toEqual(data);
	});

	it("accesses top-level key", () => {
		expect(queryJson(data, "config")).toEqual({ debug: false });
	});

	it("accesses nested key", () => {
		expect(queryJson(data, "config.debug")).toBe(false);
	});

	it("accesses array by index with dot notation", () => {
		expect(queryJson(data, "users.0.name")).toBe("Alice");
	});

	it("accesses array by bracket notation", () => {
		expect(queryJson(data, "users[1].meta.age")).toBe(25);
	});

	it("returns undefined for missing path", () => {
		expect(queryJson(data, "nonexistent.path")).toBeUndefined();
	});
});

describe("highlightJson", () => {
	it("returns a string", () => {
		const result = highlightJson({ a: 1 });
		expect(typeof result).toBe("string");
	});

	it("handles null/booleans/numbers", () => {
		const result = highlightJson({ a: null, b: true, c: 42 });
		expect(result).toContain("null");
		expect(result).toContain("true");
		expect(result).toContain("42");
	});

	it("handles undefined input", () => {
		const result = highlightJson(undefined);
		expect(result).toContain("undefined");
	});

	it("produces compact output when requested", () => {
		const compact = highlightJson({ a: 1 }, true);
		expect(compact).not.toContain("\n");
	});
});
