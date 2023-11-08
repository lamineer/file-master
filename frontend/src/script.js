var host = "http://"+window.location.host+"/"
var fileList = []
    order = 1;
var params = { page: 1 };

var pagination = document.getElementById("pagination");

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

function downloadFile(id){
    window.open(host+"/api/file/"+id, "_blank")
}

async function getFiles(){
    var queryString = Object.keys(params).map(a => `${a}=${params[a]}`).join("&");
    const response = await fetch("http://localhost/api/files?"+queryString)

    const results = await response.json()

    if(results.code == 401){
        delete_cookie("token");
        location.href = "/login.html";
    }
    return results
}

async function generateTable(){
    fileList = await getFiles();

    var tableBody = document.getElementById("file-list-body")
    tableBody.innerHTML = ""
    for(var file of fileList.data){
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

    if(fileList.fileCount > 10){
        pagination.innerHTML = "";

        for(var page = 1; page <= Math.ceil(fileList.fileCount / 10); page++){
            var classes = ["page-number"]
            if(params.page == page) {
                classes.push("current")
                pagination.innerHTML += `<span class="${classes.join(" ")}">${page}</span>`;
            } else {
                pagination.innerHTML += `<span class="${classes.join(" ")}" onClick="setPage(${page})">${page}</span>`;
            }
        }
    }
}

function setPage(number){
    params.page = number;
    generateTable();
}

function sortTable(column){
    if(order) var sortDir = "ASC"
    else var sortDir = "DESC"
    params.column = column;
    params.sortdir = sortDir;
    generateTable()
    order = !order
}

async function uploadFile(){

    var uploadForm = document.getElementById("file-upload")
    var file = document.getElementById("file")

    const formData = new FormData();
    formData.append('file', file.files[0]);

    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        if(file.files[0] == undefined){
            return;
        } else {
            const response = await fetch(host+"api/uploadfile", {
                method: "POST",
                body: formData
            })
        
            const result = await response.json()
        
            if(result.code == 200){
                console.log(result)
                location.reload()
            }
        }

    })

}

generateTable();