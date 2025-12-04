
var ratio = 1.1;
var hit = 1;
var autoHitSecond = 0;
var counter = 0;
var counterReboot = 0;
var money = 0;
var moneyExp = 0.0001;
var exp = 0;
var doubleMoney = 1;


//C-Current(текущий) R-Ratio(коэффициент) S-Start(стартовое)
var layer = {name: "layer", hp: 4, hpC: 4, hpR: ratio, hardness: 1, level: 0, expBonus: 0.1};
var prize = {name: "prize", profit: 1, profitC: 1, upCost: 10, upLevel: 0, upRatio: ratio};

var hitPlusOne = {name: "hitPlusOne", costS: 1, cost: 1, costC: 1, level: 0, openingLayer: 1, switch: "off", expBonus: 0.1, img: "pickaxe_transparent_390x390.png", imgGS: "pickaxe_transparent_grayscale_390x390.png", text: "+1 удару"};
var profitPlusOne = {name: "profitPlusOne", costS: 10, cost: 10, costC: 10, level: 0, openingLayer: 10, switch: "off", expBonus: 0.1, img: "helmet5.png", imgGS: "helmet5_transparent_grayscale_310x310.png", text: "+1🪙 к прибыли"};
var autoHitOne = {name: "autoHitOne", costS: 10, cost: 10, costC: 10, level: 0, openingLayer: 25, switch: "off", expBonus: 0.2, img: "helmet-pickaxe_transparent_450x450.png", imgGS: "helmet-pickaxe_transparent_grayscale_450x450.png", text: "+1 Автоудар раз <br> в секунду"};
var hitPlusTen = {name: "hitPlusTen", costS: 100, cost: 100, costC: 100, level: 0, openingLayer: 50, switch: "off", expBonus: 0.2, img: "drill_transparent_450x450.png", imgGS: "drill_transparent_grayscale_450x450.png", text: "+10 удару"};
var autoHitTen = {name: "autoHitTen", costS: 1000, cost: 1000, costC: 1000, level: 0, openingLayer: 100, switch: "off", expBonus: 0.3, img: "helmetDrill.png", imgGS: "helmetDrill_transparent_grayscale_450x450.png", text: "+10 Автоударов <br> в секунду"};
var autoHitOneHundred = {name: "autoHitOneHundred", costS: 10000, cost: 10000, costC: 10000, level: 0, openingLayer: 150, switch: "off", expBonus: 0.4, img: "helmet5.png", imgGS: "helmet5_transparent_grayscale_310x310.png", text: "+100 Автоударов <br> в секунду"};

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
    trembling();
    layer.hpC -= hit;
    counter++;
    document.getElementById("hpBarID").style.width = 100/layer.hp *layer.hpC + "%";
    // console.log(100/layer.hp *layer.hpC);
    finishLevel();
    updateInfo();
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
    autoHitSecond > 0 ? trembling() : updateInfo();
    layer.hpC -= autoHitSecond;
    document.getElementById("hpBarID").style.width = 100/layer.hp *layer.hpC + "%";
    finishLevel();
    updateInfo();
}

