let langGame = "en";
const langTexts = {};
let textsLoaded = false;
const HTMLs = {};
const IMGs = {};
let HTMLLoaded = false;
let loadImgs = false;
let DOMContentLoaded = false;
let offBonus = 0;

let money, handHit, autoHit;
let allBonusFree = true;
let rerollTimer = false;

const moneyExp = 0.0001;
let exp = 0;
let gold_layer;

let switchHit = true;
let layerAnimat = false;
let bossBonus = false;
let offlineBonus = false;
let dailyGiftBonus = false
let pausescreen = false;

let countAutoHit = 0;

let geodeCount = 1;


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
    freeUp: false
};
const minerShovel = {name: "minerShovel", cost: {base: 100, calc: 100, current: 100}, level: 0, levelTemp: 0, typeValue: "auto", timeHit: 1.6, value: 1, openingLayer: 10, switch: "off", expBonus: 0.1, func: (b) => upgradesFunc(minerShovel, b), freeUp: false, autoImg: "shovel", rotate: -80};
const helmet = {name: "helmet", cost: {base: 600, calc: 600, current: 600}, level: 0, typeValue: "profit", value: 1, openingLayer: 50, switch: "off", expBonus: 0.15, func: (b) => upgradesFunc(helmet, b), freeUp: false};
const pickaxe = {name: "pickaxe", cost: {base: 500, calc: 500, current: 500}, level: 0, typeValue: "hit", value: 5, openingLayer: 50, switch: "off", expBonus: 0.15, func: (b) => upgradesFunc(pickaxe, b), freeUp: false};
const minerPickaxe = {name: "minerPickaxe", cost: {base: 5000, calc: 5000, current: 5000}, level: 0, levelTemp: 0, typeValue: "auto", timeHit: 2.8, value: 7, openingLayer: 100, switch: "off", expBonus: 0.2, func: (b) => upgradesFunc(minerPickaxe, b), freeUp: false, autoImg: "pickaxe", rotate: 0};
const drill = {name: "drill", cost: {base: 40000, calc: 40000, current: 40000}, level: 0, typeValue: "hit", value: 20, openingLayer: 200, switch: "off", expBonus: 0.3, func: (b) => upgradesFunc(drill, b), freeUp: false};
const minerDrill = {name: "minerDrill", cost: {base: 120000, calc: 120000, current: 120000}, level: 0, levelTemp: 0, typeValue: "auto", timeHit: 4.2, value: 45, openingLayer: 300, switch: "off", expBonus: 0.4, func: (b) => upgradesFunc(minerDrill, b), freeUp: false, autoImg: "drill", rotate: -60};
const jackhammer = {name: "jackhammer", cost: {base: 250000, calc: 250000, current: 250000}, level: 0, typeValue: "hit", value: 75, openingLayer: 450, switch: "off", expBonus: 0.5, func: (b) => upgradesFunc(jackhammer, b), freeUp: false};
const minerJackhammer = {name: "minerJackhammer", cost: {base: 500000, calc: 500000, current: 500000}, level: 0, levelTemp: 0, typeValue: "auto", timeHit: 5.8, value: 250, openingLayer: 600, switch: "off", expBonus: 0.7, func: (b) => upgradesFunc(minerJackhammer, b), freeUp: false, autoImg: "jackhammer", rotate: -60}

const upgrades2 = [shovel, minerShovel, helmet, pickaxe, minerPickaxe, drill, minerDrill, jackhammer, minerJackhammer]; //массив с объектами улучшений;
window.upgrades2 = upgrades2;
const upgradesAuto = [minerShovel, minerPickaxe, minerDrill, minerJackhammer];//массив с объектами улучшений, только автоудары

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

const profitX2 = {name: "profitX2", value: 1, count: 1, time: 120, timeCur: 0, text: "Х2 прибыль", func: () => skill(profitX2), disable: true, autoHit: false};
const emergenceSpeedX2 = {name: "emergenceSpeedX2", value: 1, count: 1, time: 60, timeCur: 0, text: "Х2 поялвения инструментов", func: () => skill(emergenceSpeedX2), disable: true, autoHit: true}
const fallSpeedX2 = {name: "fallSpeedX2", value: 1, count: 1, time: 45, timeCur: 0, text: "Х2 скорость падения инструментов", func: () => skill(fallSpeedX2), disable: true, autoHit: true}
const damageX2 = {name: "damageX2", value: 1, count: 1, time: 60, timeCur: 0, text: "Х2 весь урон", func: () => skill(damageX2), disable: true, autoHit: true}
const multiSkill = {name: "multiSkill", value: 1, count: 1, time: 30, timeCur: 0, text: "Мультибонус", func: () => skill(multiSkill), disable: true, autoHit: false}

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
let DailyGiftCreate = 0;

const autohitSkill = [emergenceSpeedX2, fallSpeedX2, damageX2]
const skills = [profitX2, emergenceSpeedX2, damageX2, fallSpeedX2, multiSkill];
window.skills = skills;

