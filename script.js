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
    var disabledIDs = ["hitPlusOneID", "hpMinusOnePercentID", "profitUpID"];    //ID которые надо включать и выключать в соответствии с количествой денег
    var disabled = [hitPlusOneCost, hpMinusOnePercentCost, profitUpCost];       // переменные по которым отслеживать включение и выключение
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
    if (hpCurrent <= 0){
        moneyChanges(Math.floor(profit));
        hp *= 2;
        profit *= profitRatio; 
        hpCurrent = hp;
        depthLevel++;
    }
    updateInfo();
}

function hitPlusOne() {
    if (money >= hitPlusOneCost){
        moneyChanges(-hitPlusOneCost);
        hit++;
        hitPlusOneCost *= 2;
        updateInfo();
    }
}

function hpMinusOnePercent(){
    if (money >= hpMinusOnePercentCost){
        moneyChanges(-hpMinusOnePercentCost);
        hp = hp*0.99;
        hpCurrent *= 0.99; 
        hpMinusOnePercentCost *= 2;
        updateInfo();
    }
}

function profitUp(){
    if (money >= profitUpCost){
        moneyChanges(-profitUpCost);
        profitRatio = profitRatio*1.01;
        profit *= 1.01;
        profitUpCost *= 2;
        updateInfo();
    }
} 

function updateInfo(){
    document.getElementById("profitID").innerHTML = Math.floor(profit);
    document.getElementById("depthLevelID").innerHTML = depthLevel;
    document.getElementById("hpID").innerHTML = Math.floor(hpCurrent);
    document.getElementById("hitPlusOneCostID").innerHTML = hitPlusOneCost;
    document.getElementById("hitID").innerHTML = "Удар " + hit; 
    document.getElementById("hpMinusOnePercentCostID").innerHTML = hpMinusOnePercentCost;
    document.getElementById("profitUpCostID").innerHTML = profitUpCost;
}