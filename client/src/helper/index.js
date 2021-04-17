const sanitizeHtml = require("sanitize-html");

/**
 * FUNCTION TO SANITIZE INPUT CONTENT FROM HTML, SCRIPT TAGS ETC.
 * @param {String} content 
 * @returns santized content
 */
const sanitize = (content) => {
    const sanitizedContent = sanitizeHtml(content, {
        allowedAttributes: [],
        allowedTags: []
    });
    return sanitizedContent;
}

module.exports = { sanitize };