let currentSecondsStart, currentSeconds;

let bossLevel = 1;
const bossLevelRatio = 10;
let moneyBonus, trw, timer;
let layerUpIntervalID;

console.time("game")
loadHTMLs().then(()=>{
    loadIMG().then(()=>{
        generateHTML().then(()=>{
            startingCreationGUI().then(()=>{
                DOMInitialization().then(()=>{
                    loadLangTexts().then(()=>{
                        HTMLLoaded = true; 
                        textsLoaded = true; 
                        changeTextsLang(); 
                        loadedGame();
                        tick(performance.now());
                        skillSwitch()
                        upgradesExpFuncInfo();
                    });
                })
            })
        })
    })
});
console.timeEnd("game");
const imgCache = {};
async function loadIMG(){
    const load = await fetch('IMG.json').then(r => r.json());
    Object.assign(IMGs, load);
    for (const key in IMGs) {
        const img = new Image();  // Создаем объект Image (быстро)
        img.src = IMGs[key];      // Начинаем загрузку (не ждем!)
        imgCache[key] = img;     // Сохраняем в кэш (быстро)
    }
}
async function loadHTMLs(){ //загрузка HTML.json
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
                let src = imgCache[HTMLs[key]?.Src]?.src;
                let onclick = new Function(HTMLs[key]?.OnClick);
                for(let i = 0; i < array.length; i++){
                    if(HTMLs[key]?.Parent.substring(0, 1) == "_"){
                        parent = array[i].name + HTMLs[key]?.Parent.substring(1);
                    } 
                    if(HTMLs[key]?.Id.substring(0, 1) == "_"){
                        id = array[i].name + HTMLs[key]?.Id.substring(1); //Не нравиться что используеться .name не универсально скорее всего надо переходить  на глобальный объект и тогда можно получать их имена через key
                    }
                    if(HTMLs[key]?.Src?.substring(0, 1) == "_"){
                        src = imgCache[array[i].name + HTMLs[key]?.Src.substring(1)]?.src;
                    }
                    if(HTMLs[key]?.OnClick?.substring(0, 1) == "$"){
                        onclick = array[i][HTMLs[key].OnClick.substring(1)];
                    }
                    DOM.Create({Parent: parent, Id: id, Tag: HTMLs[key]?.Tag, Class: HTMLs[key]?.Class, Hidden: HTMLs[key]?.Hidden, Text:HTMLs[key]?.Text, Src: src, OnClick: onclick});   
                    IDs.push(id);
                }
            } 
            else{
                let id = key.slice(0, -1);
                let parent = HTMLs[key]?.Parent;
                let src = imgCache[HTMLs[key]?.Src]?.src;
                for(let i = 0; i < HTMLs[key].arrayName$; i++){
                    if(HTMLs[key]?.Parent.slice(-1) == "_"){
                        parent = HTMLs[key]?.Parent.slice(0, -1) + i;
                    }
                    if(HTMLs[key]?.Id.slice(-1) == "_"){
                        id = HTMLs[key]?.Id.slice(0, -1) + i;
                    }
                    DOM.Create({Parent: parent, Id: id, Tag: HTMLs[key]?.Tag, Class: HTMLs[key]?.Class, Hidden: HTMLs[key]?.Hidden, Text:HTMLs[key]?.Text, Src: src, OnClick: new Function(HTMLs[key]?.OnClick)});
                    IDs.push(id);   
                } 
            }
        }else{
            DOM?.Create({Parent: HTMLs[key]?.Parent, Id: key, Tag: HTMLs[key]?.Tag, Class: HTMLs[key]?.Class, Hidden: HTMLs[key]?.Hidden, Text:HTMLs[key]?.Text, Src:imgCache[HTMLs[key]?.Src]?.src, OnClick: new Function(HTMLs[key]?.OnClick)});
            IDs.push(key);
        }
    }
}
async function startingCreationGUI(){
    //Ежедневный подарок меню
    DOM.Id("claim_dailyGift").onclick = function(){claimDailyGift();};
    for(let i = 0; i < 7; i++){
        const keys = Object.keys(dailyGift["day"+(i+1)]);
        console.log(keys.length)
        for (let j = 0; j < keys.length; j++){
            DOM.Create({Parent: "dailyGiftDayContID"+i, Id: "dailyGiftDaySkillContID"+i+j, Class: "dailySkill"});
                IDs.push("dailyGiftDaySkillContID"+i+j); 
            for (let k = 0; k < skills.length; k++){
                if(skills[k].name == keys[j]){
                    DOM.Create({Parent: "dailyGiftDaySkillContID"+i+j, Id: "dailyGiftDaySkillIMGID"+DailyGiftCreate, Tag: "img", Class: "skillIMG", Src: imgCache[skills[k].name].src});
                        IDs.push("dailyGiftDaySkillIMGID"+DailyGiftCreate);
                    DOM.Create({Parent: "dailyGiftDaySkillContID"+i+j, Id: "dailyGiftDaySkillCountID"+DailyGiftCreate, Tag: "span", Class: "skillValue", Text: (dailyGift["day"+(i+1)][keys[j]]*weeksDailyGift)})
                        IDs.push("dailyGiftDaySkillCountID"+DailyGiftCreate);
                    DailyGiftCreate++;
                    break;
                }
            }
        }
    }    
    await new Promise(r => setTimeout(r, 0));
    return Promise.resolve();
}
const ID = {};
const IDs = ["ret", "counter", "hit", "autoHitInfo", "depthLevel", "langBtn", "coin", "counterReboot", "money"];
async function DOMInitialization() {
    IDs.forEach(id => {
        ID[id] = DOM.Id(id);
    })
    await new Promise(r => setTimeout(r, 0));
    return Promise.resolve();
}
async function loadLangTexts(){
    const texts = await fetch('lang.json').then(r => r.json());
    Object.assign(langTexts, texts);
}
function changeTextsLang(){
    for(const key in langTexts){
        toChangeText(key, getText(key));
    }
    function getText(key) {
        return langTexts[key]?.[langGame];
    }
}
function loadedGame() {
    if(sdkLoad && resurses && HTMLLoaded && textsLoaded){
        document.getElementById("preloaderID").hidden = "hidden";
        loadImgs = true;
        startingValues();
        loadLocalStorage();
        finance(0);
    }
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
    ID.claimAll.disabled = false;
    ID.claimAll.classList.remove("disabled");

    for (let i = 0; i < upgrades2.length; i++){
        upgrades2[i].level = 0;
        upgrades2[i].cost.current = upgrades2[i].cost.calc = upgrades2[i].cost.base;
        switchingElementMenu(false, upgrades2[i]);
    }
        //Меню скилов
    for(let i = 0; i < skills.length; i++){
        toChangeText(skills[i].name + "skillTimeID", numberInTime(skills[i].time, "m:S"));
    }
    upgradesFuncInfo();
    openingLayerUp();
    skillsUpdate();
    updateInfo();
}

