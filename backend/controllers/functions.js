// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

exports.generateString = (length) => {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
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