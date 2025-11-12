var hit = 1;
var hp = 5;
var hpCurrent = hp;
var money = 0;

function hit_hp() {
    hpCurrent -= hit;
    document.getElementById("hpID").innerHTML = hpCurrent;
    if (hpCurrent <= 0){
        money++;
        document.getElementById("moneyID").innerHTML = money;
        hpCurrent = hp;
    }
}