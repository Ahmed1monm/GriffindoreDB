const STRING  = '+'
const ERROR   = '-'
const INTEGER = ':'
const BULK    = '$'
const ARRAY   = '*'

export const readLine =  (data: Buffer) =>{  
  let line = '';  
  const chunk = data.toString();
  console.log(`read line received data ${chunk}`)

  for (let i = 0; i < chunk.length; i++) {
    const char = chunk[i];
    if (char === '\r') {
      return line;
    }
    line += char;
  }  
  }

export const reader = (data: Buffer)=>{
  const datatype = data.toString('utf-8', 0, 1); // read first byte of data which contains the datatype
  console.log("data content", data.toString('utf-8',0,data.length) )
  switch(datatype){
    case STRING :
      console.log(`String`);
      stringReader(data);
      break;
    case ARRAY :
      arrayReader(data);
      break; 
    case BULK :
      console.log(`Bulk: ${data}`)
      bulkReader(data);
      break;
    case ERROR :
      console.log(`Error`);
      stringReader(data);
      break;
    case INTEGER :
      console.log(`Integer`)
      integerReader(data);
      break;
  }
}

export const arrayReader = (data: Buffer)=>{
  let filteredData: Buffer = data.slice(1); //ignore first char which is the '*' that refers that data is array
  let filteredDataStr = filteredData.toString('utf-8',0,data.length); //stringify to can be easily accessed
  const length = parseInt(filteredDataStr[0]); // get array length

  for(let i = 1; i<= length; i++){
    let line = readLine(filteredData.slice(i+2))
    if (line?.startsWith('$')){
      line = line + readLine(filteredData.slice(i+5))
      i++;
      reader(Buffer.from(line!))
    }
  }
}

export const bulkReader = (data: Buffer)=>{
  const dataStr = data.toString('utf-8',1,data.length);
  const length =parseInt(dataStr[0]);
  let line = '';
  for(let i=0; i<length;i++){
    if(dataStr[i+1]=== '\r'){
      return line;
    }
    line += dataStr[i+2]
  }
  return line;
}

export const integerReader = (data: Buffer)=>{
  const filteredData = data.slice(1,data.length -2);
  const number = parseInt(filteredData.toString())
  return number;
}

export const stringReader = (data: Buffer)=>{
  const filteredData = data.slice(1,data.length -2);
  const stringVal = filteredData.toString();
  return stringVal;
}