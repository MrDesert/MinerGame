
var ratio = 1.01;
var money, handHit, autoHit;
var counter = 0;
var counterReboot = 0;

var moneyExp = 0.0001;
var exp = 1000;
var doubleMoney = 1;
var switchHit = true;
var bossBonus = false;
var autoUpgrade = true;
var autoUpgradeTime = 10;


//C-Current(текущий) R-Ratio(коэффициент) S-Start(стартовое) P-Previos(Предыдующий)
var layer = {name: "layer", hp: 4, hpC: 4, hpP: 4, hpS: 4, hpR: 1.01, level: 0, expBonus: 0.1};
var prize = {name: "prize", profit: 1, profitC: 1, upRatio: ratio};

var hitPlusOne = {name: "hitPlusOne", costS: 1, cost: 1, costC: 1, level: 0, typeValue: "hit", value: 1, openingLayer: 1, switch: "off", expBonus: 0.1, func: () => upgradesFunc("hitPlusOne"), freeUp: false, img: "pickaxe_transparent_390x390.png", text: "+1 удару"};
var profitPlusOne = {name: "profitPlusOne", costS: 10, cost: 10, costC: 10, level: 0, typeValue: "profit", value: 1, openingLayer: 15, switch: "off", expBonus: 0.1, func: () => upgradesFunc("profitPlusOne"), freeUp: false, img: "helmet5.png", text: "+1🪙 к прибыли"};
var autoHitOne = {name: "autoHitOne", costS: 10, cost: 10, costC: 10, level: 0, typeValue: "auto", value: 1, openingLayer: 30, switch: "off", expBonus: 0.2, func: () => upgradesFunc("autoHitOne"), freeUp: false, img: "helmet-pickaxe_transparent_450x450.png", text: "+1 Автоудар раз <br> в секунду"};
var hitPlusTen = {name: "hitPlusTen", costS: 100, cost: 100, costC: 100, level: 0, typeValue: "hit", value: 10, openingLayer: 60, switch: "off", expBonus: 0.2, func: () => upgradesFunc("hitPlusTen"), freeUp: false, img: "drill_transparent_450x450.png", text: "+10 удару"};
var autoHitTen = {name: "autoHitTen", costS: 1000, cost: 1000, costC: 1000, level: 0, typeValue: "auto", value: 10, openingLayer: 100, switch: "off", expBonus: 0.3, func: () => upgradesFunc("autoHitTen"), freeUp: false, img: "helmetDrill.png", text: "+10 Автоударов <br> в секунду"};
var autoHitOneHundred = {name: "autoHitOneHundred", costS: 10000, cost: 10000, costC: 10000, level: 0, typeValue: "auto", value: 100, openingLayer: 200, switch: "off", expBonus: 0.4, func: () => upgradesFunc("autoHitOneHundred"), freeUp: false, img: "helmet5.png", text: "+100 Автоударов <br> в секунду"};

var upgrades = [hitPlusOne, profitPlusOne, autoHitOne, hitPlusTen, autoHitTen, autoHitOneHundred]; //массив с объектами улучшений;

var hardness = {name: "hardness", value: 1, cost: 10, level: 0, func: () => upgradesExpFunc("hardness"), text: "Твёрдость слоёв: ", title: "-1% к твёрдости", description: "Твёрдость каждого слоя становится ниже "};
var profit = {name: "profit", value: 1, cost: 10, level: 0, func: () => upgradesExpFunc("profit"), text: "Прибыль добычи: ", title: "+1% к прибыле", description: "При каждой добыче вы будете получать больше прибыли "};
var costPump = {name: "costPump", value: 1, cost: 10, level: 0, func: () => upgradesExpFunc("costPump"), text: "Цена улучшений: ", title: "-1% к цене улучшений", description: "Стоимость всех улучшений за монеты снизиться на 1% "};

var upgradesExp = [hardness, profit, costPump];



// var costOfPump = {cost: 10, costC: 10};
var costOfPumpRatio = (ratio + 0.01) * costPump.value;

var bossLevel = 1;
var bossLevelRatio = 10;

var costOfPump = [1, 1, 1];

startingCreationGUI();
startingValues();

setInterval(() => hit(autoHit,"auto") , (1000));
moneyChanges(0);

