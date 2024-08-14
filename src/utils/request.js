import _ from 'lodash';
export function toURLString(params) {
    var str = [];
    var notNulls = 0;
    for (var p in params) {
        if (!_.isNull(params[p]) && !_.isUndefined(params[p]) && params[p] !== '' && params[p] !== false) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
            notNulls = notNulls + 1;
        }
    }

    var ret = ''
    if (notNulls == 0) {
        ret = ''
    }
    else {
        ret = '?' + str.join("&")
    }

    return ret
}