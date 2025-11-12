var hit = 1;
var hp = 5;
var hpCurrent = hp;
var money = 0;
var profit = 1;

function hit_hp() {
    hpCurrent -= hit;
    if (hpCurrent <= 0){
        money += Math.floor(profit);
        document.getElementById("moneyID").innerHTML = money;
        hp *= 2;
        profit *= 1.5; 
        hpCurrent = hp;
    }
    document.getElementById("hpID").innerHTML = hpCurrent;
}