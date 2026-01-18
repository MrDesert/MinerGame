let langGame = "en";
const langTexts = {};
let textsLoaded = false;
const HTMLs = {};
let HTMLLoaded = false;
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

const shovel = {
    name: "shovel", 
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
    func: (b) => upgradesFunc(shovel, b), 
    freeUp: false, 
    img: "shovel_transparent_390x390.png"
};

const miner_shovel = {name: "miner_shovel", cost: {base: 100, calc: 100, current: 100}, level: 0, typeValue: "auto", timeHit: 1.6, value: 1, openingLayer: 10, switch: "off", expBonus: 0.1, func: (b) => upgradesFunc(miner_shovel, b), freeUp: false, img: "helmet-shovel_transparent_450x450.png", autoImg: "shovel_transparent_390x390.png", rotate: -80};
const helmet = {name: "helmet", cost: {base: 600, calc: 600, current: 600}, level: 0, typeValue: "profit", value: 1, openingLayer: 50, switch: "off", expBonus: 0.15, func: (b) => upgradesFunc(helmet, b), freeUp: false, img: "helmet5.png"};
const pickaxe = {name: "pickaxe", cost: {base: 500, calc: 500, current: 500}, level: 0, typeValue: "hit", value: 5, openingLayer: 50, switch: "off", expBonus: 0.15, func: (b) => upgradesFunc(pickaxe, b), freeUp: false, img: "pickaxe_transparent_390x390.png"};
const miner_pickaxe = {name: "miner_pickaxe", cost: {base: 5000, calc: 5000, current: 5000}, level: 0, typeValue: "auto", timeHit: 2.8, value: 7, openingLayer: 100, switch: "off", expBonus: 0.2, func: (b) => upgradesFunc(miner_pickaxe, b), freeUp: false, img: "helmet-pickaxe_transparent_450x450.png", autoImg: "pickaxe_transparent_390x390.png", rotate: 0};
const drill = {name: "drill", cost: {base: 40000, calc: 40000, current: 40000}, level: 0, typeValue: "hit", value: 20, openingLayer: 200, switch: "off", expBonus: 0.3, func: (b) => upgradesFunc(drill, b), freeUp: false, img: "drill_transparent_450x450.png"};
const miner_drill = {name: "miner_drill", cost: {base: 120000, calc: 120000, current: 120000}, level: 0, typeValue: "auto", timeHit: 4.2, value: 45, openingLayer: 300, switch: "off", expBonus: 0.4, func: (b) => upgradesFunc(miner_drill, b), freeUp: false, img: "helmetDrill.png", autoImg: "drill_transparent_450x450.png", rotate: -60};
const jackhammer = {name: "jackhammer", cost: {base: 250000, calc: 250000, current: 250000}, level: 0, typeValue: "hit", value: 75, openingLayer: 450, switch: "off", expBonus: 0.5, func: (b) => upgradesFunc(jackhammer, b), freeUp: false, img: "molot_trasparent_450x450.png"};
const miner_jackhammer = {name: "miner_jackhammer", cost: {base: 500000, calc: 500000, current: 500000}, level: 0, typeValue: "auto", timeHit: 5.8, value: 250, openingLayer: 600, switch: "off", expBonus: 0.7, func: (b) => upgradesFunc(miner_jackhammer, b), freeUp: false, img: "helmet-molot_transparent_450x450.png", autoImg: "molot_trasparent_450x450.png", rotate: -60}

const upgrades = [shovel, miner_shovel, helmet, pickaxe, miner_pickaxe, drill, miner_drill, jackhammer, miner_jackhammer]; //массив с объектами улучшений;
const upgradesAuto = [miner_shovel, miner_pickaxe, miner_drill, miner_jackhammer];//массив с объектами улучшений, только автоудары

