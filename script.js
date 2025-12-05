
var ratio = 1.1;
var hit = 1;
var autoHitSecond = 0;
var counter = 0;
var counterReboot = 0;
var money = 0;
var moneyExp = 0.0001;
var exp = 0;
var doubleMoney = 1;
var switchHit = true;
var bossBonus = false;


//C-Current(текущий) R-Ratio(коэффициент) S-Start(стартовое) P-Previos(Предыдующий)
var layer = {name: "layer", hp: 4, hpC: 4, hpP: 4, hpS: 4, hpR: 1.01, hardness: 1, level: 0, expBonus: 0.1};
var prize = {name: "prize", profit: 1, profitC: 1, upCost: 10, upLevel: 0, upRatio: ratio};

var hitPlusOne = {name: "hitPlusOne", costS: 1, cost: 1, costC: 1, level: 0, openingLayer: 1, switch: "off", expBonus: 0.1, func: () => hitPlusOneUp(1), freeUp: false, img: "pickaxe_transparent_390x390.png", imgGS: "pickaxe_transparent_grayscale_390x390.png", text: "+1 удару"};
var profitPlusOne = {name: "profitPlusOne", costS: 10, cost: 10, costC: 10, level: 0, openingLayer: 10, switch: "off", expBonus: 0.1, func: () => profitPlusOne2(), freeUp: false, img: "helmet5.png", imgGS: "helmet5_transparent_grayscale_310x310.png", text: "+1🪙 к прибыли"};
var autoHitOne = {name: "autoHitOne", costS: 10, cost: 10, costC: 10, level: 0, openingLayer: 25, switch: "off", expBonus: 0.2, func: () => autoHitUp(1), freeUp: false, img: "helmet-pickaxe_transparent_450x450.png", imgGS: "helmet-pickaxe_transparent_grayscale_450x450.png", text: "+1 Автоудар раз <br> в секунду"};
var hitPlusTen = {name: "hitPlusTen", costS: 100, cost: 100, costC: 100, level: 0, openingLayer: 50, switch: "off", expBonus: 0.2, func: () => hitPlusOneUp(10), freeUp: false, img: "drill_transparent_450x450.png", imgGS: "drill_transparent_grayscale_450x450.png", text: "+10 удару"};
var autoHitTen = {name: "autoHitTen", costS: 1000, cost: 1000, costC: 1000, level: 0, openingLayer: 100, switch: "off", expBonus: 0.3, func: () => () => autoHitUp(10), freeUp: false, img: "helmetDrill.png", imgGS: "helmetDrill_transparent_grayscale_450x450.png", text: "+10 Автоударов <br> в секунду"};
var autoHitOneHundred = {name: "autoHitOneHundred", costS: 10000, cost: 10000, costC: 10000, level: 0, openingLayer: 150, switch: "off", expBonus: 0.4, func: () => autoHitUp(100), freeUp: false, img: "helmet5.png", imgGS: "helmet5_transparent_grayscale_310x310.png", text: "+100 Автоударов <br> в секунду"};

var upgrades = [hitPlusOne, profitPlusOne, autoHitOne, hitPlusTen, autoHitTen, autoHitOneHundred];

var hpMinusOnePercent = {cost: 10, level: 0};

// var costOfPump = {cost: 10, costC: 10,  };
var costOfPumpCost = 10;
var costOfPumpLevel = 0;
var costOfPumpRatioDown = 1;
var costOfPumpRatio = ratio * costOfPumpRatioDown;

var bossLevel = 1;
var bossLevelRatio = 10;

var costOfPump = [1, 1, 1];

