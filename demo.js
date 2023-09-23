

var answer = [];
var flag = 0;

function startConcurrentSudoku(){
    generate()
        .then((puzzles) => {
        displaySudoku(puzzles);
    });
}

function solve(){
    var TAB = document.getElementById('outside');
    var tables = TAB.children;
    if(flag == 0){
        for(let i = 0; i < tables.length; i++){
            for(let j = 0; j < 9; j++){
                for(let k = 0;k < 9; k++){
                    tables[i].rows[j].cells[k].innerHTML = answer[i][j][k];
                }
            }
        }
        flag = 1;
    }else {
        for(let i = 0; i < tables.length; i++){
            for(let j = 0; j < 9; j++){
                for(let k = 0;k < 9; k++){
                    if(tables[i].rows[j].cells[k].style.color == 'red') tables[i].rows[j].cells[k].innerHTML = null;
                    else tables[i].rows[j].cells[k].innerHTML = answer[i][j][k];
                }
            }
        }
        flag = 0;
    }

}

async function generate(){

    answer = [];
    flag = 0;

    //创建多个并发任务
    let tasks = [];
    for(let i = 0 ; i < 9; i++){
        tasks.push(generateSudoku());
    }

    //等待所有任务完成，并收集结果
    let puzzles = await Promise.all(tasks);

    return puzzles;
}



function displaySudoku(result){
    var TAB = document.getElementById('outside');
    TAB.innerHTML = '';
    for(let k = 0; k < 9; k++){
        var t = document.createElement('table');
        for(let i = 0; i < 9; i++){
            var row = document.createElement('tr');
            for(let j = 0; j < 9; j++){
                var cell = document.createElement('td');
                if(result[k][i][j] != 0) cell.innerText = result[k][i][j];
                else cell.style.color = 'red';
                cell.style.fontWeight = 'bold';
                if(j % 3 == 0) cell.style.borderLeft = '3px solid black';
                row.appendChild(cell);
            }
            if(i % 3 == 0) row.style.borderTop = '3px solid black';
            t.appendChild(row);
        }
        t.setAttribute('contentEditable', 'true');
        TAB.appendChild(t);
    }
}

function generateSudoku() {
    const size = 9; // 数独大小为 9x9

    // 创建一个空白的数独数组
    const sudoku = new Array(size);
    for (let i = 0; i < size; i++) {
        sudoku[i] = new Array(size).fill(0);
    }

    // 填充数独数组
    fillSudoku(sudoku, 0, 0);

    answer.push(sudoku);

    const demo = new Array(size);
    for (let i = 0; i < size; i++) {
        demo[i] = new Array(size).fill(0);
    }

    //挖空的个数
    var s = document.getElementById('selection');
    var num = 0;
    if(s.value === 'option1') num = 35;
    else if(s.value === 'option2') num = 28;
    else num = 20;
    while(num){
        var i = Math.floor(Math.random()*9);
        var j = Math.floor(Math.random()*9);
        if(demo[i][j] == 0){
            demo[i][j] = sudoku[i][j];
            num--;
        }
    }

    // 返回生成的数独数组
    return demo;
}
function fillSudoku(sudoku, row, col) {
    const size = 9; // 数独大小为 9x9

    // 到达数独最后一个位置时，生成完成
    if (row === size - 1 && col === size) {
        return true;
    }

    // 到达一行的末尾时，换到下一行开始
    if (col === size) {
        row++;
        col = 0;
    }

    // 如果当前位置已有数字，则跳过继续填充下一个位置
    if (sudoku[row][col] !== 0) {
        return fillSudoku(sudoku, row, col + 1);
    }

    // 获取随机可行的数字
    const numbers = getRandomNumbers();

    for (let num of numbers) {
        // 检查当前数字是否满足数独规则
        if (isValidNumber(sudoku, row, col, num)) {
            sudoku[row][col] = num;

            // 递归填充下一个位置
            if (fillSudoku(sudoku, row, col + 1)) {
                return true;
            }

            sudoku[row][col] = 0; // 如果无法填充下一个位置，则重置当前位置的数字
        }
    }

    return false; // 无法填充当前位置的数字
}

function getRandomNumbers() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 随机打乱数组顺序
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
}

function isValidNumber(sudoku, row, col, num) {
    // 检查同一行是否已存在相同数字
    for (let i = 0; i < 9; i++) {
        if (sudoku[row][i] === num) {
            return false;
        }
    }

    // 检查同一列是否已存在相同数字
    for (let i = 0; i < 9; i++) {
        if (sudoku[i][col] === num) {
            return false;
        }
    }

    // 检查同一个 3x3 小方格是否已存在相同数字
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (sudoku[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true; // 当前数字满足数独规则
}









