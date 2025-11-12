var hit = 1;
var hp = 4;
var hpCurrent = hp;
var money = 0;
var profit = 1;
var hitPlusOneCost = 1;

function hit_hp() {
    hpCurrent -= hit;
    if (hpCurrent <= 0){
        money += Math.floor(profit);
        document.getElementById("moneyID").innerHTML = money;
        hp *= 2;
        profit *= 1.5; 
        hpCurrent = hp;
    }
    document.getElementById("profitID").innerHTML = Math.floor(profit);
    document.getElementById("hpID").innerHTML = hpCurrent;
}

function hitPlusOne() {
    if (money >= hitPlusOneCost){
        money -= hitPlusOneCost;
        hit++;
        hitPlusOneCost *= 2;
        document.getElementById("moneyID").innerHTML = money;
        document.getElementById("hitPlusOneCostID").innerHTML = hitPlusOneCost; 
    }
}