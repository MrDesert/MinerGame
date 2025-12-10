
var ratio = 1.01;
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
var autoUpgrade = true;
var autoUpgradeTime = 10;


//C-Current(текущий) R-Ratio(коэффициент) S-Start(стартовое) P-Previos(Предыдующий)
var layer = {name: "layer", hp: 4, hpC: 4, hpP: 4, hpS: 4, hpR: 1.01, hardness: 1, level: 0, expBonus: 0.1};
var prize = {name: "prize", profit: 1, profitC: 1, upCost: 10, upLevel: 0, upRatio: ratio};

var hitPlusOne = {name: "hitPlusOne", costS: 1, cost: 1, costC: 1, level: 0, typeValue: "hit", value: 1, openingLayer: 1, switch: "off", expBonus: 0.1, func: () => upgradesFunc("hitPlusOne"), freeUp: false, img: "pickaxe_transparent_390x390.png", imgGS: "pickaxe_transparent_grayscale_390x390.png", text: "+1 удару"};
var profitPlusOne = {name: "profitPlusOne", costS: 10, cost: 10, costC: 10, level: 0, typeValue: "profit", value: 1, openingLayer: 15, switch: "off", expBonus: 0.1, func: () => upgradesFunc("profitPlusOne"), freeUp: false, img: "helmet5.png", imgGS: "helmet5_transparent_grayscale_310x310.png", text: "+1🪙 к прибыли"};
var autoHitOne = {name: "autoHitOne", costS: 10, cost: 10, costC: 10, level: 0, typeValue: "auto", value: 1, openingLayer: 30, switch: "off", expBonus: 0.2, func: () => upgradesFunc("autoHitOne"), freeUp: false, img: "helmet-pickaxe_transparent_450x450.png", imgGS: "helmet-pickaxe_transparent_grayscale_450x450.png", text: "+1 Автоудар раз <br> в секунду"};
var hitPlusTen = {name: "hitPlusTen", costS: 100, cost: 100, costC: 100, level: 0, typeValue: "hit", value: 10, openingLayer: 60, switch: "off", expBonus: 0.2, func: () => upgradesFunc("hitPlusTen"), freeUp: false, img: "drill_transparent_450x450.png", imgGS: "drill_transparent_grayscale_450x450.png", text: "+10 удару"};
var autoHitTen = {name: "autoHitTen", costS: 1000, cost: 1000, costC: 1000, level: 0, typeValue: "auto", value: 10, openingLayer: 100, switch: "off", expBonus: 0.3, func: () => upgradesFunc("autoHitTen"), freeUp: false, img: "helmetDrill.png", imgGS: "helmetDrill_transparent_grayscale_450x450.png", text: "+10 Автоударов <br> в секунду"};
var autoHitOneHundred = {name: "autoHitOneHundred", costS: 10000, cost: 10000, costC: 10000, level: 0, typeValue: "auto", value: 100, openingLayer: 200, switch: "off", expBonus: 0.4, func: () => upgradesFunc("autoHitOneHundred"), freeUp: false, img: "helmet5.png", imgGS: "helmet5_transparent_grayscale_310x310.png", text: "+100 Автоударов <br> в секунду"};

var upgrades = [hitPlusOne, profitPlusOne, autoHitOne, hitPlusTen, autoHitTen, autoHitOneHundred]; //массив с объектами улучшений;

var hpMinusOnePercent = {cost: 10, level: 0};

// var costOfPump = {cost: 10, costC: 10,  };
var costOfPumpCost = 10;
var costOfPumpLevel = 0;
var costOfPumpRatioDown = 1;
var costOfPumpRatio = (ratio + 0.01) * costOfPumpRatioDown;

var bossLevel = 1;
var bossLevelRatio = 10;

var costOfPump = [1, 1, 1];

startingCreationGUI();
setInterval(autoHit , (1000));
moneyChanges(0);

function startingCreationGUI(){
    let errorCode = startingCreationGUI.name

    //Родитель: Селектор и имя; Ребёнок: Тэг, ID, классы, текст; Тех. Инфо: Код поиска. 
    toCreateTag("tag", "body", "div", "menuForCoins", "sideMenuLeft", "", errorCode);
    toCreateTag("id", "menuForCoins", "div", "menuForCoinsTitle", "sideMenuTitle", "Улучшения", errorCode);

    for(let i = 0; i < upgrades.length; i++){
        let id = upgrades[i].name;
        toCreateTag("id", "menuForCoins", "div", id+"ID", "sideMenuElement disabled", "", errorCode);
        toCreateTag("id", id+"ID", "div", id+"IconID", "sideMenuElementIconLeft", "", errorCode);
        toCreateTag("id", id+"IconID", "div", id+"LevelID", "sideMenuElementIconParametrTopLeft level", "", errorCode);
        toCreateTag("id", id+"IconID", "img", id+"ImgID", "sideMenuElementIconLeftIMG", "", errorCode);
        document.getElementById(id+"ImgID").src = "img/" + upgrades[i].imgGS;
        toCreateTag("id", id+"ID", "div", id+"DescriptionID", "sideMenuElementDescription", upgrades[i].text, errorCode)
        toCreateTag("id", id+"ID", "button", id+"BtnID", "sideMenuElementBtn", "🪙", errorCode);
        document.getElementById(id+"BtnID").onclick = function(){upgrades[i].func();};
        document.getElementById(id+"BtnID").disabled = "disabled";
        toCreateTag("id", id+"BtnID", "div", id+"CostID", "inline-block cost", "", errorCode)
    }
}

