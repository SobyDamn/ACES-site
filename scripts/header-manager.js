/*contains display and handler for header including auth options in footer*/
var stickyHeaderEnabled = false;
var navMenuVisible = false;
var navArrowRotdeg = 180;
//check user authentication and display status
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User logged in already or has just logged in.
        document.getElementById("authLoader").style.display = "none";
        document.getElementById("authBTN").style.display = "none";
        document.getElementById("logoutBTNFromheader").style.display = "block";
        if (user.photoURL) {
            //display photo if exists
            fetchImage(user.photoURL,user.uid)
        }
      if (user.displayName == null) {
        document.getElementById("completeProfileLink").style.display = "inline"
      }
    } 
    else {
      // User not logged in or has just logged out.
      document.getElementById("logoutBTNFromheader").style.display = "none";
      document.getElementById("authLoader").style.display = "none";
      document.getElementById("authBTN").style.display = "block";
      document.getElementById("headerProfileImageHolder").style.display = "none";
    }
  });
function fetchImage(fileName,uid) {
    if (fileName != undefined) {
        //profile picture exists show to user
        var storageRef = firebase.storage().ref();
        var currentProfileImage = document.getElementById("showImageInHeader")
        storageRef.child("users/"+uid+"/"+fileName).getDownloadURL().then((url)=> {
            currentProfileImage.style.display = "flex";
            currentProfileImage.src = url;
            document.getElementById("headerProfileImageHolder").style.display = "block";
        }).catch((err)=> {
            // Handle any errors
            console.log(err)
        });
    }
}
function showLoginForm() {
    var modal = document.getElementById("loginPOP");
    modal.style.display = "block";
    /*window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }*/
}

function closeLoginPop() {
    document.getElementById("loginErrorHolder").style.display="none";
    document.getElementById("loginPOP").style.display = "none";
}
function showRegisterForm() {
    closeLoginPop();
    document.getElementById("regErrorHolder").style.display="none";
    var modal = document.getElementById("registerPOP");
    modal.style.display = "block";
}
function closeRegisterPOP() {
    var modal = document.getElementById("registerPOP");
    modal.style.display = "none";
}


function logout(from){
    document.getElementById("authLoader").style.display = "block";
    document.getElementById("headerProfileImageHolder").style.display = "none";
    //logout user
    setTimeout(()=>{
        firebase.auth().signOut().then(()=>{
            //logged out
            document.getElementById("authLoader").style.display = "none";
            if (from == "home") {
                window.location = "index.html"
            }
            else if (from == "secondChild") {
                window.location = "../index.html"
            }
            else {
                window.location = "../../index.html"
            }
        }).catch((err)=>{
            //errr in logging out
            document.getElementById("headerProfileImageHolder").style.display = "block";
        })
    },500)
}
function search(from) {
    const searchStringFiled = document.getElementById("searchBar");
    const searchString = searchStringFiled.value
    if (searchString == "") {
        searchStringFiled.style["border-color"] = "rgb(221, 98, 98)";
        setTimeout(()=>{
            searchStringFiled.style["border-color"] = "#d3e3f08e"
        },2000)
    }
    else {
        if (from == "home") {
            window.location = "search/?q="+searchString;
        }
        else if(from == "secondChild") {
            window.location = "../search/?q="+searchString;
        }
        else {
            window.location = "../../search/?q="+searchString;
        }
    }
}
if (stickyHeaderEnabled) {
    window.onscroll = function() {stickHeaderOptions()};
}
function stickHeaderOptions() {
    var header = document.getElementById("subHeader");
    var sticky = header.offsetTop;
    if (window.pageYOffset > sticky) {
        header.classList.add("stickyHeader");
      } else {
        header.classList.remove("stickyHeader");
    }
}
function viewProfilePage(from) {
    if (from == 'home') {
        window.location = "profile";
    }
    else if(from == "secondChild") {
        window.location = "../profile"
    }
    else {
        window.location = "../../profile"
    }
}

function showMoreNavOptions(btn) {
    btn.style.transform = `rotate(${navArrowRotdeg}deg)`;
    navArrowRotdeg += 180;
    let navOptions = document.getElementById("nav-options");
    if (!navMenuVisible) {
        navOptions.style.display = "flex";
        navMenuVisible = true;
    }
    else {
        navOptions.style.display = "none";
        navMenuVisible = false;
    }
    window.onclick = function(event) {
        if (!event.path[1].matches('#headerOptionDropdownBTN')) {
          if (navMenuVisible) {
            navOptions.style.display = "none";
            btn.style.transform = `rotate(${navArrowRotdeg}deg)`;
            navArrowRotdeg += 180;
            navMenuVisible = false;
          }
        }
      }
}