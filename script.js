let langGame = "en";
const langTexts = {};
let textsLoaded = false;
let loadImgs = false;

let money, handHit, autoHit;
let allBonusFree = true;
let rerollTimer = false;

const moneyExp = 0.0001;
let exp = 0;
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

const hitPlusOne = {
    name: "hitPlusOne", 
    cost: {
        base: 3, // Базовое
        calc: 3, // Расчётное
        current: 3 // Текущее
    },
    level: 0, 
    typeValue: "hit", 
    value: 1, 
    openingLayer: 1, 
    switch: "off", 
    expBonus: 0.05, 
    func: () => upgradesFunc("hitPlusOne"), 
    freeUp: false, 
    img: "shovel_transparent_390x390.png", 
    text: "+1 к удару",
    title: "Лопата"
};

const autoHitOne = {name: "autoHitOne", cost: {base: 100, calc: 100, current: 100}, level: 0, typeValue: "auto", timeHit: 1.6, value: 1, openingLayer: 10, switch: "off", expBonus: 0.1, func: () => upgradesFunc("autoHitOne"), freeUp: false, img: "helmet-shovel_transparent_450x450.png", autoImg: "shovel_transparent_390x390.png", rotate: -80, text: "+1 Автоудар раз в секунду", title: "Шахтёр с Лопатой"};
const profitPlusOne = {name: "profitPlusOne", cost: {base: 600, calc: 600, current: 600}, level: 0, typeValue: "profit", value: 1, openingLayer: 50, switch: "off", expBonus: 0.15, func: () => upgradesFunc("profitPlusOne"), freeUp: false, img: "helmet5.png", text: "+1 к прибыли", title: "Каска"};
const hitPlusTen = {name: "hitPlusTen", cost: {base: 500, calc: 500, current: 500}, level: 0, typeValue: "hit", value: 5, openingLayer: 50, switch: "off", expBonus: 0.15, func: () => upgradesFunc("hitPlusTen"), freeUp: false, img: "pickaxe_transparent_390x390.png", text: "+5 к удару", title: "Кирка"};
const autoHitTen = {name: "autoHitTen", cost: {base: 5000, calc: 5000, current: 5000}, level: 0, typeValue: "auto", timeHit: 2.8, value: 7, openingLayer: 100, switch: "off", expBonus: 0.2, func: () => upgradesFunc("autoHitTen"), freeUp: false, img: "helmet-pickaxe_transparent_450x450.png", autoImg: "pickaxe_transparent_390x390.png", rotate: 0, text: "+5 Автоударов в секунду", title: "Шахтёр с Киркой"};
const drill = {name: "drill", cost: {base: 40000, calc: 40000, current: 40000}, level: 0, typeValue: "hit", value: 20, openingLayer: 200, switch: "off", expBonus: 0.3, func: () => upgradesFunc("drill"), freeUp: false, img: "drill_transparent_450x450.png", text: "+20 к удару", title: "Бур"};
const autoHit100 = {name: "autoHit100", cost: {base: 120000, calc: 120000, current: 120000}, level: 0, typeValue: "auto", timeHit: 4.2, value: 45, openingLayer: 300, switch: "off", expBonus: 0.4, func: () => upgradesFunc("autoHit100"), freeUp: false, img: "helmetDrill.png", autoImg: "drill_transparent_450x450.png", rotate: -60, text: "+100 Автоударов в секунду", title: "Шахтёр с буром"};
const molot = {name: "molot", cost: {base: 250000, calc: 250000, current: 250000}, level: 0, typeValue: "hit", value: 75, openingLayer: 450, switch: "off", expBonus: 0.5, func: () => upgradesFunc("molot"), freeUp: false, img: "molot_trasparent_450x450.png", text: "+75 к удару", title: "Отбойник"};
const molotAuto = {name: "molotAuto", cost: {base: 500000, calc: 500000, current: 500000}, level: 0, typeValue: "auto", timeHit: 5.8, value: 250, openingLayer: 600, switch: "off", expBonus: 0.7, func: () => upgradesFunc("molotAuto"), freeUp: false, img: "helmet-molot_transparent_450x450.png", autoImg: "molot_trasparent_450x450.png", rotate: -60, text: "+100 Автоударов в секунду", title: "Шахтёр с отбойником"}

