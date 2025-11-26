function toCompactNotation(number){
    let units = ['', 'k', 'M', 'B', 'T'];
    let alphabet = ['A', 'B', 'C'];
    var exponent = Math.floor(Math.log10(number)/3);
    let shortNumber = 0;
    if (number != 0){ //Если приходит число 0, то и уходит 0, что бы небыло ошибки деления на ноль.
        shortNumber = Math.floor(number/(10**(exponent*3))*10)/10 +  units[exponent]; 
    }
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

function toRoundoff(number){
    number = Math.round(number);                                            //Само число, округление что бы не было дробей, только целые числа.
    let length = number.toString().length;                                  //Количество символов в числе.
    let magnitude = 10**(length - 1);                                       //Разряды. Приведение к числам кратным 10. Например 10, 100, 1000 и т.д. 
    let roundNumber = Math.round(number/(10**(length-2)))*(magnitude/10);   //Результат округлённое число, с двумя знаками дальше только нули.
    // Консоли для проверки;
    // console.log(number + " - Само число");
    // console.log(length + " - Количество символов в числе");
    // console.log(magnitude + " - Приведение к кратным числам");
    // console.log(number/magnitude + " - Число делим на разряды");
    return roundNumber;
}