// test_request.js
const data = { image: "https://example.com/your-test-image.jpg" };

fetch("https://forever-scribbles.vercel.app/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));