function changeLang(lang){
    if(lang != undefined){
        langGame = lang;
        ID.langBtn.value = lang == "ru" ? "en" : "ru";
    } else{
        langGame = langGame == "ru" ? "en" : "ru";
    }
    ID.langBtn.textContent = langGame;
    changeTextsLang() 
}

consoleCreateBtnsCP(["coins", "exp", "hit", "autohit"])//создание панели управления в консоле

function consBtnReturn(value, parameter) {
    switch(parameter){
        case "coins": finance(value); break;
        case "exp": expChanges(value); break;
        case "hit": handHit += value; break;
        case "autohit": minerShovel.value += value; break;
    }
    updateInfo;
}

document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){safeInLocalStorage();claimDailyGift();}
    else{loadLocalStorage();}
})

document.addEventListener('DOMContentLoaded', function() {
    DOMContentLoaded = true;
    loadLocalStorage();
}, {once: true});

function loadLocalStorage(){
    console.time("load")
    if(DOMContentLoaded && HTMLLoaded){
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
    ID.exp.textContent = toCompactNotation(exp);
    handHit = Number(localStorage.getItem("handHit")) || 1;
    hit.count = Number(localStorage.getItem("hit.count")) || 0;
    ID.counter.textContent = hit.count;
    expBonus.count = Number(localStorage.getItem("expBonus.count")) || 0;
    ID.counterReboot.textContent = expBonus.count;
    autoHit = Number(localStorage.getItem("autoHit")) || 0;
    bossLevel = Number(localStorage.getItem("bossLevel")) || 1;
    allBonusFree = localStorage.getItem("allBonusFree") === 'false' ? false : true;
    daysdDailyGift = Number(localStorage.getItem("daysdDailyGift"));
    myLog(daysdDailyGift+" daysdDailyGift")
    weeksDailyGift = Number(localStorage.getItem("weeksDailyGift")) || 1;
    geodeCount = Number(localStorage.getItem("geodeCount"));
    if(!allBonusFree){
        ID.claimAll.disabled = "disabled";
        ID.claimAll.classList.add("disabled");
    }
    finance(0);
    onOffBtn();
    openingLayerUp();
    ID.hpBar.style.width = 100/layer.hp.round * layer.hp.current + "%";
    ID.cracks.style.height = 100-(100/layer.hp.round * layer.hp.current) + "%";
    offlineProfit(Math.ceil((new Date() - new Date(localStorage.getItem("exitTime") || new Date()))/1000));
    ID.ret.style.backgroundPositionY = layer.level*-200+"px";
    dailyGift_F(new Date(localStorage.getItem("lastLogon")), new Date());
    localStorage.setItem("lastLogon", new Date());
    updateInfo();
    }
    console.timeEnd("load")
}

window.addEventListener('beforeunload', () => {
    if(bossBonus){
        document.getElementById("bossLevelBonusContainerID" + Math.floor(Math.random()*trw.length)).click()
    }
    safeInLocalStorage();
})

window.addEventListener('load', () => {
    loadLocalStorage();
});

