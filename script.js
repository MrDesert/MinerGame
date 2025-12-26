const gameStatus = "Test1";
let money, handHit, autoHit;
let counter = 0;
let counterReboot = 0;

const moneyExp = 0.0001;
let exp = 10 + 20+ 40+80+160+320+640+1280+2560+5120;
let doubleMoney = 1;
let switchHit = true;
let bossBonus = false;
let countAutoHit = 0;


//C-Current(текущий) R-Ratio(коэффициент) S-Start(стартовое) P-Previos(Предыдующий)
let layer = {
    name: "layer", 
    hp: {
        base: 4, // Базовое
        calc: 4, // Расчётное 
        round: 4, // На начало раунда
        current: 4 // Текущее 
    },
    level: 0, 
    expBonus: 0.01
};
const prize = {name: "prize", profit: 1, profitC: 1};

const hitPlusOne = {name: "hitPlusOne", 
    cost: {
        base: 1, // Базовое
        calc: 1, // Расчётное
        current: 1 // Текущее
    },
    level: 0, 
    typeValue: "hit", 
    value: 1, 
    openingLayer: 1, 
    switch: "off", 
    expBonus: 0.05, 
    func: () => upgradesFunc("hitPlusOne"), 
    freeUp: false, 
    img: "pickaxe_transparent_390x390.png", 
    text: "+1 удару"
};

const autoHitOne = {name: "autoHitOne", cost: {base: 50, calc: 50, current: 50}, level: 0, typeValue: "auto", timeHit: 1.6, value: 1, openingLayer: 20, switch: "off", expBonus: 0.1, func: () => upgradesFunc("autoHitOne"), freeUp: false, img: "helmet-pickaxe_transparent_450x450.png", autoImg: "pickaxe_transparent_390x390.png", text: "+1 Автоудар раз в секунду"};
const hitPlusTen = {name: "hitPlusTen", cost: {base: 500, calc: 500, current: 500}, level: 0, typeValue: "hit", value: 5, openingLayer: 50, switch: "off", expBonus: 0.15, func: () => upgradesFunc("hitPlusTen"), freeUp: false, img: "drill_transparent_450x450.png", text: "+5 удару"};
const autoHitTen = {name: "autoHitTen", cost: {base: 2500, calc: 2500, current: 2500}, level: 0, typeValue: "auto", timeHit: 2.5, value: 8, openingLayer: 75, switch: "off", expBonus: 0.3, func: () => upgradesFunc("autoHitTen"), freeUp: false, img: "helmetDrill.png", autoImg: "drill_transparent_450x450.png", text: "+5 Автоударов в секунду"};
const profitPlusOne = {name: "profitPlusOne", cost: {base: 10000, calc: 10000, current: 10000}, level: 0, typeValue: "profit", value: 1, openingLayer: 125, switch: "off", expBonus: 0.05, func: () => upgradesFunc("profitPlusOne"), freeUp: false, img: "helmet5.png", text: "+1🪙 к прибыли"};
const autoHit100 = {name: "autoHit100", cost: {base: 250000, calc: 25000, current: 25000}, level: 0, typeValue: "auto", timeHit: 5.5, value: 80, openingLayer: 750, switch: "off", expBonus: 0.4, func: () => upgradesFunc("autoHit100"), freeUp: false, img: "helmet5.png", text: "+100 Автоударов в секунду"};

const upgrades = [hitPlusOne, autoHitOne, hitPlusTen, autoHitTen, profitPlusOne, autoHit100]; //массив с объектами улучшений;

