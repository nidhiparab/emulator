const createMemory = require('./create-memory');
const instructions = require('./instructions');
const CPU = require('./cpu');

const memory = createMemory(256);
const writableBytes = new Uint8Array(memory.buffer) //get values inside the array buffer

const cpu = new CPU(memory); 


//16 bit in 3 pieces
writableBytes[0] = instructions.MOV_LIT_R1;
writableBytes[1] = 0x12;     //0x1234
writableBytes[2] = 0x34;

writableBytes[3] = instructions.MOV_LIT_R2;
writableBytes[4] = 0xAB;     //0xABCD
writableBytes[5] = 0xCD;

writableBytes[6] = instructions.ADD_REG_REG;
writableBytes[7] = 2;     //R1 index
writableBytes[8] = 3;     //R2 index

cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();

cpu.step(); 
cpu.debug();
