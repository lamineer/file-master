var host = "http://localhost/"
var fileList = []
    order = 1;

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

    if(result.error){
        document.getElementsByClassName("login-message")[0].innerHTML = result.error;
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
    console.log(result)
    const message = document.getElementsByClassName("register-message")[0]
    message.innerHTML = result.message;
    if(result.code == 200) message.style.color = "black"
    else message.style.color = "red"

}

async function logout(){
    const response = await fetch(host+"auth/logout", {
        method: "GET"
    })

    const result = await response.json()

    if(result.error){
        console.log(result.error)
    } else {
        delete_cookie("token");
        location.href = "/login.html";
    }
}

async function deleteFile(id){
    const response = await fetch(host+"api/deletefile/"+id, {
        method: "DELETE"
    })

    const result = await response;
    if(result){
        generateTable()
    }

    return result
}

function delete_cookie( name, path, domain ) {
    if( get_cookie( name ) ) {
      document.cookie = name + "=" +
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

function downloadFile(id){
    window.open(host+"/api/file/"+id, "_blank")
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

function get_cookie(name){
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
    });
}

async function getFiles(){
    const response = await fetch("http://localhost/api/files")

    const results = await response.json()

    if(results.code == 401){
        delete_cookie("token");
        location.href = "/login.html";
    }
    return results
}

async function generateTable(){
    if(!fileList.length) fileList = await getFiles();

    var tableBody = document.getElementById("file-list-body")
    tableBody.innerHTML = ""
    for(var file of fileList){
        var date = new Date(file.uploadTime)
        tableBody.innerHTML += `
        <tr>
            <td>${file.id}</td>
            <td>${file.fileName}</td>
            <td>${file.fileType}</td>
            <td>${file.fileSize}</td>
            <td>${date.toGMTString()}</td>
            <td><button class="custom-button" onClick="downloadFile(${file.id})">Download</button><span class="spacer"></span><button class="custom-button" onClick="deleteFile(${file.id})">Delete</button></td>
        </tr>
        `
    }
}

function sortTable(column){
    fileList = fileList.sort((file1, file2) => {
        if(file1[column] < file2[column]) return -1 * order;
        if(file1[column] > file2[column]) return 1 * order;
        return 0
    })
    order = -order
    generateTable()
}

async function uploadFile(){

    var uploadForm = document.getElementById("file-upload")
    var file = document.getElementById("file")
    
    const formData = new FormData();
    formData.append('file', file.files[0]);

    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const response = await fetch(host+"api/uploadfile", {
            method: "POST",
            body: formData
        })
    
        const result = await response.json()
    
        if(result.code == 200){
            console.log(result)
            location.reload()
        }
    })

}

if(document.location.pathname.includes("login")){

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
} else {
    generateTable();
}