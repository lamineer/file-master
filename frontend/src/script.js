var host = "http://localhost/"
async function login(username, password){
    const response = await fetch(host+"auth/login", {
        method: "POST",
        body: JSON.stringify({
            username: username,
            password: password
        })
    })

    const result = await response.json()

    if(result.error){
        console.log(result.error)
    } else {
        document.cookie = "token=" + result.session_token + ";expires=" + new Date(result.expireTime).toUTCString() + ";";
        location.href = "/";
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

async function downloadFile(id){

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
    var fileList = await getFiles()
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
            <td><button onClick="downloadFile(${file.id})">Download</button><span class="spacer"></span><button onClick="deleteFile(${file.id})">Delete</button></td>
        </tr>
        `
    }
}

async function uploadFile(){

    let file = document.getElementById("file").files[0]
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(host+"api/uploadfile", {
        method: "POST",
        body: formData
    })

    const result = await response.json()

    if(result.code == 200){
        console.log(result)
        generateTable()
    }
}

if(document.location.pathname.includes("login")){

    if(document.cookie.includes("token")){
        location.href = "/";
    }
    
    let loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        try{
            login(username, password)
        } catch (err) {
            console.log(err)
        }
    })
} else {
    generateTable();
}