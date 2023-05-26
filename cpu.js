const createMemory = require('./create-memory');
const instructions = require('./instructions');

class CPU {
    constructor(memory){
        this.memory = memory;                 
        
        //registers
        this.registerNames = [
            'ip',               //instruction pointer = program counter
            'acc',              //accumulator = results of math operations
            'r1', 'r2' , 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'         //general purpose registers
        ];
        
         //16 bits CPU => each register 2 byte = 16 bits
        this.registers = createMemory(this.registerNames.length * 2)    // * 2 because every size in bytes
        
        //map register name to actual value in memory(offset)
        
        this.registerMap = this.registerNames.reduce((map, name, i) =>{
            map[name] = i * 2;
            return map;
        },{});
    }
        
        debug(){
            this.registerNames.forEach(name => {
                console.log(`${name} = 0x${this.getRegister(name).toString(16).padStart(4, '0')}`);
            });
        }
        
        
        //getting and setting values in registers
        getRegister(name){
            if(!(name in this.registerMap)){
                throw new Error(`No such register '${name}'`);
            }
            return this.registers.getUint16(this.registerMap[name]);
        }
        setRegister(name, value){
            if(!(name in this.registerMap)){
                throw new Error(`No such register '${name}'`);
            }
            return this.registers.setUint16(this.registerMap[name], value);
        }
        
        //get instruction pointing to        
        fetch(){
            const nextInstructionAddress = this.getRegister('ip'); //get address
            const instruction = this.memory.getUint8(nextInstructionAddress);  //get actual intruction at that address
            this.setRegister('ip', nextInstructionAddress + 1); // increase the ip by 1 to process the next instruction
            
            return instruction;
        }
        
        fetch16(){
            const nextInstructionAddress = this.getRegister('ip'); //get address
            const instruction = this.memory.getUint16(nextInstructionAddress);  //get actual intruction at that address
            this.setRegister('ip', nextInstructionAddress + 2); // increase the ip by 2 to process the next instruction
            
            return instruction;
        }
        
        //check which instruction and execute it
        execute(instruction){
            switch(instruction){
                
                //mov *** to r1
                case instructions.MOV_LIT_R1: {
                    const literal = this.fetch16();
                    this.setRegister('r1', literal);
                    return;
                };
                
                //mov *** to r2
                case instructions.MOV_LIT_R2: {
                    const literal = this.fetch16();
                    this.setRegister('r2', literal);
                    return;
                };
                
                //add r1 and r2
                case instructions.ADD_REG_REG:{
                    const r1 = this.fetch();
                    const r2 = this.fetch();
                    const registerValue1 = this.registers.getUint16(r1 * 2); 
                    const registerValue2 = this.registers.getUint16(r2 * 2);
                    this.setRegister('acc', registerValue1 + registerValue2);
                    return 
                }
            }
        }
        
        step(){
            const instruction = this.fetch();
            return this.execute(instruction)
        }
        
    }


module.exports = CPU;