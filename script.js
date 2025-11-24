var ratio = 1.3;
var hit = 1;
var counter = 0;
var money = 0;
var exp = 10000;
//C-Current(текущий) R-Ratio(коэффициент)
var layer = {hp: 4, hpC: 4, hpR: ratio, hardness: 1, level: 0};
var prize = {profit: 1, profitC: 1, upCost: 10, upLevel: 0, upRatio: ratio};
var hitPlusOne = {cost: 1, costC: 1, level: 0};
var hitPlusTen = {cost: 100, level: 0};
var hpMinusOnePercent = {cost: 10, level: 0};

var costOfPumpCost = 10;
var costOfPumpLevel = 0;
var costOfPumpRatioDown = 1;
var costOfPumpRatio = ratio * costOfPumpRatioDown;

var bossLevel = 1;
var bossLevelRatio = 10;

var autoHitCost = 10;
var autoHitSecond = 0;
var autoHitLevel = 0;

var costOfPump = [1, 1, 1];

setInterval(autoHit , (1000));

function moneyChanges(m){
    colorNumders("moneyID", m < 0 ? "red" : "green");
    money += m;
    document.getElementById("moneyID").innerHTML = money;
    var disIDs = ["hitPlusOneID", "hitPlusTenID", "costOfPumpID", "autoHitID"];    //ID которые надо включать и выключать в соответствии с количествой денег
    var disVar = [hitPlusOne.costC, hitPlusTen.cost, costOfPumpCost, autoHitCost];       // переменные по которым отслеживать включение и выключение
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
    // console.log(100/layer.hp *layer.hpC);
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

function hitPlusOneUp(hitPlus) {
    if (money >= hitPlusTen.cost && hitPlus > 1){
        moneyChanges(-Math.floor(hitPlusTen.cost));
        hit += hitPlus;
        hitPlusTen.level++;
        hitPlusTen.cost *= costOfPumpRatio;
        colorNumders("hitPlusTenCostID", "red");
        colorNumders("hitPlusTenLevelID", "green");
    } else if (money >= hitPlusOne.costC) {
        moneyChanges(-Math.floor(hitPlusOne.costC));
        hit += hitPlus;
        hitPlusOne.level++;
        hitPlusOne.cost *= costOfPumpRatio;
        if (Math.round(hitPlusOne.cost) <= hitPlusOne.costC){
            hitPlusOne.costC++;
            console.log("true");
        } else {
            hitPlusOne.costC = Math.round(hitPlusOne.cost);
            console.log("false");
        }
        let lengthCost = hitPlusOne.costC.toString().length;
        lengthCost = 10**(lengthCost - 1);
        if (hitPlusOne.costC/lengthCost >= 3){
            hitPlusOne.costC = Math.round(hitPlusOne.costC/lengthCost)*lengthCost;
        } else if (hitPlusOne.costC/Math.sqrt(lengthCost) >= 3 && lengthCost > 10){
            hitPlusOne.costC = Math.round(hitPlusOne.costC/Math.sqrt((lengthCost)))*Math.sqrt(lengthCost);
        }

        

        colorNumders("hitPlusOneCostID", "red");
        colorNumders("hitPlusOneLevelID", "green");
    }
    document.getElementById("hitPlusTenLevelID").innerHTML = hitPlusTen.level;
    document.getElementById("hitPlusOneLevelID").innerHTML = hitPlusOne.level;
    updateInfo();
    console.log(hitPlusOne.cost + " Cost");
    console.log(hitPlusOne.costC + " CostC");
    console.log(money + " money");
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
        autoHitCost *= costOfPumpRatioDown;
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
    document.getElementById("layerProfitID").innerHTML = Math.floor(prize.profit * 100) + "%";
    document.getElementById("hitPlusOneCostID").innerHTML = hitPlusOne.costC;
    document.getElementById("hitPlusTenCostID").innerHTML = Math.floor(hitPlusTen.cost);
    document.getElementById("hpMinusOnePercentCostID").innerHTML = Math.floor(hpMinusOnePercent.cost);
    document.getElementById("profitUpCostID").innerHTML = Math.floor(prize.upCost);
    document.getElementById("costOfPumpCostID").innerHTML = Math.floor(costOfPumpCost);
    document.getElementById("autoHitCostID").innerHTML = Math.floor(autoHitCost);
    document.getElementById("counterID").innerHTML = counter;
    document.getElementById("expID").innerHTML = exp;
    document.getElementById("hitID").innerHTML = hit;
    document.getElementById("hpID").innerHTML = Math.floor(layer.hpC);

}
