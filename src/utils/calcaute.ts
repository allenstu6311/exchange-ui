import Deciimal from 'decimal.js';

type NumType = string | number;

type OperationType = 'div' | 'mul' | 'add' | 'sub'

interface ICalculateConfig {
    precision?: number;
    returnNumber?: boolean;
}

const defaultVal = '--'

const isNumberVaild = (num: NumType) => {
    try {
        new Deciimal(num);
        return true;
    } catch (error) {
        console.error('Deciimal 錯誤參數', error)
        return false;
    }
}

const formartResult = (result:Deciimal, config: ICalculateConfig | undefined): NumType => {
    const {
        precision = result.decimalPlaces(),
        returnNumber,
    } = config || {};

    return returnNumber ? result.toNumber() : result.toFixed(precision)
}

function compute({
    num1,
    num2,
    operation,
    config
}: {
    num1: NumType,
    num2: NumType,
    operation: OperationType,
    config?:ICalculateConfig
}): NumType {
    if (!isNumberVaild(num1) || !isNumberVaild(num2)) return defaultVal;

    try {
        const a = new Deciimal(num1);
        const b = new Deciimal(num2);
        const result = a[operation](b);
        return formartResult(result, config)

    } catch (error) {
        console.error(`Decimal 計算錯誤 方法名稱:${operation} 參數 num1:${num1} num2:${num2}`);
        return defaultVal
    }
}

function add(num1: NumType, num2: NumType, config?: ICalculateConfig) {
    return compute({
        num1,
        num2,
        operation: 'add',
        config
    })
}

function sub(num1: NumType, num2: NumType, config?: ICalculateConfig) {
    return compute({
        num1,
        num2,
        operation: 'sub',
        config
    })
}

function div(num1: NumType, num2: NumType, config?: ICalculateConfig) {
    return compute({
        num1,
        num2,
        operation: 'div',
        config
    })
}

function mul(num1: NumType, num2: NumType, config?: ICalculateConfig) {
    return compute({
        num1,
        num2,
        operation: 'mul',
        config
    })
}

export {
    isNumberVaild,
    add,
    sub,
    div,
    mul
}