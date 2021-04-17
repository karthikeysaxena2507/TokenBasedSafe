const sanitizeHtml = require("sanitize-html");

// FUNCTION TO SANITIZE ANY CONTENT FROM SCRIPT, TAGS ETC.
const sanitize = (content) => {
    const sanitizedContent = sanitizeHtml(content, {
        allowedAttributes: [],
        allowedTags: []
    });
    return sanitizedContent;
}

module.exports = { sanitize };