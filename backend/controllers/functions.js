// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

exports.checkFileExistance = (file) => {
  if(fs.existsSync(filePath+fileData.fileName)){
    return true
  } else {
    return false
  }
}


exports.generateString = (length) => {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

exports.getBoundary = (header) => {
  var headerVars = header.split(";")
  for(var headVar of headerVars){
    if(headVar.includes("boundary")){
      return "--" + headVar.split("=")[1]
    }
  }
  return "No boundary found!"
}

exports.getFileData = (reader) => {
  var fileObject = {}
  console.log(reader)
  fileObject.fileSize = reader.length
  fileObject.fileName = reader.slice(reader.indexOf("filename=\"") + "filename=\"".length, reader.indexOf("\"\r\nContent-Type")).toString();
  fileObject.fileType = reader.slice(reader.indexOf("Content-Type: ") + "Content-Type: ".length, reader.indexOf("\r\n\r\n")).toString()
  boundary = reader.slice(0,reader.indexOf('\r\n'));
  fileObject.data = reader.slice(reader.indexOf('\r\n\r\n') + '\r\n\r\n'.length, reader.lastIndexOf(Buffer.from('\r\n') + boundary));

  return fileObject
}

exports.multipartParser = (body) => {
  body = body.split('\r\n');
  const jsonBody = {};
  for (let i = 0; i < body.length; i++) {
    const arrayPart = body[i];
    if (arrayPart.includes('name=')) {
      const fieldName = arrayPart.substring(
        arrayPart.indexOf('name=') + 6, arrayPart.lastIndexOf('"'));
      jsonBody[fieldName] = body[i + 2];
    }
  }
  return {body, jsonBody};
}