const upgrades = [hitPlusOne, autoHitOne, profitPlusOne, hitPlusTen, autoHitTen, drill, autoHit100, molot, molotAuto]; //массив с объектами улучшений;
const upgradesAuto = [autoHitOne, autoHitTen, autoHit100, molotAuto];//массив с объектами улучшений, только автоудары

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
const profit = {name: "profit", value: 1, valueStep: 0.01, parameter:{type: "%", step: 1, value: 100}, cost: 10, level: 0, func: () => upgradesExpFunc("profit"), text: "Прибыль добычи: ", title: "+1% к прибыли", description: "При каждой добыче вы будете получать больше прибыли "};
const costPump = {name: "costPump", value: 1, valueStep: -0.01, parameter:{type: "%", step: -1, value: 100}, cost: 10, level: 0, func: () => upgradesExpFunc("costPump"), text: "Цена улучшений: ", title: "-1% к цене улучшений", description: "Стоимость всех улучшений за монеты снизится на 1% "};
const autoBonus = {name: "autoBonus", value: 11, valueStep: -1, parameter:{type: "s", step: -1, value: 11}, cost: 10, level: 0, enabled: false, func: () => upgradesExpFunc("autoBonus"), text: "Длительность автобонуса: ", title: "-1s ко времени автобонуса", description: "Автоматическое получение бонуса по истечении времени"};
const percentMoney = {name: "percentMoney", value: 0, valueStep: 0.01, parameter:{type: "%", step: 1, value: 0}, cost: 10, level: 0, func: () => upgradesExpFunc("percentMoney"), text: "Сохранение денег: ", title: "+1% к сохранению денег", description: "Сохраняет процент денег при перезапуске шахты"};
const speedAutoHit = {name: "speedAutoHit", value: 0, valueStep: 0.1, parameter:{type: "s", step: -0.05, value: 1}, cost: 10, level: 0, func: () => upgradesExpFunc("speedAutoHit"), text: "Скорость автоудара: ", title: "+0.05 к скорости автоудара", description: "Увеличивает скорость автоудара"};
const expPlus = {name: "expPlus", value: 1, valueStep: 0.1, parameter:{type: "%", step: 10, value: 100}, cost: 10, level: 0, func: () => upgradesExpFunc("expPlus"), text: "Получение опыта: ", title: "+10% к получаемому опыту", description: "Увеличивает получаемый опыт за шахту"};
const lycki = false;

const upgradesExp = [hardness, profit, costPump, autoBonus, percentMoney, speedAutoHit, expPlus];

let currentSecondsStart, currentSeconds;

let bossLevel = 1;
const bossLevelRatio = 10;
let moneyBonus, trw, timer;
let layerUpIntervalID;

// let obj = {message: "JS"};
//  myLog?.("obj - " + obj.message);
// fetch('data.json')
//     .then(r => r.json())
//     .then(data => {
//         obj.message = data.message;
//         myLog?.("obj - " + obj.message);
// })

loadLangTexts().then(()=>{textsLoaded = true; myLog(textsLoaded); loadedGame()});
async function loadLangTexts(){
    const texts = await fetch('lang.json').then(r => r.json());
    Object.assign(langTexts, texts);
}
function getText(key) {
    return langTexts[key]?.[langGame];
}
function changeLang(){
    langGame = langGame == "ru" ? "en" : "ru";
    toChangeText("langBtnID", langGame);
    changeTextsLang() 
}
function changeTextsLang(){
    for(const key in langTexts){
        toChangeText(key, getText(key));
    }
}
        


startingCreationGUI();
startingValues();
moneyChanges(0);
updateInfo();

consoleCreateBtnsCP(["coins", "exp", "hit", "autohit"])//создание панели управления в консоле

function consBtnReturn(value, parameter) {
    myLog?.(parameter + " " + value);
    switch(parameter){
        case "coins":
            moneyChanges(value);
            break;
        case "exp":
            expChanges(value);
            break;
        case "hit":
            handHit += value;
            break;
        case "autohit":
            autoHitOne.value += value;
            break;
    }
    updateInfo;
}

