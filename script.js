var hit = 1;
var hp = 4;
var hpCurrent = hp;
var money = 0;
var profit = 1;
var hitPlusOneCost = 1;
var hpMinusOnePercentCost = 1;

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
}

function hit_hp() {
    hpCurrent -= hit;
    if (hpCurrent <= 0){
        moneyChanges(Math.floor(profit));
        hp *= 2;
        profit *= 1.5; 
        hpCurrent = hp;
    }
    document.getElementById("profitID").innerHTML = Math.floor(profit);
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
        hpMinusOnePercentCost *= 2;
        document.getElementById("hpMinusOnePercentCostID").innerHTML = hpMinusOnePercentCost;
        document.getElementById("hpID").innerHTML = Math.floor(hpCurrent);
    }
}