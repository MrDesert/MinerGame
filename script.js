
var ratio = 1.01;
var money, handHit, autoHit;
var counter = 0;
var counterReboot = 0;

var moneyExp = 0.0001;
var exp = 0;
var doubleMoney = 1;
var switchHit = true;
var bossBonus = false;


//C-Current(текущий) R-Ratio(коэффициент) S-Start(стартовое) P-Previos(Предыдующий)
var layer = {
    name: "layer", 
    hp: {
        base: 4, // Базовое
        calc: 4, // Расчётное 
        round: 4, // На начало раунда
        current: 4, // Текущее 
    },
    level: 0, 
    expBonus: 0.01
};
var prize = {name: "prize", profit: 1, profitC: 1};

var hitPlusOne = {name: "hitPlusOne", costS: 1, cost: 1, costC: 1, level: 0, typeValue: "hit", value: 1, openingLayer: 1, switch: "off", expBonus: 0.05, func: () => upgradesFunc("hitPlusOne"), freeUp: false, img: "pickaxe_transparent_390x390.png", text: "+1 удару"};
var profitPlusOne = {name: "profitPlusOne", costS: 20, cost: 20, costC: 20, level: 0, typeValue: "profit", value: 1, openingLayer: 20, switch: "off", expBonus: 0.05, func: () => upgradesFunc("profitPlusOne"), freeUp: false, img: "helmet5.png", text: "+1🪙 к прибыли"};
var autoHitOne = {name: "autoHitOne", costS: 50, cost: 50, costC: 50, level: 0, typeValue: "auto", value: 1, openingLayer: 40, switch: "off", expBonus: 0.1, func: () => upgradesFunc("autoHitOne"), freeUp: false, img: "helmet-pickaxe_transparent_450x450.png", text: "+1 Автоудар раз <br> в секунду"};
var hitPlusTen = {name: "hitPlusTen", costS: 150, cost: 150, costC: 150, level: 0, typeValue: "hit", value: 10, openingLayer: 75, switch: "off", expBonus: 0.15, func: () => upgradesFunc("hitPlusTen"), freeUp: false, img: "drill_transparent_450x450.png", text: "+10 удару"};
var autoHitTen = {name: "autoHitTen", costS: 1500, cost: 1500, costC: 1500, level: 0, typeValue: "auto", value: 10, openingLayer: 150, switch: "off", expBonus: 0.3, func: () => upgradesFunc("autoHitTen"), freeUp: false, img: "helmetDrill.png", text: "+10 Автоударов <br> в секунду"};
var autoHitOneHundred = {name: "autoHitOneHundred", costS: 20000, cost: 20000, costC: 20000, level: 0, typeValue: "auto", value: 100, openingLayer: 500, switch: "off", expBonus: 0.4, func: () => upgradesFunc("autoHitOneHundred"), freeUp: false, img: "helmet5.png", text: "+100 Автоударов <br> в секунду"};

var upgrades = [hitPlusOne, profitPlusOne, autoHitOne, hitPlusTen, autoHitTen, autoHitOneHundred]; //массив с объектами улучшений;

var hardness = {name: "hardness", value: 1, parametr: 100, typeParametr: "%", cost: 10, level: 0, func: () => upgradesExpFunc("hardness"), text: "Твёрдость слоёв: ", title: "-1% к твёрдости", description: "Твёрдость каждого слоя становится ниже "};
var profit = {name: "profit", value: 1, parametr: 100, typeParametr: "%", cost: 10, level: 0, func: () => upgradesExpFunc("profit"), text: "Прибыль добычи: ", title: "+1% к прибыле", description: "При каждой добыче вы будете получать больше прибыли "};
var costPump = {name: "costPump", value: 1, parametr: 100, typeParametr: "%", cost: 10, level: 0, func: () => upgradesExpFunc("costPump"), text: "Цена улучшений: ", title: "-1% к цене улучшений", description: "Стоимость всех улучшений за монеты снизиться на 1% "};
var autoBonus = {name: "autoBonus", value: 11, parametr: 10, typeParametr: "s", cost: 10, level: 0, enabled: false, func: () => upgradesExpFunc("autoBonus"), text: "Время автобонуса: ", title: "-1s ко времени автобонуса", description: "Автоматическое получение бонуса по истечению времени"};

var upgradesExp = [hardness, profit, costPump, autoBonus];

let currentSecondsStart;
let currentSeconds;

var costOfPumpRatio = (ratio + 0.01) * costPump.value;

