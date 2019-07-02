const utils ={
    sortObjectArray(payload = {}) {
        let {dataList, key, order} = payload || {};
        var length = (dataList || []).length;
        let shouldSwitch = false;
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < (length - i - 1); j++) {
                if (order === 1) {
                    if (typeof dataList[j][key] === 'string') {
                        shouldSwitch = (dataList[j][key].toLowerCase() > dataList[j + 1][key].toLowerCase());
                    }
                    if (typeof dataList[j][key] === 'number') {
                        shouldSwitch = (dataList[j][key] > dataList[j + 1][key])
                    }
                    if (shouldSwitch) {
                        var tmp = dataList[j];
                        dataList[j] = dataList[j + 1];
                        dataList[j + 1] = tmp;
                    }
                } else if (order === 2) {
                    if (typeof dataList[j][key] === 'string') {
                        shouldSwitch = (dataList[j][key].toLowerCase() < dataList[j + 1][key].toLowerCase());
                    }
                    if (typeof dataList[j][key] === 'number') {
                        shouldSwitch = (dataList[j][key] < dataList[j + 1][key])
                    }
                    if (shouldSwitch) {
                        let tmp = dataList[j];
                        dataList[j] = dataList[j + 1];
                        dataList[j + 1] = tmp;
                    }
                } else {
                    return dataList;
                }
            }
        }
        return dataList;
    }
};
export default utils;