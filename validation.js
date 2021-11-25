

module.exports = function validation(number1 , number2) {
  if(isNaN(number1) == false && isNaN(number2) == false){
    let convertedNumber1 = parseInt(number1)
    let convertedNumber2 = parseInt(number2)
    if(typeof(convertedNumber1) === 'number' && typeof(convertedNumber2) === 'number'){
      return true
    }
    else{
      return false
    }    
  }
  else{
    false;
  }

};