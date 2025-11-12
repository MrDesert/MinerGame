var hit = 1;
var hp = 4;
var hpCurrent = hp;
var money = 0;
var profit = 1;
var hitPlusOneCost = 1;
var hpMinusOnePercentCost = 1;
var depthLevel = 0;
var profitUpCost = 1;
var profitRatio = 2;

function moneyChanges(m){
    money += m;
    document.getElementById("moneyID").innerHTML = money;
    if (money >= hitPlusOneCost){
        document.getElementById("hitPlusOneID").removeAttribute("disabled");
    } else {
        document.getElementById("hitPlusOneID").disabled="disabled";
    }
    if (money >= hpMinusOnePercentCost){
        document.getElementById("hpMinusOnePercentID").removeAttribute("disabled");
    } else {
        document.getElementById("hpMinusOnePercentID").disabled="disabled";
    }
    if (money >= profitUpCost){
        document.getElementById("profitUpID").removeAttribute("disabled");
    } else {
        document.getElementById("profitUpID").disabled="disabled";
    }
}

function hit_hp() {
    hpCurrent -= hit;
    if (hpCurrent <= 0){
        moneyChanges(Math.floor(profit));
        hp *= 2;
        profit *= profitRatio; 
        hpCurrent = hp;
        depthLevel++;
        document.getElementById("profitID").innerHTML = Math.floor(profit);
        document.getElementById("depthLevelID").innerHTML = depthLevel;
    }
    document.getElementById("hpID").innerHTML = Math.floor(hpCurrent);
}

function hitPlusOne() {
    if (money >= hitPlusOneCost){
        moneyChanges(-hitPlusOneCost);
        hit++;
        hitPlusOneCost *= 2;
        document.getElementById("hitPlusOneCostID").innerHTML = hitPlusOneCost;
        document.getElementById("hitID").innerHTML = "Удар " + hit; 
    }
}

function hpMinusOnePercent(){
    if (money >= hpMinusOnePercentCost){
        moneyChanges(-hpMinusOnePercentCost);
        hp = hp*0.99;
        hpCurrent *= 0.99; 
        hpMinusOnePercentCost *= 2;
        document.getElementById("hpMinusOnePercentCostID").innerHTML = hpMinusOnePercentCost;
        document.getElementById("hpID").innerHTML = Math.floor(hpCurrent);
    }
}

function profitUp(){
    if (money >= profitUpCost){
        moneyChanges(-profitUpCost);
        profitRatio = profitRatio*1.01;
        profit *= 1.01;
        profitUpCost *= 2;
        document.getElementById("profitUpCostID").innerHTML = profitUpCost;
        document.getElementById("profitID").innerHTML = Math.floor(profit);
    }
}