const urlParams = new URLSearchParams(window.location.search)
const queryVal = urlParams.get('q');
const filterBranch = urlParams.get('branch');
const filterBatch = urlParams.get('batch');
var searchBoxCount = 0; //just to get element id
var lastVisibleDoc = null;
var searchBoxElements = "";
var searchResultShowAny = false;
var maxDocLimit = 10; //maxm doc load at first time

function loadSearchEngine() {
    if (queryVal != null) {
        //req query
        document.getElementById("searchResultHeading").innerHTML = `Showing result for "<span id="searchQuery">${queryVal}</span>"`;
        document.getElementById("searchBar").value = queryVal;
        if (filterBatch != null) {
            document.getElementById("filterByBatch").value = filterBatch;
        }
        if (filterBranch != null) {
            document.getElementById("filterByBranch").value = filterBranch;
        }
        searchQuery(queryVal,null,maxDocLimit,filterBranch,filterBatch)
    }
    else {
        //no query parameter
        document.getElementById("searchResultloader").style.display = "none";
        document.getElementById("searchResultHeading").innerHTML = `Knock! Knock!
                                                                    <br>
                                                                    <i>Who's this?</i>
                                                                    <br>
                                                                    Search Page!
                                                                    <br>
                                                                    <i>Search Page who?</i>
                                                                    <br>
                                                                    Who likes to search<br>
                                                                    Please enter a search value`
    }
}

