const urlParams = new URLSearchParams(window.location.search)
const queryVal = urlParams.get('q');
const filterBranch = urlParams.get('branch');
const filterBatch = urlParams.get('batch');
const batch_FilterType = urlParams.get('batchFilterType');
const fromBatch = urlParams.get('batchFrom');
const toBatch = urlParams.get('batchTo');
const filterName = urlParams.get('nameFilter');
var searchResultShowAny = false;
var lastVisibleDoc = null;
var searchBoxElements = "";
var searchTableElements = "";
var searchTableElementsHeader = `<tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Branch</th>
                            <th>Batch</th>
                            <th>Email</th>
                            <th>Number</th>
                        </tr>`;
var maxDocLimit = 1; //maxm doc load at first time

function batchFilterType(value) {
    if (value == "static") {
        document.getElementById("batchFilterTypeStatic").style.display = "inline";
        document.getElementById("batchFilterTypeRangeContainer").style.display = "none";
    }
    else {
        document.getElementById("batchFilterTypeStatic").style.display = "none";
        document.getElementById("batchFilterTypeRangeContainer").style.display = "block";
    }
}

function changeSearchResultType() {
    searchBoxElements = "";
    searchTableElements = searchTableElementsHeader;
    lastVisibleDoc = null;
    document.getElementById("searchResultloader").style.display = "block";
    loadAdminSearchEngine();
}

//Search functions
function loadAdminSearchEngine() {
    searchTableElements = searchTableElementsHeader;
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

function searchQuery(value,fltrBranch,batchFltrType,fltrBatch,fltrBatchRange1,fltrBatchRange2,filterName,lastDoc,maxLimit) {
    var searchResultType = document.getElementById("searchResultType").value;
    var userRefs = searchQueryRefsGenerator(value,fltrBranch,batchFltrType,fltrBatch,fltrBatchRange1,fltrBatchRange2,filterName);
    if (lastDoc == null) {
        //show from beginning
        if (maxLimit != null) {
            userRefs = userRefs.limit(maxLimit)
        }
        userRefs.get()
            .then(function(querySnapshot) {
                searchResultManager(querySnapshot.size);
                lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length-1];
                document.getElementById("searchResultContainerTypeList").innerHTML = searchBoxElements;
                document.getElementById("searchResultTypeTable").innerHTML = searchTableElements;
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var user = doc.data();
                    var id = doc.id;
                    searchResultGenerator(id,user.Name,user.Branch,user.Batch,user.Email,user.Contact,user.profileImage,user.admin,user.adminBy,user.adminOn,user.adminVerified,user.adminVerifiedBy,user.adminVerifiedOn)
                        .then((element)=>{
                            if (searchResultType == "list") {
                                //generate list
                                searchBoxElements += element
                                document.getElementById("searchResultContainerTypeList").innerHTML = searchBoxElements
                            }
                            else {
                                //generate table
                                searchTableElements += element
                                document.getElementById("searchResultTypeTable").innerHTML = searchTableElements
                            }
                        })
                });
            })
            .catch(function(error) {
                searchResultManager(0);
                console.log("Error getting documents: ", error);
            });
    }
    else {
        //continue to next doc
        userRefs = userRefs.startAfter(lastDoc).limit(maxLimit)
        userRefs.get()
            .then(function(querySnapshot) {
                searchResultManager(querySnapshot.size);
                lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length-1];
                document.getElementById("searchResultContainerTypeList").innerHTML = searchBoxElements;
                document.getElementById("searchResultTypeTable").innerHTML = searchTableElements;
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var user = doc.data();
                    var id = doc.id;
                    searchResultGenerator(id,user.Name,user.Branch,user.Batch,user.Email,user.Contact,user.profileImage,user.admin,user.adminBy,user.adminOn,user.adminVerified,user.adminVerifiedBy,user.adminVerifiedOn)
                        .then((element)=>{
                            if (searchResultType == "list") {
                                //generate list
                                searchBoxElements += element
                                document.getElementById("searchResultContainerTypeList").innerHTML = searchBoxElements
                            }
                            else {
                                //generate table
                                searchTableElements += element
                                document.getElementById("searchResultTypeTable").innerHTML = searchTableElements
                            }
                        })
                });
            })
            .catch(function(error) {
                searchResultManager(0);
                console.log("Error getting documents: ", error);
            });
    }
}

