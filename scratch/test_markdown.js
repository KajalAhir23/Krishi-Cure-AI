function parseMarkdown(text) {
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    const lines = html.split('\n');
    let result = [];
    let inList = null;

    for (let line of lines) {
        const olMatch = line.match(/^\s*\d+\.\s+(.+)$/);
        const ulMatch = line.match(/^\s*[-*+]\s+(.+)$/);

        if (olMatch) {
            if (inList !== 'ol') {
                if (inList) result.push(`</${inList}>`);
                result.push('<ol>');
                inList = 'ol';
            }
            result.push(`<li>${olMatch[1]}</li>`);
        } else if (ulMatch) {
            if (inList !== 'ul') {
                if (inList) result.push(`</${inList}>`);
                result.push('<ul>');
                inList = 'ul';
            }
            result.push(`<li>${ulMatch[1]}</li>`);
        } else {
            if (inList) {
                result.push(`</${inList}>`);
                inList = null;
            }
            if (line.trim() === '') {
                result.push('<br>');
            } else {
                result.push(`<p>${line}</p>`);
            }
        }
    }
    if (inList) {
        result.push(`</${inList}>`);
    }

    return result.join('\n');
}

const input = `Yellow leaves in cotton crops can be a sign of a problem. Here are some possible reasons:

1. **Nutrient deficiency**: Lack of nutrients like nitrogen, iron, or magnesium can cause yellow leaves.
2. **Water stress**: Too little or too much water can stress the plant, leading to yellow leaves.

To fix the issue, you can try:

- Check soil moisture: Ensure the soil is not too dry or waterlogged.
- Fertilize: Apply a balanced fertilizer to provide essential nutrients.`;

console.log(parseMarkdown(input));
