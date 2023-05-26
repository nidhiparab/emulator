const createMemory = sizeinBytes =>{
    const ab = new ArrayBuffer(sizeinBytes);
    const dv = new DataView(ab);                                  //read and write values of different sizes
    return dv;
}

module.exports = createMemory;