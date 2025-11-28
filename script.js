var ratio = 1.1;
var hit = 1;
var autoHitSecond = 0;
var counter = 0;
var money = 0;
var moneyExp = 0.0001;
var exp = 0;
var doubleMoney = 1;


//C-Current(текущий) R-Ratio(коэффициент)
var layer = {hp: 4, hpC: 4, hpR: ratio, hardness: 1, level: 0, expBonus: 0.1};
var prize = {profit: 1, profitC: 1, upCost: 10, upLevel: 0, upRatio: ratio};
var hitPlusOne = {cost: 1, costC: 1, level: 0, expBonus: 0.1};
var hitPlusTen = {cost: 100, costC: 100, level: 0, expBonus: 0.2};
var profitPlusOne = {cost: 10, costC: 10, level: 0, expBonus: 0.1};
var autoHitOne = {cost: 10, costC: 10, level: 0, expBonus: 0.2};
var autoHitTen = {cost: 1000, costC: 1000, level: 0, expBonus: 0.3};
var autoHitOneHundred = {cost: 10000, costC: 10000, level: 0, expBonus: 0.4};

var hpMinusOnePercent = {cost: 10, level: 0};

// var costOfPump = {cost: 10, costC: 10,  };
var costOfPumpCost = 10;
var costOfPumpLevel = 0;
var costOfPumpRatioDown = 1;
var costOfPumpRatio = ratio * costOfPumpRatioDown;

var bossLevel = 1;
var bossLevelRatio = 10;

var costOfPump = [1, 1, 1];

var disIDs = ["hitPlusOneID"];    //ID которые надо включать и выключать в соответствии с количествой денег
var disVar = [hitPlusOne];       // переменные по которым отслеживать включение и выключение

setInterval(autoHit , (1000));
moneyChanges(0)


function moneyChanges(m){
    // console.log(m + " - Денег"); //Количество денег на трату
    colorNumders("moneyID", m < 0 ? "red" : "green");
    money += m;
    document.getElementById("moneyID").innerHTML = toCompactNotation(money);
    updateInfo();
}

function onOffBtn(){
    for (let i = 0; i<disVar.length; i++){
        let disBtn = document.getElementById(disIDs[i]);
        money >= disVar[i].costC ? disBtn.removeAttribute("disabled") : disBtn.disabled="disabled";
    }
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
    hit = 1;
    autoHitSecond = 0;
    layer.level = 0;
    hitPlusOne.level = 0;
    hitPlusOne.cost = 1;
    hitPlusOne.costC = 1;
    profitPlusOne.level = 0;
    profitPlusOne.cost = 10;
    profitPlusOne.costC = 10;
    autoHitOne.level = 0;
    autoHitOne.cost = 10;
    autoHitOne.costC = 10;
    hitPlusTen.level = 0;
    hitPlusTen.cost = 100;
    hitPlusTen.costC = 100;
    autoHitTen.level = 0;
    autoHitTen.cost = 1000; 
    autoHitTen.costC = 1000;
    autoHitOneHundred.level = 0;
    autoHitOneHundred.cost = 10000;
    autoHitOneHundred.costC = 10000;
    disIDs = ["hitPlusOneID"];    //ID которые надо включать и выключать в соответствии с количествой денег
    disVar = [hitPlusOne];
    document.getElementById("profitPlusOneID2").classList.add("disabled");
    document.getElementById("profitPlusOneID").disabled = "disabled";
    document.getElementById("autoHitID2").classList.add("disabled");
    document.getElementById("autoHitID").disabled = "disabled";
    document.getElementById("hitPlusTenID2").classList.add("disabled");
    document.getElementById("hitPlusTenID").disabled = "disabled";
    document.getElementById("autoHitTenID2").classList.add("disabled");
    document.getElementById("autoHitTenID").disabled = "disabled";
    document.getElementById("autoHitOneHundredID2").classList.add("disabled");
    document.getElementById("autoHitOneHundredID").disabled = "disabled";
    moneyChanges(0);
    updateInfo;
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
        moneyChanges(Math.floor(prize.profitC * doubleMoney));
        layer.hpC = layer.hp *= layer.hpR;
        prize.profit *= prize.upRatio;
        prize.profitC = Math.round(prize.profit) <= prize.profitC ? requiredUp(prize.profit, prize.profitC) : Math.round(prize.profit);
        // console.log(prize.profitC + "  prize.profitC");
        prize.profitC = toRoundoff(prize.profitC);
        layer.level++;
        // let lycky = document.getElementById("luckyID");
        // Math.floor(Math.random() * 5) < 2 ? (doubleMoney = 2, lycky.innerHTML = "Удача!! х2 ") : (doubleMoney = 1, lycky.innerHTML= " ");
        if (bossLevel == layer.level){  
            bossLevel += bossLevelRatio;
            bossLevelBonus();
        }
        document.getElementById("hpBarID").style.width = "100%";
        if (layer.level == 150){
            document.getElementById("autoHitOneHundredID2").classList.remove("disabled");
            document.getElementById("autoHitOneHundredID").removeAttribute("disabled");
            disIDs.push("autoHitOneHundredID");
            disVar.push(autoHitOneHundred);
        } else if (layer.level == 100){
            document.getElementById("autoHitTenID2").classList.remove("disabled");
            document.getElementById("autoHitTenID").removeAttribute("disabled");
            disIDs.push("autoHitTenID");
            disVar.push(autoHitTen);
        } else if (layer.level == 50){
            document.getElementById("hitPlusTenID2").classList.remove("disabled");
            document.getElementById("hitPlusTenID").removeAttribute("disabled");
            disIDs.push("hitPlusTenID");
            disVar.push(hitPlusTen);
        } else if (layer.level == 25){ 
            document.getElementById("autoHitID2").classList.remove("disabled");
            document.getElementById("autoHitID").removeAttribute("disabled");
            disIDs.push("autoHitID");
            disVar.push(autoHitOne);
        } else if (layer.level == 10){ 
            document.getElementById("profitPlusOneID2").classList.remove("disabled");
            document.getElementById("profitPlusOneID").removeAttribute("disabled");
            disIDs.push("profitPlusOneID");
            disVar.push(profitPlusOne);
        }
        updateInfo();
    }
}