window.addEventListener('pagehide', () => {
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
    localStorage.setItem("geodeCount", geodeCount);
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
    // console.time("tick");
    tick.count = (tick.count || 0)
    if(time - (tick.lastTime || 0) >= 100){
        if(tick.count % 10 === 0){skillTimer(); textTimer(); interectiveBonusCreate.time--}
        if(tick.count % 50 === 0){interectiveBonusCreate();}
        if(!loadImgs && tick.count % 8 === 0){preloaderTextChange();}
        tick.count++;
        for(let i = 0; i < upgradesAuto.length; i++){
            if(tick.count / (Math.round(upgradesAuto[i].timeHit*10 - auto_mine_speed.value*(i+1)*10)/10)*emergenceSpeedX2.value % 10 === 0){
                hit(upgradesAuto[i]);
            }
        }
        tick.lastTime = time;
    }
    requestAnimationFrame(tick);
    // console.timeEnd("tick");
}

function textTimer(){
    if(HTMLLoaded){
    if (auto_bonus_duration.enabled == true && rerollTimer && !ID.bossLevelBonus.hidden){
        currentSeconds = new Date().getSeconds();
        let raznica = auto_bonus_duration.value - (currentSeconds - currentSecondsStart);
        if(raznica > 60){raznica -= 60};
        ID.autoSelectValue.textContent = raznica;
    } else {ID.autoSelectValue.textContent = ""}
    }
}

function skillTimer(){
    if(HTMLLoaded && !pausescreen && !bossBonus && !offlineBonus && !dailyGiftBonus){
        for(let i = 0; i < skills.length; i++){
            if(skills[i].value == 2){
                skills[i].timeCur -= 1;
                if(skills[i].timeCur <= 0){
                    skills[i].value = 1;
                    ID[skills[i].name+"skillID"].classList.remove("backlight");
                    ID[skills[i].name+"skillTimeID"].classList.remove("timer");
                    if(skills[i].name == "multiSkill"){
                        for(let i = 0; i < upgradesAuto.length; i++){
                            upgradesAuto[i].levelTemp = 0;
                        }
                    }
                }
                ID[skills[i].name+"skillTimeID"].textContent = numberInTime(skills[i].timeCur, "m:S")
            }
        }
        skillSwitch();
        skillsUpdate() 
    }  
}

function preloaderTextChange(){
    const id = document.getElementById("preloaderTextID");
    id.textContent = id.textContent == "..." ? "." : id.textContent == "." ? ".." : "...";
}

window.addEventListener('blur', ()=>{
    DOM.Hide("blurID", false);
    pausescreen = true;
    switchsHit();
    ysdk?.features?.GameplayAPI?.stop?.();
})

window.addEventListener('focus', ()=>{
    DOM.Hide("blurID");
    pausescreen = false;
    switchsHit();
    if (sdkLoad && resurses){
        ysdk.features?.GameplayAPI?.start?.();
    }
})

geodeHit.bool =true;
function geodeHit(){
    if(geodeCount <= 0){
        ID.geodeIMG.style.filter = "grayscale(50%)"
    }else{
    if(geodeHit.bool){
    geodeHit.count = geodeHit.count || 3;
    geodeHit.count = geodeHit.count <= 0 ? 3 : geodeHit.count-1;
    ID.geodeCraks.style.height = 100-(geodeHit.count*33)+"%";
    animationOnce(ID.geodeConteiner, 'anim_Trembling');
    if(geodeHit.count == 0){
        geodeHit.bool = false;
        const geodeBonus = ["exp", ...[...skills].reverse(), "money"];
        let choice = Math.ceil(Math.random()*mathTriangularNumber(geodeBonus.length));
        let result = geodeBonus[Math.ceil(mathTriangularNumberInverse(choice))-1];
        let srcImg, target;
        if(result == "money"){
            srcImg = imgCache.coin.src;
            target = ID.coin;
        }else if(result == "exp"){
            srcImg = imgCache.exp.src;
            target = ID.menu;
        }else{
            srcImg = imgCache[result.name].src;
            target = ID[result.name+"skillIMGID"];
        }
        DOM.Create({Parent: "ret", Id: "geodeBonusIMGID", Tag: "img", Hidden: "true", Src: srcImg})
        const object = ID.geodeIMG.getBoundingClientRect();
        const bonus = DOM.Id("geodeBonusIMGID");
                bonus.style.left = object.left+object.width/5 +"px";
                bonus.style.top = object.top+"px";
                bonus.hidden = false;
        ID.geodeCraks.style.height = "0%";
        flightToTarget(bonus, target);
        bonus.style.opacity = "40%";
        ID.geodeIMG.hidden = true;
        ID.geodeRift.hidden = false;
        ID.geodeConteiner.classList.add("claet");
        bonus.addEventListener('transitionend', function opacity(e){
            animationOnce(ID.geodeConteiner, 'anim_Trembling');
            ID.geodeIMG.hidden = false;
            ID.geodeRift.hidden = true;
            ID.geodeConteiner.classList.remove("claet");
            geodeHit.count == 3
            bonus.remove();
            geodeHit.bool = true;
        if(result == "money"){finance(Math.floor(money/10)+1);
        }else if(result == "exp"){expChanges(1);
        }else{
            result.count += 1;
            colorNumbers(ID[result.name+"skillCountID"], "green")};
            geodeCount--;
            skillSwitch();
            updateInfo();
        }, {once: true})
    }
}
}
}

function skillSwitch(){
    for(let i = 0; i < skills.length; i++){
        if(skills[i].autoHit){
            skills[i].disable = skills[i].count > 0 && autoHit > 0 ? false : true;
        } else {
            skills[i].disable = skills[i].count > 0 ? false : true;
        }
        ID[skills[i].name+"skillID"].classList.toggle("disabled", skills[i].disable);
    }
}
function skill(id){
    if(id.count > 0 && id.timeCur == 0){
        colorNumbers(ID[id.name+"skillCountID"], "red");
        id.count -= 1;
        id.timeCur = id.time;
        if(id.name == "multiSkill"){
            for(let i = 0; i < skills.length; i++){
                skills[i].value = 2;
                if(skills[i].name != "multiSkill"){
                    skills[i].timeCur += multiSkill.timeCur;
                }
            }
            for(let i = 0; i < upgradesAuto.length; i++){
                upgradesAuto[i].levelTemp = upgradesAuto[i].level * 2 + 1;
            }
        }else{
            id.value = 2;
        }
        x2orX4();
        updateInfo();
    }
}

function reroll(t){
    pausescreen = true;
    if(t != "geoda"){
    rerollTimer = false;
    clearTimeout(timer);
    }
    ysdk.adv.showRewardedVideo?.({
        callbacks: {
            onRewarded: () => {
                if(t == "geoda"){
                    geodeCount++;
                }else{
                    allBonusFree = true;
                    ID.claimAll.disabled = false;
                    ID.claimAll.classList.remove("disabled");
                    ID.bossLevelBonusRerolBtn.hidden = true;
                }
                pausescreen = false;
            }
        }
    });
    updateInfo();
}

function finance(m){
    colorNumbers(ID.money, m < 0 ? "red" : "green");
    money += m;
    ID.money.textContent = toCompactNotation(money);
    if(m != 0){
        onOffBtn();
        updateInfo();
    }
}

function expChanges(e){
    ID.exp.textContent = toCompactNotation(exp += e);
}

function expCalc(){
    let expProfit = money*moneyExp + layer.level*layer.expBonus || 0;
    for(let i = 0; i < upgrades2.length; i++){
        expProfit += upgrades2[i].level*upgrades2[i].expBonus;
    }
    expProfit = Math.round(expProfit * xp_gain.value);
    ID.warning.hidden = !(expProfit >=10 || exp >= 10);
    return expProfit;
}

function expBonus(){
    let exp = expCalc();
    expChanges(exp);
    let m = money;
    startingValues();    
    money = Math.round(m * money_keep.value);
    finance(0);
    ID.ret.style.backgroundPositionY = "0%";
    ID.hpBar.style.width = 100/layer.hp.round * layer.hp.current+ "%";
    ID.cracks.style.height = 100-(100/layer.hp.round * layer.hp.current) + "%";
    ID.counterReboot.textContent = expBonus.count=(expBonus.count || 0) + 1;
    updateInfo();
    ysdk?.adv?.showFullscreenAdv?.();
}

function hit(object) {
    if (switchHit){
        if(object.typeValue == "hit"){
            damage(object);
            ID.counter.textContent = hit.count=(hit.count || 0) + 1;
        }
        else {
            if((object.level + object.levelTemp) > 0){
                animationAutoHit(object);
            }
        } 
    }
}

function damage(object){
    console.time("damage")
    animationOnce(ID.layer, "anim_TremblingLayer_"+(Math.floor(Math.random()*4)+1))
    if (switchHit && layer.hp.current > 0){
        if (object.typeValue == "hit"){
            layer.hp.current -= handHit * damageX2.value;
        } else {
            layer.hp.current -= object.value * (object.level + object.levelTemp) * damageX2.value;
        }
        ID.hpBar.style.width = 100/layer.hp.round * layer.hp.current + "%";
        ID.cracks.style.height = 100-(100/layer.hp.round * layer.hp.current) + "%";
    }
    finishLevel();
    console.timeEnd("damage")
}

function animationAutoHit(autoDamage){
    console.time("animationAutoHit")
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
            tailMeteor.classList.add("imgTailMeteor"+Math.round(Math.random()*1));
            tailMeteor.src = imgCache.tailMeteor.src;
        }
        element.src = imgCache[autoDamage.autoImg].src;
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
                tailMeteor.classList.add("death");
                element.style.opacity = "0%";
                element.classList.add("death");
                damage(autoDamage);
            } else if (e.propertyName === 'opacity'){
                tailMeteor.remove();
                element.remove();
                element.removeEventListener('transitionend', opacity); 
            }
        }, {once: true});
        console.timeEnd("animationAutoHit")
}

