function RC4decode(s) {

    var _PADCHAR = "=",
        _ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        _VERSION = "1.0";
    
    function _getbyte64(s, i) {
        var idx = _ALPHA.indexOf(s.charAt(i));
        if (idx === -1) {
            throw "Cannot decode"
        }
        return idx
    }    
    
    var pads = 0,
        i, b10, imax = s.length,
        x = [];
    s = String(s);
    if (imax === 0) {
        return s
    }
    if (imax % 4 !== 0) {
        throw "Cannot decode"
    }
    if (s.charAt(imax - 1) === _PADCHAR) {
        pads = 1;
        if (s.charAt(imax - 2) === _PADCHAR) {
            pads = 2
        }
        imax -= 4
    }
    for (i = 0; i < imax; i += 4) {
        b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6) | _getbyte64(s, i + 3);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255))
    }
    switch (pads) {
    case 1:
        b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255));
        break;
    case 2:
        b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12);
        x.push(String.fromCharCode(b10 >> 16));
        break
    }
    return x.join("")
}