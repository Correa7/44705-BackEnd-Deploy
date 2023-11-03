const dir = window.location.href;
const paramsString = dir.split("?")[1];
const paramsArray = paramsString.split("&");
const params = {};
paramsArray.forEach(param => {
    const [key, value] = param.split("=");
    params[key] = value;
    });

let token = params.token;
document.getElementById('token').value = token

 