let layerUpIntervalID;
function finishLevel(){
    if (layer.hpC <= 0){
        document.getElementById("layerImgID").style.bottom = "-90%";
        layerUpIntervalID = setInterval(layerUp, 4);
        moneyChanges(Math.floor(prize.profitC * doubleMoney));
        layer.hpC = layer.hp *= layer.hpR;
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

let percent = -90;
function layerUp(){
    percent++;
    document.getElementById("layerImgID").style.bottom = percent+ "%";
    document.getElementById("ret").style.backgroundPosition = "0% " + percent/2 + "%";
    if (percent == 0){
        clearInterval(layerUpIntervalID);
        percent = -100;
        document.getElementById("ret").style.backgroundImage = "linear-gradient(rgba(50,50,50,0.8), rgba(50,50,50,0.8)), url(img/background-4x.png)";
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
    // console.log(original + (original*1.1) + " original");
    // console.log(result + " result");
    if (Math.round(original + (original*1.1)) <= result){
        result++;
    } else{
        result = Math.round(original + (original*1.1));
    }
    return result;
}

function profitPlusOne2(){
    if (money >= profitPlusOne.costC){
        prize.profit++;
        prize.profitC++;
        moneyChanges(-Math.floor(profitPlusOne.costC));
        profitPlusOne.level++;
        profitPlusOne.cost *= costOfPumpRatio;
        profitPlusOne.costC = toRoundoff(profitPlusOne.cost);
            console.log(profitPlusOne.costC + " profitPlusOne.costC");
        colorNumbers("profitPlusOneCostID", "red");
        colorNumbers("profitPlusOneLevelID", "green");
    }
    updateInfo();
}

function hitPlusOneUp(hitPlus) {
    if (money >= hitPlusTen.cost && hitPlus > 1){
        moneyChanges(-Math.floor(hitPlusTen.costC));
        hit += hitPlus;
        hitPlusTen.level++;
        hitPlusTen.cost *= costOfPumpRatio;
        hitPlusTen.costC = toRoundoff(hitPlusTen.cost);
        colorNumbers("hitPlusTenCostID", "red");
        colorNumbers("hitPlusTenLevelID", "green");
    } else if (money >= hitPlusOne.costC) {
        moneyChanges(-Math.floor(hitPlusOne.costC));
        hit += hitPlus;
        hitPlusOne.level++;
        hitPlusOne.cost *= costOfPumpRatio;
        hitPlusOne.costC = Math.round(hitPlusOne.cost) <= hitPlusOne.costC ? requiredUp(hitPlusOne.cost, hitPlusOne.costC) : Math.round(hitPlusOne.cost);
        hitPlusOne.costC = toRoundoff(hitPlusOne.costC);
        // let lengthCost = hitPlusOne.costC.toString().length;
        // let lengthCost2 = hitPlusOne.costC.toString().length;
        // lengthCost = 10**(lengthCost - 1);
        // if (hitPlusOne.costC/lengthCost >= 9){
        //     hitPlusOne.costC = Math.ceil(hitPlusOne.costC/lengthCost)*lengthCost;
        // } else if (hitPlusOne.costC/Math.sqrt(lengthCost) >= 3 && lengthCost > 10){
        //     hitPlusOne.costC = Math.round(hitPlusOne.costC/(10**(lengthCost2-2)))*(lengthCost/10);
        // }
        colorNumbers("hitPlusOneCostID", "red");
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
        moneyChanges(-Math.floor(hitPlusTen.costC));
        autoHitSecond += autoHitUp;
        autoHitOneHundred.level++;
        autoHitOneHundred.cost *= costOfPumpRatio;
        autoHitOneHundred.costC = toRoundoff(autoHitOneHundred.cost);
        colorNumbers("autoHitOneHundredCostID", "red");
        colorNumbers("autoHitOneHundredLevelID", "green");
    } else if (money >= autoHitTen.costC && autoHitUp > 1){
        moneyChanges(-Math.floor(autoHitTen.costC));
        autoHitTen.level++;
        autoHitSecond += autoHitUp;
        autoHitTen.cost *= costOfPumpRatio;
        autoHitTen.costC = toRoundoff(autoHitTen.cost);
        colorNumbers("autoHitTenCostID", "red");
        colorNumbers("autoHitTenLevelID", "green");
    }
    else if (money >= autoHitOne.costC){
        moneyChanges(-Math.floor(autoHitOne.costC));
        autoHitOne.level++;
        autoHitSecond++;
        autoHitOne.cost *= costOfPumpRatio;
        autoHitOne.costC = toRoundoff(autoHitOne.cost);
        colorNumbers("autoHitOneCostID", "red");
        colorNumbers("autoHitOneLevelID", "green");
    }
    updateInfo();
}

function bossLevelBonus(){
    for (var i = 0; i < 3; i++){
        var moneyBonus = 0;
        // console.log(disVar.length);
        for (var j = 0; j < switchVar.length; j++){
            if(switchVar[j].switch == "on"){
                moneyBonus += switchVar[j].costC;
            }
        }
        moneyBonus = toRoundoff(Math.floor(Math.random()*(moneyBonus / switchVar.length))+1);
        document.getElementById("bossLevelBonusID").append(
            Object.assign(document.createElement('button'), {className: "bossLevelBonusCls", id: "bossLevelBonusID" + i,  innerHTML: "Приз №" + i + " " + toCompactNotation(moneyBonus) + " Монет!", value: moneyBonus, onclick: function(){bossLevelBonusBtn(this);}})
        )
    }
}

function bossLevelBonusBtn(bonus){
    moneyChanges(Math.floor(bonus.value));
    for (var i = 0; i < 3; i++){
        document.getElementById("bossLevelBonusID" + i).remove();
    }
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

    document.getElementById("profitPlusOneCostID").innerHTML = toCompactNotation(profitPlusOne.costC);
    document.getElementById("profitPlusOneLevelID").innerHTML = profitPlusOne.level;
    
    document.getElementById("hitPlusOneCostID").innerHTML = toCompactNotation(hitPlusOne.costC);
    document.getElementById("hitPlusOneLevelID").innerHTML = hitPlusOne.level;

    document.getElementById("hitPlusTenCostID").innerHTML = toCompactNotation(hitPlusTen.costC);
    document.getElementById("hitPlusTenLevelID").innerHTML = hitPlusTen.level;

    document.getElementById("autoHitOneHundredCostID").innerHTML = toCompactNotation(autoHitOneHundred.costC);
    document.getElementById("autoHitOneHundredLevelID").innerHTML = autoHitOneHundred.level;

    document.getElementById("autoHitOneCostID").innerHTML = toCompactNotation(autoHitOne.costC);
    document.getElementById("autoHitOneLevelID").innerHTML = autoHitOne.level; 

    document.getElementById("autoHitTenCostID").innerHTML = toCompactNotation(autoHitTen.costC);
    document.getElementById("autoHitTenLevelID").innerHTML = autoHitTen.level;  

    document.getElementById("hpMinusOnePercentCostID").innerHTML = Math.floor(hpMinusOnePercent.cost);
    document.getElementById("profitUpCostID").innerHTML = Math.floor(prize.upCost);
    document.getElementById("costOfPumpCostID").innerHTML = Math.floor(costOfPumpCost);
    
    document.getElementById("counterID").innerHTML = counter;
    document.getElementById("expID").innerHTML = toCompactNotation(exp);
    document.getElementById("hitID").innerHTML = hit;
    document.getElementById("autoHitInfoID").innerHTML = autoHitSecond;
    document.getElementById("hpID").innerHTML = Math.floor(layer.hpC);
}
