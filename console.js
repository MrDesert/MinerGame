let myConsoleSwitch = false;
const consoleLog = [];
let consoleLogPreviosLenght = 0;
let consoleBtns = [];

function createConsole(btns){

    consoleBtnsNames = [...btns];
    document.querySelector("body").append(
	    Object.assign(document.createElement("div"), {id: "myConsoleID", style: "z-index: 1000; overflow: auto; position: fixed; right: 0; top: 0; background-color: black; color: white; height: 100%; width: 40%; font-family: 'Courier New', Courier, monospace;", hidden: "hidden"}) //
    );
    document.querySelector("#myConsoleID").append(
	    Object.assign(document.createElement("div"), {id: "myConsoleInfoPanelID", style: "height: auto; width: 100%;"})
    );
    document.querySelector("#myConsoleInfoPanelID").append(
	    Object.assign(document.createElement("div"), {id: "myConsoleInfoFPSID", style: "height: 25px; width: 130px; font-size: 25px; margin: 10px; display: inline-block;"})
    );
    document.querySelector("#myConsoleID").append(
	    Object.assign(document.createElement("div"), {id: "myConsoleControlPanel", style: "height: auto; width: 100%; font-size: 20px; padding: 5px;"})
    );
        document.querySelector("#myConsoleControlPanel").append(
	        Object.assign(document.createElement("input"), {id: "myConsoleCPRangeID", style: "height: 25px; font-size: 20px; margin: 5px; display: inline-block;", type: "range", min: 0, value: 1, max: 15,})
        );
        document.getElementById("myConsoleCPRangeID").addEventListener('input', ()=> {
            consoleBtnsUpdate();
        })
        for(let i = 0; i < consoleBtnsNames.length; i++){
            document.querySelector("#myConsoleControlPanel").append(
	            Object.assign(document.createElement("button"), {id: "myConsoleCPBtnID"+i, value: consoleBtnsNames[i], style: "height: 25px; font-size: 20px; margin: 5px; display: inline-block;"})
            );
            document.querySelector("#myConsoleCPBtnID"+i).onclick = function(){consBtnReturn(10**document.getElementById("myConsoleCPRangeID").value, this.value);};
        }
        consoleBtnsUpdate();
    document.querySelector("#myConsoleID").append(
	    Object.assign(document.createElement("div"), {id: "myConsoleLines", style: "height: 100%; width: 100%; font-size: 20px; padding: 10px;"})
    );
    consoleLog.push("Консоль создана!")
} 

function  consoleBtnsUpdate(){
    for(let i = 0; i < consoleBtnsNames.length; i++){
        document.getElementById("myConsoleCPBtnID"+i).innerHTML = consoleBtnsNames[i] + " - " + 10** document.getElementById("myConsoleCPRangeID").value;
    }
}

document.addEventListener('keydown', (e)=> {
    if(e.code === 'F1'){
        let myConsoleID = document.getElementById("myConsoleID");
        e.preventDefault();
        myConsoleSwitch = !myConsoleSwitch;
        if(myConsoleSwitch){
            myConsoleID.removeAttribute("hidden");

        } else{
            myConsoleID.hidden = "hidden";
        }
    }
});

let FPS = 0;
let myConsPreviosTime = 0;
function FPS_f(currentTime){
    if(currentTime - myConsPreviosTime >= 1000){
        document.getElementById("myConsoleInfoFPSID").innerHTML = "FPS: " + FPS;
        FPS = 0;
        myConsPreviosTime = currentTime;
    }
    if(consoleLog.length != consoleLogPreviosLenght){
        consoleLogPreviosLenght = consoleLog.length;
        consoleAddLine()
    }
    FPS++;
    requestAnimationFrame(FPS_f);
}
FPS_f(performance.now());

function consoleAddLine(){
    document.querySelector("#myConsoleLines").append(
	    Object.assign(document.createElement("div"), {id: "myConsoleLineID"+consoleLog.length, style: "height: 20px; width: 100%;", innerHTML: consoleLog.length-1 + ". " + consoleLog[consoleLog.length-1] + " - " + new Date().toLocaleTimeString()})
    );
}