function loadedGame(load) {
    if(load && textsLoaded){
        document.getElementById("preloaderID").hidden = "hidden";
        loadImgs = true;
        changeTextsLang();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    for(let i = 0; i < upgrades.length; i++){
        if(localStorage.getItem(upgrades[i].name)){
            Object.assign(upgrades[i], JSON.parse(localStorage.getItem(upgrades[i].name)));
        }
    }
    for(let i = 0; i < upgradesExp.length; i++){
        if(localStorage.getItem(upgradesExp[i].name)){
            Object.assign(upgradesExp[i], JSON.parse(localStorage.getItem(upgradesExp[i].name)));
        }
    }
    if(localStorage.getItem('layer')){
         Object.assign(layer, JSON.parse(localStorage.getItem('layer')));
    }
    if(localStorage.getItem("prize")){
         Object.assign(prize, JSON.parse(localStorage.getItem('prize')));
    }
    money = Number(localStorage.getItem("money")) || 0;
    exp = Number(localStorage.getItem("exp")) || 0;
    toChangeText("expID", toCompactNotation(exp));
    handHit = Number(localStorage.getItem("handHit")) || 1;
    hit.count = Number(localStorage.getItem("hit.count")) || 0;
    toChangeText("counterID", hit.count);
    expBonus.count = Number(localStorage.getItem("expBonus.count")) || 0;
    toChangeText("counterRebootID", expBonus.count);
    autoHit = Number(localStorage.getItem("autoHit")) || 0;
    bossLevel = Number(localStorage.getItem("bossLevel")) || 1;
    allBonusFree = localStorage.getItem("allBonusFree") === 'false' ? false : true;
    if(!allBonusFree){
        document.getElementById("bossLevelBonusAllBtnID").disabled = "disabled";
        document.getElementById("bossLevelBonusAllBtnID").classList.add("disabled");
    }
    moneyChanges(0);
    onOffBtn();
    openingLayerUp();
    toStyle("#hpBarID", "width", 100/layer.hp.round * layer.hp.current + "%");
    toStyle("#cracksID", "height", 100-(100/layer.hp.round * layer.hp.current) + "%");
    updateInfo();
})

window.addEventListener('beforeunload', () => {
    localStorage.setItem("money", money);
    localStorage.setItem("exp", exp);
    localStorage.setItem("handHit", handHit);
    localStorage.setItem("autoHit", autoHit);
    localStorage.setItem("hit.count", hit.count);
    localStorage.setItem("expBonus.count", expBonus.count);
    localStorage.setItem("bossLevel", bossLevel);
    localStorage.setItem("allBonusFree", allBonusFree);
    localStorage.setItem(layer.name, JSON.stringify(layer));
    localStorage.setItem(prize.name, JSON.stringify(prize));
    for(let i = 0; i < upgrades.length; i++){
        localStorage.setItem(upgrades[i].name, JSON.stringify(upgrades[i]));
    }
    for(let i = 0; i < upgradesExp.length; i++){
        localStorage.setItem(upgradesExp[i].name, JSON.stringify(upgradesExp[i]));
    }
})

function tick(time){
    tick.count = (tick.count || 0)
    if(time - (tick.lastTime || 0) >= 100){
        if(!loadImgs && tick.count % 8 === 0){
            preloaderTextChange();
        }
        tick.count++;
        for(let i = 0; i < upgradesAuto.length; i++){
            if(tick.count / (Math.round(upgradesAuto[i].timeHit*10 - speedAutoHit.value*(i+1)*10)/10) % 10 === 0){
                // myLog(speedAutoHit.value*(i+1)+" i "+ i)
                hit(upgradesAuto[i]);
            }
        }
        textTimer();
        tick.lastTime = time;
    }
    requestAnimationFrame(tick);
}
tick(performance.now());

function textTimer(){
    if (!document.getElementById("bossLevelBonusID").hidden && autoBonus.enabled == true && rerollTimer){
        currentSeconds = new Date().getSeconds();
        let raznica = autoBonus.value - (currentSeconds - currentSecondsStart);
        if(raznica > 60){raznica -= 60}
        toChangeText("timeID", "Автовыбор через: " + raznica + " секунд")
    } else {
        toChangeText("timeID", "");
    }
}

function preloaderTextChange(){
    let preloaderTextID = document.getElementById("preloaderTextID");
    switch(preloaderTextID.innerHTML){
        case "...":
            preloaderTextID.innerHTML = "."
            break;
        case ".":
            preloaderTextID.innerHTML = ".."
            break;
        case "..":
            preloaderTextID.innerHTML = "..."
            break;
    }
}