const hardness = {
    name: "hardness", 
    value: 1, 
    valueStep: 0.01,
    parameter: {
        type: "%",
        step: -1,
        value: 100
    },
    cost: 10, 
    level: 0, 
    func: () => upgradesExpFunc("hardness"), 
    text: "Твёрдость слоёв: ", 
    title: "-1% к твёрдости", 
    description: "Твёрдость каждого слоя становится ниже "
};
const profit = {name: "profit", value: 1, valueStep: 0.01, parameter:{type: "%", step: 1, value: 100}, cost: 10, level: 0, func: () => upgradesExpFunc("profit"), text: "Прибыль добычи: ", title: "+1% к прибыле", description: "При каждой добыче вы будете получать больше прибыли "};
const costPump = {name: "costPump", value: 1, valueStep: -0.01, parameter:{type: "%", step: -1, value: 100}, cost: 10, level: 0, func: () => upgradesExpFunc("costPump"), text: "Цена улучшений: ", title: "-1% к цене улучшений", description: "Стоимость всех улучшений за монеты снизиться на 1% "};
const autoBonus = {name: "autoBonus", value: 11, valueStep: -1, parameter:{type: "s", step: -1, value: 11}, cost: 10, level: 0, enabled: false, func: () => upgradesExpFunc("autoBonus"), text: "Время автобонуса: ", title: "-1s ко времени автобонуса", description: "Автоматическое получение бонуса по истечению времени"};
const percentMoney = {name: "percentMoney", value: 0, valueStep: 0.01, parameter:{type: "%", step: 1, value: 0}, cost: 10, level: 0, func: () => upgradesExpFunc("percentMoney"), text: "Сохранение денег: ", title: "+1% к сохранению денег", description: "Сохраняет процент денег при перезапуске шахты"};
const speedAutoHit = {name: "speedAutoHit", value: 1, valueStep: -0.05, parameter:{type: "s", step: -0.05, value: 1}, cost: 10, level: 0, func: () => upgradesExpFunc("speedAutoHit"), text: "Скорость автоудара: ", title: "-0.05 к времени автоудара", description: "Увеличивает скорость автоудара"};
const expPlus = {name: "expPlus", value: 1, valueStep: 0.1, parameter:{type: "%", step: 10, value: 100}, cost: 10, level: 0, func: () => upgradesExpFunc("expPlus"), text: "Получение опыта: ", title: "+10% к полученому опыту", description: "Увеличивает получаемы опыт за шахту"};
const lycki = false;

const upgradesExp = [hardness, profit, costPump, autoBonus, percentMoney, speedAutoHit, expPlus];

let currentSecondsStart, currentSeconds;

let bossLevel = 1;
const bossLevelRatio = 10;
let moneyBonus, trw, timer;
let layerUpIntervalID, autoIntervalOne, autoIntervalTen, autoInterval100;

startingCreationGUI();
startingValues();
interval();
moneyChanges(0);


function interval(){
    autoIntervalOne = setInterval(() => hit(autoHitOne) , (1000*autoHitOne.timeHit*speedAutoHit.value));
    // autoIntervalTen = setInterval(() => hit(autoHitTen) , (1000*autoHitTen.timeHit*speedAutoHit.value));
    // autoInterval100 = setInterval(() => hit(autoHit100) , (1000*autoHit100.timeHit*speedAutoHit.value));
}

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
                    toStyle("#"+id+"ImgID", "filter", "grayscale(50%)");
                toCreateTag("#"+id+"ID", "div", id+"DescriptionID", "sideMenuElementDescription", upgrades[i].text, errorCode)
                toCreateTag("#"+id+"ID", "button", id+"BtnID", "sideMenuElementBtn", "", errorCode);
                    toCreateTag("#"+id+"BtnID", "img", id+"BtnImgID", "coinCl", "", errorCode);
                         document.getElementById(id+"BtnImgID").src = "img/coin.png";
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
            toCreateTag("#menuForExp", "div", "expTitleID", "moneyTopRight", "", errorCode);
                toCreateTag("#expTitleID", "img", "expImgID", "expCl", "", errorCode);
                    document.getElementById("expImgID").src = "img/exp.png";
                toCreateTag("#expTitleID", "div", "expID", "moneyTopRightNum", "", errorCode);
            toCreateTag("#menuForExp", "div", "infoExpID", "centralMenuInfo", "", errorCode);
                toCreateTag("#infoExpID", "div", "rebootExpDesID", "centralMenuInfoElement", "Если перезапустить шахту сейчас то можно получить: ", errorCode);
                toCreateTag("#infoExpID", "div", "rebootExpID", "centralMenuInfoElement", "", errorCode);
                    toCreateTag("#rebootExpID", "img", "rebootExpImgID", "expCl", "", errorCode);
                        document.getElementById("rebootExpImgID").src = "img/exp.png";
                toCreateTag("#infoExpID", "button", "rebootExpBtnID", "centralMenuElementBtn", "⟳", errorCode);
                    document.getElementById("rebootExpBtnID").onclick = function(){expBonus();};
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
    if(m != 0){
        onOffBtn();
        updateInfo();
    }
}

