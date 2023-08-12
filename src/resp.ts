export const readLine =  (data: Buffer): Promise<string> =>{
    return new Promise((resolve, reject) => {
      let line = '';  
      const chunk = data.toString();
      console.log(`read line received data ${chunk}`)
  
      for (let i = 0; i < chunk.length; i++) {
        const char = chunk[i];
        if (char === '\n') {
          resolve(line);
          return;
        }
        line += char;
      }   
    });
  }
