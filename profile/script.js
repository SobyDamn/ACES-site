const urlParams = new URLSearchParams(window.location.search)
const uid = urlParams.get('id')
const userName = urlParams.get('name')
console.log(uid,userName)