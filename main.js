function toCompactNotation(number){
    let units = ['', 'k', 'M', 'B', 'T'];
    let alphabet = ['A', 'B', 'C'];
    var exponent = Math.floor(Math.log10(number)/3);
    let shortNumber = Math.floor(number/(10**(exponent*3))*10)/10 +  units[exponent];   
    return shortNumber;
}

function colorNumders(id, color){
    document.getElementById(id).style.color = color;
    document.getElementById(id).style.filter = "blur(0.3px)"
    setTimeout(function(){
        document.getElementById(id).style.color = "black"
        document.getElementById(id).style.filter = "none"
    }, (400));
}