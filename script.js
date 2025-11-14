var ratio = 1.3;
var hit = 1;
var hp = 4;
var hpCurrent = hp;
var hpRatio = ratio;
var money = 0;
var profit = 1;
var profitCurrent = profit;
var hitPlusOneCost = 1;
var hitPlusOneLevel = 0;
var hpMinusOnePercentCost = 1;
var hpMinusOnePercentLevel = 0;
var depthLevel = 0;
var profitUpCost = 1;
var profitUpLevel = 0;
var profitRatio = ratio;
var costOfPumpCost = 1;
var costOfPumpLevel = 0;
var costOfPumpRatio = ratio;
var counter = 0;
var bossLevel = 1;
var bossLevelRatio = 10;
var autoHitCost = 100;
var autoHitSecond = 0;
var autoHitLevel = 0;

setInterval(autoHit , (1000));

function moneyChanges(m){
    money += m;
    document.getElementById("moneyID").innerHTML = money;
    var disabledIDs = ["hitPlusOneID", "hpMinusOnePercentID", "profitUpID", "costOfPumpID", "autoHitID"];    //ID которые надо включать и выключать в соответствии с количествой денег
    var disabled = [hitPlusOneCost, hpMinusOnePercentCost, profitUpCost, costOfPumpCost, autoHitCost];       // переменные по которым отслеживать включение и выключение
    for (let i = 0; i<disabled.length; i++){
        let disBtn = document.getElementById(disabledIDs[i]);
        money >= disabled[i] ? disBtn.removeAttribute("disabled") : disBtn.disabled="disabled";
    }
    updateInfo();
}

function hit_hp() {
    hpCurrent -= hit;
    counter++;
    finishLevel();
    updateInfo();
}

function autoHit(){
    hpCurrent -= autoHitSecond;
    finishLevel();
    updateInfo();
}

function finishLevel(){
    if (hpCurrent <= 0){
        moneyChanges(Math.floor(profitCurrent));
        hpCurrent = hp *= hpRatio;
        profitCurrent = profit *= profitRatio;
        depthLevel++;
        let lycky = document.getElementById("luckyID");
        Math.floor(Math.random() * 5) < 2 ? (profitCurrent *= 2, lycky.innerHTML = "Удача!! х2 ") : lycky.innerHTML= " ";
        if (bossLevel == depthLevel){
            bossLevel += bossLevelRatio;
            bossLevelBonus();
        }
        updateInfo();
    }
}

function hitPlusOne() {
    if (money >= hitPlusOneCost){
        moneyChanges(-Math.floor(hitPlusOneCost));
        hit++;
        hitPlusOneLevel++;
        hitPlusOneCost *= costOfPumpRatio;
        document.getElementById("hitPlusOneLevelID").innerHTML = hitPlusOneLevel;
        updateInfo();
    }
}

function hpMinusOnePercent(){
    if (money >= hpMinusOnePercentCost){
        moneyChanges(-Math.floor(hpMinusOnePercentCost));
        hpMinusOnePercentLevel++;
        hp = hp*0.99;
        hpCurrent *= 0.99; 
        hpMinusOnePercentCost *= costOfPumpRatio;
        document.getElementById("hpMinusOnePercentLevelID").innerHTML = hpMinusOnePercentLevel;
        updateInfo();
    }
}

function profitUp(){
    if (money >= profitUpCost){
        moneyChanges(-Math.floor(profitUpCost));
        profitUpLevel++;
        profitRatio = profitRatio*1.01;
        profit *= 1.01;
        profitUpCost *= costOfPumpRatio;
        document.getElementById("profitUpLevelID").innerHTML = profitUpLevel;
        updateInfo();
    }
} 

function costOfPump(){
    if (money >= costOfPumpCost){
        moneyChanges(-Math.floor(costOfPumpCost));
        costOfPumpLevel++;
        costOfPumpRatio = costOfPumpRatio*0.99;
        costOfPumpCost *= costOfPumpRatio;
        profitUpCost *= 0.99;
        hpMinusOnePercentCost *= 0.99;
        hitPlusOneCost *= 0.99;
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
        var moneyBonus = Math.floor(Math.random()*((hitPlusOneCost + hpMinusOnePercentCost + profitUpCost + costOfPumpCost + autoHitCost) / 5));
        document.getElementById("bossLevelBonusID").append(
            Object.assign(document.createElement('button'), {className: "bossLevelBonusCls", id: "bossLevelBonusID" + i,  innerHTML: "Приз №" + i + " " + moneyBonus + " Монет!", value: moneyBonus, onclick: function(){bossLevelBonusBtn(this);}})
        )
    }
    document.getElementById("hitID").disabled = "disabled";
}

function bossLevelBonusBtn(bonus){
    moneyChanges(Math.floor(bonus.value));
    document.getElementById("hitID").removeAttribute("disabled");
    for (var i = 0; i < 3; i++){
        document.getElementById("bossLevelBonusID" + i).remove();
    }
}

function updateInfo(){
    document.getElementById("profitID").innerHTML = Math.floor(profitCurrent);
    document.getElementById("depthLevelID").innerHTML = depthLevel;
    document.getElementById("hpID").innerHTML = Math.floor(hpCurrent);
    document.getElementById("hitPlusOneCostID").innerHTML = Math.floor(hitPlusOneCost);
    document.getElementById("hitID").innerHTML = "Удар " + hit; 
    document.getElementById("hpMinusOnePercentCostID").innerHTML = Math.floor(hpMinusOnePercentCost);
    document.getElementById("profitUpCostID").innerHTML = Math.floor(profitUpCost);
    document.getElementById("costOfPumpCostID").innerHTML = Math.floor(costOfPumpCost);
    document.getElementById("autoHitCostID").innerHTML = Math.floor(autoHitCost);
    document.getElementById("counterID").innerHTML = counter;
}