var switchIDs = ["hitPlusOne", "profitPlusOne", "autoHitOne", "hitPlusTen", "autoHitTen", "autoHitOneHundred"];    //ID которые надо включать и выключать в соответствии с количествой денег
var switchVar = [hitPlusOne, profitPlusOne, autoHitOne, hitPlusTen, autoHitTen, autoHitOneHundred];       // переменные по которым отслеживать включение и выключение

    let menuForCoins = [
        ["hitPlusOne", "pickaxe_transparent_grayscale_390x390.png", "+1 удару", () => hitPlusOneUp(1)], 
        ["profitPlusOne", "helmet5_transparent_grayscale_310x310.png", "+1🪙 к прибыли", () => profitPlusOne2()], 
        ["autoHitOne", "helmet-pickaxe_transparent_grayscale_450x450.png", "+1 Автоудар раз <br> в секунду", () => autoHitUp(1)], 
        ["hitPlusTen", "drill_transparent_grayscale_450x450.png", "+10 удару", () => hitPlusOneUp(10)], 
        ["autoHitTen", "helmetDrill_transparent_grayscale_450x450.png", "+10 Автоударов <br> в секунду", () => autoHitUp(10)], 
        ["autoHitOneHundred", "helmet5_transparent_grayscale_310x310.png", "+100 Автоударов <br> в секунду", () => autoHitUp(100)]
    ];

startingCreationGUI();
setInterval(autoHit , (1000));
moneyChanges(0);

function startingCreationGUI(){
    let errorCode = startingCreationGUI.name

    //Родитель: Селектор и имя; Ребёнок: Тэг, ID, классы, текст; Тех. Инфо: Код поиска. 
    toCreateTag("tag", "body", "div", "menuForCoins", "sideMenuLeft", "", errorCode);
    toCreateTag("id", "menuForCoins", "div", "menuForCoinsTitle", "sideMenuTitle", "Улучшения", errorCode);

    for(let i = 0; i < menuForCoins.length; i++){
        let id = menuForCoins[i][0];
        toCreateTag("id", "menuForCoins", "div", id+"ID", "sideMenuElement disabled", "", errorCode);
        toCreateTag("id", id+"ID", "div", id+"IconID", "sideMenuElementIconLeft", "", errorCode);
        toCreateTag("id", id+"IconID", "div", id+"LevelID", "sideMenuElementIconParametrTopLeft level", "", errorCode);
        toCreateTag("id", id+"IconID", "img", id+"ImgID", "sideMenuElementIconLeftIMG", "", errorCode);
        document.getElementById(id+"ImgID").src = "img/" + menuForCoins[i][1];
        toCreateTag("id", id+"ID", "div", id+"DescriptionID", "sideMenuElementDescription", menuForCoins[i][2], errorCode)
        toCreateTag("id", id+"ID", "button", id+"BtnID", "sideMenuElementBtn", "🪙", errorCode);
        document.getElementById(id+"BtnID").onclick = function(){menuForCoins[i][3]();};
        document.getElementById(id+"BtnID").disabled = "disabled";
        toCreateTag("id", id+"BtnID", "div", id+"CostID", "inline-block cost", "", errorCode)
    }
}

function moneyChanges(m){
    // console.log(m + " - Денег"); //Количество денег на трату
    colorNumbers("moneyID", m < 0 ? "red" : "green");
    money += m;
    document.getElementById("moneyID").innerHTML = toCompactNotation(money);
    updateInfo();
}

function expChanges(e){
    exp += e;
}

function expBonus(){
    var expProfit = money*moneyExp + layer.level*layer.expBonus + hitPlusOne.level*hitPlusOne.expBonus + profitPlusOne.level*profitPlusOne.expBonus + autoHitOne.level*autoHitOne.expBonus + hitPlusTen.level*hitPlusTen.expBonus + autoHitTen.level*autoHitTen.expBonus + autoHitOneHundred.level*autoHitOneHundred.expBonus;
    expProfit = Math.round(expProfit);
    console.log(money*moneyExp + " + " + layer.level*layer.expBonus + " + " + hitPlusOne.level*hitPlusOne.expBonus + " + " + profitPlusOne.level*profitPlusOne.expBonus + " + " + autoHitOne.level*autoHitOne.expBonus + " + " + hitPlusTen.level*hitPlusTen.expBonus + " + " + autoHitTen.level*autoHitTen.expBonus + " + " + autoHitOneHundred.level*autoHitOneHundred.expBonus + " = " + expProfit);
    expChanges(expProfit);
    money = 0;
    layer.hpC = layer.hp = 4;
    prize.profitC = prize.profit = 1;
    hit = 1;
    autoHitSecond = 0;
    layer.level = 0;

    for (let i = 0; i < upgrades.length; i++){
        upgrades[i].level = 0;
        upgrades[i].costC = upgrades[i].cost = upgrades[i].costS;
        switchingElementMenu("disable", upgrades[i]);
    }
    moneyChanges(0);
    counterReboot++;
    document.getElementById("counterRebootID").innerHTML = counterReboot;
    updateInfo;
}


