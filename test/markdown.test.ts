import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../src/cli/format.js";
import { highlightJson } from "../src/cli/format.js";
import { parseMarkdown } from "../src/lib/markdown.js";

const fixturePath = path.resolve(import.meta.dirname, "fixtures/sample.md");

describe("parseMarkdown", () => {
	it("extracts frontmatter", async () => {
		const raw = await fs.readFile(fixturePath, "utf-8");
		const result = parseMarkdown(raw);
		expect(result.frontmatter).toEqual({
			title: "Test Document",
			author: "Jane Doe",
			tags: ["markdown", "test"],
		});
	});

	it("returns body without frontmatter delimiters", async () => {
		const raw = await fs.readFile(fixturePath, "utf-8");
		const result = parseMarkdown(raw);
		expect(result.content).toContain("# Hello World");
		expect(result.content).not.toContain("title:");
	});

	it("returns null frontmatter when none present", () => {
		const result = parseMarkdown("# Just a heading\n\nSome text.");
		expect(result.frontmatter).toBeNull();
		expect(result.content).toContain("# Just a heading");
	});
});

describe("renderMarkdown", () => {
	it("returns a rendered string", () => {
		const result = renderMarkdown("# Hello\n\n**bold** text");
		expect(typeof result).toBe("string");
		expect(result).toContain("Hello");
		expect(result).toContain("bold");
	});
});

describe("renderFrontmatter", () => {
	it("returns highlighted JSON string", () => {
		const result = highlightJson({ title: "Test" });
		expect(result).toContain("title");
		expect(result).toContain("Test");
	});
});