function expChanges(e){
    exp += e;
}

function startingValues(){
    if(gameStatus == "Test"){
        money = 10000000;
    } else {
        money = 0;
        layer.hp.calc = layer.hp.current = layer.hp.round = layer.hp.base;
        prize.profitC = prize.profit = 1 * profit.value;
        handHit = 1;
        autoHit = 0;
        layer.level = 0;

        for (let i = 0; i < upgrades.length; i++){
            upgrades[i].level = 0;
            upgrades[i].cost.current = upgrades[i].cost.calc = upgrades[i].cost.base;
            switchingElementMenu(false, upgrades[i]);
        }
    }
}

function expCalc(){
    let expProfit = money*moneyExp + layer.level*layer.expBonus + hitPlusOne.level*hitPlusOne.expBonus + profitPlusOne.level*profitPlusOne.expBonus + autoHitOne.level*autoHitOne.expBonus + hitPlusTen.level*hitPlusTen.expBonus + autoHitTen.level*autoHitTen.expBonus + autoHit100.level*autoHit100.expBonus;
    expProfit = Math.round(expProfit * expPlus.value);
    // console.log(money*moneyExp + " + " + layer.level*layer.expBonus + " + " + hitPlusOne.level*hitPlusOne.expBonus + " + " + profitPlusOne.level*profitPlusOne.expBonus + " + " + autoHitOne.level*autoHitOne.expBonus + " + " + hitPlusTen.level*hitPlusTen.expBonus + " + " + autoHitTen.level*autoHitTen.expBonus + " + " + autoHit100.level*autoHit100.expBonus + " = " + expProfit);
    return expProfit;
}

function expBonus(){
    let exp = expCalc();
    expChanges(exp);
    let m = money;
    startingValues();    
    money = Math.round(m * percentMoney.value);
    moneyChanges(0);
    counterReboot++;

    toStyle("#ret", "backgroundPositionY", "0%");
    toStyle("#hpBarID", "width", 100/layer.hp.round * layer.hp.current+ "%");
    toStyle("#cracksID", "height", 100-(100/layer.hp.round * layer.hp.current) + "%");

    toChangeText("counterRebootID", counterReboot);
    updateInfo();
}

function hit(object) {
    if (switchHit){
        if(object.typeValue == "hit"){counter++; damage(object);}
        else {
            if(object.level > 0){
                animationAutoHit(object);
            }
        } 

        updateInfo();
    }
    if (!document.getElementById("bossLevelBonusID").hidden && autoBonus.enabled == true){
        currentSeconds = new Date().getSeconds();
        let raznica = autoBonus.value - (currentSeconds - currentSecondsStart);
        toChangeText("timeID", "Автовыбор через: " + raznica + " секунд")
    }
}

function damage(object){
    trembling();
    if (switchHit){
        if (object.typeValue == "hit"){
            layer.hp.current -= handHit;
        } else {
            layer.hp.current -= object.value * object.level;
        }
        toStyle("#hpBarID", "width", 100/layer.hp.round * layer.hp.current + "%");
        toStyle("#cracksID", "height", 100-(100/layer.hp.round * layer.hp.current) + "%");
    }

    updateInfo();
}