function requiredUp(original, result){
    // console.log(original + (original*1.1) + " original");
    // console.log(result + " result");
    if (Math.round(original + (original*1.1)) <= result){
        result++;
        // console.log("result++");
    } else{
        result = Math.round(original + (original*1.1));
        // console.log("Math.round");
    }
    // console.log(result);
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
        colorNumders("profitPlusOneCostID", "red");
        colorNumders("profitPlusOneID", "green");
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
        colorNumders("hitPlusTenCostID", "red");
        colorNumders("hitPlusTenLevelID", "green");
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
        colorNumders("hitPlusOneCostID", "red");
        colorNumders("hitPlusOneLevelID", "green");
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
        colorNumders("autoHitOneHundredCostID", "red");
        colorNumders("autoHitOneHundredLevelID", "green");
    } else if (money >= autoHitTen.costC && autoHitUp > 1){
        moneyChanges(-Math.floor(autoHitTen.costC));
        autoHitTen.level++;
        autoHitSecond += autoHitUp;
        autoHitTen.cost *= costOfPumpRatio;
        autoHitTen.costC = toRoundoff(autoHitTen.cost);
        colorNumders("autoHitTenCostID", "red");
        colorNumders("autoHitTenLevelID", "green");
    }
    else if (money >= autoHitOne.costC){
        moneyChanges(-Math.floor(autoHitOne.costC));
        autoHitOne.level++;
        autoHitSecond++;
        autoHitOne.cost *= costOfPumpRatio;
        autoHitOne.costC = toRoundoff(autoHitOne.cost);
        colorNumders("autoHitCostID", "red");
        colorNumders("autoHitLevelID", "green");
    }
    updateInfo();
}

function bossLevelBonus(){
    for (var i = 0; i < 3; i++){
        var moneyBonus = 0;
        // console.log(disVar.length);
        for (var j = 0; j < disVar.length; j++){
             moneyBonus += disVar[j].costC;
        }
        moneyBonus = toRoundoff(Math.floor(Math.random()*(moneyBonus / disVar.length))+1);
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

    document.getElementById("profitPlusOneCostID").innerHTML = toCompactNotation(profitPlusOne.costC);
    document.getElementById("profitPlusOneLevelID").innerHTML = profitPlusOne.level;
    
    document.getElementById("hitPlusOneCostID").innerHTML = toCompactNotation(hitPlusOne.costC);
    document.getElementById("hitPlusOneLevelID").innerHTML = hitPlusOne.level;

    document.getElementById("hitPlusTenCostID").innerHTML = toCompactNotation(hitPlusTen.costC);
    document.getElementById("hitPlusTenLevelID").innerHTML = hitPlusTen.level;

    document.getElementById("autoHitOneHundredCostID").innerHTML = toCompactNotation(autoHitOneHundred.costC);
    document.getElementById("autoHitOneHundredLevelID").innerHTML = autoHitOneHundred.level;

    document.getElementById("autoHitCostID").innerHTML = toCompactNotation(autoHitOne.costC);
    document.getElementById("autoHitLevelID").innerHTML = autoHitOne.level; 

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
