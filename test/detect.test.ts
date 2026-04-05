import { describe, expect, it } from "vitest";
import { detectByContent, detectByExtension } from "../src/lib/detect.js";

describe("detectByExtension", () => {
	it("detects .json", () => expect(detectByExtension("data.json")).toBe("json"));
	it("detects .jsonc", () => expect(detectByExtension("config.jsonc")).toBe("json"));
	it("detects .json5", () => expect(detectByExtension("data.json5")).toBe("json"));
	it("detects .md", () => expect(detectByExtension("README.md")).toBe("markdown"));
	it("detects .markdown", () => expect(detectByExtension("doc.markdown")).toBe("markdown"));
	it("detects .mdx", () => expect(detectByExtension("page.mdx")).toBe("markdown"));
	it("returns unknown for .txt", () => expect(detectByExtension("notes.txt")).toBe("unknown"));
	it("returns unknown for no extension", () => expect(detectByExtension("Makefile")).toBe("unknown"));
});

describe("detectByContent", () => {
	it("detects JSON object", () => expect(detectByContent('{ "a": 1 }')).toBe("json"));
	it("detects JSON array", () => expect(detectByContent("[1, 2, 3]")).toBe("json"));
	it("detects markdown heading", () => expect(detectByContent("# Hello")).toBe("markdown"));
	it("detects markdown frontmatter", () => expect(detectByContent("---\ntitle: x\n---")).toBe("markdown"));
	it("returns unknown for plain text", () => expect(detectByContent("just some text")).toBe("unknown"));
	it("handles leading whitespace", () => expect(detectByContent("  { \"a\": 1 }")).toBe("json"));
});
