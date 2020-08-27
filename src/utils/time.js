function pad(str, length, character) {
    str = '' + str
    while (str.length < length) {
        str = character + str
    }
    return str
}

export default function formatTimeFromSeconds(sec) {
    let str = ''

    let hour = Math.floor(sec / 60.0 / 60.0)
    str += pad(hour, 2, '0')

    let minute = Math.floor(sec / 60.0)
    while (minute >= 60) {
        minute -= 60
    }
    str += ':' + pad(minute, 2, '0')

    sec = Math.floor(sec)
    while (sec >= 60) {
        sec -= 60
    }
    str += ':' + pad(sec, 2, '0')

    return str
}