function animationAutoHit(autoDamage){
    let id = "imgID" + countAutoHit++;
    toCreateTag("body", "img", id, "imgAutoHit", "", "hit-function");
    let element = document.getElementById(id);
        element.src = "img/"+autoDamage.autoImg;
        element.style.left = Math.floor(Math.random()*100)+"%";

    let rotate = Math.floor(Math.random()*60)+1070;
    if (autoDamage.name == "autoHitTen"){rotate += -60;}
    element.offsetHeight;
    element.style.transform = "rotate("+rotate+"deg)";
    element.style.top = "65%";

    element.addEventListener('transitionend', function opacity(e){
        if (e.propertyName === 'top'){
            element.style.opacity = "0%";
            element.classList.add("death");
            damage(autoDamage);
        } else if (e.propertyName === 'opacity'){
            element.remove();
            element.removeEventListener('transitionend', opacity); 
        }
    });
}

function trembling(){
    toStyle("#layerID", "left", Math.floor(Math.random()*2) > 0 ? "0.5%" : "-0.5%");
    // toStyle("#layerID", "bottom", Math.floor(Math.random()*2) > 0 ? "0.5%" : "-0.5%");
    setTimeout(function(){
        toStyle("#layerID", "left", "0%");
        // toStyle("#layerID", "bottom", "0%");
        finishLevel();
    }, 50);
}

function switchsHit(bool){;
    if (!bossBonus){
        switchHit = bool;
    }
}