window.addEventListener('blur', ()=> {
    myLog?.("Потерян фокус");
    ysdk.features?.GameplayAPI?.stop?.();
    toSeeable("blurID");
    switchHit = false;
})

window.addEventListener('focus', ()=>{
    myLog?.("Снова в фокусе");
    if (sdkLoad && resurses){
        ysdk.features?.GameplayAPI?.start?.();
    }
    toHide("blurID");
    if(!bossBonus){
        switchHit = true;
    }
})

function startingCreationGUI(){
    let errorCode = startingCreationGUI.name

    //Родитель: Имя с селетором; Ребёнок: Тэг, ID, классы, текст; Тех. Инфо: Код поиска. 
    //Боковое меню
    toCreateTag("body", "div", "menuForCoins", "sideMenuLeft", "", errorCode);
        toCreateTag("#menuForCoins", "div", "upgrades", "sideMenuTitle", "Улучшения", errorCode);
    for(let i = 0; i < upgrades.length; i++){
        let id = upgrades[i].name;
        toCreateTag("#menuForCoins", "div", id+"ID", "sideMenuElement disabled", "", errorCode);
            toCreateTag("#"+id+"ID", "div", id+"IconID", "sideMenuElementIconLeft", "", errorCode);
                toCreateTag("#"+id+"IconID", "div", id+"LevelID", "sideMenuElementIconParametrTopLeft level", "", errorCode);
                toCreateTag("#"+id+"IconID", "img", id+"ImgID", "sideMenuElementIconLeftIMG", "", errorCode);
                    document.getElementById(id+"ImgID").src = "img/" + upgrades[i].img;
                    toStyle("#"+id+"ImgID", "filter", "grayscale(50%)");
                toCreateTag("#"+id+"ID", "div", id+"InfoID", "sideMenuElementInfo", "", errorCode);
                    toCreateTag("#"+id+"InfoID", "div", id+"TitleID", "sideMenuElementTitle", upgrades[i].title, errorCode);
                    toCreateTag("#"+id+"InfoID", "div", id+"DescriptionID", "sideMenuElementDescription", upgrades[i].text, errorCode)
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
                toCreateTag("#expTitleID", "div", "expID", "moneyTopRightNum", "0", errorCode);
            toCreateTag("#menuForExp", "div", "infoExpID", "centralMenuInfo", "", errorCode);
                toCreateTag("#infoExpID", "div", "rebootExpDesID", "centralMenuInfoElement", "Если перезапустить шахту сейчас, то можно получить: ", errorCode);
                toCreateTag("#infoExpID", "div", "rebootExpID", "centralMenuInfoElement", "", errorCode);
                    toCreateTag("#rebootExpID", "img", "rebootExpImgID", "expCl", "", errorCode);
                        document.getElementById("rebootExpImgID").src = "img/exp.png";
                    toCreateTag("#rebootExpID", "div", "rebootExpCostID", "inline-block cost", "0", errorCode);
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
                toCreateTag("#"+id+"ID", "button", id+"BtnID", "centralMenuElementBtn", "", errorCode);
                    toCreateTag("#"+id+"BtnID", "img", id+"ImgBtnID", "expCl", "", errorCode);
                        document.getElementById(id+"ImgBtnID").src = "img/exp.png";
                    document.getElementById(id+"BtnID").onclick = function(){upgradesExp[i].func();};
                    toCreateTag("#"+id+"BtnID", "div", id+"CostID", "inline-block cost", "", errorCode);
        }

        //бонусное меню
        toCreateTag("body", "div", "bossLevelBonusID", "", "", errorCode);
        toHide("bossLevelBonusID");
            toCreateTag("#bossLevelBonusID", "div", "bossLevelBonusTitleID", "", "Доступен бонус!", errorCode);
            toCreateTag("#bossLevelBonusID", "div", "timeID", "", "", errorCode);
            for(let i = 0; i < 3; i++){
                toCreateTag("#bossLevelBonusID", "div", "bossLevelBonusContainerID"+i, "bonusContainer", "", errorCode);
                    toCreateTag("#bossLevelBonusContainerID"+i, "img", "bossLevelBonusIMGID"+i, "bossLevelBonusIMG", "", errorCode);    
            }
            toCreateTag("#bossLevelBonusID", "div", "bossLevelBonusConteinerRerollID", "", "", errorCode)
            toCreateTag("#bossLevelBonusConteinerRerollID", "button", "bossLevelBonusAllBtnID", "bossLevelBonusCls", "Получить всё", errorCode);
                document.getElementById("bossLevelBonusAllBtnID").onclick = function(){bossLevelBonusBtn("All");};
            toCreateTag("#bossLevelBonusConteinerRerollID", "button", "bossLevelBonusRerolBtnID", "bossLevelBonusCls", "", errorCode);
                document.getElementById("bossLevelBonusRerolBtnID").onclick = function(){reroll();};
                toCreateTag('#bossLevelBonusRerolBtnID', "img", "bossLevelBonusRerolBtnImgID", "", "", errorCode);
                    document.getElementById("bossLevelBonusRerolBtnImgID").src = "img/ad.png";
    updateInfo();
}

