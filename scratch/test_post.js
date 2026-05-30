async function testPost() {
    console.log("Sending POST request to http://localhost:3000/api/chatbot...");
    try {
        const response = await fetch('http://localhost:3000/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: "in cotton crops leaves are become yellow why??",
                lang: "en",
                history: []
            })
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response text:", text);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}
testPost();
