let langGame = "en";
const langTexts = {};
let textsLoaded = false;
const HTMLs = {};
let HTMLLoaded = false;
let loadImgs = false;
let DOMContentLoaded = false;
let offBonus = 0;

let money, handHit, autoHit;
let allBonusFree = true;
let rerollTimer = false;

const moneyExp = 0.0001;
let exp = 0;

let switchHit = true;
let layerAnimat = false;
let bossBonus = false;
let offlineBonus = false;
let pausescreen = false;

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

const miner_shovel = {name: "miner_shovel", cost: {base: 100, calc: 100, current: 100}, level: 0, levelTemp: 0, typeValue: "auto", timeHit: 1.6, value: 1, openingLayer: 10, switch: "off", expBonus: 0.1, func: (b) => upgradesFunc(miner_shovel, b), freeUp: false, img: "helmet-shovel_transparent_450x450.png", autoImg: "shovel_transparent_390x390.png", rotate: -80};
const helmet = {name: "helmet", cost: {base: 600, calc: 600, current: 600}, level: 0, typeValue: "profit", value: 1, openingLayer: 50, switch: "off", expBonus: 0.15, func: (b) => upgradesFunc(helmet, b), freeUp: false, img: "helmet5.png"};
const pickaxe = {name: "pickaxe", cost: {base: 500, calc: 500, current: 500}, level: 0, typeValue: "hit", value: 5, openingLayer: 50, switch: "off", expBonus: 0.15, func: (b) => upgradesFunc(pickaxe, b), freeUp: false, img: "pickaxe_transparent_390x390.png"};
const miner_pickaxe = {name: "miner_pickaxe", cost: {base: 5000, calc: 5000, current: 5000}, level: 0, levelTemp: 0, typeValue: "auto", timeHit: 2.8, value: 7, openingLayer: 100, switch: "off", expBonus: 0.2, func: (b) => upgradesFunc(miner_pickaxe, b), freeUp: false, img: "helmet-pickaxe_transparent_450x450.png", autoImg: "pickaxe_transparent_390x390.png", rotate: 0};
const drill = {name: "drill", cost: {base: 40000, calc: 40000, current: 40000}, level: 0, typeValue: "hit", value: 20, openingLayer: 200, switch: "off", expBonus: 0.3, func: (b) => upgradesFunc(drill, b), freeUp: false, img: "drill_transparent_450x450.png"};
const miner_drill = {name: "miner_drill", cost: {base: 120000, calc: 120000, current: 120000}, level: 0, levelTemp: 0, typeValue: "auto", timeHit: 4.2, value: 45, openingLayer: 300, switch: "off", expBonus: 0.4, func: (b) => upgradesFunc(miner_drill, b), freeUp: false, img: "helmetDrill.png", autoImg: "drill_transparent_450x450.png", rotate: -60};
const jackhammer = {name: "jackhammer", cost: {base: 250000, calc: 250000, current: 250000}, level: 0, typeValue: "hit", value: 75, openingLayer: 450, switch: "off", expBonus: 0.5, func: (b) => upgradesFunc(jackhammer, b), freeUp: false, img: "molot_trasparent_450x450.png"};
const miner_jackhammer = {name: "miner_jackhammer", cost: {base: 500000, calc: 500000, current: 500000}, level: 0, levelTemp: 0, typeValue: "auto", timeHit: 5.8, value: 250, openingLayer: 600, switch: "off", expBonus: 0.7, func: (b) => upgradesFunc(miner_jackhammer, b), freeUp: false, img: "helmet-molot_transparent_450x450.png", autoImg: "molot_trasparent_450x450.png", rotate: -60}

const upgrades2 = [shovel, miner_shovel, helmet, pickaxe, miner_pickaxe, drill, miner_drill, jackhammer, miner_jackhammer]; //массив с объектами улучшений;
window.upgrades2 = upgrades2;
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
const lycki = true;

const upgradesExp = [layer_hardness, mining_profit, upgrade_cost, auto_bonus_duration, money_keep, auto_mine_speed, xp_gain];
window.upgradesExp = upgradesExp;

const profitX2 = {name: "profitX2", value: 1, count: 10, time: 120, timeCur: 0, text: "Х2 прибыль", func: () => skill(profitX2), img: "profitX2.png", disable: true, autoHit: false};
const emergenceSpeedX2 = {name: "emergenceSpeedX2", value: 1, count: 0, time: 60, timeCur: 0, text: "Х2 поялвения инструментов", func: () => skill(emergenceSpeedX2), img: "emergenceSpeedX2.png", disable: true, autoHit: true}
const fallSpeedX2 = {name: "fallSpeedX2", value: 1, count: 0, time: 45, timeCur: 0, text: "Х2 скорость падения инструментов", func: () => skill(fallSpeedX2), img: "fallSpeedX2.png", disable: true, autoHit: true}
const damageX2 = {name: "damageX2", value: 1, count: 0, time: 60, timeCur: 0, text: "Х2 весь урон", func: () => skill(damageX2), img: "pickaxe_transparent_redShadow_390x390.png", disable: true, autoHit: true}
const multiSkill = {name: "multiSkill", value: 1, count: 0, time: 30, timeCur: 0, text: "Мультибонус", func: () => skill(multiSkill), img: "multiSkill.png", disable: true, autoHit: false}

