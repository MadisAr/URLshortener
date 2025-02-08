document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("submitButton");
  const resultElement = document.getElementById("result");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const urlInput = document.getElementById("urlInput").value;
    fetch("/api/shorturl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        url: urlInput,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          resultElement.innerHTML = `shortened link: <a href="http://localhost:3000/link/${data.result}">http://localhost:3000/link/${data.result}</a>`;
        } else {
          resultElement.textContent = `${data.result}`;
        }
        resultElement.classList.contains("hidden") &&
          resultElement.classList.remove("hidden");
      })
      .catch((err) => console.log(err));
  });
});
