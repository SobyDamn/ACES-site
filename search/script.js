const urlParams = new URLSearchParams(window.location.search)
const query = urlParams.get('q')
function searchResult() {
    document.getElementById("searchValue").innerText = query;
}