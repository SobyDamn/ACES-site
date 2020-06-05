/*contains display and handler for header(anything in upper blue part)*/

//check user authentication and display status
firebase.auth().onAuthStateChanged(function(user) {
    var nameElement = document.getElementById("userName");
    if (user) {
      // User logged in already or has just logged in.
        document.getElementById("userSignedIN").style.display = "block";
        document.getElementById("userSignedOut").style.display = "none";
        document.getElementById("spin_loader").style.display = "none";
        if (user.photoURL) {
            //display photo if exists
            fetchImage(user.photoURL,user.uid)
        }
      if (user.displayName != null) {
          nameElement.style.display = "inline";
          nameElement.innerText = "Hi! "+ user.displayName;
      }
      else {
        nameElement.style.display = "inline";
        nameElement.innerHTML = `<a href="../edit-profile">Complete Your Profile</a>`
      }
    } 
    else {
      // User not logged in or has just logged out.
      document.getElementById("showImageInNoImage").style.display = "inline"
      document.getElementById("spin_loader").style.display = "none";
      document.getElementById("userSignedIN").style.display = "none";
      document.getElementById("userSignedOut").style.display = "block";
      nameElement.style.display = "none";
    }
  });
function fetchImage(fileName,uid) {
    if (fileName != undefined) {
        //profile picture exists show to user
        var storageRef = firebase.storage().ref();
        var currentProfileImage = document.getElementById("showImageInHeader")
        storageRef.child("users/"+uid+"/"+fileName).getDownloadURL().then((url)=> {
            currentProfileImage.style.display = "inline-block";
            currentProfileImage.src = url;
            document.getElementById("showImageInNoImage").style.display = "none";
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
    document.getElementById("loginPOP").style.display = "none";
}
function showRegisterForm() {
    closeLoginPop();
    var modal = document.getElementById("registerPOP");
    modal.style.display = "block";
}
function closeRegisterPOP() {
    var modal = document.getElementById("registerPOP");
    modal.style.display = "none";
}


function logout(from){
    document.getElementById("spin_loader").style.display = "block";
    document.getElementById("userSignedIN").style.display = "none";
    //logout user
    setTimeout(()=>{
        firebase.auth().signOut().then(()=>{
            //logged out
            document.getElementById("spin_loader").style.display = "none";
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
            document.getElementById("spin_loader").style.display = "none";
            document.getElementById("userSignedIN").style.display = "block";
        })
    },500)
}
function search(value) {
    const searchStringFiled = document.getElementById("searchBar");
    const searchString = searchStringFiled.value
    if (searchString == "") {
        searchStringFiled.style["border-color"] = "rgb(221, 98, 98)";
        setTimeout(()=>{
            searchStringFiled.style["border-color"] = "#d3e3f08e"
        },2000)
    }
    else {
        if (value == "home") {
            window.location = "search/?q="+searchString;
        }
        else {
            window.location = "../search/?q="+searchString;
        }
    }
}
//window.onscroll = function() {stickHeaderOptions()};
function stickHeaderOptions() {
    var header = document.getElementsByClassName("multiBoxContainer")[0];
    var sticky = header.offsetTop;
    if (window.pageYOffset > sticky) {
        header.classList.add("stickyHeader");
      } else {
        header.classList.remove("stickyHeader");
    }
}
