import { validateDebate } from "./validateDebate.js"

describe("validateDebate", () => {
    test("returns valid=true when title and topic are provided", () => {
        const result = validateDebate("AI regulation", "Technology")
        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
    })

    test("returns valid=false when title is missing", () => {
        const result = validateDebate("", "Technology")
        expect(result.valid).toBe(false)
        expect(result.errors).toContain("Title is required.")
    })

    test("returns valid=false when topic is missing", () => {
        const result = validateDebate("AI regulation", "")
        expect(result.valid).toBe(false)
        expect(result.errors).toContain("Topic is required.")
    })

    test("returns valid=false when title is too long", () => {
        const longTitle = "a".repeat(201)
        const result = validateDebate(longTitle, "Technology")
        expect(result.valid).toBe(false)
        expect(result.errors).toContain("Title must be less than 200 characters.")
    })
})