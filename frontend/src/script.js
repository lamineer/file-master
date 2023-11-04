async function login(username, password){
    const response = await fetch("http://localhost/auth/login", {
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
    }
}

async function deleteFile(id){

}

async function downloadFile(id){
    
}

async function getFiles(){
    const response = await fetch("http://localhost/api/files")

    const results = await response.json()
    return results
}

async function generateTable(fileList){
    fileList = await fileList
    var tableBody = document.getElementById("file-list-body")
    console.log(tableBody)
    for(var file of fileList){
        var date = new Date(file.uploadTime)
        tableBody.innerHTML += `
        <tr>
            <td>${file.id}</td>
            <td>${file.fileName}</td>
            <td>${file.fileType}</td>
            <td>${file.fileSize}</td>
            <td>${date.toGMTString()}</td>
            <td><a ></td>
        </tr>
        `
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
    var fileList = getFiles();
    generateTable(fileList);
}