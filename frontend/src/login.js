var host = "http://"+window.location.host+"/"

async function login(){

  let username = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;

  const response = await fetch(host+"auth/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          username: username,
          password: password
      })
  })

  const result = await response.json()

  if(result.code != 200){
      setMessage(result);
  } else {
      document.cookie = "token=" + result.session_token + ";expires=" + new Date(result.expireTime).toUTCString() + ";";
      location.href = "/";
  }
}

async function register(){

  let username = document.getElementById("registerUsername").value;
  let password = document.getElementById("registerPassword").value;

  const response = await fetch(host+"auth/register", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          username: username,
          password: password
      })
  })

  const result = await response.json();
  setMessage(result)
}

async function setMessage(result){
  const message = document.getElementsByClassName("message")[0];
  message.innerHTML = result.message;
  if(result.code == 200) message.style.color = "black";
  else message.style.color = "red";
}


// Cookie Functions
function get_cookie(name){
  return document.cookie.split(';').some(c => {
      return c.trim().startsWith(name + '=');
  });
}

function delete_cookie( name, path, domain ) {
  if( get_cookie( name ) ) {
    document.cookie = name + "=" +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

function showRegister(value){
  var loginDiv = document.getElementById("login");
  var registerDiv = document.getElementById("register");
  if (value == 1) {
      loginDiv.style.display = "none"
      registerDiv.style.display = "block"
      document.getElementsByClassName("login-header")[0].innerHTML = "File Master - Register"
  } else {
      loginDiv.style.display = "block"
      registerDiv.style.display = "none"
      document.getElementsByClassName("login-header")[0].innerHTML = "File Master - Login"
  }
}

if(document.cookie.includes("token")){
  location.href = "/";
}

var loginForm = document.getElementById("loginForm");
var registerForm = document.getElementById("registerForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  try{
      login();
  } catch (err) {
      console.log(err)
  }
})

registerForm.addEventListener("submit", e => {
  e.preventDefault();
  
  try{
      register();
  } catch (err){
      console.log(err)
  }
})