function startingCreationGUI(){
    let errorCode = startingCreationGUI.name

    //Родитель: Имя с селетором; Ребёнок: Тэг, ID, классы, текст; Тех. Инфо: Код поиска. 
    //Боковое меню
    toCreateTag("body", "div", "menuForCoins", "sideMenuLeft", "", errorCode);
        toCreateTag("#menuForCoins", "div", "menuForCoinsTitle", "sideMenuTitle", "Улучшения", errorCode);
    for(let i = 0; i < upgrades.length; i++){
        let id = upgrades[i].name;
        toCreateTag("#menuForCoins", "div", id+"ID", "sideMenuElement disabled", "", errorCode);
            toCreateTag("#"+id+"ID", "div", id+"IconID", "sideMenuElementIconLeft", "", errorCode);
                toCreateTag("#"+id+"IconID", "div", id+"LevelID", "sideMenuElementIconParametrTopLeft level", "", errorCode);
                toCreateTag("#"+id+"IconID", "img", id+"ImgID", "sideMenuElementIconLeftIMG", "", errorCode);
                    document.getElementById(id+"ImgID").src = "img/" + upgrades[i].img;
                    document.getElementById(id+"ImgID").style.filter = "grayscale(50%)";
                toCreateTag("#"+id+"ID", "div", id+"DescriptionID", "sideMenuElementDescription", upgrades[i].text, errorCode)
                toCreateTag("#"+id+"ID", "button", id+"BtnID", "sideMenuElementBtn", "🪙", errorCode);
                    document.getElementById(id+"BtnID").onclick = function(){upgrades[i].func();};
                    document.getElementById(id+"BtnID").disabled = "disabled";
                    toCreateTag("#"+id+"BtnID", "div", id+"CostID", "inline-block cost", "", errorCode)
    }
    // Центральное меню
    toCreateTag("body", "div", "menuForExpBack", "centralMenuBackground", "", errorCode);
    toHide('menuForExpBack');
        toCreateTag("#menuForExpBack", "div", "menuForExp", "centralMenu", "", errorCode);
            toCreateTag("#menuForExp", "button", "menuForExpBtnClose", "btnCloseCircule", "X", errorCode);
                document.getElementById("menuForExpBtnClose").onclick = function(){menuTreePump(false)};
            toCreateTag("#menuForExp", "div", "expTitleID", "moneyTopRight", "🟢", errorCode);
                toCreateTag("#expTitleID", "div", "expID", "moneyTopRightNum", "", errorCode);
            toCreateTag("#menuForExp", "div", "infoID", "centralMenuInfo", "", errorCode);
        for(let i = 0; i < upgradesExp.length; i++){
            let id = upgradesExp[i].name;
                toCreateTag("#infoID", "div", id+"InfoID", "centralMenuInfoElement", upgradesExp[i].text, errorCode);
                    toCreateTag("#"+id+"InfoID", "div", id+"InfoValueID", "centralMenuInfoElementValue inline-block", "", errorCode);
            toCreateTag("#menuForExp", "div", id+"ID", "centralMenuElement inline-block", "", errorCode);
                toCreateTag("#"+id+"ID", "div", id+"TitleID", "centralMenuElementTitle", upgradesExp[i].title, errorCode); 
                toCreateTag("#"+id+"ID", "div", id+"LevelID", "btnCloseCircule", "0", errorCode);
                toCreateTag("#"+id+"ID", "div", id+"DescriptionID", "centralMenuElementDescription", upgradesExp[i].description, errorCode);  
                toCreateTag("#"+id+"ID", "button", id+"BtnID", "centralMenuElementBtn", "🟢", errorCode);
                    document.getElementById(id+"BtnID").onclick = function(){upgradesExp[i].func();};
                    toCreateTag("#"+id+"BtnID", "div", id+"CostID", "inline-block cost", "", errorCode);
        }       
}

function moneyChanges(m){
    // console.log(m + " - Денег"); //Количество денег на трату
    colorNumbers("moneyID", m < 0 ? "red" : "green");
    money += m;
    toChangeText("moneyID", toCompactNotation(money));
    onOffBtn();
    updateInfo();
}

function expChanges(e){
    exp += e;
}