function reroll(){
    rerollTimer = false;
    clearTimeout(timer);
    // ysdk.adv.showFullscreenAdv({
    ysdk.adv.showRewardedVideo?.({
        callbacks: {
            onRewarded: () => {
                // myLog?.('реклама открыта'),
            // onOpen: () => myLog?.('реклама открыта'),
            // onClose: (wasShown) => {
                // if(wasShown){
                    allBonusFree = true
                    document.getElementById("bossLevelBonusAllBtnID").removeAttribute("disabled");
                    document.getElementById("bossLevelBonusAllBtnID").classList.remove("disabled");
                    toHide("bossLevelBonusRerolBtnID");
                // } else {
                    // myLog?.('реклама не была показана');
                // }
            }
            // onError: (error) => myLog?.("ошибка: ", error)
        }
    });
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
    toChangeText("expID", toCompactNotation(exp));
}

function startingValues(){
    money = 0;
    bossLevel = 1;
    layer.hp.calc = layer.hp.current = layer.hp.round = layer.hp.base;
    prize.profitC = prize.profit = 1 * profit.value;
    handHit = 1;
    autoHit = 0;
    layer.level = 0;
    allBonusFree = true;
    document.getElementById("bossLevelBonusAllBtnID").removeAttribute("disabled");
    document.getElementById("bossLevelBonusAllBtnID").classList.remove("disabled");

    for (let i = 0; i < upgrades.length; i++){
        upgrades[i].level = 0;
        upgrades[i].cost.current = upgrades[i].cost.calc = upgrades[i].cost.base;
        switchingElementMenu(false, upgrades[i]);
    }
    openingLayerUp();
}

function expCalc(){
    let expProfit = money*moneyExp + layer.level*layer.expBonus + hitPlusOne.level*hitPlusOne.expBonus + profitPlusOne.level*profitPlusOne.expBonus + autoHitOne.level*autoHitOne.expBonus + hitPlusTen.level*hitPlusTen.expBonus + autoHitTen.level*autoHitTen.expBonus + autoHit100.level*autoHit100.expBonus || 0;
    for(let i = 0; i < upgrades.length; i++){
        expProfit += upgrades[i].level*upgrades.expBonus;
    }
    expProfit = Math.round(expProfit * expPlus.value);
    if(expProfit >=10 || exp >= 10){
        toSeeable("warningID");
    } else {
        toHide("warningID");
    }
    return expProfit;
}

function expBonus(){
    let exp = expCalc();
    expChanges(exp);
    let m = money;
    startingValues();    
    money = Math.round(m * percentMoney.value);
    moneyChanges(0);
    ysdk?.adv?.showFullscreenAdv?.();
    toStyle("#ret", "backgroundPositionY", "0%");
    toStyle("#hpBarID", "width", 100/layer.hp.round * layer.hp.current+ "%");
    toStyle("#cracksID", "height", 100-(100/layer.hp.round * layer.hp.current) + "%");

    toChangeText("counterRebootID", expBonus.count=(expBonus.count || 0) + 1);
    updateInfo();
}

function hit(object) {

    if (switchHit){
        if(object.typeValue == "hit"){
            damage(object);
            toChangeText("counterID", hit.count=(hit.count || 0) + 1);
        }
        else {
            if(object.level > 0){animationAutoHit(object);}
        } 
    }
}