function switchsHit(){
    if (bossBonus || offlineBonus || dailyGiftBonus || pausescreen || layerAnimat){switchHit = false;}
    if (!bossBonus && !offlineBonus && !dailyGiftBonus && !pausescreen && !layerAnimat){switchHit = true;}
}

function finishLevel(){
    if (layer.hp.current <= 0){
        layerAnimat = true;
        switchsHit();
        ID.layerAll.style.top = "100%";
        ID.layerAll.style.transition = "none";
        const death = document.querySelectorAll(".death");
            death.forEach( det => {det.remove()});
        ID.cracks.style.height = "0%";
        finance(Math.floor(prize.profitC * profitX2.value * (gold_layer == 0 ? 2 : 1)));
        layer.hp.calc = softProgress(layer.hp.calc, -1);
        layer.hp.round = layer.hp.current = Math.floor(layer.hp.calc * layer_hardness.value);
        prize.profit = prize.profitC = Math.round(softProgress(prize.profit, -2));
        prize.profitC = Math.floor(prize.profitC * mining_profit.value);
        layer.level++;
        layerUp();
        ID.hpBar.style.width = "100%";
        openingLayerUp();
        if (bossLevel == layer.level){  
            bossLevel += bossLevelRatio;
            bossLevelBonus();
            safeInLocalStorage();
        }
    }
} 

