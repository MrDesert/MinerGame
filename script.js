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
var costOfPumpCost = 1;
var costOfPumpRatio = 2;
var counter = 0;

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

function updateInfo(){
    document.getElementById("profitID").innerHTML = Math.floor(profit);
    document.getElementById("depthLevelID").innerHTML = depthLevel;
    document.getElementById("hpID").innerHTML = Math.floor(hpCurrent);
    document.getElementById("hitPlusOneCostID").innerHTML = Math.floor(hitPlusOneCost);
    document.getElementById("hitID").innerHTML = "Удар " + hit; 
    document.getElementById("hpMinusOnePercentCostID").innerHTML = Math.floor(hpMinusOnePercentCost);
    document.getElementById("profitUpCostID").innerHTML = Math.floor(profitUpCost);
    document.getElementById("costOfPumpCostID").innerHTML = Math.floor(costOfPumpCost);
    document.getElementById("counterID").innerHTML = counter;
}