function searchResultGenerator(id,name,branch,batch,email,contact,imageURL,adminStatus,adminBy,adminOn,adminVerifyStatus,adminVerifyBy,adminVerifyOn) {
    var searchResultType = document.getElementById("searchResultType").value;
    if (searchResultType == "list") {
        //generate list view
        document.getElementById("searchResultContainerTypeList").style.display = "inline-block";
        document.getElementById("searchResultContainerTypeTable").style.display = "none";
        var profileBoxElement = new Promise((res,rej)=>{
            if (imageURL != undefined) {
                fetchProfilePreviewImage(id,imageURL).then((url)=>{
                    var profileBox = `<div class=searchResultBox>
                                        <div class="searchResultImageHolder">
                                            <img class="searchResultImage" src="${url}"/>
                                        </div>
                                        <div class="searchDetailsHolder">
                                            <a href="../../profile/?name=${name}&id=${id}" class="searchResultName">${name}</a>
                                            <br>
                                            <span class="searchResultBranch">${branch}</span>
                                            <br>
                                            <span class="searchResultBatch">${batch}</span>
                                            <br>
                                            ${checkAdminStatus(id,name,email,branch,adminStatus,adminBy,adminOn)[1]}
                                            ${checkAdminVerifyStatus(id,name,email,branch,adminVerifyStatus,adminVerifyBy,adminVerifyOn)[1]}
                                            <button onclick="openMoreUserOption(this)" class="adminUserMoreOptionBTN"><i class="material-icons adminUserMoreOptionBTN"">more_vert</i>
                                                <div class="moreOption-content">
                                                    <p onclick="deleteUser('${id}','${name}','${email}','${branch}','${imageURL}')">Delete User</p>
                                                    <br>
                                                    ${checkAdminStatus(id,name,email,branch,adminStatus,adminBy,adminOn)[0]}
                                                    <br>
                                                    ${checkAdminVerifyStatus(id,name,email,branch,adminVerifyStatus,adminVerifyBy,adminVerifyOn)[0]}
                                                </div>
                                            </button>
                                        </div>
                                    </div>`
                    res(profileBox)
                })
            }
            else {
                var profileBox = `<div class=searchResultBox>
                                        <div class="searchResultImageHolder">
                                            <img class="searchResultImage" src="../../resource/img/aces-blue-bg-portrait.jpg"/>
                                        </div>
                                        <div class="searchDetailsHolder">
                                            <a href="../../profile/?name=${name}&id=${id}" class="searchResultName">${name}</a>
                                            <br>
                                            <span class="searchResultBranch">${branch}</span>
                                            <br>
                                            <span class="searchResultBatch">${batch}</span>
                                            <br>
                                            ${checkAdminStatus(id,name,email,branch,adminStatus,adminBy,adminOn)[1]}
                                            ${checkAdminVerifyStatus(id,name,email,branch,adminVerifyStatus,adminVerifyBy,adminVerifyOn)[1]}
                                            <button onclick="openMoreUserOption(this)" class="adminUserMoreOptionBTN"><i class="material-icons adminUserMoreOptionBTN">more_vert</i>
                                                <div class="moreOption-content">
                                                    <p onclick="deleteUser('${id}','${name}','${email}','${branch}','${imageURL}')">Delete User</p>
                                                    <br>
                                                    ${checkAdminStatus(id,name,email,branch,adminStatus,adminBy,adminOn)[0]}
                                                    <br>
                                                    ${checkAdminVerifyStatus(id,name,email,branch,adminVerifyStatus,adminVerifyBy,adminVerifyOn)[0]}
                                                </div>
                                            </button>
                                        </div>
                                    </div>`
                res(profileBox)
            }
        })
        return profileBoxElement;
    }
    else {
        //generateTableView
        document.getElementById("searchResultContainerTypeList").style.display = "none";
        document.getElementById("searchResultContainerTypeTable").style.display = "block";
        var profileTableElement = new Promise((res,rej)=>{
            fetchPrivateData(id).then((pvtContact)=>{
                var profileTableRow = `<tr>
                                    <td></td>
                                    <td><a href="../../profile/?name=${name}&id=${id}" class="tableProfileLink">${name}</a></td>
                                    <td>${branch}</td>
                                    <td>${batch}</td>
                                    <td class="userEmailList">${email}</td>
                                    <td>${pvtContact}</td>
                                </tr>`
            res(profileTableRow)
            })
        })
        return profileTableElement;
    }
}
function fetchProfilePreviewImage(id,fileName) {
    var storageRef = firebase.storage().ref();
    return storageRef.child("users/"+id+"/"+fileName).getDownloadURL();
}