function hit_hp() {
    if (switchHit){
        trembling();
        layer.hpC -= hit;
        counter++;
        document.getElementById("hpBarID").style.width = 100/layer.hpP *layer.hpC + "%";
        // console.log(100/layer.hp *layer.hpC);
        finishLevel();
        updateInfo();
    }
}
function trembling(){
    let tremblingH = Math.floor(Math.random()*2);
    let tremblingV = Math.floor(Math.random()*2);
    document.getElementById("layerID").style.left = tremblingH > 0 ? "0.5%" : "-0.5%";
    document.getElementById("layerID").style.bottom = tremblingV > 0 ? "0.5%" : "-0.5%";
    setTimeout(trembling2, 50);
}
function trembling2(){
    document.getElementById("layerID").style.left = "0%";
    document.getElementById("layerID").style.bottom = "0%";
}

function autoHit(){
    if (switchHit){
        autoHitSecond > 0 ? trembling() : updateInfo();
        layer.hpC -= autoHitSecond;
        document.getElementById("hpBarID").style.width = 100/layer.hpP *layer.hpC + "%";
        finishLevel();
        updateInfo();
    }
}

function switchsHit(bool){;
    if (!bossBonus){
        switchHit = bool;
    }
}

let layerUpIntervalID;
function finishLevel(){
    if (layer.hpC <= 0){
        document.getElementById("layerImgID").style.bottom = "-80%";
        switchsHit(false)
        layerUpIntervalID = setInterval(layerUp, 8);
        moneyChanges(Math.floor(prize.profitC * doubleMoney));
        layer.hp *= layer.hpR;
        console.log(Math.round(layer.hp) + " Math.round(layer.hp)");
        console.log(layer.hpP + " layer.hpP");
        layer.hpC = Math.round(layer.hp) <= layer.hpP ? requiredUp(layer.hp, layer.hpP) : Math.round(layer.hp);
        layer.hpP = layer.hpC;
        prize.profit *= prize.upRatio;
        prize.profitC = Math.round(prize.profit) <= prize.profitC ? requiredUp(prize.profit, prize.profitC) : Math.round(prize.profit);
        // console.log(prize.profitC + "  prize.profitC");
        prize.profitC = toRoundoff(prize.profitC);
        layer.level++;
        // let lycky = document.getElementById("luckyID");
        // Math.floor(Math.random() * 5) < 2 ? (doubleMoney = 2, lycky.innerHTML = "Удача!! х2 ") : (doubleMoney = 1, lycky.innerHTML= " ");
        document.getElementById("hpBarID").style.width = "100%";
        switch(layer.level){
            case 1:
                switchingElementMenu("enable", hitPlusOne);
                break;
            case 10: 
                switchingElementMenu("enable", profitPlusOne);
                break;
            case 25: 
                switchingElementMenu("enable", autoHitOne);
                break;
            case 50:
                switchingElementMenu("enable", hitPlusTen);
                break;
            case 100:
                switchingElementMenu("enable", autoHitTen);
                break;
            case 150:
                switchingElementMenu("enable", autoHitOneHundred);
                break;
        }
        if (bossLevel == layer.level){  
            bossLevel += bossLevelRatio;
            bossLevelBonus();
        }
        updateInfo();
    }
} 

