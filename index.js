const path = require('path')
const fs = require('fs')
const moment = require('./moment')

main(process.argv[2], parseInt(process.argv[3], 10))

function main(filename, offset){
  console.log(`file: ${filename}`)
  console.log(`offset in ms: ${offset}`)

  const reg = new RegExp(/^([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}) --> ([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})$/)
  const content = fs.readFileSync(path.resolve(__dirname, filename), 'utf8')
  const arr = content.split('\r\n')

  let result = arr.reduce((acc, el) => {
      let readLine = reg.exec(el)
      if(readLine){
        let start = offsetTime(readLine[1], offset)
        var end = offsetTime(readLine[2], offset)
        return acc + start.format('HH:mm:ss,SSS') + ' --> ' + end.format('HH:mm:ss,SSS') + '\r\n'
      } else {
        return acc + el + '\r\n'
      }
    }, '')
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
  timeMoment.add(offset, 'ms')
  return timeMoment
}