function searchQuery(value,lastDoc,limit,filter1,filter2) {
    //value can be multiword make it in array and search the db
    var searchResultContainer = document.getElementById("searchResultContainer");
    
    var queryArray = value.toLowerCase().split(" ");
    if (lastDoc == null) {
        //show from beginnng
        var userRefs = searchRefs(queryArray,filter1,filter2).limit(limit); //allowed only 10! just in case, don't want any error
        userRefs.get()
            .then(function(querySnapshot) {
                lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length-1];
                searchResultManager(querySnapshot.size);
                searchResultContainer.innerHTML = searchBoxElements;
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var user = doc.data();
                    var id = doc.id;
                    searchResultBoxGenerator(id,user.Name,user.Branch,user.Batch,user.profileImage)
                        .then((element)=>{
                            searchBoxElements += element
                            searchResultContainer.innerHTML = searchBoxElements
                        })
                    searchBoxCount++;
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }
    else {
        var userRefs = searchRefs(queryArray,filter1,filter2).startAfter(lastDoc).limit(limit); //allowed only 10! just in case, don't want any error
        userRefs.get()
            .then(function(querySnapshot) {
                lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length-1];
                searchResultManager(querySnapshot.size);
                searchResultContainer.innerHTML = searchBoxElements;
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var user = doc.data();
                    var id = doc.id;
                    searchResultBoxGenerator(id,user.Name,user.Branch,user.Batch,user.profileImage)
                        .then((element)=>{
                            searchBoxElements += element
                            searchResultContainer.innerHTML = searchBoxElements
                        })
                    searchBoxCount++;
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }
}

function searchResultBoxGenerator(id,name,branch,batch,imageURL) {
    var profileBoxElement = new Promise((res,rej)=>{
        if (imageURL != undefined) {
            fetchProfilePreviewImage(id,imageURL).then((url)=>{
                var profileBox = `<div class=searchResultBox>
                                    <div class="searchResultImageHolder">
                                        <img class="searchResultImage" src="${url}"/>
                                    </div>
                                    <div class="searchDetailsHolder">
                                        <a href="../profile/?name=${name}&id=${id}" class="searchResultName">${name}</a>
                                        <br>
                                        <span class="searchResultBranch">${branch}</span>
                                        <br>
                                        <span class="searchResultBatch">${batch}</span>
                                    </div>
                                </div>`
                res(profileBox)
            })
        }
        else {
            var profileBox = `<div class=searchResultBox>
                                    <div class="searchResultImageHolder">
                                        <img class="searchResultImage" src="../resource/img/aces-blue-bg-portrait.jpg"/>
                                    </div>
                                    <div class="searchDetailsHolder">
                                        <a href="../profile/?name=${name}&id=${id}" class="searchResultName">${name}</a>
                                        <br>
                                        <span class="searchResultBranch">${branch}</span>
                                        <br>
                                        <span class="searchResultBatch">${batch}</span>
                                    </div>
                                </div>`
            res(profileBox)
        }
    })
    return profileBoxElement;
}

function fetchProfilePreviewImage(id,fileName) {
    var storageRef = firebase.storage().ref();
    return storageRef.child("users/"+id+"/"+fileName).getDownloadURL();
}
function searchResultManager(size) {
    if (!searchResultShowAny && size == 0) {
        //show no result found
        document.getElementById("noResultFound").style.display = "block";
        document.getElementById("searchResultloader").style.display = "none";
        document.getElementById("loadMoreResultBTN").style.display = "none";
    }
    else {
        searchResultShowAny = true;
        if (size == maxDocLimit) {
            document.getElementById("searchResultloader").style.display = "none";
            document.getElementById("loadMoreResultBTN").style.display = "block";
        }
        else if(size < maxDocLimit) {
            document.getElementById("searchResultloader").style.display = "none";
            document.getElementById("loadMoreResultBTN").style.display = "none";
        }
        else {
            document.getElementById("searchResultloader").style.display = "none";
            document.getElementById("loadMoreResultBTN").style.display = "none";
        }
    }
}
function fetchMoreSearchResult() {
    document.getElementById("searchResultloader").style.display = "block";
    document.getElementById("loadMoreResultBTN").style.display = "none";
    maxDocLimit = 5;
    searchQuery(queryVal,lastVisibleDoc,maxDocLimit,filterBranch,filterBatch);
}

function searchRefs(value,filter1,filter2) {
    //value is in array
    /**
     * filter1 is branch
     * filter2 is batch
     */
    var queryArray = value.splice(0,10) ; //only 10 values are allowed as per firestore(just in case)
    var userRefs = firebase.firestore().collection("users");
    if (filter1 == null && filter2 == null) {
        userRefs = userRefs.where("query", "array-contains-any", queryArray) ;
        return userRefs;
    }
    else if (filter1 != null && filter2 != null) {
        userRefs = userRefs.where("query", "array-contains-any", queryArray).where("Branch","==",filter1).where("Batch","==",filter2);
        return userRefs;
    }
    else if(filter1 != null && filter2 == null) {
        userRefs = userRefs.where("query", "array-contains-any", queryArray).where("Branch","==",filter1);
        return userRefs;
    }
    else if(filter1 == null && filter2 != null) {
        userRefs = userRefs.where("query", "array-contains-any", queryArray).where("Batch","==",filter2);
        return userRefs;
    }
    else {
        //never expecting
        userRefs = userRefs.where("query", "array-contains-any", queryArray) ;
        return userRefs;
    }
}
function changeFilterParams() {
    var errorElement = document.getElementById("errorInSearchFilter");
    errorElement.style.display = "none";
    document.getElementById("filterBTN").style.background = "rgb(51, 16, 207)"
}
function filterSearchResult() {
    var filterBranchVal = document.getElementById("filterByBranch").value;
    var filterBatchVal = document.getElementById("filterByBatch").value;
    var errorElement = document.getElementById("errorInSearchFilter");
    if (filterBranchVal == "" && filterBatchVal == "") {
        errorElement.innerHTML = "Please Select any filter parameters"
        errorElement.style.display = "block";
    }
    else if(filterBranchVal != "" && filterBatchVal != "") {
        if (verifiyFields(filterBatchVal)) {
            window.location = `?q=${queryVal}&branch=${filterBranchVal}&batch=${filterBatchVal}`
        }
    }
    else if(filterBranchVal == "" && filterBatchVal != "") {
        if (verifiyFields(filterBatchVal)) {
            window.location = `?q=${queryVal}&batch=${filterBatchVal}`
        }
    }
    else if(filterBranchVal != "" && filterBatchVal == "") {
        window.location = `?q=${queryVal}&branch=${filterBranchVal}`
    }
}
function verifiyFields(value) {
    var errorElement = document.getElementById("errorInSearchFilter");
    var currYear = new Date().getFullYear() + 10;
    if (value > currYear) {
        errorElement.style.display = "block";
        errorElement.innerHTML = "Please Select valid Batch Value"
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