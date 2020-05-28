var userViewedEventBox = false //In case user interacted with box make a pause allow him to read through for a while
var eventBoxIdNum = 0;
var eventBoxTimeOnScreen = 5000;
var userInterruptEventBox = false; //user viewing event by navigation buttons
var eventBoxInterruptionTime = 3000; //extra time when interrupted before continuing to next box
var resumeEventBoxCycle;
var eventBoxCycleInterval;
function loadEventBoxes() {
    document.getElementById("currentNumStatusEvent").innerText = 1;
    document.getElementById(`eventBox${eventBoxIdNum}`).style.display = "flex"
    var totalEventBoxes = document.getElementsByClassName("eventBox").length
    document.getElementById("totalEventBoxesNum").innerText = totalEventBoxes
    loadEventBoxesCycle()
}

function loadEventBoxesCycle() {
    clearInterval(eventBoxCycleInterval);
    var totalEventBoxes = document.getElementsByClassName("eventBox").length
    eventBoxCycleInterval = setInterval(()=>{
        if (eventBoxIdNum >= totalEventBoxes-1) {
            //show from beginning
            document.getElementById(`eventBox${eventBoxIdNum}`).style.animation = "fadeOut 2s"
            setTimeout(()=>{
                document.getElementById(`eventBox${eventBoxIdNum}`).style.display = "none";
                document.getElementById(`eventBox${0}`).style.display = "flex"
                document.getElementById(`eventBox${0}`).style.animation = "fadeIn 1s"
                eventBoxIdNum = 0;
                document.getElementById("currentNumStatusEvent").innerText = eventBoxIdNum + 1
            },500)
        }
        else {
            //show next box
            document.getElementById(`eventBox${eventBoxIdNum}`).style.animation = "fadeOut 1s"
            setTimeout(()=>{
                document.getElementById(`eventBox${eventBoxIdNum}`).style.display = "none";
                document.getElementById(`eventBox${eventBoxIdNum+1}`).style.display = "flex"
                document.getElementById(`eventBox${eventBoxIdNum+1}`).style.animation = "fadeIn 1s"
                eventBoxIdNum +=1;
                document.getElementById("currentNumStatusEvent").innerText = eventBoxIdNum + 1
            },400)
        }
    },eventBoxTimeOnScreen)
    /*if (!userInterruptEventBox) {
        if (eventBoxIdNum >= totalEventBoxes-1) {
            //show from beginning
            setTimeout(()=>{
                if (!userInterruptEventBox) {
                    document.getElementById(`eventBox${eventBoxIdNum}`).style.animation = "fadeOut 2s"
                    setTimeout(()=>{
                        document.getElementById(`eventBox${eventBoxIdNum}`).style.display = "none";
                        document.getElementById(`eventBox${0}`).style.display = "flex"
                        document.getElementById(`eventBox${0}`).style.animation = "fadeIn 1s"
                        eventBoxIdNum = 0;
                        document.getElementById("currentNumStatusEvent").innerText = eventBoxIdNum + 1
                        loadEventBoxesCycle()
                    },500)
                }
            },eventBoxTimeOnScreen)
    
        }
        else {
            //show next box
            setTimeout(()=>{
                if (!userInterruptEventBox) {
                    document.getElementById(`eventBox${eventBoxIdNum}`).style.animation = "fadeOut 1s"
                    setTimeout(()=>{
                        document.getElementById(`eventBox${eventBoxIdNum}`).style.display = "none";
                        document.getElementById(`eventBox${eventBoxIdNum+1}`).style.display = "flex"
                        document.getElementById(`eventBox${eventBoxIdNum+1}`).style.animation = "fadeIn 1s"
                        eventBoxIdNum +=1;
                        document.getElementById("currentNumStatusEvent").innerText = eventBoxIdNum + 1
                        loadEventBoxesCycle()
                    },400)
                }
            },eventBoxTimeOnScreen)
        }
    }*/
}
function nextEventBox() {
    clearTimeout(resumeEventBoxCycle);
    clearInterval(eventBoxCycleInterval);
    var totalEventBoxes = document.getElementsByClassName("eventBox").length
    if (eventBoxIdNum >= totalEventBoxes-1) {
        //show from beginning
        document.getElementById(`eventBox${eventBoxIdNum}`).style.animation = "fadeOut 2s"
        setTimeout(()=>{
            document.getElementById(`eventBox${eventBoxIdNum}`).style.display = "none";
            document.getElementById(`eventBox${0}`).style.display = "flex"
            document.getElementById(`eventBox${0}`).style.animation = "fadeIn 1s"
            eventBoxIdNum = 0;
            document.getElementById("currentNumStatusEvent").innerText = eventBoxIdNum + 1
        },500)

    }
    else {
        //show next box
        document.getElementById(`eventBox${eventBoxIdNum}`).style.animation = "fadeOut 1s"
        setTimeout(()=>{
            document.getElementById(`eventBox${eventBoxIdNum}`).style.display = "none";
            document.getElementById(`eventBox${eventBoxIdNum+1}`).style.display = "flex"
            document.getElementById(`eventBox${eventBoxIdNum+1}`).style.animation = "fadeIn 1s"
            eventBoxIdNum +=1;
            document.getElementById("currentNumStatusEvent").innerText = eventBoxIdNum + 1
        },400)
    }
    //resume the cycle
    resumeEventBoxCycle = setTimeout(()=>{
        loadEventBoxesCycle()
    },eventBoxTimeOnScreen+eventBoxInterruptionTime)
}

function previousEventBox() {
    clearTimeout(resumeEventBoxCycle);
    clearInterval(eventBoxCycleInterval);
    var totalEventBoxes = document.getElementsByClassName("eventBox").length
    if (eventBoxIdNum <= 0) {
        //show from beginning
        document.getElementById(`eventBox${eventBoxIdNum}`).style.animation = "fadeOut 2s"
        setTimeout(()=>{
            document.getElementById(`eventBox${eventBoxIdNum}`).style.display = "none";
            document.getElementById(`eventBox${totalEventBoxes-1}`).style.display = "flex"
            document.getElementById(`eventBox${totalEventBoxes-1}`).style.animation = "fadeIn 1s"
            eventBoxIdNum = totalEventBoxes-1;
            document.getElementById("currentNumStatusEvent").innerText = eventBoxIdNum + 1
        },500)

    }
    else {
        //show next box
        document.getElementById(`eventBox${eventBoxIdNum}`).style.animation = "fadeOut 1s"
        setTimeout(()=>{
            document.getElementById(`eventBox${eventBoxIdNum}`).style.display = "none";
            document.getElementById(`eventBox${eventBoxIdNum-1}`).style.display = "flex"
            document.getElementById(`eventBox${eventBoxIdNum-1}`).style.animation = "fadeIn 1s"
            eventBoxIdNum -=1;
            document.getElementById("currentNumStatusEvent").innerText = eventBoxIdNum + 1
        },400)
    }
    //resume the cycle
    resumeEventBoxCycle = setTimeout(()=>{
        loadEventBoxesCycle()
    },eventBoxTimeOnScreen+eventBoxInterruptionTime)
}
//pause if mouse is over the box allowing to read
function pauseEventBoxesCycle() {
    clearInterval(eventBoxCycleInterval);
}
function resumeEventBoxesCycle() {
    loadEventBoxesCycle()
}