function startingValues(){
    money = 0;
    layer.hpC = layer.hp = 4;
    prize.profitC = prize.profit = 1;
    handHit = 1;
    autoHit = 0;
    layer.level = 0;

    for (let i = 0; i < upgrades.length; i++){
        upgrades[i].level = 0;
        upgrades[i].costC = upgrades[i].cost = upgrades[i].costS;
        switchingElementMenu(false, upgrades[i]);
    }
}
 
function expBonus(){
    var expProfit = money*moneyExp + layer.level*layer.expBonus + hitPlusOne.level*hitPlusOne.expBonus + profitPlusOne.level*profitPlusOne.expBonus + autoHitOne.level*autoHitOne.expBonus + hitPlusTen.level*hitPlusTen.expBonus + autoHitTen.level*autoHitTen.expBonus + autoHitOneHundred.level*autoHitOneHundred.expBonus;
    expProfit = Math.round(expProfit);
    console.log(money*moneyExp + " + " + layer.level*layer.expBonus + " + " + hitPlusOne.level*hitPlusOne.expBonus + " + " + profitPlusOne.level*profitPlusOne.expBonus + " + " + autoHitOne.level*autoHitOne.expBonus + " + " + hitPlusTen.level*hitPlusTen.expBonus + " + " + autoHitTen.level*autoHitTen.expBonus + " + " + autoHitOneHundred.level*autoHitOneHundred.expBonus + " = " + expProfit);
    expChanges(expProfit);
    startingValues();    

    moneyChanges(0);
    counterReboot++;

    document.getElementById("ret").style.backgroundPositionY = "0%"
    document.getElementById("ret").style.transition = "none";

    toChangeText("counterRebootID", counterReboot);
    updateInfo();
}

function hit(damage, type) {
    if (switchHit){
        if(type == "hand"){counter++;} 
        if(damage > 0){trembling();}
        layer.hpC -= damage;
        document.getElementById("hpBarID").style.width = 100/layer.hpP *layer.hpC + "%";
        document.getElementById("cracksID").style.height = 100-(100/layer.hpP *layer.hpC) + "%";
        finishLevel();
        updateInfo();
    }
}

function trembling(){
    let horizontal = Math.floor(Math.random()*2);
    let vertical = Math.floor(Math.random()*2);
    let layer = document.getElementById("layerID");
    layer.style.left = horizontal > 0 ? "0.5%" : "-0.5%";
    layer.bottom = vertical > 0 ? "0.5%" : "-0.5%";
    setTimeout(function(){
        layer.style.left = "0%"; 
        layer.style.bottom = "0%";
    }, 50);
}

function switchsHit(bool){;
    if (!bossBonus){
        switchHit = bool;
    }
}

let layerUpIntervalID;
function finishLevel(){
    if (layer.hpC <= 0){
        switchsHit(false)
        document.getElementById("layerImgID").style.top = "400px";
        document.getElementById("layerImgID").style.transition = "none";
        document.getElementById("cracksID").style.height = "0%";
        layerUpIntervalID = setTimeout(layerUp, 100);
        moneyChanges(Math.floor(prize.profitC * doubleMoney));
        layer.hpP = layer.hpC = softProgress(layer.hpP, 1);
        prize.profitC = Math.round(softProgress(prize.profitC, 2));
        layer.level++;
        document.getElementById("hpBarID").style.width = "100%";
        for (let i = 0; i < upgrades.length; i++){
            if (layer.level == upgrades[i].openingLayer){
                switchingElementMenu(true, upgrades[i]);
            }
        }
        if (bossLevel == layer.level){  
            bossLevel += bossLevelRatio;
            bossLevelBonus();
        }
        updateInfo();
    }
} 

function layerUp(){
    let mirror = Math.round(Math.random()*1);
    if(mirror == 0){mirror = -1;}
    let layerImgID = document.getElementById("layerImgID");
    layerImgID.style.transform = "scaleX("+ mirror +")";
    document.getElementById("cracksID").style.transform = "scaleX("+ mirror +")";
    layerImgID.style.transition = "top 0.7s linear";
    layerImgID.style.top = "0px";
    document.getElementById("ret").style.transition = "background-position 0.7s linear";
    document.getElementById("ret").style.backgroundPositionY = layer.level*-200 + "px";
    clearInterval(layerUpIntervalID);
    layerUpIntervalID = setTimeout(() => switchsHit(true) && clearInterval(layerUpIntervalID), 700);
}

