let myConsoleCreated = false;
let myConsoleSwitch = false;
let consoleBtns = [];

function createConsole(){
    document.querySelector("body").append(
	    Object.assign(document.createElement("div"), {id: "myConsoleID", style: "z-index: 1000; overflow: auto; position: fixed; right: 0; top: 0; background-color: black; color: white; height: 100%; width: 40%; min-width: 10%; max-width: 100% font-family: 'Courier New', Courier, monospace; resize: horizontal;", hidden: "hidden"}) //
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
    document.querySelector("#myConsoleID").append(
	    Object.assign(document.createElement("div"), {id: "myConsoleLines", style: "height: 100%; width: 100%; font-size: 20px; padding: 10px;"})
    );
    myConsoleCreated = true;
    FPS_f(performance.now());
    myConsole("Консоль создана!")
} 

function consoleCreateBtnsCP(btns){
    if(myConsoleCreated){
        consoleBtnsNames = [...btns];
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
    }
}

function  consoleBtnsUpdate(){
    for(let i = 0; i < consoleBtnsNames.length; i++){
        document.getElementById("myConsoleCPBtnID"+i).innerHTML = consoleBtnsNames[i] + " - " + 10** document.getElementById("myConsoleCPRangeID").value;
    }
}

document.addEventListener('keydown', (e)=> {
    if(myConsoleCreated){
        if(e.code === 'F1'){
            let myConsoleID = document.getElementById("myConsoleID");
            e.preventDefault();
            myConsoleSwitch = !myConsoleSwitch;
            myConsoleSwitch ? myConsoleID.removeAttribute("hidden") : myConsoleID.hidden = "hidden";
        }
    }
});

let FPS = 0;
let myConsPreviosTime = 0;
function FPS_f(currentTime){
    if(myConsoleCreated){
        if(currentTime - myConsPreviosTime >= 1000){
            document.getElementById("myConsoleInfoFPSID").innerHTML = "FPS: " + FPS;
            FPS = 0;
            myConsPreviosTime = currentTime;
        }
        FPS++;
        requestAnimationFrame(FPS_f);
    }
}

function myConsole(text){
    if(myConsoleCreated){
        myConsole.count = (myConsole.count || 0) + 1;
        document.querySelector("#myConsoleLines").append(
	        Object.assign(document.createElement("div"), {id: "myConsoleLineID"+myConsole.count, style: "height: 20px; width: 100%;", innerHTML: myConsole.count + ". " + text + " - " + new Date().toLocaleTimeString({fractionalSecondDigits: 3})})
        );
        return myConsole.count;
    }
}