const inputData = document.querySelector('.input')
const outputData = document.querySelector('.output')
const enterButton = document.querySelector('.enterButton')
const deleteButton = document.querySelector('.deleteButton')

let variableObject = {}
let functionObject = {}

inputData.onkeydown = function(event) {
    if (event.code == 'Enter') {
        enterInput()
    }
}

enterButton.addEventListener('click', () => enterInput())

deleteButton.addEventListener('click', () => {
    inputData.value = ''
    outputData.innerHTML = ''
    variableObject = {}
    functionObject = {}
})

function enterInput() {
    outputData.innerHTML += `${inputData.value}<br>`
    const [partBeforeEqual, partAfterEqual] = inputData.value.trim().split('=')
    const [beforeEqualOne, beforeEqualTwo] = partBeforeEqual.split(' ')

    switch (beforeEqualOne) {
        case 'var':
            const varName = partBeforeEqual.split(' ')[1]
            if (checkName(varName) && checkDoubling(variableObject, varName) && checkDoubling(functionObject, varName)) {
                variableObject[varName] = 'NaN'
                console.log('variables:', variableObject)
            } else {
                outputData.innerHTML += 'NaN<br>'
            }
        break

        case 'let':
            const letName = partBeforeEqual.split(' ')[1]
            if (checkName(letName) && checkDoubling(functionObject, letName)) {
                if (!checkDoubling(variableObject, partAfterEqual)) {
                    variableObject[letName] = variableObject[partAfterEqual]
                    console.log('variables:', variableObject)
                } else {
                    const letValue = parseFloat(partAfterEqual).toFixed(2)
                    if (checkName(letName) && letValue) {
                        variableObject[letName] = letValue
                        console.log('variables:', variableObject)
                    }
                }
            } else {
                outputData.innerHTML += 'NaN<br>'
            }
        break

        case 'fn':
            const fnName = partBeforeEqual.split(' ')[1]
            if (checkName(fnName) && checkDoubling(variableObject, fnName)) {
                if (!checkDoubling(variableObject, partAfterEqual)) {
                    functionObject[fnName] = variableObject[partAfterEqual]
                    console.log('functions:', functionObject)
                } else if (!checkDoubling(functionObject, partAfterEqual)) {
                    functionObject[fnName] = functionObject[partAfterEqual]
                    console.log('functions:', functionObject)
                } else {
                    const signs = ['+', '-', '*', '/']
                    let usedSign = signs.filter((sign) => {
                        const [operandOne, operandTwo] = partAfterEqual.split(sign)
                        return (operandOne && operandTwo)
                    })
                    const [operandOne, operandTwo] = partAfterEqual.split(usedSign)
                    functionObject[fnName] = calculation(operandOne, usedSign[0], operandTwo)   
                    console.log('functions:', functionObject)
                }
            } else {
                outputData.innerHTML += 'NaN<br>'
            }
        break

        case 'printvars':
            if (Object.keys(variableObject).length == 0) {
                outputData.innerHTML += 'NaN<br>'
            } else {
                for (key in variableObject) {
                    outputData.innerHTML += `${key} : ${variableObject[key]}<br>`
                }
            }
        break

        case 'printfns':
            if (Object.keys(functionObject).length == 0) {
                outputData.innerHTML += 'NaN<br>'
            } else {
                for (key in functionObject) {
                    outputData.innerHTML += `${key} : ${functionObject[key]}<br>`
                }
            }
        break

        case 'print':
            const identifier = partBeforeEqual.split(' ')[1]
            if (!checkDoubling(variableObject, identifier)) {
                outputData.innerHTML += `${variableObject[identifier]}<br>`
            } else if (!checkDoubling(functionObject, identifier)) {
                outputData.innerHTML += `${functionObject[identifier]}<br>`
            } else {
                outputData.innerHTML += 'NaN<br>'
            }
        break

        default:
            outputData.innerHTML += 'NaN<br>'
    } 
    inputData.value = ''
}

function checkName(name) {
return (!parseInt(name[0]) && /^[a-zA-Z0-9_]+$/.test(name))
}

function checkDoubling(object, name) {
    return !object.hasOwnProperty([name])
}

function calculation(operand1, operator, operand2) {
    
    function findOperand(name) {
        let object = checkDoubling(variableObject, name) ? functionObject : variableObject
        return parseFloat(object[name])
    }
    
    let calculatedVal
    switch (operator) {
        case '+':
            calculatedVal = findOperand(operand1) + findOperand(operand2)
            break
        case '-':
            calculatedVal = findOperand(operand1) - findOperand(operand2)
            break
        case '*':
            calculatedVal = findOperand(operand1) * findOperand(operand2)
            break
        case '/':
            calculatedVal = findOperand(operand1) / findOperand(operand2)
            break                           
    }
    return parseFloat(calculatedVal).toFixed(2)
}