document.querySelector("#searchButton").addEventListener("click", () => {
    window.location.href = `/?search=${document.querySelector("input").value}`;
});