function moneyChanges(m){
    // console.log(m + " - Денег"); //Количество денег на трату
    colorNumbers("moneyID", m < 0 ? "red" : "green");
    money += m;
    document.getElementById("moneyID").innerHTML = toCompactNotation(money);
    onOffBtn();
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
        onOffBtn();
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
        // layer.hp *= layer.hpR;
        // layer.hpC = Math.round(layer.hp) <= layer.hpP ? requiredUp(layer.hp, layer.hpP) : Math.round(layer.hp);
        layer.hpP = layer.hpC = softProgress(layer.hpP, 1);
        // prize.profit *= prize.upRatio;
        // prize.profitC = Math.round(prize.profit) <= prize.profitC ? requiredUp(prize.profit, prize.profitC) : Math.round(prize.profit);
        prize.profitC = Math.round(softProgress(prize.profitC, 2));
        // prize.profitC = toRoundoff(prize.profitC);
        layer.level++;
        // let lycky = document.getElementById("luckyID");
        // Math.floor(Math.random() * 5) < 2 ? (doubleMoney = 2, lycky.innerHTML = "Удача!! х2 ") : (doubleMoney = 1, lycky.innerHTML= " ");
        document.getElementById("hpBarID").style.width = "100%";
        for (let i = 0; i < upgrades.length; i++){
            if (layer.level == upgrades[i].openingLayer){
                switchingElementMenu("enable", upgrades[i]);
            }
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
        switchsHit(true);
    }
}

function onOffBtn(){
    for (let i = 0; i < upgrades.length; i++){
        let disBtn = document.getElementById(upgrades[i].name + "BtnID");
        money >= upgrades[i].costC && upgrades[i].switch == "on" ? disBtn.removeAttribute("disabled") : disBtn.disabled="disabled";
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
    // console.log(Math.round(original*1.1) + " original");
    // console.log(result + " result");
    if (Math.round(original*1.1) <= result){
        result++;
    } else{
        result = Math.round(original*1.1);
    }
    // console.log(result + " result"); 
    return result;
}

function upgradesFunc(upgrade) {
    let up = false;
    for(let i = 0; i < upgrades.length; i++){
        let name = upgrades[i].name;
        let freeUp = upgrades[i].freeUp;
        let cost = upgrades[i].cost;
        let costC = upgrades[i].costC;
        let typeValue = upgrades[i].typeValue;
        let value = upgrades[i].value;

        if (upgrade == name){
            if(freeUp){
                up = true;
                upgrades[i].freeUp = false;
            } else if(money >= costC){
                up = true;
                moneyChanges(-Math.floor(costC));
                upgrades[i].cost *= costOfPumpRatio;
                upgrades[i].costC = toRoundoff(Math.round(cost) <= costC ? requiredUp(cost, costC) : Math.round(cost));
                colorNumbers(name+"CostID", "red");
            }
            if(up){
                switch(typeValue){
                    case "hit":
                        hit += value;
                        break;
                    case "auto":
                        autoHitSecond += value;
                        break;
                    case "profit":
                        prize.profit++;
                        prize.profitC++;
                        break;
                }
                upgrades[i].level++;
                colorNumbers(name+"LevelID", "green");
            }  
        }
    }
    updateInfo();
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

var moneyBonus;
let trw;
function bossLevelBonus(){
    document.getElementById("bossLevelBonusID").removeAttribute("hidden");
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
    for (var i = 0; i < upgrades.length; i++){
        document.getElementById(upgrades[i].name + "BtnID").disabled = "disabled";
    }
    if (autoUpgrade){
        setTimeout(function(){document.getElementById("bossLevelBonusID" + Math.floor(Math.random()*trw.length)).click()}, autoUpgradeTime*1000);
    }
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
    onOffBtn();
    document.getElementById("bossLevelBonusID").hidden = "hidden";
}

function menuTreePumpClose(){
    document.getElementById("menuTreePumpID").hidden = "hidden";
}
function menuTreePumpOpen(){
    document.getElementById("menuTreePumpID").removeAttribute("hidden");
}

function updateInfo(){
    document.getElementById("profitID").innerHTML = toCompactNotation(prize.profitC * doubleMoney);
    document.getElementById("depthLevelID").innerHTML = layer.level;
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
