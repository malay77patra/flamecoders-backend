

function getJwtFormat(ms) {
    if (ms < 1000) throw new Error("Expiration time must be at least 1 second.");
    if (ms > 30 * 24 * 60 * 60 * 1000) throw new Error("Expiration time cannot exceed 30 days.");

    const seconds = ms / 1000;

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 60 * 60) return `${seconds / 60}m`;
    if (seconds < 24 * 60 * 60) return `${seconds / (60 * 60)}h`;
    return `${seconds / (24 * 60 * 60)}d`;
}

function extractPreview(metadata) {
    let previewTxt = "";

    function walkContent(content) {
        if (!content || previewTxt.length >= 100) return;

        content.forEach((block) => {
            if (previewTxt.length >= 100) return;

            if (block.type === "text" && block.text) {
                if (previewTxt.length > 0) {
                    previewTxt += " ";
                }
                previewTxt += block.text;
            }
            if (block.content) {
                walkContent(block.content);
            }
        });
    }

    walkContent(metadata.content);

    previewTxt = previewTxt.replace(/\s+/g, " ").trim();

    if (previewTxt.length > 100) {
        previewTxt = previewTxt.slice(0, 97).trim() + "...";
    }

    return previewTxt;
}




module.exports = {
    getJwtFormat,
    extractPreview,
};