function fetchMoreSearchResult() {
    document.getElementById("searchResultloader").style.display = "block";
    document.getElementById("loadMoreResultContainer").style.display = "none";
    maxDocLimit = 1;
    if (queryVal == null) {
        //Show all users
        searchQuery(null,filterBranch,batch_FilterType,filterBatch,fromBatch,toBatch,filterName,lastVisibleDoc,maxDocLimit)
    }
    else {
        if (queryVal.toLowerCase() == "all") {
            searchQuery(null,filterBranch,batch_FilterType,filterBatch,fromBatch,toBatch,filterName,lastVisibleDoc,maxDocLimit)
        }
        else {
            //show requested users
            searchQuery(queryVal,filterBranch,batch_FilterType,filterBatch,fromBatch,toBatch,filterName,lastVisibleDoc,maxDocLimit)
        }
    }
}
function fetchAllSearchResult() {
    document.getElementById("searchResultloader").style.display = "block";
    document.getElementById("loadMoreResultContainer").style.display = "none";
    searchTableElements = searchTableElementsHeader;//make table from beginning
    maxDocLimit = null; //will fetch all result at once
    if (queryVal == null) {
        //Show all users
        searchQuery(null,filterBranch,batch_FilterType,filterBatch,fromBatch,toBatch,filterName,null,maxDocLimit)
    }
    else {
        if (queryVal.toLowerCase() == "all") {
            searchQuery(null,filterBranch,batch_FilterType,filterBatch,fromBatch,toBatch,filterName,null,maxDocLimit)
        }
        else {
            //show requested users
            searchQuery(queryVal,filterBranch,batch_FilterType,filterBatch,fromBatch,toBatch,filterName,null,maxDocLimit)
        }
    }
}

function searchResultManager(size) {
    if (!searchResultShowAny && size == 0) {
        //show no result found
        document.getElementById("noResultFound").style.display = "block";
        document.getElementById("searchResultloader").style.display = "none";
        document.getElementById("loadMoreResultContainer").style.display = "none";
    }
    else {
        searchResultShowAny = true;
        if (size == maxDocLimit) {
            document.getElementById("searchResultloader").style.display = "none";
            document.getElementById("loadMoreResultContainer").style.display = "inline";
        }
        else if(size < maxDocLimit) {
            document.getElementById("searchResultloader").style.display = "none";
            document.getElementById("loadMoreResultContainer").style.display = "none";
        }
        else {
            document.getElementById("searchResultloader").style.display = "none";
            document.getElementById("loadMoreResultContainer").style.display = "none";
        }
    }
}
function adminSearch(){
    var queryField = document.getElementById("adminSearchBar");
    if (queryField.value != "") {
        window.location = `?q=${queryField.value}`
    }
    else {
        queryField.style["border-color"] = "red";
        setTimeout(()=>{
            queryField.style["border-color"] = "#ccc";
        },2000)
    }
}
function filterAdminSearch(){
    var queryParams = `?`
    if (queryVal != null) {
        queryParams = `?q=${queryVal}`
    }
    var filterName = document.getElementById("filterByName").value;
    var filterBranch = document.getElementById("filterByBranch").value;
    var batchFilterType = document.getElementById("batchFilterType").value;
    var batchFilter = document.getElementById("batchFilterTypeStatic").value;
    var batchFilterFrom = document.getElementById("batchFilterFrom").value
    var batchFilterTo = document.getElementById("batchFilterTo").value
    var errorElement = document.getElementById("errorInSearchFilter");
    if (filterName == "" && filterBranch == "" && batchFilter == "" && batchFilterFrom == "" && batchFilterTo == "") {
        errorElement.style.display = "block";
        errorElement.innerHTML = "Please Select any field!"
        return;
    }
    else {
        if (filterName != "") {
            queryParams += `&nameFilter=${filterName}`
        }
        if (filterBranch != "") {
            queryParams += `&branch=${filterBranch}`
        }
        if (batchFilterType == "static") {
            if (batchFilter != "") {
                if (verifiyFields(batchFilter)) {
                    queryParams += `&batchFilterType=${batchFilterType}&batch=${batchFilter}`
                }
                else {
                    return;
                }
            }
        }
        else if(batchFilterType == "range") {
            if (batchFilterFrom != "" || batchFilterTo != "") {
                if (verifiyFields(batchFilterFrom) && verifiyFields(batchFilterTo)) {
                    queryParams += `&batchFilterType=${batchFilterType}&batchFrom=${batchFilterFrom}&batchTo=${batchFilterTo}`
                }
                else {
                    return;
                }
            }
        }
    }
    window.location = queryParams;
}

function verifiyFields(value) {
    var errorElement = document.getElementById("errorInSearchFilter");
    var currYear = new Date().getFullYear()
    if (value > currYear) {
        errorElement.style.display = "block";
        errorElement.innerHTML = "Whoops! Looks like we can't see into the future<br>Please Select valid Batch Value"
        return false;
    }
    else if(value < 1978) {
        errorElement.style.display = "block";
        errorElement.innerHTML = "Please Select valid Batch Value"
        return false;
    }
    else {
        errorElement.style.display = "none";
        return true;
    }
}
function changeInFilterParams() {
    var errorElement = document.getElementById("errorInSearchFilter");
    errorElement.style.display = "none";
}
function setupFilterDefault() {
    if (batch_FilterType != null) {
        document.getElementById("batchFilterType").value = batch_FilterType;
        batchFilterType(batch_FilterType)
    }
    if (queryVal != null) {
        document.getElementById("adminSearchBar").value = queryVal;
    }
    if (filterName != null) {
        document.getElementById("filterByName").value = filterName;
    }
    if (filterBranch != null) {
        document.getElementById("filterByBranch").value = filterBranch;
    }
    if (filterBatch != null) {
        document.getElementById("batchFilterTypeStatic").value = filterBatch;
    }
    if (fromBatch != null) {
        document.getElementById("batchFilterFrom").value = fromBatch;
    }
    if (toBatch != null) {
        document.getElementById("batchFilterTo").value = toBatch;
    }
}
function openMoreUserOption(val) {
    val.childNodes[2].classList.toggle("show");
}
window.onclick = function(event) {
    if (!event.target.matches('.adminUserMoreOptionBTN')) {
      var dropdowns = document.getElementsByClassName("moreOption-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }