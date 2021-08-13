import * as fs from 'fs';
import commandLineArgs from 'command-line-args'


const createFileName = (fileName: string, counter: number, maxNum: number) => {
  const maxLength = maxNum.toString().length;
  return fileName + String(counter).padStart(maxLength, "0");
}

const main = () => {

  const OptionDefinitions: commandLineArgs.OptionDefinition[] = [
    { name: 'quiet', alias: 'q', type: Boolean, defaultValue: false},
    { name: 'dryrun', alias: 'd', type: Boolean, defaultValue: true},
    { name: 'src', alias: 'i', type: String, multiple: false, },
    { name: 'name', alias: 'n', type: String, multiple: false, defaultValue: ""},
    { name: 'startNum', type: Number, multiple: false, defaultOption: true, defaultValue: "1"},
  ];
  
  const options = commandLineArgs(OptionDefinitions)
  const path = options["src"] as string;

  const files = fs.readdirSync(path, {
    withFileTypes: true
  });

  let startNum = parseInt(options["startNum"])
  let counter: number = startNum;
  const baseName: string = options["name"];

  // gate code for aborting if extensionless files are encountered
  if (files.filter( file => file.name.includes(".")).length == 0) {
    console.error("directory contains extensionless files but support for this is not implemented");
    process.exit(1);
  }

  files
  .filter( entry => 
    entry.isFile()
  )
  .forEach( (file) => {
    if ( !file.isFile() ) return;

    const oldPath = `${path}/${file.name}`;

    // kind of hacky to figure out the max offset of leading zeros
    // ie, what if the first run has 999 files, then more are added in a second run?
    // consider adding a CLI arg for offset
    /*
    0001
    0002
    ...
    999
    1000

    should be:
    0001
    0002
    ...
    0999
    1000
    */ 
    const newFileName = createFileName(baseName, counter++, startNum + files.length) 
    const fileExtension = file.name.split(".")[1];
    const newPath = `${path}/${newFileName}.${fileExtension}`;

    if (!options["quiet"]) {
      console.log(
      `${path}
      ${file.name} 
      ${newFileName}.${fileExtension} 
      `);
    }

    if (!options["dryrun"]) {
      fs.renameSync(oldPath, newPath);
    }

  });

  if (!options["quiet"]) {
    const message = !!options["dryrun"] ? "Dry Run: File names have not been changed" : "File names have been changed"; 
    console.log(message);
  }
}
main();

// TODO
/* 
TODO

* handle files without




*/