function damage(object){
    trembling();
    if (switchHit && layer.hp.current > 0){
        if (object.typeValue == "hit"){
            layer.hp.current -= handHit;
        } else {
            layer.hp.current -= object.value * object.level;
        }
        toStyle("#hpBarID", "width", 100/layer.hp.round * layer.hp.current + "%");
        toStyle("#cracksID", "height", 100-(100/layer.hp.round * layer.hp.current) + "%");
    }
    finishLevel();
    updateInfo();
}

function animationAutoHit(autoDamage){
    let id = "imgID" + countAutoHit++;
    toCreateTag("body", "img", id, "imgAutoHit", "", "hit-function");
    let element = document.getElementById(id);
        element.src = "img/"+autoDamage.autoImg;
        element.style.left = Math.floor(Math.random()*100)+"%";

    let rotate = Math.floor(Math.random()*80)+1060 + autoDamage.rotate;
    // if (autoDamage.name == "autoHitTen"){rotate += autoDamage.rotate;}
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
    let id = document.getElementById("layerID");
    // let instrumets = document.querySelectorAll('.death');
    let random = Math.floor(Math.random()*2) > 0 ? "0.5%" : "-0.5%"
    id.style.left = random;
    // instrumets.forEach( i => {i.style.left = random});

    // id.style.bottom = Math.floor(Math.random()*2) > 0 ? "0.5%" : "-0.5%";

    // toStyle("#layerID", "bottom", Math.floor(Math.random()*2) > 0 ? "0.5%" : "-0.5%");

    id.addEventListener('transitionend', () =>{
        id.style.left = "0%";
        // instrumets.forEach( i => {i.style.left = "0%"});
        // id.style.bottom = "0%";
    }, {once: true});
        
        // toStyle("#layerID", "bottom", "0%");
}

function switchsHit(bool){;
    if (!bossBonus){
        switchHit = bool;
    }
}

function finishLevel(){
    if (layer.hp.current <= 0){
        switchsHit(false)
        let layerID = document.getElementById('layerImgID');
        layerID.style.top = "100%";
        layerID.style.transition = "none";
        let death = document.querySelectorAll(".death");
        death.forEach( det => {det.remove()});
        toStyle("#cracksID", "height", "0%");
        moneyChanges(Math.floor(prize.profitC * doubleMoney));
        layer.hp.calc = softProgress(layer.hp.calc, -1);
        layer.hp.round = layer.hp.current = Math.floor(layer.hp.calc * hardness.value);
        prize.profit = prize.profitC = Math.round(softProgress(prize.profit, -2));
        prize.profitC = Math.floor(prize.profitC * profit.value);
        layer.level++;
        layerUp(layerID);
        toStyle("#hpBarID", "width", "100%");
        openingLayerUp();
        if (bossLevel == layer.level){  
            bossLevel += bossLevelRatio;
            bossLevelBonus();
        }
        updateInfo();
    }
} 

function layerUp(layerID){
    let mirror = Math.round(Math.random()*1);
    if(mirror == 0){mirror = -1;}
    layerID.offsetHeight;
    layerID.style.transform = "scaleX("+ mirror +")";
    toStyle("#cracksID", "transform", "scaleX("+ mirror +")");
    layerID.style.transition = "top 0.4s linear"
    layerID.style.top = "0px";
    toStyle("#ret", "backgroundPositionY", layer.level*-200 + "px");
    
    layerID.addEventListener('transitionend', (e) => {
        switchsHit(true); 
    }, {once: true});
}

