var hit = 1;
var hp = 5;

function hit_hp() {
    hp -= hit;
    document.getElementById("hpID").innerHTML = hp;
}