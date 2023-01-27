const validate = function(a){
if(a.match (/^([a-z A-Z]){2,50}$/)) return true
}

const validateTitle = function(a){
if(a.match (/^([a-z A-Z\d]){2,50}$/)) return true
}
// const validateObjectId = function(a){
//     if(a.match(/^[a-f\d]{24}$/i)) return true;
// }

const validateISBN= function(a){
    if(a.match(/^.*(?=.{10,13})(?=.*\d).*/)) return true
}

const validateEmail = function(a){
    if(a.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) return true
}

const validatePassword = function(a){
    if(a.match(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/)) return true
}

const validatePhone = function(a){
    if(a.match(/^[6-9][0-9]{9}$/)) return true
}


module.exports={validate,validateTitle,validateISBN,validateEmail,validatePassword,validatePhone}