function layerUp(){
    let mirror = Math.round(Math.random()*1) == 1 ? 1 : -1;
    gold_layer = Math.floor(Math.random()*15);
    ID.layerGold.hidden = gold_layer == 0 ? false : true;
    x2orX4();
    ID.layerGold.style.transform = "scaleX("+ mirror +")";
    ID.layerAll.offsetHeight;
    ID.layerAll.style.transform = "scaleX("+ mirror +")";
    ID.cracks.style.transform = "scaleX("+ mirror +")";
    ID.layerAll.style.transition = "top 0.4s linear"
    ID.layerAll.style.top = "0px";
    ID.ret.style.backgroundPositionY = layer.level*-200+"px";
    ID.layerAll.addEventListener('transitionend', (e) => {
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
        ID[upgrades2[i].name+"BtnID"].disabled = !(money >= upgrades2[i].cost.current && upgrades2[i].switch == "on");
    }
    for (let i = 0; i < upgradesExp.length; i++){
        ID[upgradesExp[i].name+"BtnID"].disabled = exp >= upgradesExp[i].cost ? false : true;
    }
}

function switchingElementMenu(switchType, btn){
    btn.switch = switchType? "on" : "off";
    ID[btn.name+"ID"].classList.toggle("disabled", !switchType);
    ID[btn.name+"ImgID"].classList.toggle("unavailable", !switchType)
    onOffBtn();
}

function upgradesFunc(item, bool) {
    let name = item.name;
    let cost = item.cost;
    if(bool == true){up();
    } else 
        if(money >= cost.current){
        up();
        finance(-Math.floor(cost.current));
        cost.calc = Math.round(softProgress(cost.calc, upgrades2.indexOf(item)-1));
        cost.current = Math.round(cost.calc * upgrade_cost.value);
        colorNumbers(ID[name+"CostID"], "red");
        onOffBtn();
    }
    function up(){
        switch(item.typeValue){
            case "hit": handHit += item.value; break;
            case "profit": prize.profit++; prize.profitC++; break;
        }
        item.level++;
        colorNumbers(ID[name+"LevelID"], "green");
    }
    upgradesFuncInfo()
    skillSwitch();
    updateInfo();
}
function upgradesFuncInfo(){
    for(let i = 0; i < upgrades2.length; i++){
        ID[upgrades2[i].name+"CostID"].textContent = toCompactNotation(upgrades2[i].cost.current);
        ID[upgrades2[i].name+"LevelID"].textContent = upgrades2[i].level;
        if(upgrades2[i].typeValue == "auto"){
            let damage = Math.round(upgrades2[i].value*upgrades2[i].level/(auto_mine_speed.parameter.value*upgrades2[i].timeHit)*100)/100;
            ID[upgrades2[i].name+"ValueID"].textContent = damage+" hp/s";
            autoHit += damage;
        }
    } 
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
                if (!auto_bonus_duration.enabled){auto_bonus_duration.enabled = true;};
            } 
        } 
        if (upgradesExp[i].level >= 10){
            ID[name+"ID"].classList.add('disabled');
            ID[name+"BtnID"].disabled = true;
        }
    }
    upgradesExpFuncInfo();
}
function upgradesExpFuncInfo() {
    for(let i = 0; i < upgradesExp.length; i++){
        let name = upgradesExp[i].name;
        ID[name+"InfoValueID"].textContent = upgradesExp[i].enabled == false? "-" + upgradesExp[i].parameter.type : Math.round(upgradesExp[i].parameter.value*100)/100 + upgradesExp[i].parameter.type;
        ID[name+"CostID"].textContent = upgradesExp[i].level < 10 ? Math.floor(upgradesExp[i].cost) : "Максимум";
        ID[name+"LevelID"].textContent = upgradesExp[i].level;
    }
}