function onOffBtn(){
    for (let i = 0; i < upgrades.length; i++){
        let disBtn = document.getElementById(upgrades[i].name + "BtnID");
        money >= upgrades[i].costC && upgrades[i].switch == "on" ? disBtn.removeAttribute("disabled") : disBtn.disabled="disabled";
    }
    for (let i = 0; i < upgradesExp.length; i++){
        let disBtn = document.getElementById(upgradesExp[i].name + "BtnID");
        exp >= upgradesExp[i].cost ? disBtn.removeAttribute("disabled") : disBtn.disabled="disabled";
    }
}

function switchingElementMenu(switchType, btn){
    if(switchType){
        btn.switch = "on"
        document.getElementById(btn.name+"ID").classList.remove("disabled");
        document.getElementById(btn.name+"ImgID").style.filter = "grayscale(0%)";
    } else {
        btn.switch = "off"
        document.getElementById(btn.name+"ID").classList.add("disabled");
        document.getElementById(btn.name+"ImgID").style.filter = "grayscale(50%)";
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
                        handHit += value;
                        break;
                    case "auto":
                        autoHit += value;
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

function upgradesExpFunc(upgrade){
    for(let i = 0; i < upgradesExp.length; i++){
        let name = upgradesExp[i].name;
        let cost = upgradesExp[i].cost;
        if(upgrade == name && exp >= cost){
            expChanges(-Math.floor(cost));
            upgradesExp[i].cost *= 1.4;
            upgradesExp[i].level++;
            if(upgrade == "hardness"){
                hardness.value -= 0.01;
                layer.hp *= hardness.value;
                layer.hpCurr *= hardness.value; 
            } else if(upgrade == "profit"){
                prize.upRatio += 0.01;
                profit.value += 0.01;
            } else if(upgrade == "costPump"){
                costPump.value -= 0.01;
                hitPlusOne.cost *= costPump.value;
                hitPlusOne.costC = Math.round(hitPlusOne.cost);
                hitPlusTen.cost *= costPump.value;
                autoHitOne.cost *= costPump.value;
            }
        } 
        if (upgradesExp[i].level >= 9){
            console.log(upgradesExp[i].level);
            document.getElementById(name+"ID").classList.add('disabled');
            document.getElementById(name+"BtnID").disabled = "disabled";
        }
    }
    onOffBtn()
    updateInfo();
}

var moneyBonus;
let trw;
let timer;
function bossLevelBonus(){
    toSeeable("bossLevelBonusID");
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
        timer = setTimeout(function(){document.getElementById("bossLevelBonusID" + Math.floor(Math.random()*trw.length)).click()}, autoUpgradeTime*1000);
    }
}

function bossLevelBonusBtn(bonus){
    clearTimeout(timer);
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
    toHide("bossLevelBonusID");
}

function menuTreePump(open){
    if(open){
        toSeeable("menuForExpBack");
    } else {
        toHide("menuForExpBack");
    } 
}

function updateInfo(){
    toChangeText("prizeID", toCompactNotation(prize.profitC * doubleMoney));
    toChangeText("depthLevelID", layer.level);

    for(let i = 0; i < upgrades.length; i++){
        toChangeText(upgrades[i].name+"CostID", toCompactNotation(upgrades[i].costC));
        toChangeText(upgrades[i].name+"LevelID", upgrades[i].level);
    } 

    for(let i = 0; i < upgradesExp.length; i++){
        let name = upgradesExp[i].name;
        toChangeText(name+"InfoValueID", Math.floor(upgradesExp[i].value * 100) + "%");
        toChangeText(name+"CostID", Math.floor(upgradesExp[i].cost));
        toChangeText(name+"LevelID", upgradesExp[i].level);
        if (upgradesExp[i].level >= 10){
            toChangeText(upgradesExp[i].name+"CostID", "Максимум");
        }
    }
    
    toChangeText("counterID", counter);
    toChangeText("expID", toCompactNotation(exp));
    toChangeText("hitID", handHit);
    toChangeText("autoHitInfoID", autoHit);
    toChangeText("hpID", Math.floor(layer.hpC));
}