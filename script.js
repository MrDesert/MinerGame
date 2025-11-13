var hit = 1;
var hp = 4;
var hpCurrent = hp;
var money = 10000;
var profit = 1;
var profitCurrent = profit;
var hitPlusOneCost = 1;
var hpMinusOnePercentCost = 1;
var depthLevel = 0;
var profitUpCost = 1;
var profitRatio = 2;
var costOfPumpCost = 1;
var costOfPumpRatio = 2;
var counter = 0;
var bossLevel = 1;
var bossLevelRatio = 10;

function moneyChanges(m){
    money += m;
    document.getElementById("moneyID").innerHTML = money;
    var disabledIDs = ["hitPlusOneID", "hpMinusOnePercentID", "profitUpID", "costOfPumpID"];    //ID которые надо включать и выключать в соответствии с количествой денег
    var disabled = [hitPlusOneCost, hpMinusOnePercentCost, profitUpCost, costOfPumpCost];       // переменные по которым отслеживать включение и выключение
    for (let i = 0; i<disabled.length; i++){
        if (money >= disabled[i]){
            document.getElementById(disabledIDs[i]).removeAttribute("disabled");
        } else {
            document.getElementById(disabledIDs[i]).disabled="disabled";
        }
    }
}

function hit_hp() {
    hpCurrent -= hit;
    counter++;
    if (hpCurrent <= 0){
        moneyChanges(Math.floor(profitCurrent));
        hp *= 2;
        profit *= profitRatio;
        profitCurrent = profit; 
        hpCurrent = hp;
        depthLevel++;
        var test = Math.floor(Math.random() * 4);
        console.log(test);
        if(test < 2){
            profitCurrent *= 2;
            document.getElementById("luckyID").innerHTML = "Удача!! х2 "
        } else {
            document.getElementById("luckyID").innerHTML = " "
        }
        if (bossLevel == depthLevel){
            bossLevel += bossLevelRatio;
            bossLevelBonus();
        }
    }
    updateInfo();
}

function hitPlusOne() {
    if (money >= hitPlusOneCost){
        moneyChanges(-Math.floor(hitPlusOneCost));
        hit++;
        hitPlusOneCost *= costOfPumpRatio;
        updateInfo();
    }
}

function hpMinusOnePercent(){
    if (money >= hpMinusOnePercentCost){
        moneyChanges(-Math.floor(hpMinusOnePercentCost));
        hp = hp*0.99;
        hpCurrent *= 0.99; 
        hpMinusOnePercentCost *= costOfPumpRatio;
        updateInfo();
    }
}

function profitUp(){
    if (money >= profitUpCost){
        moneyChanges(-Math.floor(profitUpCost));
        profitRatio = profitRatio*1.01;
        profit *= 1.01;
        profitUpCost *= costOfPumpRatio;
        updateInfo();
    }
} 

function costOfPump(){
    if (money >= costOfPumpCost){
        moneyChanges(-Math.floor(costOfPumpCost));
        costOfPumpRatio = costOfPumpRatio*0.99;
        costOfPumpCost *= costOfPumpRatio;
        profitUpCost *= 0.99;
        hpMinusOnePercentCost *= 0.99;
        hitPlusOneCost *= 0.99;
        updateInfo();
    }
}

function bossLevelBonus(){
    for (var i = 0; i < 3; i++){
        var moneyBonus = Math.floor(Math.random()*((hitPlusOneCost + hpMinusOnePercentCost + profitUpCost + costOfPumpCost) / 1.5));
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
    document.getElementById("counterID").innerHTML = counter;
}