let percent = -80;
function layerUp(){
    percent += 2;
    document.getElementById("layerImgID").style.bottom = percent + "%";
    document.getElementById("ret").style.backgroundPosition = "0% " + percent/2 + "%";
    if (percent >= 0){
        clearInterval(layerUpIntervalID);
        percent = -80;
        // document.getElementById("ret").style.backgroundImage = "linear-gradient(rgba(50,50,50,0.8), rgba(50,50,50,0.8)), url(img/background-4x.png)";
        switchsHit(true);
    }
}

function onOffBtn(){
    for (let i = 0; i < switchVar.length; i++){
        let disBtn = document.getElementById(switchIDs[i] + "BtnID");
        money >= switchVar[i].costC && switchVar[i].switch == "on" ? disBtn.removeAttribute("disabled") : disBtn.disabled="disabled";
    }
}

function switchingElementMenu(switchType, btn){
    switch(switchType){
        case "enable":
            btn.switch = "on"
            document.getElementById(btn.name+"ID").classList.remove("disabled");
            document.getElementById(btn.name+"ImgID").src = "img/" + btn.img;
            break;
        case "disable":
            btn.switch = "off"
            document.getElementById(btn.name+"ID").classList.add("disabled");
            document.getElementById(btn.name+"ImgID").src = "img/" + btn.imgGS;
            break;
    }
    onOffBtn();
}

function requiredUp(original, result){

    console.log(Math.round(original*1.1) + " original");
    console.log(result + " result");
    if (Math.round(original*1.1) <= result){
        result++;
    } else{
        result = Math.round(original*1.1);
    }
    return result;
}

function profitPlusOne2(){
    if (money >= profitPlusOne.costC){
        if(!profitPlusOne.freeUp){
            moneyChanges(-Math.floor(profitPlusOne.costC));
            profitPlusOne.cost *= costOfPumpRatio;
            profitPlusOne.costC = toRoundoff(profitPlusOne.cost);
            colorNumbers("profitPlusOneCostID", "red");
        }
        profitPlusOne.freeUp = false;
        prize.profit++;
        prize.profitC++;
        profitPlusOne.level++;
        colorNumbers("profitPlusOneLevelID", "green");
    }
    updateInfo();
}

function hitPlusOneUp(hitPlus) {
    if (money >= hitPlusTen.cost && hitPlus > 1){
        if(!hitPlusTen.freeUp){
            moneyChanges(-Math.floor(hitPlusTen.costC));
            hitPlusTen.cost *= costOfPumpRatio;
            hitPlusTen.costC = toRoundoff(hitPlusTen.cost);
            colorNumbers("hitPlusTenCostID", "red");
        }
        hitPlusTen.freeUp = false;
        hit += hitPlus;
        hitPlusTen.level++;
        colorNumbers("hitPlusTenLevelID", "green");
    } else if (money >= hitPlusOne.costC) {
        if (!hitPlusOne.freeUp){
            moneyChanges(-Math.floor(hitPlusOne.costC));
            hitPlusOne.cost *= costOfPumpRatio;
            hitPlusOne.costC = Math.round(hitPlusOne.cost) <= hitPlusOne.costC ? requiredUp(hitPlusOne.cost, hitPlusOne.costC) : Math.round(hitPlusOne.cost);
            hitPlusOne.costC = toRoundoff(hitPlusOne.costC);
            colorNumbers("hitPlusOneCostID", "red");
        }
        hitPlusOne.freeUp = false;
        hit += hitPlus;
        hitPlusOne.level++;

        // let lengthCost = hitPlusOne.costC.toString().length;
        // let lengthCost2 = hitPlusOne.costC.toString().length;
        // lengthCost = 10**(lengthCost - 1);
        // if (hitPlusOne.costC/lengthCost >= 9){
        //     hitPlusOne.costC = Math.ceil(hitPlusOne.costC/lengthCost)*lengthCost;
        // } else if (hitPlusOne.costC/Math.sqrt(lengthCost) >= 3 && lengthCost > 10){
        //     hitPlusOne.costC = Math.round(hitPlusOne.costC/(10**(lengthCost2-2)))*(lengthCost/10);
        // }
        colorNumbers("hitPlusOneLevelID", "green");
    } 
    updateInfo();
    // console.log(hitPlusOne.cost + " Cost");
    // console.log(hitPlusOne.costC + " CostC");
}

