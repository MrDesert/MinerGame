var ratio = 1.3;
var hit = 1;
var counter = 0;
var money = 0;
var exp = 10000;
//C-Current(текущий) R-Ratio(коэффициент)
var layer = {hp: 4, hpC: 4, hpR: ratio, hardness: 1, level: 0};
var prize = {profit: 1, profitC: 1, upCost: 1, upLevel: 0, upRatio: ratio};
var hitPlusOne = {cost: 1, level: 0};
var hpMinusOnePercent = {cost: 10, level: 0};

var costOfPumpCost = 1;
var costOfPumpLevel = 0;
var costOfPumpRatio = ratio;

var bossLevel = 1;
var bossLevelRatio = 10;

var autoHitCost = 100;
var autoHitSecond = 0;
var autoHitLevel = 0;

var costOfPump = [1, 1, 1];

setInterval(autoHit , (1000));

function moneyChanges(m){
    colorNumders("moneyID", m < 0 ? "red" : "green");
    money += m;
    document.getElementById("moneyID").innerHTML = money;
    var disIDs = ["hitPlusOneID", "hpMinusOnePercentID", "profitUpID", "costOfPumpID", "autoHitID"];    //ID которые надо включать и выключать в соответствии с количествой денег
    var disVar = [hitPlusOne.cost, hpMinusOnePercent.cost, prize.upCost, costOfPumpCost, autoHitCost];       // переменные по которым отслеживать включение и выключение
    for (let i = 0; i<disVar.length; i++){
        let disBtn = document.getElementById(disIDs[i]);
        money >= disVar[i] ? disBtn.removeAttribute("disabled") : disBtn.disabled="disabled";
    }
    updateInfo();
}
function expChanges(e){
    exp += e;
}

function colorNumders(id, color){
    document.getElementById(id).style.color = color;
    document.getElementById(id).style.filter = "blur(0.3px)"
    setTimeout(function(){
        document.getElementById(id).style.color = "black"
        document.getElementById(id).style.filter = "none"
    }, (400));
}

function hit_hp() {
    layer.hpC -= hit;
    counter++;
    document.getElementById("hpBarID").style.width = 100/layer.hp *layer.hpC + "%";
    console.log(100/layer.hp *layer.hpC);
    finishLevel();
    updateInfo();
}

function autoHit(){
    layer.hpC -= autoHitSecond;
    document.getElementById("hpBarID").style.width = 100/layer.hp *layer.hpC + "%";
    finishLevel();
    updateInfo();
}

function finishLevel(){
    if (layer.hpC <= 0){
        moneyChanges(Math.floor(prize.profitC));
        layer.hpC = layer.hp *= layer.hpR;
        prize.profitC = prize.profit *= prize.upRatio;
        layer.level++;
        let lycky = document.getElementById("luckyID");
        Math.floor(Math.random() * 5) < 2 ? (prize.profitC *= 2, lycky.innerHTML = "Удача!! х2 ") : lycky.innerHTML= " ";
        if (bossLevel == layer.level){
            bossLevel += bossLevelRatio;
            bossLevelBonus();
        }
        document.getElementById("hpBarID").style.width = "100%";
        updateInfo();
    }
}

function hitPlusOneUp() {
    if (money >= hitPlusOne.cost){
        moneyChanges(-Math.floor(hitPlusOne.cost));
        hit++;
        hitPlusOne.level++;
        hitPlusOne.cost *= costOfPumpRatio;
        colorNumders("hitPlusOneCostID", "red");
        colorNumders("hitPlusOneLevelID", "green");
        document.getElementById("hitPlusOneLevelID").innerHTML = hitPlusOne.level;
        updateInfo();
    }
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
            document.getElementById("hardnessID").style.backgroundColor = "rgb(200, 80, 80)";
            document.getElementById("hardnessBtnID").style.backgroundColor = "rgb(129, 51, 51)";
            document.getElementById("hardnessBtnID").style.filter = "blur";
            document.getElementById("hardnessBtnID").disabled = "disabled";
        }

        hpMinusOnePercent.cost *= costOfPumpRatio;
        document.getElementById("hpMinusOnePercentLevelID").innerHTML = hpMinusOnePercent.level;
        updateInfo();
    }
}

function profitUp(){
    if (money >= prize.upCost){
        moneyChanges(-Math.floor(prize.upCost));
        prize.upLevel++;
        prize.upRatio = prize.upRatio*1.01;
        prize.profit *= 1.01;
        prize.upCost *= costOfPumpRatio;
        document.getElementById("profitUpLevelID").innerHTML = prize.upLevel;
        updateInfo();
    }
} 

function costOfPump1(){
    if (money >= costOfPumpCost){
        moneyChanges(-Math.floor(costOfPumpCost));
        costOfPumpLevel++;
        costOfPumpRatio = costOfPumpRatio - 0.01;
        if(costOfPumpRatio <= 1){
            document.getElementById("costOfPumpLevelID").disabled = "disabled";
        }
        costOfPumpCost *= (1 + costOfPumpRatio);
        prize.upCost *= 0.99;
        hpMinusOnePercent.cost *= 0.99;
        hitPlusOne.cost = hitPlusOne.cost/(costOfPumpRatio + 0.01) * costOfPumpRatio;
        autoHitCost *= 0.99;
        document.getElementById("costOfPumpLevelID").innerHTML = costOfPumpLevel;
        updateInfo();
    }
}

function autoHitUp(){
    if (money >= autoHitCost){
        moneyChanges(-Math.floor(autoHitCost));
        autoHitLevel++;
        autoHitSecond++;
        autoHitCost *= costOfPumpRatio;
        document.getElementById("autoHitLevelID").innerHTML = autoHitLevel;
        updateInfo();
    }
}

function bossLevelBonus(){
    for (var i = 0; i < 3; i++){
        var moneyBonus = Math.floor(Math.random()*((hitPlusOne.cost + hpMinusOnePercent.cost + prize.upCost + costOfPumpCost + autoHitCost) / 5));
        document.getElementById("bossLevelBonusID").append(
            Object.assign(document.createElement('button'), {className: "bossLevelBonusCls", id: "bossLevelBonusID" + i,  innerHTML: "Приз №" + i + " " + moneyBonus + " Монет!", value: moneyBonus, onclick: function(){bossLevelBonusBtn(this);}})
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
    document.getElementById("profitID").innerHTML = Math.floor(prize.profitC);
    document.getElementById("depthLevelID").innerHTML = layer.level;
    document.getElementById("layerHardnessID").innerHTML = Math.floor(layer.hardness * 100) + "%";
    document.getElementById("hitPlusOneCostID").innerHTML = Math.floor(hitPlusOne.cost);
    document.getElementById("hpMinusOnePercentCostID").innerHTML = Math.floor(hpMinusOnePercent.cost);
    document.getElementById("profitUpCostID").innerHTML = Math.floor(prize.upCost);
    document.getElementById("costOfPumpCostID").innerHTML = Math.floor(costOfPumpCost);
    document.getElementById("autoHitCostID").innerHTML = Math.floor(autoHitCost);
    document.getElementById("counterID").innerHTML = counter;
    document.getElementById("expID").innerHTML = exp;
}