const layer_hardness = {
    name: "layer_hardness", 
    value: 1, 
    valueStep: 0.01,
    parameter: {
        type: "%",
        step: -1,
        value: 100
    },
    cost: 10, 
    level: 0, 
    func: () => upgradesExpFunc("layer_hardness")
};
const mining_profit = {name: "mining_profit", value: 1, valueStep: 0.01, parameter:{type: "%", step: 1, value: 100}, cost: 10, level: 0, func: () => upgradesExpFunc("mining_profit")};
const upgrade_cost = {name: "upgrade_cost", value: 1, valueStep: -0.01, parameter:{type: "%", step: -1, value: 100}, cost: 10, level: 0, func: () => upgradesExpFunc("upgrade_cost")};
const auto_bonus_duration = {name: "auto_bonus_duration", value: 11, valueStep: -1, parameter:{type: "s", step: -1, value: 11}, cost: 10, level: 0, enabled: false, func: () => upgradesExpFunc("auto_bonus_duration")};
const money_keep = {name: "money_keep", value: 0, valueStep: 0.01, parameter:{type: "%", step: 1, value: 0}, cost: 10, level: 0, func: () => upgradesExpFunc("money_keep")};
const auto_mine_speed = {name: "auto_mine_speed", value: 0, valueStep: 0.1, parameter:{type: "s", step: -0.05, value: 1}, cost: 10, level: 0, func: () => upgradesExpFunc("auto_mine_speed")};
const xp_gain = {name: "xp_gain", value: 1, valueStep: 0.1, parameter:{type: "%", step: 10, value: 100}, cost: 10, level: 0, func: () => upgradesExpFunc("xp_gain")};
const lycki = false;

const upgradesExp = [layer_hardness, mining_profit, upgrade_cost, auto_bonus_duration, money_keep, auto_mine_speed, xp_gain];

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

loadHTMLs().then(()=>{
    HTMLLoaded = true; 
    generateHTML().then(()=>{
        startingCreationGUI().then(()=>{
            startingValues();
        })
    })
});
async function loadHTMLs(){
    const load = await fetch('HTML.json').then(r => r.json());
    Object.assign(HTMLs, load);
}
function generateHTML(){
    for(const key in HTMLs){
        console.log(key);
        console.log(HTMLs[key]);
        DOM.Create({Parent: HTMLs[key]?.Parent, Id: key, Class: HTMLs[key]?.Class});
    }
}
loadLangTexts().then(()=>{textsLoaded = true; loadedGame()});
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


// startingCreationGUI();
// startingValues();
finance(0);
updateInfo();

consoleCreateBtnsCP(["coins", "exp", "hit", "autohit"])//создание панели управления в консоле

