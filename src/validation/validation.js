const validate = function (a) {
  if (a.match(/^([a-z A-Z]){2,50}$/)) return true;
};

const validateTitle = function (a) {
  if (a.match(/^([a-z A-Z\d]){2,50}$/)) return true;
};

const validateEmail = function (a) {
  if (a.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) return true;
};

const validatePassword = function (a) {
  if (a.match(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/)) return true;
};

module.exports = { validate, validateTitle, validateEmail, validatePassword };