function openingLayerUp(){
    for (let i = 0; i < upgrades.length; i++){
        if (layer.level >= upgrades[i].openingLayer){
            switchingElementMenu(true, upgrades[i]);
        }
    }
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
            } 
        } 
        if (upgradesExp[i].level >= 10){
            document.getElementById(name+"ID").classList.add('disabled');
            document.getElementById(name+"BtnID").disabled = "disabled";
        }
    }
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

    let bonus1 = bossLevelBonusRandom(switchsOn);
    let bonus2 = bossLevelBonusRandom(switchsOn);
    let bonus3 = bossLevelBonusRandom(switchsOn);

    trw.push(bonus1);
    if(bonus2 === bonus1){bonus2 = moneyBonus}
    trw.push(bonus2);
    if(bonus3 === bonus2 || bonus3 === bonus1){bonus3 = moneyBonus;}
    trw.push(bonus3);

    for (let i = 0; i < trw.length; i++){
        let valueBtn = trw[i].name;
        let title = "+1 "+trw[i].title;
        let img = trw[i].img;
        if (trw[i] == moneyBonus){
            valueBtn = "moneyBonus";
            title = "+"+ toCompactNotation(trw[i]) + " Монет!";
            img = "coin.png";
        }
        document.getElementById("bossLevelBonusContainerID"+i).append(
            Object.assign(document.createElement('button'), {className: "bossLevelBonusCls", id: "bossLevelBonusID" + i,  innerHTML:title, value: valueBtn, onclick: function(){bossLevelBonusBtn(this);}})
        )
        document.getElementById("bossLevelBonusIMGID"+i).src = "img/" + img;
    }
    switchsHit(false);
    bossBonus = true;
    for (let i = 0; i < upgrades.length; i++){
        document.getElementById(upgrades[i].name + "BtnID").disabled = "disabled";
    }
    if (autoBonus.enabled){
        currentSecondsStart = new Date().getSeconds();
        rerollTimer = true;
        timer = setTimeout(function(){document.getElementById("bossLevelBonusID" + Math.floor(Math.random()*trw.length)).click()}, autoBonus.value*1000);
    }
    if(allBonusFree){
        toHide("bossLevelBonusRerolBtnID");
    } else {
        toSeeable("bossLevelBonusRerolBtnID");
    }
}

function bossLevelBonusRandom(switchsOn){
    let random = Math.ceil(Math.random()*mathTriangularNumber(switchsOn));
    let test = switchsOn;
    for(let i = 0; i < test; i++){
        if(random - switchsOn <= 0 ){
            myLog(upgrades[i].name);
            return upgrades[i];
        }  else {
            random -= switchsOn;
            switchsOn--;
        }
    }
}

function bossLevelBonusBtn(bonus){
    clearTimeout(timer);
    if(bonus === "All"){
        bossLevelBonusBtn.count = 3;
        if(allBonusFree){
            allBonusFree = false;
            document.getElementById("bossLevelBonusAllBtnID").disabled = "disabled";
             document.getElementById("bossLevelBonusAllBtnID").classList.add("disabled");
            for (let i = 0; i < trw.length; i++){
                simulateClick("#bossLevelBonusID" + i);
            }
        } 
    } else if(bonus.value == "moneyBonus"){
        moneyChanges(Math.floor(moneyBonus));
    } else {
        for (let i = 0; i < upgrades.length; i++){
            if (bonus.value == upgrades[i].name){
                upgrades[i].freeUp = true;
                upgrades[i].func();
            } 
        }
    }
    if(bossLevelBonusBtn.count > 0){
        bossLevelBonusBtn.count--;
    } else {
        for (let i = 0; i < trw.length; i++){
            document.getElementById("bossLevelBonusID" + i).remove();
        }
    }
    bossBonus = false;
    switchsHit(true);
    toHide("bossLevelBonusID");
}

function menuTreePump(open){
    open ? toSeeable("menuForExpBack") : toHide("menuForExpBack");
}

function updateInfo(){
    onOffBtn();
    toChangeText("prizeID", toCompactNotation(prize.profitC * doubleMoney));
    toChangeText("depthLevelID", layer.level);
    autoHit = 0;
    for(let i = 0; i < upgrades.length; i++){
        toChangeText(upgrades[i].name+"CostID", toCompactNotation(upgrades[i].cost.current));
        toChangeText(upgrades[i].name+"LevelID", upgrades[i].level);
        if( upgrades[i].typeValue == "auto"){
            let text = " Автоудар - "
            // if(upgrades[i].value > 1){text = " Автоудар - "}
            let damage = Math.round(upgrades[i].value*upgrades[i].level/(speedAutoHit.parameter.value*upgrades[i].timeHit)*100)/100;
            toChangeText(upgrades[i].name+"DescriptionID", text + damage + " hp/s");
            autoHit += damage;
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

    toChangeText("hitID", handHit);
    toChangeText("autoHitInfoID", Math.round(autoHit*100)/100 + " hp/s");
    toChangeText("hpID", Math.floor(layer.hp.current));
    toChangeText("rebootExpCostID", expCalc());
}