function hpMinusOnePercentUp(){
    if (exp >= hpMinusOnePercent.cost){
        expChanges(-Math.floor(hpMinusOnePercent.cost));
        hpMinusOnePercent.level++;
        if (hpMinusOnePercent.level < 10){
            layer.hardness -= 0.01;
            layer.hp = layer.hp * layer.hardness;
            layer.hpCurr *= layer.hardness; 
        } else {
            document.getElementById("hardnessID").classList.add('disabled');
            document.getElementById("hardnessBtnID").disabled = "disabled";
        }

        hpMinusOnePercent.cost *= costOfPumpRatio;
        document.getElementById("hpMinusOnePercentLevelID").innerHTML = hpMinusOnePercent.level;
        updateInfo();
    }
}

function profitUp(){
    if (exp >= prize.upCost){
        expChanges(-Math.floor(prize.upCost));
        prize.upLevel++;
        prize.upRatio += 0.01;
        prize.profit += 0.01;
        prize.upCost *= costOfPumpRatio;
        document.getElementById("profitUpLevelID").innerHTML = prize.upLevel;
        updateInfo();
        if (prize.upLevel >= 10){
            document.getElementById("profitID2").classList.add('disabled');
            document.getElementById("profitUpID").disabled = "disabled";
        }
    }
} 

function costOfPump1(){
    if (exp >= costOfPumpCost){
        expChanges(-Math.floor(costOfPumpCost));
        costOfPumpLevel++;
        costOfPumpRatioDown -= 0.01;
        costOfPumpCost *= 2;
        hitPlusOne.cost *= costOfPumpRatioDown;
        hitPlusOne.costC = Math.round(hitPlusOne.cost);
        hitPlusTen.cost *= costOfPumpRatioDown;
        autoHitOne.cost *= costOfPumpRatioDown;
        document.getElementById("costOfPumpLevelID").innerHTML = costOfPumpLevel;
        updateInfo();
    }
}

function autoHitUp(autoHitUp){
    if(money >= autoHitOneHundred.cost && autoHitUp > 10){
        if(!autoHitOneHundred.freeUp){
            moneyChanges(-Math.floor(hitPlusTen.costC));
            autoHitOneHundred.cost *= costOfPumpRatio;
            autoHitOneHundred.costC = toRoundoff(autoHitOneHundred.cost);
            colorNumbers("autoHitOneHundredCostID", "red");
        }
        autoHitOneHundred.freeUp = false;
        autoHitSecond += autoHitUp;
        autoHitOneHundred.level++;
        colorNumbers("autoHitOneHundredLevelID", "green");
    } else if (money >= autoHitTen.costC && autoHitUp > 1){
        if(!autoHitTen.freeUp){
            moneyChanges(-Math.floor(autoHitTen.costC));
            autoHitTen.cost *= costOfPumpRatio;
            autoHitTen.costC = toRoundoff(autoHitTen.cost);
            colorNumbers("autoHitTenCostID", "red");
        }
        autoHitTen.freeUp = false;
        autoHitTen.level++;
        autoHitSecond += autoHitUp;
        colorNumbers("autoHitTenLevelID", "green");
    }
    else if (money >= autoHitOne.costC){
        if(!autoHitOne.freeUp){
            moneyChanges(-Math.floor(autoHitOne.costC));
            autoHitOne.cost *= costOfPumpRatio;
            autoHitOne.costC = toRoundoff(autoHitOne.cost);
            colorNumbers("autoHitOneCostID", "red");
        }
        autoHitOne.freeUp = false;
        autoHitOne.level++;
        autoHitSecond++;
        colorNumbers("autoHitOneLevelID", "green");
    }
    updateInfo();
}