function consBtnReturn(value, parameter) {
    switch(parameter){
        case "coins": finance(value); break;
        case "exp": expChanges(value); break;
        case "hit": handHit += value; break;
        case "autohit": miner_shovel.value += value; break;
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
        document.getElementById("claim_all").disabled = "disabled";
        document.getElementById("claim_all").classList.add("disabled");
    }
    finance(0);
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
        if(!loadImgs && tick.count % 8 === 0){preloaderTextChange();}
        tick.count++;
        for(let i = 0; i < upgradesAuto.length; i++){
            if(tick.count / (Math.round(upgradesAuto[i].timeHit*10 - auto_mine_speed.value*(i+1)*10)/10) % 10 === 0){
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
    if(HTMLLoaded){
    if (auto_bonus_duration.enabled == true && rerollTimer && !document.getElementById("bossLevelBonusID").hidden){
        currentSeconds = new Date().getSeconds();
        let raznica = auto_bonus_duration.value - (currentSeconds - currentSecondsStart);
        if(raznica > 60){raznica -= 60}
        toChangeText("autoSelectValue", raznica);
    } else {toChangeText("autoSelectValue", "");}
    }
}

function preloaderTextChange(){
    const id = document.getElementById("preloaderTextID");
    id.textContent = id.textContent == "..." ? "." : id.textContent == "." ? ".." : "...";
}

window.addEventListener('blur', ()=> {
    DOM.Hide("blurID", false);
    switchHit = false;
    ysdk?.features?.GameplayAPI?.stop?.();
})

window.addEventListener('focus', ()=>{
    DOM.Hide("blurID");
    switchHit = !bossBonus;
    if (sdkLoad && resurses){
        ysdk.features?.GameplayAPI?.start?.();
    }
})

function startingCreationGUI(){
    //Боковое меню
    // DOM.Create({Parent: "ret", Id: "menuForCoins", Class: "sideMenuLeft"});
        // DOM.Create({Parent: "menuForCoins", Id: "upgrades", Class: "sideMenuTitle"});
    for(let i = 0; i < upgrades.length; i++){
        let id = upgrades[i].name;
        DOM.Create({Parent: "menuForCoins", Id: id+"ID", Class: "sideMenuElement disabled"});
            DOM.Create({Parent: id+"ID", Id: id+"IconID", Class: "sideMenuElementIconLeft"});
                DOM.Create({Parent: id+"IconID", Id: id+"LevelID", Class: "sideMenuElementIconParametrTopLeft level"});
                DOM.Create({Parent: id+"IconID", Tag: "img", Id: id+"ImgID", Class: "sideMenuElementIconLeftIMG", Src: "img/" + upgrades[i].img});
                    toStyle("#"+id+"ImgID", "filter", "grayscale(50%)");
            DOM.Create({Parent: id+"ID", Id: id+"InfoID", Class: "sideMenuElementInfo"});
                DOM.Create({Parent: id+"InfoID", Id: id, Class: "sideMenuElementTitle"});
                DOM.Create({Parent: id+"InfoID", Tag: "span", Id: id+"_desc", Class: "sideMenuElementDescription"});
                DOM.Create({Parent: id+"InfoID", Tag: "span", Id: id+"ValueID", Class: "sideMenuElementDescription"});
            DOM.Create({Parent: id+"ID", Tag: "button", Id: id+"BtnID", Class: "sideMenuElementBtn", OnClick: function(){upgrades[i].func();}});
                DOM.Create({Parent: id+"BtnID", Tag: "img", Id: id+"BtnImgID", Class: "coinCl", Src: "img/coin.png", Disabled: "true"});
                DOM.Create({Parent: id+"BtnID", Id: id+"CostID", Class: "inline-block cost"});
    }
    // Центральное меню
    DOM.Create({Parent: "ret", Id: "menuForExpBack", Class: "centralMenuBackground", Hidden: "true"});
        DOM.Create({Parent: "menuForExpBack", Id: "menuForExp", Class: "centralMenu"});
            DOM.Create({Parent: "menuForExp", Tag: "button", Id: "menuForExpBtnClose", Class: "btnCloseCircule", Text: "X", OnClick: function(){menuTreePump(true)}});
            DOM.Create({Parent: "menuForExp", Id: "expTitleID", Class: "moneyTopRight"});
                DOM.Create({Parent: "expTitleID", Tag: "img", Id: "expImgID", Class: "expCl", Src: "img/exp.png"});
                DOM.Create({Parent: "expTitleID", Id: "expID", Class: "moneyTopRightNum"});
            DOM.Create({Parent: "menuForExp", Id: "infoExpID", Class: "centralMenuInfo"});
                DOM.Create({Parent: "infoExpID", Tag: "span", Id: "prestige_info", Class: "centralMenuInfoElement"});
                DOM.Create({Parent: "infoExpID", Id: "rebootExpID", Class: "centralMenuInfoElement"});
                    DOM.Create({Parent: "rebootExpID", Tag: "img", Id: "rebootExpImgID", Class: "expCl", Src: "img/exp.png"});
                    DOM.Create({Parent: "rebootExpID", Id: "rebootExpCostID", Class: "inline-block cost", Text: "0"});
                DOM.Create({Parent: "infoExpID", Tag: "button", Id: "rebootExpBtnID", Class: "centralMenuElementBtn", Text: "⟳", OnClick: function(){expBonus()}});
            DOM.Create({Parent: "menuForExp", Id: "infoID", Class: "centralMenuInfo"});
        for(let i = 0; i < upgradesExp.length; i++){
            let id = upgradesExp[i].name;
                DOM.Create({Parent: "infoID", Id: id+"InfoID", Class: "centralMenuInfoElement"});
                    DOM.Create({Parent: id+"InfoID", Tag: "span", Id: id, Class: "centralMenuInfoElementValue"});
                    DOM.Create({Parent: id+"InfoID", Tag: "span", Id: id+"InfoValueID", Class: "centralMenuInfoElementValue"});
            DOM.Create({Parent: "menuForExp", Id: id+"ID", Class: "centralMenuElement inline-block"});
                DOM.Create({Parent: id+"ID", Id: id+"_title", Class: "centralMenuElementTitle"});
                DOM.Create({Parent: id+"ID", Id: id+"LevelID", Class: "btnCloseCircule", Text: "0"}); 
                DOM.Create({Parent: id+"ID", Tag: "p", Id: id+"_desc", Class: "centralMenuElementDescription"});
                DOM.Create({Parent: id+"ID", Tag: "button", Id: id+"BtnID", Class: "centralMenuElementBtn", OnClick: function(){upgradesExp[i].func();}}); 
                    DOM.Create({Parent: id+"BtnID", Tag: "img", Id: id+"ImgBtnID", Class: "expCl", Src: "img/exp.png"});
                    DOM.Create({Parent: id+"BtnID", Id: id+"CostID", Class: "inline-block cost"});
        }
        //бонусное меню
        DOM.Create({Parent: "ret", Id: "bossLevelBonusID", Hidden: "true"});
            DOM.Create({Parent: "bossLevelBonusID", Id: "bonus_available", Text: "Доступен бонус!"});
            DOM.Create({Parent: "bossLevelBonusID", Id: "timeID"});
                DOM.Create({Parent: "timeID", Tag: "span", Id: "auto_select"});
                DOM.Create({Parent: "timeID", Tag: "span", Id: "autoSelectValue"});
                DOM.Create({Parent: "timeID", Tag: "span", Id: "auto_select_second"});
            for(let i = 0; i < 3; i++){
                DOM.Create({Parent: "bossLevelBonusID", Id: "bossLevelBonusContainerID"+i, Class: "bonusContainer"});
                    DOM.Create({Parent: "bossLevelBonusContainerID"+i, Tag: "img", Id: "bossLevelBonusIMGID"+i, Class: "bossLevelBonusIMG"});
                    DOM.Create({Parent: "bossLevelBonusContainerID"+i, Tag: "span", Id: "bossLevelBonusValueID"+i, Class: "bossLevelBonusValue"}); 
            }
            DOM.Create({Parent: "bossLevelBonusID", Id: "bossLevelBonusConteinerRerollID"});
                DOM.Create({Parent: "bossLevelBonusConteinerRerollID", Tag: "button", Id: "claim_all", Class: "bossLevelBonusCls", Text: "Получить всё", OnClick: function(){bossLevelBonusBtn("All");}});
                DOM.Create({Parent: "bossLevelBonusConteinerRerollID", Tag: "button", Id: "bossLevelBonusRerolBtnID", Class: "bossLevelBonusCls", OnClick: function(){reroll();}});
                    DOM.Create({Parent: "bossLevelBonusRerolBtnID", Tag: "img", Id: "bossLevelBonusRerolBtnImgID", Src: "img/ad.png"});
    updateInfo();
}

function reroll(){
    rerollTimer = false;
    clearTimeout(timer);
    ysdk.adv.showRewardedVideo?.({
        callbacks: {
            onRewarded: () => {
                allBonusFree = true;
                DOM.Disable("claim_all", false);
                DOM.Id("claim_all").classList.remove("disabled");
                DOM.Hide("bossLevelBonusRerolBtnID");
            }
        }
    });
}

function finance(m){
    colorNumbers("moneyID", m < 0 ? "red" : "green");
    money += m;
    toChangeText("moneyID", toCompactNotation(money));
    if(m != 0){
        onOffBtn();
        updateInfo();
    }
}

function expChanges(e){
    toChangeText("expID", toCompactNotation(exp += e));
}

function startingValues(){
    money = 0;
    bossLevel = 1;
    layer.hp.calc = layer.hp.current = layer.hp.round = layer.hp.base;
    prize.profitC = prize.profit = 1 * mining_profit.value;
    handHit = 1;
    autoHit = 0;
    layer.level = 0;
    allBonusFree = true;
    DOM.Disable("claim_all", false);
    DOM.Id("claim_all").classList.remove("disabled");

    for (let i = 0; i < upgrades.length; i++){
        upgrades[i].level = 0;
        upgrades[i].cost.current = upgrades[i].cost.calc = upgrades[i].cost.base;
        switchingElementMenu(false, upgrades[i]);
    }
    openingLayerUp();
}

function expCalc(){
    let expProfit = money*moneyExp + layer.level*layer.expBonus || 0;
    for(let i = 0; i < upgrades.length; i++){
        expProfit += upgrades[i].level*upgrades[i].expBonus;
    }
    expProfit = Math.round(expProfit * xp_gain.value);
    DOM.Hide("warningID", !(expProfit >=10 || exp >= 10))
    return expProfit;
}

function expBonus(){
    let exp = expCalc();
    expChanges(exp);
    let m = money;
    startingValues();    
    money = Math.round(m * money_keep.value);
    finance(0);
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
    DOM.Create({Parent: "ret", Tag: "img", Id: id, Class: "imgAutoHit"});
    let rotate = Math.floor(Math.random()*80)+1060 + autoDamage.rotate;
    let element = DOM.Id(id);
        element.src = "img/"+autoDamage.autoImg;
        element.style.left = Math.floor(Math.random()*100)+"%";
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
    let id = DOM.Id("layerID");
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

function switchsHit(bool){
    if (!bossBonus){switchHit = bool;}
}

function finishLevel(){
    if (layer.hp.current <= 0){
        switchsHit(false)
        let layerID = DOM.Id('layerImgID');
            layerID.style.top = "100%";
            layerID.style.transition = "none";
        let death = document.querySelectorAll(".death");
            death.forEach( det => {det.remove()});
        toStyle("#cracksID", "height", "0%");
        finance(Math.floor(prize.profitC * doubleMoney));
        layer.hp.calc = softProgress(layer.hp.calc, -1);
        layer.hp.round = layer.hp.current = Math.floor(layer.hp.calc * layer_hardness.value);
        prize.profit = prize.profitC = Math.round(softProgress(prize.profit, -2));
        prize.profitC = Math.floor(prize.profitC * mining_profit.value);
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
            // myLog(1)
    for (let i = 0; i < upgrades.length; i++){
        const id = upgrades[i].name + "BtnID";
        const bool = !(money >= upgrades[i].cost.current && upgrades[i].switch == "on");
        DOM.Disable(id, bool)
    }
    for (let i = 0; i < upgradesExp.length; i++){
        let disBtn = document.getElementById(upgradesExp[i].name + "BtnID");
        exp >= upgradesExp[i].cost ? disBtn.removeAttribute("disabled") : disBtn.disabled="disabled";
    }
}

function switchingElementMenu(switchType, btn){
    if(switchType){
        btn.switch = "on";
        DOM.Id(btn.name+"ID").classList.remove("disabled");
        toStyle("#"+btn.name+"ImgID", "filter", "grayscale(0%)");
    } else {
        btn.switch = "off";
        DOM.Id(btn.name+"ID").classList.add("disabled");
        toStyle("#"+btn.name+"ImgID", "filter", "grayscale(50%)");
    }
    onOffBtn();
    // myLog("switch")
}

function upgradesFunc(item, bool) {
    let name = item.name;
    let cost = item.cost;
    if(bool){up();
    } else if(money >= cost.current){
        up();
        finance(-Math.floor(cost.current));
        cost.calc = Math.round(softProgress(cost.calc, upgrades.indexOf(item)-1));
        cost.current = Math.round(cost.calc * upgrade_cost.value);
        colorNumbers(name+"CostID", "red");
    }
    function up(){
        switch(item.typeValue){
            case "hit": handHit += item.value; break;
            case "profit": prize.profit++; prize.profitC++; break;
        }
        item.level++;
        colorNumbers(name+"LevelID", "green");
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
            if(upgrade == "upgrade_cost"){
                for(let i = 0; i < upgrades.length; i++){
                    upgrades[i].cost.current = Math.round(upgrades[i].cost.calc * upgrade_cost.value);
                }
            } else if (upgrade == "auto_bonus_duration"){
                if (!auto_bonus_duration.enabled){auto_bonus_duration.enabled = true};
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
    DOM.Hide("bossLevelBonusID", false);
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
        let title = "+1 "+ getText(valueBtn);
        let img = trw[i].img;
        if (trw[i] == moneyBonus){
            valueBtn = "moneyBonus";
            title = "+"+ toCompactNotation(trw[i]) + " Монет!";
            img = "coin.png";
        }
        const id = "bossLevelBonusIMGID"+i;
        DOM.Id(id).src = "img/" + img;
        DOM.Id(id).onclick = ()=> bossLevelBonusBtn(valueBtn);
        toChangeText("bossLevelBonusValueID"+i, title);
    }
    switchsHit(false);
    bossBonus = true;
    for (let i = 0; i < upgrades.length; i++){
        DOM.Disable(upgrades[i].name + "BtnID", true);
    }
    if (auto_bonus_duration.enabled){
        currentSecondsStart = new Date().getSeconds();
        rerollTimer = true;
        timer = setTimeout(function(){document.getElementById("bossLevelBonusContainerID" + Math.floor(Math.random()*trw.length)).click()}, auto_bonus_duration.value*1000);
    }
    DOM.Hide("bossLevelBonusRerolBtnID", allBonusFree);
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
        if(allBonusFree){
            allBonusFree = false;
            DOM.Disable("claim_all", true);
            DOM.Id("claim_all").classList.add("disabled");
            for (let i = 0; i < trw.length; i++){
                simulateClick("#bossLevelBonusContainerID" + i);
            }
        } 
    } else if(bonus == "moneyBonus"){
        finance(Math.floor(moneyBonus));
    } else {
        for (let i = 0; i < upgrades.length; i++){
            if (bonus == upgrades[i].name){
                // upgrades[i].freeUp = true;
                upgrades[i].func(true);
            } 
        }
    }
    bossBonus = false;
    switchsHit(true);
    DOM.Hide("bossLevelBonusID");
}

function menuTreePump(open){
    DOM.Hide("menuForExpBack", open);
}

function updateInfo(){
    if(HTMLLoaded){
    toChangeText("prizeID", toCompactNotation(prize.profitC * doubleMoney));
    toChangeText("depthLevelID", layer.level);
    autoHit = 0;
    for(let i = 0; i < upgrades.length; i++){
        toChangeText(upgrades[i].name+"CostID", toCompactNotation(upgrades[i].cost.current));
        toChangeText(upgrades[i].name+"LevelID", upgrades[i].level);
        if( upgrades[i].typeValue == "auto"){
            // if(upgrades[i].value > 1){text = " Автоудар - "}
            let damage = Math.round(upgrades[i].value*upgrades[i].level/(auto_mine_speed.parameter.value*upgrades[i].timeHit)*100)/100;
            toChangeText(upgrades[i].name+"ValueID", damage + " hp/s");
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
}