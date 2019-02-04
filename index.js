const path = require('path')
const fs = require('fs')
const moment = require('moment')

const filename = process.argv[2]
const offset = process.argv[3]

console.log(`file: ${filename}`)
console.log(`offset in ms: ${offset}`)

const reg = new RegExp(/^[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3} --> [0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}$/, 'g')
const content = fs.readFileSync(path.resolve(__dirname, 'srt', filename), 'utf8')
// console.log(typeof content)
// console.log(JSON.stringify(content))
const arr = content.split('\r\n')
console.log('length arr: ' + arr.length )

let readLine = null,
  result = ''

for(let i = 0 ; i < arr.length ; i++){
  readLine = reg.exec(arr[i])
  if(readLine){
		// console.log('read line is time')
		// console.log(readLine)
	} else {
    // console.log('read line is not time')
    result += arr[i] + '\n'
	}
}

fs.writeFileSync(path.resolve(__dirname, 'results', filename.split('.srt')[0] + '_result.srt'), result)