function bossLevelBonus(){
    ID.bossLevelBonus.hidden = false;
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

    if(bonus2 === bonus1){bonus2 = moneyBonus}
    if(bonus3 === bonus2 || bonus3 === bonus1){bonus3 = moneyBonus;}
    trw.push(bonus1, bonus2, bonus3);

    for (let i = 0; i < trw.length; i++){
        let valueBtn, valueLevel, title, img
        if (trw[i] == moneyBonus){
            valueBtn = "moneyBonus";
            valueLevel = ""
            title = "+"+toCompactNotation(trw[i]);
            img = imgCache.coin.src;
        } else{
            valueBtn = trw[i].name;
            valueLevel = Math.floor(Math.random()*(trw[i].level/20)) + 1;
            title = "+" + valueLevel;
            img = imgCache[trw[i].name].src;
        }
        ID["bossLevelBonusIMGID"+i].src = img;
        ID["bossLevelBonusContainerID"+i].onclick = ()=> bossLevelBonusBtn(valueBtn, valueLevel);
        ID["bossLevelBonusValueID"+i].textContent = title;
    }
    switchsHit();
    bossBonus = true;
    for (let i = 0; i < upgrades2.length; i++){
        ID[upgrades2[i].name+"BtnID"].disabled = true;
    }//как будто бы вообще это не нужно
    if (auto_bonus_duration.enabled){
        ID.time.hidden = false;
        currentSecondsStart = new Date().getSeconds();
        rerollTimer = true;
        timer = setTimeout(function(){ID["bossLevelBonusContainerID" + Math.floor(Math.random()*trw.length)].click()}, auto_bonus_duration.value*1000);
    }
    ID.bossLevelBonusRerolBtn.hidden = allBonusFree;
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
            ID.claimAll.disabled = true;
            ID.claimAll.classList.add("disabled");
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
    ID.bossLevelBonus.hidden = true;
}

function menuTreePump(open){
    ID.menuForExpBack.hidden = open;
}

function offlineProfit(offlineSeconds){
    offlineSeconds = offlineSeconds > 43200 ? 43200 : offlineSeconds;
    const h = Math.floor(offlineSeconds/3600);
    const m = Math.floor((offlineSeconds - h*3600) /60);
    const s = offlineSeconds - h*3600 - m*60
    const H = h > 0 ? h + "h " : "" ;
    const M = m > 0 ? m + "m " : "" ;
    const S = s > 0 ? s + "s" : "";
    ID.timeOffline.textContent = H + M + S;
    const hours = Math.ceil(offlineSeconds/3600)
    const hourlyRate = [null, 1, 0.9, 0.81, 0.73, 0.66, 0.59, 0.53, 0.48, 0.43, 0.39, 0.35, 0.31];
    const damage = autoHit + handHit/10; //Офлайн урон
    const secForWin = layer.hp.calc / damage; //Кол-во секунд на 1 слой
    for (let i = 0; i < hours; i++){
        let offlineSec = offlineSeconds
        const sec = offlineSec <= 3600 ? offlineSec : 3600;
        offBonus = offBonus + sec / secForWin * prize.profitC * hourlyRate[i+1] * 0.01; // итогове количество монет с учётом часовой ставки и процента
        if(offlineSec > 3600){offlineSec -= 3600}
    }
    offBonus = Math.ceil(offBonus);
    if(offBonus > 0 && offlineSeconds > 4){
        ID.bossLevelBonus.hidden = true;
        ID.offlineBonus.hidden = false;
        ID.offlineBonusValue.textContent = "+" + toCompactNotation(offBonus);
        offlineBonus = true;
        switchsHit();
    }
}

function offlineProfit2(){
    finance(offBonus);
    offBonus = 0;
    ID.offlineBonus.hidden = true;
    if(bossBonus){ID.bossLevelBonus.hidden = false}
    offlineBonus = false;
    switchsHit();
}

function dailyGift_F(lastLogon, currentLogon){
    if(!lastLogon){lastLogon = new Date(new Date()-172800000)}
    const lastDay = lastLogon.getDate();
    const today = currentLogon.getDate();
    if(today != lastDay){
        geodeCount++;
        let raznica = today - lastDay;
        let raznicaMonth = currentLogon.getMonth() - lastLogon.getMonth()
        if(raznica > 1){
            daysdDailyGift = 1;
            weeksDailyGift = 1;
        } else if (raznica == 1 || raznica < 0 && raznicaMonth == 1 && today == 1 || raznicaMonth == -11 && today == 1){
            daysdDailyGift++;
            raznica = 1;
        }
        if(raznica > 0){
            dailyGiftBonus = true;
            ID.offlineBonus.hidden = true;
            for(let i = 0; i < DailyGiftCreate; i++){
                ID["dailyGiftDaySkillCountID"+i].textContent = Number(DOM.Id("dailyGiftDaySkillCountID"+i).textContent)*weeksDailyGift;
            }
            ID.dailyGiftMenu.hidden = false;
            for(let i = 0; i < 7; i++){
                if(i+1 == daysdDailyGift){
                    ID["dailyGiftDayContID"+i].classList.add("backlight");
                } else if (i < daysdDailyGift){
                    ID["dailyGiftDayContID"+i].classList.add("disabled");
                }
            }
        }
    }
}

