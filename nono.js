const { execSync } = require('child_process'); let [_, __, ...args] = process.argv;
const command = `ts-node --transpileOnly "${args.at(-1)}"`;
const fs = require('fs'); const path = require('path');
(() => {
    
    let currentpath = "";
    for(let i = 2; i < args.length-2; i++)
    {
        currentpath+= args[i]
    }
    //SHARP
    let sharppath = path.join(currentpath, "node_modules/sharp/lib/sharp.js")
    if (fs.existsSync(sharppath)) {
        let sharp = fs.readFileSync(sharppath, 'utf8')
        sharp = sharp.replace("module.exports = require(`../build/Release/sharp-${platformAndArch}.node`);", `
    let path = require('path')
    let npath = path.join(process.cwd(), "./files/sharp/sharp-win32-x64.node");
    module.exports = require(npath);
    `)
        fs.writeFileSync(sharppath, sharp)
    }

    if(fs.existsSync(path.join(currentpath, ".rollup.cache")))
    {
        fs.rmSync(path.join(currentpath, ".rollup.cache"), { recursive: true, force: true });
    }
    if(fs.existsSync(path.join(currentpath, "./tsconfig.tsbuildinfo")))
    {
        fs.unlinkSync(path.join(currentpath, "./tsconfig.tsbuildinfo"))
    }
    
    fs.writeFileSync(path.join(currentpath, "./tsconfig.json"), `
    {
        "compilerOptions": {
          "target": "es2022",
          "allowJs": true,
          "skipLibCheck": true,
          "strict": false,
          "forceConsistentCasingInFileNames": true,
          "noEmit": true,
          "allowSyntheticDefaultImports":true,
          "module": "NodeNext",
          "moduleResolution": "NodeNext",
          "resolveJsonModule": true,
          "isolatedModules": true,
          "jsx": "preserve",
          "incremental": true,
          "esModuleInterop": true,
          "importHelpers": true
        }
      }
    `)
    
})()
execSync(command, { stdio: 'inherit' });