function fetchPrivateData(uid) {
    var userPrivateData = firebase.firestore().collection("users-pvt-data").doc(uid);
    var getPvtData = new Promise((res,rej)=>{
        userPrivateData.get().then((doc)=>{
            if (doc.exists) {
                var userDetails = doc.data();
                res(userDetails["Contact"])
            }
            else {
                res("Not Available")
            }
        }).catch((err)=>{
            res("Unauthorized")
        })
    })
    return getPvtData;
}
function checkAdminStatus(id,name,email,branch,adminStatus,adminBy,adminOn) {
    if (adminStatus != undefined) {
        if (adminStatus) {
            var btnElement = `<p onclick="manageAdminship('${id}','${name}','${email}','${branch}',${adminStatus})">Remove Admin</p>`
            var statusElement = `<span class="userAdminStatus">
                                    Admin
                                    <div class="userAdminStatus-content">
                                        <h3>Admin Status</h3>
                                        <span>AddedBy:- ${adminBy}</span>
                                        <br>
                                        <span>AddedOn:- ${adminOn}</span>
                                    </div>
                                </span>`
            var elementArray = new Array(btnElement,statusElement);
            return elementArray;
        }
        else {
            var btnElement = `<p onclick="manageAdminship('${id}','${name}','${email}','${branch}',${adminStatus})">Add Admin</p>`
            var statusElement = ` `
            var elementArray = new Array(btnElement,statusElement);
            return elementArray;
        }
    }
    else {
        var btnElement = `<p onclick="manageAdminship('${id}','${name}','${email}','${branch}',${adminStatus})">Add Admin</p>`
        var statusElement = ` `
        var elementArray = new Array(btnElement,statusElement);
        return elementArray;
    }
}
function checkAdminVerifyStatus(id,name,email,branch,adminVerifyStatus,adminVerifyBy,adminVerifyOn) {
    if (adminVerifyStatus != undefined) {
        if (adminVerifyStatus) {
            var btnElement = `<p onclick="manageAdminVerificationStatus('${id}','${name}','${email}','${branch}',${adminVerifyStatus})">Remove Verification</p>`
            var statusElement = `<span class="userVerifyStatus">
                                    Verified
                                    <div class="userVerifyStatus-content">
                                        <h3>Verify Status</h3>
                                        <span>VerifiedBy:- ${adminVerifyBy}</span>
                                        <br>
                                        <span>VerifiedOn:- ${adminVerifyOn}</span>
                                    </div>
                                </span>`
            var elementArray = new Array(btnElement,statusElement);
            return elementArray;
        }
        else {
            var btnElement = `<p onclick="manageAdminVerificationStatus('${id}','${name}','${email}','${branch}',${adminVerifyStatus})">Verify</p>`
            var statusElement = ` `
            var elementArray = new Array(btnElement,statusElement);
            return elementArray;
        }
    }
    else {
        var btnElement = `<p onclick="manageAdminVerificationStatus('${id}','${name}','${email}','${branch}',${adminVerifyStatus})">Verify</p>`
        var statusElement = ` `
        var elementArray = new Array(btnElement,statusElement);
        return elementArray;
    }

}
function searchQueryRefsGenerator(value,fltrBranch,batchFltrType,fltrBatch,fltrBatchRange1,fltrBatchRange2,filterName) {
    var userRefs = firebase.firestore().collection("users");
    if (filterName != null) {
        if (filterName == "a2z") {
            userRefs = userRefs.orderBy("Name")
        }
        else {
            userRefs = userRefs.orderBy("Name","desc")
        }
    }
    if (value == null) {
        if (fltrBranch == null && batchFltrType == null) {
            //user filtering nothing show all
            return userRefs;
        }
        else if (fltrBranch !=null && batchFltrType == null) {
            //user filtering with branch
            userRefs = userRefs.where("Branch","==",fltrBranch);
            return userRefs;
        }
        else if (fltrBranch ==null && batchFltrType != null) {
            //user filtering batch
            if (batchFltrType == "static") {
                //static filter type
                userRefs = userRefs.where("Batch","==",fltrBatch);
                return userRefs;
            }
            else {
                //range filter type
                userRefs = firebase.firestore().collection("users").orderBy("Batch").where("Batch",">=",fltrBatchRange1).where("Batch","<=",fltrBatchRange2);
                return userRefs;
            }
        }
        else {
            //filtering by both
            if (batchFltrType == "static") {
                //static filter type
                userRefs = userRefs.where("Branch","==",fltrBranch).where("Batch","==",fltrBatch);
                return userRefs
            }
            else {
                //range filter type
                userRefs = firebase.firestore().collection("users").orderBy("Batch").where("Branch","==",fltrBranch).where("Batch",">=",fltrBatchRange1).where("Batch","<=",fltrBatchRange2);
                return userRefs;
            }
        }
    }
    else {
        var queryArray = value.toLowerCase().split(" ");
        if (fltrBranch == null && batchFltrType == null) {
            //user filtering nothing show all
            userRefs = userRefs.where("query", "array-contains-any", queryArray);
            return userRefs;
        }
        else if (fltrBranch !=null && batchFltrType == null) {
            //user filtering with branch
            userRefs = userRefs.where("query", "array-contains-any", queryArray).where("Branch","==",fltrBranch);
            return userRefs;
        }
        else if (fltrBranch ==null && batchFltrType != null) {
            //user filtering batch
            if (batchFltrType == "static") {
                //static filter type
                userRefs = userRefs.where("query", "array-contains-any", queryArray).where("Batch","==",fltrBatch);
                return userRefs;
            }
            else {
                //range filter type
                userRefs = firebase.firestore().collection("users").orderBy("Batch").where("query", "array-contains-any", queryArray).where("Batch",">=",fltrBatchRange1).where("Batch","<=",fltrBatchRange2);
                return userRefs;
            }
        }
        else {
            //filtering by both
            if (batchFltrType == "static") {
                //static filter type
                userRefs = userRefs.where("query", "array-contains-any", queryArray).where("Branch","==",fltrBranch).where("Batch","==",fltrBatch);
                return userRefs
            }
            else {
                //range filter type
                userRefs = firebase.firestore().collection("users").orderBy("Batch").where("query", "array-contains-any", queryArray).where("Branch","==",fltrBranch).where("Batch",">=",fltrBatchRange1).where("Batch","<=",fltrBatchRange2);
                return userRefs;
            }
        }
    }
    
}