var bossLevel = 1;
var bossLevelRatio = 10;

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
                toCreateTag("#"+id+"ID", "p", id+"DescriptionID", "centralMenuElementDescription", upgradesExp[i].description, errorCode);  
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
    layer.hp.calc = layer.hp.current = layer.hp.round = layer.hp.base;
    prize.profitC = prize.profit = 1 * profit.value;
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
    document.getElementById("hpBarID").style.width = 100/layer.hp.round * layer.hp.current+ "%";
    document.getElementById("cracksID").style.height = 100-(100/layer.hp.round * layer.hp.current) + "%";

    toChangeText("counterRebootID", counterReboot);
    updateInfo();
}

function hit(damage, type) {
    if (switchHit){
        if(type == "hand"){counter++;} 
        if(damage > 0){trembling();}
        layer.hp.current -= damage;
        document.getElementById("hpBarID").style.width = 100/layer.hp.round * layer.hp.current + "%";
        document.getElementById("cracksID").style.height = 100-(100/layer.hp.round * layer.hp.current) + "%";
        finishLevel();
        updateInfo();
    }
    if (!document.getElementById("bossLevelBonusID").hidden && autoBonus.enabled == true){
        currentSeconds = new Date().getSeconds();
        let raznica = autoBonus.value - (currentSeconds - currentSecondsStart);
        toChangeText("timeID", "Автовыбор через: " + raznica + " секунд")
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
    if (layer.hp.current <= 0){
        switchsHit(false)
        document.getElementById("layerImgID").style.top = "100%";
        document.getElementById("layerImgID").style.transition = "none";
        document.getElementById("cracksID").style.height = "0%";
        layerUpIntervalID = setTimeout(layerUp, 100);
        moneyChanges(Math.floor(prize.profitC * doubleMoney));
        layer.hp.calc = softProgress(layer.hp.calc, 1);
        layer.hp.round = layer.hp.current = Math.floor(layer.hp.calc * hardness.value);
        prize.profitC = Math.round(softProgress(prize.profit, 2));
        prize.profit = Math.floor(prize.profitC * profit.value);
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
    console.log(Math.round(original*1.1) + " original");
    console.log(result + " result");
    if (Math.round(original*1.1) <= result){
        console.log("if")
        result++;
    } else{
        console.log("else")
        result = Math.round(original*1.1);
    }
    console.log(result + " result"); 
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
                console.log(upgrades[i].cost + " upgrades[i].cost")
                console.log(upgrades[i].costC + " upgrades[i].costC")
                upgrades[i].costC = Math.round(softProgress(upgrades[i].costC, 1))+i;
                // upgrades[i].costC = toRoundoff(Math.round(cost) <= costC ? requiredUp(cost, costC) : Math.round(cost));
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
                hardness.parametr -= 1;
            } else if(upgrade == "profit"){
                profit.value += 0.01;
                profit.parametr += 1;
            } else if(upgrade == "costPump"){
                costPump.value -= 0.01;
                costPump.parametr -= 1;
                for(let i = 0; i < upgrades.length; i++){
                    upgrades[i].costC = Math.round(upgrades[i].cost * costPump.value);
                }
            } else if (upgrade == "autoBonus"){
                autoBonus.parametr = autoBonus.value -= 1;
                if (!autoBonus.enabled){ autoBonus.enabled = true};
            }
        } 
        if (upgradesExp[i].level >= 10){
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
    var lowCost;
    for (var i = 0; i < upgrades.length; i++){
        if(upgrades[i].switch == "on"){
            moneyBonus += upgrades[i].costC;
            if (!lowCost || lowCost > upgrades[i].costC){
                lowCost = upgrades[i].costC;
            }
            switchsOn++;
        }
    }
    moneyBonus = toRoundoff(Math.ceil(Math.random()*(moneyBonus / switchsOn)) * 2 + 1);
    if(moneyBonus < lowCost){moneyBonus = lowCost + moneyBonus};
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
        document.getElementById("bossLevelBonusID").append(
            Object.assign(document.createElement('button'), {className: "bossLevelBonusCls", id: "bossLevelBonusID" + i,  innerHTML: "Приз №" + (i+1) + " " + text, value: valueBtn, onclick: function(){bossLevelBonusBtn(this);}})
        )
    }
    switchsHit(false);
    bossBonus = true;
    for (var i = 0; i < upgrades.length; i++){
        document.getElementById(upgrades[i].name + "BtnID").disabled = "disabled";
    }
    if (autoBonus.enabled){
        currentSecondsStart = new Date().getSeconds();
        timer = setTimeout(function(){document.getElementById("bossLevelBonusID" + Math.floor(Math.random()*trw.length)).click()}, autoBonus.value*1000);
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
        if(upgradesExp[i].enabled == false){
            toChangeText(name+"InfoValueID", "-" + upgradesExp[i].typeParametr);  
        } else {
            toChangeText(name+"InfoValueID", upgradesExp[i].parametr + upgradesExp[i].typeParametr);
        }
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
    toChangeText("hpID", Math.floor(layer.hp.current));
}