const dailyGift = {
    day1: {profitX2: 3},
    day2: {emergenceSpeedX2: 3},
    day3: {damageX2: 3},
    day4: {fallSpeedX2: 3},
    day5: {profitX2: 3, emergenceSpeedX2: 2},
    day6: {damageX2: 3, fallSpeedX2: 2},
    day7: {multiSkill: 3}
}
let daysdDailyGift = 0; 
let weeksDailyGift = 1;

const autohitSkill = [emergenceSpeedX2, fallSpeedX2, damageX2]
const skills = [profitX2, emergenceSpeedX2, fallSpeedX2, damageX2, multiSkill];
window.skills = skills;

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
    generateHTML().then(()=>{
        startingCreationGUI().then(()=>{
            HTMLLoaded = true; 
            loadedGame()
        })
    })
});
async function loadHTMLs(){
    const load = await fetch('HTML.json').then(r => r.json());
    Object.assign(HTMLs, load);
}
async function generateHTML(){
    for(const key in HTMLs){
        let isСycle = key.substring(0, 1);
        if(isСycle == "$"){
            if(isNaN(HTMLs[key].arrayName$)){
                const array = window[HTMLs[key].arrayName$];
                let id = key.substring(1);
                let parent = HTMLs[key]?.Parent;
                for(let i = 0; i < array.length; i++){
                    if(HTMLs[key]?.Parent.substring(0, 1) == "_"){
                        parent = array[i].name + HTMLs[key]?.Parent.substring(1);
                    } 
                    if(HTMLs[key]?.Id.substring(0, 1) == "_"){
                        id = array[i].name + HTMLs[key]?.Id.substring(1); //Не нравиться что используеться .name не универсально скорее всего надо переходить  на глобальный объект и тогда можно получать их имена через key
                    }
                    DOM.Create({Parent: parent, Id: id, Tag: HTMLs[key]?.Tag, Class: HTMLs[key]?.Class, Hidden: HTMLs[key]?.Hidden, Text:HTMLs[key]?.Text});   
                }
            } 
            else{
                let id = key.slice(0, -1);
                let parent = HTMLs[key]?.Parent;
                for(let i = 0; i < HTMLs[key].arrayName$; i++){
                    if(HTMLs[key]?.Parent.slice(-1) == "_"){
                        parent = HTMLs[key]?.Parent.slice(0, -1) + i;
                    }
                    if(HTMLs[key]?.Id.slice(-1) == "_"){
                        id = HTMLs[key]?.Id.slice(0, -1) + i;
                    }
                    DOM.Create({Parent: parent, Id: id, Tag: HTMLs[key]?.Tag, Class: HTMLs[key]?.Class, Hidden: HTMLs[key]?.Hidden, Text:HTMLs[key]?.Text});   
                } 
            }
        }else{
            // console.log(key);
            DOM?.Create({Parent: HTMLs[key]?.Parent, Id: key, Tag: HTMLs[key]?.Tag, Class: HTMLs[key]?.Class, Hidden: HTMLs[key]?.Hidden, Text:HTMLs[key]?.Text});
        }
    }
}
loadLangTexts().then(()=>{
    textsLoaded = true; 
    changeTextsLang(); 
    loadedGame()});
async function loadLangTexts(){
    const texts = await fetch('lang.json').then(r => r.json());
    Object.assign(langTexts, texts);
}
function getText(key) {
    return langTexts[key]?.[langGame];
}
function changeLang(lang){
    if(lang != undefined){
        langGame = lang;
        document.getElementById("langBtnID").value = lang == "ru" ? "en" : "ru";
    } else{
        langGame = langGame == "ru" ? "en" : "ru";
    }
    toChangeText("langBtnID", langGame);
    changeTextsLang() 
}
function changeTextsLang(){
    for(const key in langTexts){
        toChangeText(key, getText(key));
    }
}

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

function loadedGame() {
    if(sdkLoad && resurses && HTMLLoaded && textsLoaded){
        document.getElementById("preloaderID").hidden = "hidden";
        loadImgs = true;
        startingValues();
        loadLocalStorage();
        finance(0);
        updateInfo();
    }
}

document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){safeInLocalStorage();}
    else{loadLocalStorage();}
})

