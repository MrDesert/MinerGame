var hit = 1;
var hp = 4;
var hpCurrent = hp;
var money = 0;
var profit = 1;
var hitPlusOneCost = 1;

function moneyChanges(m){
    money += m;
    document.getElementById("moneyID").innerHTML = money;
    if (money >= hitPlusOneCost){
        document.getElementById("hitPlusOneID").removeAttribute("disabled");
    } else {
        document.getElementById("hitPlusOneID").disabled="disabled";
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
    document.getElementById("hpID").innerHTML = hpCurrent;
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