var moneyBonus;
let trw;
function bossLevelBonus(){
    moneyBonus = 0;
    trw = [];
    var switchsOn = 0;
    for (var i = 0; i < upgrades.length; i++){
        if(upgrades[i].switch == "on"){
            moneyBonus += upgrades[i].costC;
            switchsOn++;
        }
    }
    moneyBonus = toRoundoff(Math.ceil(Math.random()*(moneyBonus / switchsOn)) * 2 + 1);
    let bonus2 = upgrades[Math.floor(Math.random()*switchsOn)];
    trw.push(toCompactNotation(moneyBonus));
    trw.push(bonus2);
    let bonus3 = upgrades[Math.floor(Math.random()*switchsOn)];
    if (bonus3 != bonus2){
        trw.push(bonus3);
    }

    for (var i = 0; i < trw.length; i++){
        let valueBtn = trw[i].name;
        let text = trw[i].text;
        if (i == 0){
            valueBtn = "moneyBonus";
            text = trw[i] + " Монет!";
        }
        // console.log(disVar.length);
        document.getElementById("bossLevelBonusID").append(
            Object.assign(document.createElement('button'), {className: "bossLevelBonusCls", id: "bossLevelBonusID" + i,  innerHTML: "Приз №" + (i+1) + " " + text, value: valueBtn, onclick: function(){bossLevelBonusBtn(this);}})
        )
    }
    switchsHit(false);
    bossBonus = true;
}

function bossLevelBonusBtn(bonus){
    if(bonus.value == "moneyBonus"){
        moneyChanges(Math.floor(moneyBonus));
    } else {
        for (let i = 0; i < upgrades.length; i++){
            if (bonus.value == upgrades[i].name){
                upgrades[i].freeUp = true;
                upgrades[i].func();
            }
        }
    }
    for (var i = 0; i < trw.length; i++){
        document.getElementById("bossLevelBonusID" + i).remove();
    }
    bossBonus = false;
    switchsHit(true);
}

function menuTreePumpClose(){
    document.getElementById("menuTreePumpID").hidden = "hidden";
}
function menuTreePumpOpen(){
    document.getElementById("menuTreePumpID").removeAttribute("hidden");
}

function updateInfo(){
    onOffBtn();
    document.getElementById("profitID").innerHTML = toCompactNotation(prize.profitC * doubleMoney);
    document.getElementById("depthLevelID").innerHTML = toCompactNotation(layer.level);
    document.getElementById("layerHardnessID").innerHTML = Math.floor(layer.hardness * 100) + "%";
    document.getElementById("layerProfitID").innerHTML = Math.floor(prize.profit * 100) + "%";
    document.getElementById("costProfitID").innerHTML = Math.floor(costOfPumpRatioDown*100)+ "%";

    for(let i = 0; i < upgrades.length; i++){
        document.getElementById(upgrades[i].name + "CostID").innerHTML = toCompactNotation(upgrades[i].costC);
        document.getElementById(upgrades[i].name + "LevelID").innerHTML = upgrades[i].level;
    } 

    document.getElementById("hpMinusOnePercentCostID").innerHTML = Math.floor(hpMinusOnePercent.cost);
    document.getElementById("profitUpCostID").innerHTML = Math.floor(prize.upCost);
    document.getElementById("costOfPumpCostID").innerHTML = Math.floor(costOfPumpCost);
    
    document.getElementById("counterID").innerHTML = counter;
    document.getElementById("expID").innerHTML = toCompactNotation(exp);
    document.getElementById("hitID").innerHTML = hit;
    document.getElementById("autoHitInfoID").innerHTML = autoHitSecond;
    document.getElementById("hpID").innerHTML = Math.floor(layer.hpC);
}
