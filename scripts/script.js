var activeActivityBoxId=0;
var userInterruptActivity = false; //user viewing activity by navigation buttons
var activityBoxRequested = false; //prevent multiple request, no overlap
function loadElements() {
    document.getElementById(`activity0`).style.display = "block";
    document.getElementById(`activity0`).style.animation = "showFromRight 2s"
    loadActivityBoxes();
}

function loadActivityBoxes() {
    var activityBox = document.getElementsByClassName("activityBox")
    if (!activityBoxRequested && !userInterruptActivity) {
        //make request for next box
        activityBoxRequested = true;
        if (activeActivityBoxId >= activityBox.length-1) {
            setTimeout(()=>{
                if (!userInterruptActivity) {
                    showNextActivityBox(activeActivityBoxId);
                    activeActivityBoxId = 0;
                    loadActivityBoxes()
                }
            },6000)
        }
        else {
            setTimeout(()=>{
                if (!userInterruptActivity) {
                    showNextActivityBox(activeActivityBoxId);
                    activeActivityBoxId +=1;
                    loadActivityBoxes()
                }
            },6000)
        }
    }
}
function showNextActivityBox(currID) {
    var activityBox = document.getElementsByClassName("activityBox")
    var totalBox = activityBox.length
    var activeActivityElement = document.getElementById(`activity${currID}`)
    var nextActivityElement = document.getElementById(`activity${currID+1}`)
    //process activity
    if (currID >= totalBox-1) {
        document.getElementById(`activity${totalBox-1}`).style.animation = "hideToLeft 2s"
        setTimeout(()=>{
            document.getElementById(`activity${totalBox-1}`).style.display = "none";
        },2000)
        document.getElementById(`activity${0}`).style.display = "block";
        document.getElementById(`activity${0}`).style.animation = "showFromRight 2s";
        activityBoxRequested = false; //request done
    }
    else {
        activeActivityElement.style.animation = "hideToLeft 2s"
        setTimeout(()=>{
            activeActivityElement.style.display = "none";
        },2000)
        nextActivityElement.style.display = "block";
        nextActivityElement.style.animation = "showFromRight 2s";
        activityBoxRequested = false; //request done
    }
}
function showPreviousActivityBox(currID) {
    var activityBox = document.getElementsByClassName("activityBox")
    var totalBox = activityBox.length
    //process activity
    if (currID <= 0) {
        document.getElementById(`activity${0}`).style.animation = "hideToRight 2s"
        setTimeout(()=>{
            document.getElementById(`activity${0}`).style.display = "none";
        },2000)
        document.getElementById(`activity${totalBox-1}`).style.display = "block"
        document.getElementById(`activity${totalBox-1}`).style.animation = "showFromLeft 2s"
        activityBoxRequested = false; //request done
    }
    else {
        var activeActivityElement = document.getElementById(`activity${currID}`)
        var previousActivityElement = document.getElementById(`activity${currID-1}`)
        activeActivityElement.style.animation = "hideToRight 2s"
        setTimeout(()=>{
            activeActivityElement.style.display = "none";
        },2000)
        previousActivityElement.style.display = "block";
        previousActivityElement.style.animation = "showFromLeft 2s";
        activityBoxRequested = false; //request done
    }
}
function swipeLeft() {
    document.getElementById("goLeftBTN").disabled = true;
    userInterruptActivity = true;
    var activityBox = document.getElementsByClassName("activityBox")
    if (activeActivityBoxId <= 0) {
        showPreviousActivityBox(activeActivityBoxId);
        activeActivityBoxId = activityBox.length-1;
    }
    else {
        showPreviousActivityBox(activeActivityBoxId);
        activeActivityBoxId -=1;
    }
    setTimeout(()=>{
        document.getElementById("goLeftBTN").disabled = false;
        //userInterruptActivity = false;
        //loadActivityBoxes();
    },2100)
}
function swipeRight() {
    document.getElementById("goRightBTN").disabled = true;
    userInterruptActivity = true;
    var activityBox = document.getElementsByClassName("activityBox")
    if (activeActivityBoxId >= activityBox.length-1) {
        showNextActivityBox(activeActivityBoxId);
        activeActivityBoxId = 0;
    }
    else {
        showNextActivityBox(activeActivityBoxId);
        activeActivityBoxId +=1;
    }
    setTimeout(()=>{
        document.getElementById("goRightBTN").disabled = false;
        //userInterruptActivity = false;
        //loadActivityBoxes();
    },2100)
}