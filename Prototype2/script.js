document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById("navbar");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        if (window.scrollY > lastScrollY) {
            navbar.classList.add("hidden");
        } else {
            navbar.classList.remove("hidden");
        }
        lastScrollY = window.scrollY;
    });

    // Section Slide-In Animation
    const sections = document.querySelectorAll(".section");
    const revealSection = () => {
        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100) {
                section.classList.add("show");
            }
        });
    };

    window.addEventListener("scroll", revealSection);
    window.addEventListener("load", revealSection);

    // Chatbot Logic
    const chatMessages = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");

    function addMessage(message, isUser) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleSubmit() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = "";

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message }),
            });

            const data = await response.json();
            if (data.response) {
                addMessage(data.response, false);
            } else {
                addMessage("I didn't quite catch that. Try again!", false);
            }
        } catch (error) {
            console.error("Error:", error);
            addMessage("Error connecting to server. Try again later.", false);
        }
    }

    sendButton.addEventListener("click", handleSubmit);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSubmit();
    });

    // Image Generation Logic
    const generateImageBtn = document.getElementById("generateImageBtn");
    const imagePrompt = document.getElementById("imagePrompt");
    const imageResult = document.getElementById("imageResult");

    generateImageBtn.addEventListener("click", async function () {
        const promptText = imagePrompt.value.trim();
        if (promptText === "") return;

        imageResult.innerHTML = "<p>Generating...</p>";

        try {
            const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_API_KEY", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Generate an image of: ${promptText}` }] }]
                })
            });

            const data = await response.json();

            if (data && data.candidates && data.candidates.length > 0) {
                const imageUrl = data.candidates[0].content; // Ensure this matches the API's actual response
                imageResult.innerHTML = `<img src="${imageUrl}" alt="Generated Image">`;
            } else {
                imageResult.innerHTML = "<p>Failed to generate image.</p>";
            }
        } catch (error) {
            console.error("Error:", error);
            imageResult.innerHTML = "<p>Error generating image.</p>";
        }
    });
});
function reviewCode() {
    const code = document.getElementById("codeInput").value;
    let review = "✅ Your code looks clean! Consider adding comments.";

    if (code.includes("alert(")) {
        review = "⚠️ Avoid using 'alert()' in production code.";
    }

    document.getElementById("reviewOutput").innerText = review;
}
document.addEventListener("DOMContentLoaded", function () {
    // Initialize CodeMirror Editors
    const htmlEditor = CodeMirror.fromTextArea(document.getElementById("html-code"), {
        mode: "xml",
        theme: "dracula",
        lineNumbers: true,
        autoCloseTags: true
    });

    const cssEditor = CodeMirror.fromTextArea(document.getElementById("css-code"), {
        mode: "css",
        theme: "dracula",
        lineNumbers: true,
        autoCloseBrackets: true
    });

    const jsEditor = CodeMirror.fromTextArea(document.getElementById("js-code"), {
        mode: "javascript",
        theme: "dracula",
        lineNumbers: true,
        autoCloseBrackets: true
    });

    // Function to update the preview
    function updatePreview() {
        const htmlCode = htmlEditor.getValue();
        const cssCode = `<style>${cssEditor.getValue()}</style>`;
        const jsCode = `<script>${jsEditor.getValue()}<\/script>`;

        const previewFrame = document.getElementById("preview");
        const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;

        previewDocument.open();
        previewDocument.write(`<!DOCTYPE html>
        <html>
        <head>${cssCode}</head>
        <body>${htmlCode} ${jsCode}</body>
        </html>`);
        previewDocument.close();
    }

    // Run Code Button Click Event
    document.getElementById("run-code").addEventListener("click", updatePreview);
});
document.getElementById("review-code").addEventListener("click", async () => {
    const code = document.getElementById("code-input").value;
    if (!code.trim()) {
        document.getElementById("review-output").innerText = "Please enter some code first!";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/ai/get-review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code })
        });

        const data = await response.json();
        document.getElementById("review-output").innerText = data;
    } catch (error) {
        document.getElementById("review-output").innerText = "Error fetching review.";
    }
});
