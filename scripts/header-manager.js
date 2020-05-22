//Contains most function of button in header part except authentication(reg or login)
function logout(){
    document.getElementById("spin_loader").style.display = "block";
    document.getElementById("userSignedIN").style.display = "none";
    //logout user
    setTimeout(()=>{
        firebase.auth().signOut().then(()=>{
            //logged out
            document.getElementById("spin_loader").style.display = "none";
        }).catch((err)=>{
            //errr in logging out
            document.getElementById("spin_loader").style.display = "none";
            document.getElementById("userSignedIN").style.display = "block";
        })
    },500)
}