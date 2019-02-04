const path = require('path')
const fs = require('fs')
const moment = require('moment')

main()

function main(){
  const filename = process.argv[2]
  const offset = parseInt(process.argv[3], 10)

  console.log(`file: ${filename}`)
  console.log(`offset in ms: ${offset}`)

  const reg = new RegExp(/^([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}) --> ([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})$/, 'g')
  const content = fs.readFileSync(path.resolve(__dirname, 'srt', filename), 'utf8')
  const arr = content.split('\r\n')
  console.log('length arr: ' + arr.length )

  let readLine = null,
    result = ''

  for(let i = 0 ; i < arr.length ; i++){
    readLine = reg.exec(arr[i])
    if(readLine){
      let start = offsetTime(readLine[1], offset)
      var end = offsetTime(readLine[2], offset)
      result += start.format('HH:mm:ss,SSS') + ' --> ' + end.format('HH:mm:ss,SSS') + '\r\n'
    } else {
      result += arr[i] + '\r\n'
    }
  }
  fs.writeFileSync(path.resolve(__dirname, 'results', filename.split('.srt')[0] + '_result.srt'), result)
}

/**
 * @param {string} time - format HH:mm:ss,SSS
 * @param {Number} offset - offset ms
 * @returns {moment}
 */
function offsetTime(time, offset){
  // no method in moment to format duration, so we use a moment
  let timeMoment = moment('2019-02-20 00:00:00.000')
  var duration = moment.duration(time.replace(',', '.'))
  // mutates moment
  timeMoment.add(duration)
  if(offset > 0){
    timeMoment.add(offset, 'ms')
  }else{
    timeMoment.subtract(offset, 'ms')
  }
  return timeMoment
}