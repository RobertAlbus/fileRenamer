import * as fs from 'fs';
import commandLineArgs from 'command-line-args'


const createFileName = (fileName: string, counter: number, integerSpace: number) => {
  return fileName + String(counter).padStart(integerSpace, "0");
}

const main = () => {

  const OptionDefinitions: commandLineArgs.OptionDefinition[] = [
    { name: 'quiet', alias: 'q', type: Boolean, defaultValue: false},
    { name: 'wetrun', alias: 'w', type: Boolean, defaultValue: false},
    { name: 'integerSpace', alias: 's', type: Number, multiple: false, defaultValue: 4 },
    { name: 'src', alias: 'i', type: String, multiple: false, },
    { name: 'name', alias: 'n', type: String, multiple: false, defaultValue: ""},
    { name: 'startNum', type: Number, multiple: false, defaultOption: true, defaultValue: "1"},
  ];
  
  const options = commandLineArgs(OptionDefinitions)
  const path = options["src"] as string;

  const files = fs.readdirSync(path, {
    withFileTypes: true
  });

  // gate code for aborting if extensionless files are encountered
  if (files.filter( file => file.name.includes(".")).length == 0) {
    console.error("directory contains extensionless files but support for this is not implemented");
    process.exit(1);
  }

  let startNum = parseInt(options["startNum"])
  let counter: number = startNum;
  const baseName: string = options["name"];

  // integerSpace
  // larger of: CLI arg or maxNumber.length
  // used for file counter padding, 0999 vs 999 for example
  const maxNumberOfFiles = (startNum + files.length).toString().length;
  let integerSpace: number = parseInt(options["integerSpace"]);
  integerSpace = 
    integerSpace > maxNumberOfFiles.toString().length ? 
    integerSpace : maxNumberOfFiles.toString().length;

  files
  .filter( entry => 
    entry.isFile()
  )
  .forEach( (file) => {
    if ( !file.isFile() ) return;

    const oldPath = `${path}/${file.name}`;
    const newFileName = createFileName(baseName, counter++, integerSpace) 

    // assumes file with extension and one dot
    // should handle extensionless files
    const fileExtension = file.name.split(".")[1];
    const newPath = `${path}/${newFileName}.${fileExtension}`;

    if (!options["quiet"]) {
      console.log(
      `${path}
      ${file.name} 
      ${newFileName}.${fileExtension} 
      `);
    }

    if (options["wetrun"]) {
      fs.renameSync(oldPath, newPath);
    }

  });

  if (!options["quiet"]) {
    const message = !options["wetrun"] ? "Dry Run: File names have not been changed" : "File names have been changed"; 
    console.log(message);
  }
}
main();

/* 
TODO

* handle files without extensions




*/