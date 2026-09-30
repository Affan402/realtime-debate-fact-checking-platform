export function validateDebate(title, topic) {
    const errors = [];

    if (!title || title.trim().length === 0) {
        errors.push("Title is missing.");
    }
    if (!topic || topic.trim().length === 0) {
        errors.push("Topic is required.");
    }
    if (title && title.length > 200) {
        errors.push("Title must be less than 200 characters.");
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}