document.addEventListener('DOMContentLoaded', function() {
    DOMContentLoaded = true;
    loadLocalStorage();
}, {once: true});

function loadLocalStorage(){
    if(DOMContentLoaded && HTMLLoaded){
    myLog("Парс")
    for(let i = 0; i < upgrades2.length; i++){
        if(localStorage.getItem(upgrades2[i].name)){
            Object.assign(upgrades2[i], JSON.parse(localStorage.getItem(upgrades2[i].name)));
        }
    }
    for(let i = 0; i < upgradesExp.length; i++){
        if(localStorage.getItem(upgradesExp[i].name)){
            Object.assign(upgradesExp[i], JSON.parse(localStorage.getItem(upgradesExp[i].name)));
        }
    }
    for(let i = 0; i < skills.length; i++){
        if(localStorage.getItem(skills[i].name)){
            Object.assign(skills[i], JSON.parse(localStorage.getItem(skills[i].name)));
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
    daysdDailyGift = Number(localStorage.getItem("daysdDailyGift"));
    myLog(daysdDailyGift+" daysdDailyGift")
    weeksDailyGift = Number(localStorage.getItem("weeksDailyGift"));
    if(!allBonusFree){
        document.getElementById("claim_all").disabled = "disabled";
        document.getElementById("claim_all").classList.add("disabled");
    }
    finance(0);
    onOffBtn();
    openingLayerUp();
    toStyle("#hpBarID", "width", 100/layer.hp.round * layer.hp.current + "%");
    toStyle("#cracksID", "height", 100-(100/layer.hp.round * layer.hp.current) + "%");
    offlineProfit(Math.ceil((new Date() - new Date(localStorage.getItem("exitTime") || new Date()))/1000))
    toStyle("#ret", "backgroundPositionY", layer.level*-200 + "px");
    dailyGift_F(new Date(localStorage.getItem("lastLogon")), new Date());
    localStorage.setItem("lastLogon", new Date());
    updateInfo();
    }
}

window.addEventListener('beforeunload', () => {
    if(bossBonus){
        document.getElementById("bossLevelBonusContainerID" + Math.floor(Math.random()*trw.length)).click()
    }
    safeInLocalStorage();
})

function safeInLocalStorage(){
    localStorage.setItem("money", money + offBonus);
    offBonus = 0;
    localStorage.setItem("exp", exp);
    localStorage.setItem("handHit", handHit);
    localStorage.setItem("autoHit", autoHit);
    localStorage.setItem("hit.count", hit.count);
    localStorage.setItem("expBonus.count", expBonus.count);
    localStorage.setItem("bossLevel", bossLevel);
    localStorage.setItem("allBonusFree", allBonusFree);
    localStorage.setItem("daysdDailyGift", daysdDailyGift);
    localStorage.setItem("weeksDailyGift", weeksDailyGift);
    localStorage.setItem(layer.name, JSON.stringify(layer));
    localStorage.setItem(prize.name, JSON.stringify(prize));
    for(let i = 0; i < upgrades2.length; i++){
        localStorage.setItem(upgrades2[i].name, JSON.stringify(upgrades2[i]));
    }
    for(let i = 0; i < upgradesExp.length; i++){
        localStorage.setItem(upgradesExp[i].name, JSON.stringify(upgradesExp[i]));
    }
    for(let i = 0; i< skills.length; i++){
        localStorage.setItem(skills[i].name, JSON.stringify(skills[i]));
    }
    localStorage.setItem("exitTime", new Date())
}

function tick(time){
    tick.count = (tick.count || 0)
    if(time - (tick.lastTime || 0) >= 100){
        if(tick.count % 10 === 0){skillTimer(); interectiveBonusCreate.time--}
        if(tick.count % 50 === 0){interectiveBonusCreate();}
        if(!loadImgs && tick.count % 8 === 0){preloaderTextChange();}
        tick.count++;
        for(let i = 0; i < upgradesAuto.length; i++){
            if(tick.count / (Math.round(upgradesAuto[i].timeHit*10 - auto_mine_speed.value*(i+1)*10)/10)*emergenceSpeedX2.value % 10 === 0){
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

function skillTimer(){
    if(HTMLLoaded && !pausescreen && !bossBonus && !offlineBonus){
        for(let i = 0; i < skills.length; i++){
            if(skills[i].value == 2){
                skills[i].timeCur -= 1;
                let m = Math.floor(skills[i].timeCur / 60);
                let s = skills[i].timeCur - m * 60;
                if(skills[i].timeCur <= 0){
                    skills[i].value = 1;
                    m = Math.floor(skills[i].time / 60);
                    s = skills[i].time - m * 60;
                    DOM.Id(skills[i].name+"skillID").classList.remove("backlight");
                    DOM.Id(skills[i].name+"skillTimeID").classList.remove("timer");
                    if(skills[i].name == "multiSkill"){
                        for(let i = 0; i < upgradesAuto.length; i++){
                            upgradesAuto[i].levelTemp = 0;
                        }
                    }
                }
                toChangeText(skills[i].name+"skillTimeID", m + ":" + (s < 10 ? "0" + s : s));
            }
        }
    }   
}

function preloaderTextChange(){
    const id = document.getElementById("preloaderTextID");
    id.textContent = id.textContent == "..." ? "." : id.textContent == "." ? ".." : "...";
}

window.addEventListener('blur', ()=> {
    DOM.Hide("blurID", false);
    pausescreen = true;
    ysdk?.features?.GameplayAPI?.stop?.();
})

window.addEventListener('focus', ()=>{
    DOM.Hide("blurID");
    pausescreen = false;
    if (sdkLoad && resurses){
        ysdk.features?.GameplayAPI?.start?.();
    }
})

async function startingCreationGUI(){
    //Боковое меню
    for(let i = 0; i < upgrades2.length; i++){
        let id = upgrades2[i].name;
        DOM.Create({Parent: id+"IconID", Tag: "img", Id: id+"ImgID", Class: "sideMenuElementIconLeftIMG unavailable", Src: "img/" + upgrades2[i].img});
        DOM.Create({Parent: id+"ID", Tag: "button", Id: id+"BtnID", Class: "sideMenuElementBtn", OnClick: function(){upgrades2[i].func();}});
            DOM.Create({Parent: id+"BtnID", Tag: "img", Id: id+"BtnImgID", Class: "coinCl", Src: "img/coin.png", Disabled: "true"});
            DOM.Create({Parent: id+"BtnID", Id: id+"CostID", Class: "inline-block cost"});
    }
    // Центральное меню
    DOM.Create({Parent: "menuForExp", Tag: "button", Id: "menuForExpBtnClose", Class: "btnCloseCircule", Text: "X", OnClick: function(){menuTreePump(true)}});
        DOM.Create({Parent: "expTitleID", Tag: "img", Id: "expImgID", Class: "expCl", Src: "img/exp.png"});
            DOM.Create({Parent: "rebootExpID", Tag: "img", Id: "rebootExpImgID", Class: "expCl", Src: "img/exp.png"});
        DOM.Create({Parent: "infoExpID", Tag: "button", Id: "rebootExpBtnID", Class: "centralMenuElementBtn", Text: "⟳", OnClick: function(){expBonus()}});   
    for(let i = 0; i < upgradesExp.length; i++){
        let id = upgradesExp[i].name;
        DOM.Create({Parent: id+"ID", Tag: "button", Id: id+"BtnID", Class: "centralMenuElementBtn", OnClick: function(){upgradesExp[i].func();}}); 
            DOM.Create({Parent: id+"BtnID", Tag: "img", Id: id+"ImgBtnID", Class: "expCl", Src: "img/exp.png"});
            DOM.Create({Parent: id+"BtnID", Id: id+"CostID", Class: "inline-block cost"});
    }
    //Офлайн меню
    DOM.Create({Parent: "offlineBonusConteinerRerollID", Tag: "button", Id: "claim_offBonus", Class: "bossLevelBonusCls", OnClick: function(){offlineProfit2();}});
    //Ежедневный подарок меню
    DOM.Create({Parent: "dailyGiftMenuConteinerRerollID", Tag: "button", Id: "claim_dailyGift", Class: "bossLevelBonusCls", OnClick: function(){claimDailyGift();}});
    for(let i = 0; i < 7; i++){
        const keys = Object.keys(dailyGift["day"+(i+1)]);
        for (let j = 0; j < keys.length; j++){
            DOM.Create({Parent: "dailyGiftDayContID"+i, Id: "dailyGiftDaySkillContID"+i+j, Class: "skillContainer"});
            for (let k = 0; k < skills.length; k++){

                if(skills[k].name == keys[j]){
                    DOM.Create({Parent: "dailyGiftDaySkillContID"+i+j, Id: "dailyGiftDaySkillIMGID"+j+k, Tag: "img", Class: "skillIMG", Src: "img/"+skills[k].img});
                    DOM.Create({Parent: "dailyGiftDaySkillContID"+i+j, Id: "dailyGiftDaySkillCountID"+i+j+k, Tag: "span", Class: "skillValue", Text: dailyGift["day"+(i+1)][keys[j]]})
                    break;
                }
            }
        }
    }    
    //Бонусное меню
    DOM.Create({Parent: "bossLevelBonusConteinerRerollID", Tag: "button", Id: "claim_all", Class: "bossLevelBonusCls", Text: "Получить всё", OnClick: function(){bossLevelBonusBtn("All")}});
    DOM.Create({Parent: "bossLevelBonusConteinerRerollID", Tag: "button", Id: "bossLevelBonusRerolBtnID", Class: "bossLevelBonusCls", OnClick: function(){reroll();}});
        DOM.Create({Parent: "bossLevelBonusRerolBtnID", Tag: "img", Id: "bossLevelBonusRerolBtnImgID", Src: "img/ad.png"});
    //Меню скилов
    for(let i = 0; i < skills.length; i++){
        let id = skills[i].name;
        DOM.Id(id+"skillID").onclick = function(){skills[i].func();};
        DOM.Id(id+"skillIMGID").src = "img/"+skills[i].img;
        const m = Math.floor(skills[i].time / 60);
        const s = skills[i].time - m * 60;
        toChangeText(id+"skillTimeID", m + ":" + (s < 10 ? "0" + s : s));
    }
    interectiveBonusCreate()
    updateInfo();
}

function skill(id){
    if(id.count > 0 && id.timeCur == 0){
        colorNumbers(id.name + "skillCountID" , "red");
        id.count -= 1;
        id.timeCur = id.time;
        if(id.name == "multiSkill"){
            for(let i = 0; i < skills.length; i++){
                skills[i].value = 2;
                if(skills[i].name != "multiSkill"){
                    skills[i].timeCur += multiSkill.timeCur;
                }
                DOM.Id(skills[i].name+"skillID").classList.add("backlight");
                DOM.Id(skills[i].name+"skillTimeID").classList.add("timer");
                myLog(skills[i].timeCur)
            }
            for(let i = 0; i < upgradesAuto.length; i++){
                upgradesAuto[i].levelTemp = upgradesAuto[i].level * 2 + 1;
            }
        }else{
            id.value = 2;
        }
        DOM.Id(id.name+"skillID").classList.add("backlight");
        DOM.Id(id.name+"skillTimeID").classList.add("timer");
        updateInfo();
    }
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

    for (let i = 0; i < upgrades2.length; i++){
        upgrades2[i].level = 0;
        upgrades2[i].cost.current = upgrades2[i].cost.calc = upgrades2[i].cost.base;
        switchingElementMenu(false, upgrades2[i]);
    }
    openingLayerUp();
}

function expCalc(){
    let expProfit = money*moneyExp + layer.level*layer.expBonus || 0;
    for(let i = 0; i < upgrades2.length; i++){
        expProfit += upgrades2[i].level*upgrades2[i].expBonus;
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
    toStyle("#ret", "backgroundPositionY", "0%");
    toStyle("#hpBarID", "width", 100/layer.hp.round * layer.hp.current+ "%");
    toStyle("#cracksID", "height", 100-(100/layer.hp.round * layer.hp.current) + "%");
    toChangeText("counterRebootID", expBonus.count=(expBonus.count || 0) + 1);
    updateInfo();
    ysdk?.adv?.showFullscreenAdv?.();
}

function hit(object) {
    if (switchHit){
        if(object.typeValue == "hit"){
            damage(object);
            toChangeText("counterID", hit.count=(hit.count || 0) + 1);
        }
        else {
            if((object.level + object.levelTemp) > 0){
                animationAutoHit(object);
            }
        } 
    }
}

function damage(object){
    trembling();
    if (switchHit && layer.hp.current > 0){
        if (object.typeValue == "hit"){
            layer.hp.current -= handHit * damageX2.value;
        } else {
            layer.hp.current -= object.value * (object.level + object.levelTemp) * damageX2.value;
        }
        toStyle("#hpBarID", "width", 100/layer.hp.round * layer.hp.current + "%");
        toStyle("#cracksID", "height", 100-(100/layer.hp.round * layer.hp.current) + "%");
    }
    finishLevel();
    updateInfo();
}

function animationAutoHit(autoDamage){
    let id = "fallTool" + countAutoHit++;
    let id2 = "fallToolTailMeteor" + countAutoHit
    DOM.Create({Parent: "ret", Tag: "img", Id: id2, Class: "imgTailMeteor"});
    DOM.Create({Parent: "ret", Tag: "img", Id: id, Class: "imgAutoHit"});
    let rotate = Math.floor(Math.random()*80)+1060 + autoDamage.rotate;
        let tailMeteor = DOM.Id(id2);
        let element = DOM.Id(id);
        if(fallSpeedX2.value == 2){
            rotate = Math.floor(Math.random()*80)+700 + autoDamage.rotate;
            element.style.transition = "top 1.5s ease-in, transform 1.5s ease-in, opacity 3s ease-in";
            let mirror = Math.round(Math.random()*1) == 1 ? 1 : -1;
            tailMeteor.style.transform = "scaleX("+ mirror +")";
            tailMeteor.src = "img/tailMeteor.png";
        }
        element.src = "img/"+autoDamage.autoImg;
        if(damageX2.value == 2){
            element.classList.add("redShadow");
        }
        let leftRandom = (Math.floor(Math.random()*94)+1)+"%";
        let leftRandom2 = "calc("+leftRandom+" - 40px)"
        tailMeteor.style.left = leftRandom2;
        element.style.left = leftRandom;
        element.offsetHeight;
        element.style.transform = "rotate("+rotate+"deg)";
        tailMeteor.style.top = "calc(65% - 110px)";
        element.style.top = "65%";
        element.addEventListener('transitionend', function opacity(e){
            if (e.propertyName === 'top'){
                tailMeteor.style.opacity = "0%";
                element.style.opacity = "0%";
                element.classList.add("death");
                damage(autoDamage);
            } else if (e.propertyName === 'opacity'){
                tailMeteor.remove();
                element.remove();
                element.removeEventListener('transitionend', opacity); 
            }
        });
}

function trembling(){
    let id = DOM.Id("layerID");
    // let instrumets = document.querySelectorAll('.death');
    let random = Math.floor(Math.random()*2) > 0 ? "0.5%" : "-0.5%"
    let randomY = Math.floor(Math.random()*2) > 0 ? "0.5%" : "-0.5%"
    id.style.transform = "scale(1.01) translateX(" + random + ") translateY(" + randomY + ")";
    // instrumets.forEach( i => {i.style.left = random});

    id.addEventListener('transitionend', () =>{
        id.style.transform = "scale(1) translateX(0%) translateY(0%)"
        // instrumets.forEach( i => {i.style.left = "0%"});
    }, {once: true});
}

function switchsHit(){
    if (bossBonus || offlineBonus || pausescreen || layerAnimat){switchHit = false;}
    if (!bossBonus && !offlineBonus && !pausescreen && !layerAnimat){switchHit = true;}
}

function finishLevel(){
    if (layer.hp.current <= 0){
        layerAnimat = true;
        switchsHit();
        let layerID = DOM.Id('layerImgID');
            layerID.style.top = "100%";
            layerID.style.transition = "none";
        let death = document.querySelectorAll(".death");
            death.forEach( det => {det.remove()});
        toStyle("#cracksID", "height", "0%");
        finance(Math.floor(prize.profitC * profitX2.value));
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
    let mirror = Math.round(Math.random()*1) == 1 ? 1 : -1;
    layerID.offsetHeight;
    layerID.style.transform = "scaleX("+ mirror +")";
    toStyle("#cracksID", "transform", "scaleX("+ mirror +")");
    layerID.style.transition = "top 0.4s linear"
    layerID.style.top = "0px";
    toStyle("#ret", "backgroundPositionY", layer.level*-200 + "px");
    layerID.addEventListener('transitionend', (e) => {
        layerAnimat = false;
        switchsHit(); 
    }, {once: true});
}

function openingLayerUp(){
    for (let i = 0; i < upgrades2.length; i++){
        if (layer.level >= upgrades2[i].openingLayer){
            switchingElementMenu(true, upgrades2[i]);
        }
    }
}

function onOffBtn(){
    for (let i = 0; i < upgrades2.length; i++){
        const id = upgrades2[i].name + "BtnID";
        const bool = !(money >= upgrades2[i].cost.current && upgrades2[i].switch == "on");
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
}

function upgradesFunc(item, bool) {
    let name = item.name;
    let cost = item.cost;
    if(bool){up();
    } else if(money >= cost.current){
        up();
        finance(-Math.floor(cost.current));
        cost.calc = Math.round(softProgress(cost.calc, upgrades2.indexOf(item)-1));
        cost.current = Math.round(cost.calc * upgrade_cost.value);
        colorNumbers(name+"CostID", "red");
        onOffBtn();
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
                for(let i = 0; i < upgrades2.length; i++){
                    upgrades2[i].cost.current = Math.round(upgrades2[i].cost.calc * upgrade_cost.value);
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
    for (let i = 0; i < upgrades2.length; i++){
        if(upgrades2[i].switch == "on"){
            moneyBonus += upgrades2[i].cost.current;
            if (!lowCost || lowCost > upgrades2[i].cost.current){
                lowCost = upgrades2[i].cost.current;
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
        let valueBtn, valueLevel, title, img
        if (trw[i] == moneyBonus){
            valueBtn = "moneyBonus";
            valueLevel = ""
            title = "+"+toCompactNotation(trw[i]);
            img = "coin.png";
        } else{
            valueBtn = trw[i].name;
            valueLevel = Math.floor(Math.random()*(trw[i].level/20)) + 1;
            title = "+" + valueLevel;
            img = trw[i].img;
        }
        DOM.Id("bossLevelBonusIMGID"+i).src = "img/" + img;
        DOM.Id("bossLevelBonusContainerID"+i).onclick = ()=> bossLevelBonusBtn(valueBtn, valueLevel);
        toChangeText("bossLevelBonusValueID"+i, title);
    }
    switchsHit();
    bossBonus = true;
    for (let i = 0; i < upgrades2.length; i++){
        DOM.Disable(upgrades2[i].name + "BtnID", true);
    }
    if (auto_bonus_duration.enabled){
        DOM.Hide("timeID", false);
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
            return upgrades2[i];
        }  else {
            random -= switchsOn;
            switchsOn--;
        }
    }
}

function bossLevelBonusBtn(bonus, count){
    clearTimeout(timer);
    if(bonus === "All"){
        if(allBonusFree){
            allBonusFree = false;
            DOM.Disable("claim_all", true);
            DOM.Id("claim_all").classList.add("disabled");
            for (let i = 0; i < trw.length; i++){
                simulateClick("#bossLevelBonusIMGID" + i);
            }
        } 
    } else if(bonus == "moneyBonus"){
        finance(Math.floor(moneyBonus));
    } else {
        for (let i = 0; i < upgrades2.length; i++){
            if (bonus == upgrades2[i].name){
                // upgrades[i].freeUp = true;
                for (let j = 0; j < count; j++){
                    upgrades2[i].func(true);
                }
            } 
        }
    }
    bossBonus = false;
    switchsHit();
    DOM.Hide("bossLevelBonusID");
}

function menuTreePump(open){
    DOM.Hide("menuForExpBack", open);
}

function offlineProfit(offlineSeconds){
    offlineSeconds = offlineSeconds > 43200 ? 43200 : offlineSeconds;
    const h = Math.floor(offlineSeconds/3600);
    const m = Math.floor((offlineSeconds - h*3600) /60);
    const s = offlineSeconds - h*3600 - m*60
    const H = h > 0 ? h + "h " : "" ;
    const M = m > 0 ? m + "m " : "" ;
    const S = s > 0 ? s + "s" : "";
    toChangeText("time_offline", H + M + S);
    const hours = Math.ceil(offlineSeconds/3600)
    const hourlyRate = [null, 1, 0.9, 0.81, 0.73, 0.66, 0.59, 0.53, 0.48, 0.43, 0.39, 0.35, 0.31];
    const damage = autoHit + handHit/10; //Офлайн урон
    const secForWin = layer.hp.calc / damage; //Кол-во секунд на 1 слой
    // const wins = offlineSeconds / secForWin; //Кол-во побед за отсутствие
    // const offlineMoney = wins * prize.profitC //Кол-во монет за отстутсвие
    for (let i = 0; i < hours; i++){
        let offlineSec = offlineSeconds
        if(offlineSec <= 3600){
            offBonus = offBonus + offlineSec / secForWin * prize.profitC * hourlyRate[i+1] * 0.01; // итогове количество монет с учётом часовой ставки и процента
        } else {
            offBonus = offBonus + 3600 / secForWin * prize.profitC * hourlyRate[i+1] * 0.01;
            offlineSec -= 3600;
        }
    }
    offBonus = Math.ceil(offBonus);
    if(offBonus > 0 && offlineSeconds > 3){
        DOM.Hide("bossLevelBonusID", true);
        DOM.Hide("offlineBonusID", false);
        DOM.Id("offlineBonusIMGID").src = "img/coin.png";
        toChangeText("offlineBonusValueID", "+" + offBonus);
        offlineBonus = true;
        switchsHit();
    }
}

function offlineProfit2(){
    finance(offBonus);
    offBonus = 0;
    DOM.Hide("offlineBonusID", true);
    if(bossBonus){DOM.Hide("bossLevelBonusID", false);}
    offlineBonus = false;
    switchsHit();
}

function dailyGift_F(lastLogon, currentLogon){
    if(!lastLogon){lastLogon = new Date(new Date()-172800000)}
    const lastDay = lastLogon.getDate();
    const today = currentLogon.getDate();
        myLog(today + " today")
        myLog(lastDay + " lastDay")
    if(today != lastDay){
        let raznica = today - lastDay;
        let raznicaMonth = currentLogon.getMonth() - lastLogon.getMonth()
        for(let i = 0; i < 7; i++){
        if(i == daysdDailyGift){
            DOM.Id("dailyGiftDayContID"+i).classList.add("backlight");
        } else if (i < daysdDailyGift){
            DOM.Id("dailyGiftDayContID"+i).classList.add("disabled");
        }
        }
        if(raznica > 1){
            daysdDailyGift = 1;
            weeksDailyGift = 1;
        } else if (raznica == 1 || raznica < 0 && raznicaMonth == 1 && today == 1 || raznicaMonth == -11 && today == 1){
            daysdDailyGift++;
            raznica = 1;
        }
        if(raznica > 0){
            DOM.Hide("dailyGiftMenuID", false);
        }
    }
}

function claimDailyGift(){
    myLog(daysdDailyGift+" daysdDailyGift")
    const keys = Object.keys(dailyGift["day"+daysdDailyGift]);
    for (let i = 0; i < keys.length; i++){
        for (let j = 0; j < skills.length; j++){
            if(skills[j].name == keys[i]){
                skills[j].count += dailyGift["day"+daysdDailyGift][keys[i]] * weeksDailyGift;
            }
        }
    }
    DOM.Hide("dailyGiftMenuID", true);
    if(daysdDailyGift >=7){
        daysdDailyGift -= 7;
        weeksDailyGift++;
    }
    updateInfo();
}   
function interectiveBonusCreate(){
    if(!interectiveBonusCreate.bool){
        const r = Math.floor(Math.random()*1)
        myLog(r + " r");
        if(r == 0){
            interectiveBonusCreate.bool = true;
            interectiveBonusCreate.time = 30;
        DOM.Create({Parent: "ret", Id: "inerectiveBonusContID2", OnClick: function(){interectiveBonus()}})
        const id = DOM.Id("inerectiveBonusContID2");
        id.style.top = (Math.floor(Math.random()*94)+1)+"%";
        id.style.left = (Math.floor(Math.random()*94)+1)+"%";
        id.offsetHeight;
        id.style.opacity = "100%";
        DOM.Create({Parent: "inerectiveBonusContID2", Id: "inerectiveBonusID", Tag: "img", Src: "img/coin.png"})
        }
    } else {
        if(interectiveBonusCreate.time <= 0){
            interectiveBonusCreate.bool = false;
            DOM.Id("inerectiveBonusContID2").remove();
        } else if (interectiveBonusCreate.time <= 5){
            DOM.Id("inerectiveBonusContID2").style.opacity = "0%";
        }
    }
 }
function interectiveBonus(){
    interectiveBonusCreate.bool = false;
 const randomSkill = Math.floor(Math.random()*skills.length);
 myLog(skills[randomSkill].name)
 if(skills[randomSkill].value == 2 || skills[randomSkill].autoHit == true && autoHit <= 0){
    finance(Math.floor(money/10)+1);
 } else{
    skills[randomSkill].count += 1;
    skill(skills[randomSkill]);
 }
  DOM.Id("inerectiveBonusContID2").remove();
}

function updateInfo(){
    if(HTMLLoaded){
    toChangeText("prizeID", toCompactNotation(prize.profitC));
    if (profitX2.value > 1){
        DOM.Id("prizeID").classList.add("strike");
        DOM.Hide("luckyID", false);
        toChangeText("prizeID2", toCompactNotation(prize.profitC * profitX2.value));
    }else{
        DOM.Id("prizeID").classList.remove("strike");
        DOM.Hide("luckyID", true);
        toChangeText("prizeID2", "");
    }
    for(let i = 0; i < skills.length; i++){
        if(skills[i].disable){
            DOM.Id(skills[i].name+"skillID").classList.add("disabled");
        } else{
            DOM.Id(skills[i].name+"skillID").classList.remove("disabled");
        }
        if(skills[i].autoHit){
            if(skills[i].count > 0 && autoHit > 0){
                skills[i].disable = false;
            } else{
                skills[i].disable = true;
            }
        } else {
            if(skills[i].count > 0){
                skills[i].disable = false;
            } else {
                skills[i].disable = true;
            }
        }
    }
    toChangeText("depthLevelID", layer.level);
    autoHit = 0;
    for(let i = 0; i < upgrades2.length; i++){
        toChangeText(upgrades2[i].name+"CostID", toCompactNotation(upgrades2[i].cost.current));
        toChangeText(upgrades2[i].name+"LevelID", upgrades2[i].level);
        if( upgrades2[i].typeValue == "auto"){
            // if(upgrades[i].value > 1){text = " Автоудар - "}
            let damage = Math.round(upgrades2[i].value*upgrades2[i].level/(auto_mine_speed.parameter.value*upgrades2[i].timeHit)*100)/100;
            toChangeText(upgrades2[i].name+"ValueID", damage + " hp/s");
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

    for(let i = 0; i < skills.length; i++){
        toChangeText(skills[i].name + "skillCountID", skills[i].count);
    }

    toChangeText("hitID", handHit);
    toChangeText("autoHitInfoID", Math.round(autoHit*100)/100 + " hp/s");
    toChangeText("hpID", Math.floor(layer.hp.current));
    toChangeText("rebootExpCostID", expCalc());
    }
}