function finishLevel(){
    if (layer.hp.current <= 0){
        switchsHit(false)
        toStyle("#layerImgID", "top", "100%");
        toStyle("#layerImgID", "transition", "none");
        let death = document.querySelectorAll(".death");
        death.forEach( det => {det.remove()});
        toStyle("#cracksID", "height", "0%");
        layerUpIntervalID = setTimeout(layerUp, 100);
        moneyChanges(Math.floor(prize.profitC * doubleMoney));
        layer.hp.calc = softProgress(layer.hp.calc, -1);
        layer.hp.round = layer.hp.current = Math.floor(layer.hp.calc * hardness.value);
        prize.profit = prize.profitC = Math.round(softProgress(prize.profit, -2));
        prize.profitC = Math.floor(prize.profitC * profit.value);
        layer.level++;
        toStyle("#hpBarID", "width", "100%");
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
    toStyle("#layerImgID", "transform", "scaleX("+ mirror +")");
    toStyle("#cracksID", "transform", "scaleX("+ mirror +")");
    toStyle("#layerImgID", "transition", "top 0.7s linear");
    toStyle("#layerImgID", "top", "0px");
    toStyle("#ret", "backgroundPositionY", layer.level*-200 + "px");
    clearInterval(layerUpIntervalID);
    layerUpIntervalID = setTimeout(() => switchsHit(true) && clearInterval(layerUpIntervalID), 700);
}

function onOffBtn(){
    for (let i = 0; i < upgrades.length; i++){
        let disBtn = document.getElementById(upgrades[i].name + "BtnID");
        // console.log(money >= upgrades[i].cost.current + "money >= upgrades[i].cost.current");
        // console.log(upgrades[i].switch == "on" + "upgrades[i].switch == 'on'");
        money >= upgrades[i].cost.current && upgrades[i].switch == "on" ? disBtn.removeAttribute("disabled") : disBtn.disabled="disabled";
    }
    for (let i = 0; i < upgradesExp.length; i++){
        let disBtn = document.getElementById(upgradesExp[i].name + "BtnID");
        exp >= upgradesExp[i].cost ? disBtn.removeAttribute("disabled") : disBtn.disabled="disabled";
    }
}

function switchingElementMenu(switchType, btn){
    if(switchType){
        btn.switch = "on";
        document.getElementById(btn.name+"ID").classList.remove("disabled");
        toStyle("#"+btn.name+"ImgID", "filter", "grayscale(0%)");
    } else {
        btn.switch = "off";
        document.getElementById(btn.name+"ID").classList.add("disabled");
        toStyle("#"+btn.name+"ImgID", "filter", "grayscale(50%)");
    }
    onOffBtn();
}

function upgradesFunc(upgrade) {
    let up = false;
    for(let i = 0; i < upgrades.length; i++){
        let name = upgrades[i].name;
        let freeUp = upgrades[i].freeUp;
        let costC = upgrades[i].cost.current;
        let typeValue = upgrades[i].typeValue;
        let value = upgrades[i].value;

        if (upgrade == name){
            if(freeUp){
                up = true;
                upgrades[i].freeUp = false;
            } else if(money >= costC){
                up = true;
                moneyChanges(-Math.floor(costC));
                upgrades[i].cost.calc = Math.round(softProgress(upgrades[i].cost.calc, i-1));
                upgrades[i].cost.current = Math.round(upgrades[i].cost.calc * costPump.value);
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
            upgradesExp[i].cost *= 2;
            upgradesExp[i].level++;
            upgradesExp[i].parameter.value += upgradesExp[i].parameter.step;
            upgradesExp[i].value += upgradesExp[i].valueStep;
            if(upgrade == "costPump"){
                for(let i = 0; i < upgrades.length; i++){
                    upgrades[i].cost.current = Math.round(upgrades[i].cost.calc * costPump.value);
                }
            } else if (upgrade == "autoBonus"){
                if (!autoBonus.enabled){autoBonus.enabled = true};
            } else if (upgrade == "speedAutoHit"){
                clearInterval(autoIntervalOne);
                clearInterval(autoIntervalTen);
                clearInterval(autoInterval100);
                interval();
            }
        } 
        if (upgradesExp[i].level >= 10){
            document.getElementById(name+"ID").classList.add('disabled');
            document.getElementById(name+"BtnID").disabled = "disabled";
        }
    }
    // onOffBtn()
    updateInfo();
}


function bossLevelBonus(){
    toSeeable("bossLevelBonusID");
    moneyBonus = 0;
    trw = [];
    let switchsOn = 0;
    let lowCost;
    for (let i = 0; i < upgrades.length; i++){
        if(upgrades[i].switch == "on"){
            moneyBonus += upgrades[i].cost.current;
            if (!lowCost || lowCost > upgrades[i].cost.current){
                lowCost = upgrades[i].cost.current;
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
    if (bonus3 != bonus2){trw.push(bonus3);}

    for (let i = 0; i < trw.length; i++){
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
    for (let i = 0; i < upgrades.length; i++){
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
    for (let i = 0; i < trw.length; i++){
        document.getElementById("bossLevelBonusID" + i).remove();
    }
    bossBonus = false;
    switchsHit(true);
    // onOffBtn();
    toHide("bossLevelBonusID");
}

function menuTreePump(open){
    open ? toSeeable("menuForExpBack") : toHide("menuForExpBack");
}

function updateInfo(){
    toChangeText("prizeID", toCompactNotation(prize.profitC * doubleMoney));
    toChangeText("depthLevelID", layer.level);

    for(let i = 0; i < upgrades.length; i++){
        toChangeText(upgrades[i].name+"CostID", toCompactNotation(upgrades[i].cost.current));
        toChangeText(upgrades[i].name+"LevelID", upgrades[i].level);
        if( upgrades[i].typeValue == "auto"){
            let text = " Автоудар - "
            // if(upgrades[i].value > 1){text = " Автоудар - "}
            toChangeText(upgrades[i].name+"DescriptionID", text + Math.round(upgrades[i].value*upgrades[i].level/(speedAutoHit.parameter.value*upgrades[i].timeHit)*100)/100 + " hp/s");
        }
    } 

    for(let i = 0; i < upgradesExp.length; i++){
        let name = upgradesExp[i].name;
        if(upgradesExp[i].enabled == false){
            toChangeText(name+"InfoValueID", "-" + upgradesExp[i].parameter.type);  
        } else {
            toChangeText(name+"InfoValueID", Math.round(upgradesExp[i].parameter.value*100)/100 + upgradesExp[i].parameter.type);
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
    toChangeText("rebootExpID", expCalc());
}