function claimDailyGift(){
    if(dailyGiftBonus){
    ID.offlineBonus.hidden = false;
    const keys = Object.keys(dailyGift["day"+daysdDailyGift]);
    for (let i = 0; i < keys.length; i++){
        for (let j = 0; j < skills.length; j++){
            if(skills[j].name == keys[i]){
                skills[j].count += dailyGift["day"+daysdDailyGift][keys[i]] * weeksDailyGift;
            }
        }
    }
    ID.dailyGiftMenu.hidden = true;
    ID.offlineBonusValue.textContent = "+" + toCompactNotation(offBonus);
    if(daysdDailyGift >=7){
        daysdDailyGift -= 7;
        weeksDailyGift++;
    }
    dailyGiftBonus = false;
    updateInfo();
    }
}   
function interectiveBonusCreate(){
    if(!interectiveBonusCreate.bool){
        const r = Math.floor(Math.random()*15)
        if(r == 0){
            interectiveBonusCreate.bool = true;
            interectiveBonusCreate.time = 30;
        DOM.Create({Parent: "ret", Id: "inerectiveBonusContID2", OnClick: function(){interectiveBonus()}})
        const id = DOM.Id("inerectiveBonusContID2");
        id.classList.add("highlight");
        id.style.transform = "rotate("+Math.floor(Math.random()*360)+"deg)";
        id.style.top = (Math.floor(Math.random()*94)+1)+"%";
        id.style.left = (Math.floor(Math.random()*94)+1)+"%";
        id.offsetHeight;
        id.style.opacity = "100%";
        id.style.scale = 1;
        DOM.Create({Parent: "inerectiveBonusContID2", Id: "inerectiveBonusID", Tag: "img", Src: imgCache.nugget.src})
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
 const rSkill = skills[Math.floor(Math.random()*skills.length)];
 const nugget = DOM.Id("inerectiveBonusContID2");
    let target;
    let notSkill;
 if(rSkill.value == 2 || rSkill.autoHit == true && autoHit <= 0){
    const other = Math.floor(Math.random()*10);
    if(other == 0){
        target = ID.menu;
        notSkill = "book";
    }else if(other == 1 || other == 2){
        target = ID.geodeConteiner;
        notSkill = "geode";
    }else{
        target = ID.coin;
        notSkill = "coin";
    }
 } else{
    target = ID[rSkill.name+"skillIMGID"];
 }
flightToTarget(nugget, target);
nugget.style.opacity = "30%";
nugget.addEventListener('transitionend', function opacity(e){
    if(notSkill){
        if(notSkill == "coin"){finance(Math.floor(money/10)+1);
        } else if (notSkill == "book"){expChanges(1);
        } else {geodeCount++}
    } else{
        rSkill.count += 1;
        skill(rSkill);
    }
    nugget.remove();
    interectiveBonusCreate.bool = false;
 }, {once: true})
}
function x2orX4 (){
    if (profitX2.value > 1 || gold_layer == 0){
        ID.prize.classList.add("strike");
        const factor = profitX2.value * (gold_layer == 0 ? 2 : 1);
        ID.lucky.textContent = "X"+factor;
        ID.prize2.textContent = toCompactNotation(prize.profitC * factor);
    }else{
        ID.prize.classList.remove("strike");
        ID.lucky.textContent = "";
        ID.prize2.textContent = "";
    }
}
function skillsUpdate(){
        for(let i = 0; i < skills.length; i++){
            if(skills[i].value == 2){
                ID[skills[i].name+"skillID"].classList.add("backlight");
                ID[skills[i].name+"skillTimeID"].classList.add("timer");
            }
            ID[skills[i].name+"skillCountID"].textContent = skills[i].count;
        }
}
function updateInfo(){
    console.time('update');
    if(HTMLLoaded){
        const geodeBool = geodeCount > 0;
        ID.geodeValue.textContent = geodeCount;
        ID.geodeRerolBtn.hidden = geodeBool;
        ID.geodeIMG.classList.toggle('geode-glow', geodeBool); 
        ID.geodeIMG.classList.toggle('grayScale', !geodeBool); 
        ID.prize.textContent = toCompactNotation(prize.profitC);
        ID.depthLevel.textContent = layer.level;
        autoHit = 0;
        ID.hit.textContent = handHit;
        ID.autoHitInfo.textContent = Math.round(autoHit*100)/100 + " hp/s";
        ID.hp.textContent = Math.floor(layer.hp.current);
        ID.rebootExpCost.textContent = expCalc();
    }
    console.timeEnd('update'); // ~1-3ms
}