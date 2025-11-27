// 魔方状态管理
let cubeState = {
    front: [['green', 'green', 'green'], ['green', 'green', 'green'], ['green', 'green', 'green']],
    back: [['red', 'red', 'red'], ['red', 'red', 'red'], ['red', 'red', 'red']],
    right: [['blue', 'blue', 'blue'], ['blue', 'blue', 'blue'], ['blue', 'blue', 'blue']],
    left: [['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow']],
    top: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']],
    bottom: [['orange', 'orange', 'orange'], ['orange', 'orange', 'orange'], ['orange', 'orange', 'orange']]
};

// 颜色映射
const colorMap = {
    green: '#00ff00',
    red: '#ff0000',
    blue: '#0000ff',
    yellow: '#ffff00',
    white: '#ffffff',
    orange: '#ff8000'
};

// 初始化魔方
function initCube() {
    updateCubeDisplay();
}

// 更新魔方显示
function updateCubeDisplay() {
    for (let face in cubeState) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cubelet = document.querySelector(`[data-face="${face}"][data-row="${row}"][data-col="${col}"]`);
                if (cubelet) {
                    cubelet.style.backgroundColor = colorMap[cubeState[face][row][col]];
                }
            }
        }
    }
}

// 旋转面
function rotateFace(face, direction) {
    // 防止连续点击
    if (document.querySelector('.rotating')) return;
    
    const cube = document.getElementById('cube');
    cube.classList.add('rotating');
    
    // 执行旋转逻辑
    switch (face) {
        case 'front':
            rotateFront(direction);
            break;
        case 'back':
            rotateBack(direction);
            break;
        case 'right':
            rotateRight(direction);
            break;
        case 'left':
            rotateLeft(direction);
            break;
        case 'top':
            rotateTop(direction);
            break;
        case 'bottom':
            rotateBottom(direction);
            break;
    }
    
    // 更新显示
    updateCubeDisplay();
    
    // 移除旋转类
    setTimeout(() => {
        cube.classList.remove('rotating');
    }, 500);
}

// 旋转前面
function rotateFront(direction) {
    // 旋转前面自身
    cubeState.front = rotateMatrix(cubeState.front, direction);
    
    // 处理相邻面
    if (direction === 'clockwise') {
        const temp = [...cubeState.top[2]];
        cubeState.top[2] = cubeState.left[2].reverse();
        cubeState.left[2] = cubeState.bottom[0];
        cubeState.bottom[0] = cubeState.right[2].reverse();
        cubeState.right[2] = temp;
    } else {
        const temp = [...cubeState.top[2]];
        cubeState.top[2] = cubeState.right[2].reverse();
        cubeState.right[2] = cubeState.bottom[0].reverse();
        cubeState.bottom[0] = cubeState.left[2];
        cubeState.left[2] = temp.reverse();
    }
}

// 旋转后面
function rotateBack(direction) {
    // 旋转后面自身
    cubeState.back = rotateMatrix(cubeState.back, direction);
    
    // 处理相邻面
    if (direction === 'clockwise') {
        const temp = [...cubeState.top[0]];
        cubeState.top[0] = cubeState.right[0];
        cubeState.right[0] = cubeState.bottom[2].reverse();
        cubeState.bottom[2] = cubeState.left[0];
        cubeState.left[0] = temp.reverse();
    } else {
        const temp = [...cubeState.top[0]];
        cubeState.top[0] = cubeState.left[0].reverse();
        cubeState.left[0] = cubeState.bottom[2];
        cubeState.bottom[2] = cubeState.right[0].reverse();
        cubeState.right[0] = temp;
    }
}

// 旋转右面
function rotateRight(direction) {
    // 旋转右面自身
    cubeState.right = rotateMatrix(cubeState.right, direction);
    
    // 处理相邻面
    if (direction === 'clockwise') {
        const temp = [cubeState.top[0][2], cubeState.top[1][2], cubeState.top[2][2]];
        cubeState.top[0][2] = cubeState.front[0][2];
        cubeState.top[1][2] = cubeState.front[1][2];
        cubeState.top[2][2] = cubeState.front[2][2];
        cubeState.front[0][2] = cubeState.bottom[0][2];
        cubeState.front[1][2] = cubeState.bottom[1][2];
        cubeState.front[2][2] = cubeState.bottom[2][2];
        cubeState.bottom[0][2] = cubeState.back[2][0];
        cubeState.bottom[1][2] = cubeState.back[1][0];
        cubeState.bottom[2][2] = cubeState.back[0][0];
        cubeState.back[2][0] = temp[0];
        cubeState.back[1][0] = temp[1];
        cubeState.back[0][0] = temp[2];
    } else {
        const temp = [cubeState.top[0][2], cubeState.top[1][2], cubeState.top[2][2]];
        cubeState.top[0][2] = cubeState.back[2][0];
        cubeState.top[1][2] = cubeState.back[1][0];
        cubeState.top[2][2] = cubeState.back[0][0];
        cubeState.back[2][0] = cubeState.bottom[2][2];
        cubeState.back[1][0] = cubeState.bottom[1][2];
        cubeState.back[0][0] = cubeState.bottom[0][2];
        cubeState.bottom[0][2] = cubeState.front[0][2];
        cubeState.bottom[1][2] = cubeState.front[1][2];
        cubeState.bottom[2][2] = cubeState.front[2][2];
        cubeState.front[0][2] = temp[0];
        cubeState.front[1][2] = temp[1];
        cubeState.front[2][2] = temp[2];
    }
}

// 旋转左面
function rotateLeft(direction) {
    // 旋转左面自身
    cubeState.left = rotateMatrix(cubeState.left, direction);
    
    // 处理相邻面
    if (direction === 'clockwise') {
        const temp = [cubeState.top[0][0], cubeState.top[1][0], cubeState.top[2][0]];
        cubeState.top[0][0] = cubeState.back[2][2];
        cubeState.top[1][0] = cubeState.back[1][2];
        cubeState.top[2][0] = cubeState.back[0][2];
        cubeState.back[2][2] = cubeState.bottom[2][0];
        cubeState.back[1][2] = cubeState.bottom[1][0];
        cubeState.back[0][2] = cubeState.bottom[0][0];
        cubeState.bottom[0][0] = cubeState.front[0][0];
        cubeState.bottom[1][0] = cubeState.front[1][0];
        cubeState.bottom[2][0] = cubeState.front[2][0];
        cubeState.front[0][0] = temp[0];
        cubeState.front[1][0] = temp[1];
        cubeState.front[2][0] = temp[2];
    } else {
        const temp = [cubeState.top[0][0], cubeState.top[1][0], cubeState.top[2][0]];
        cubeState.top[0][0] = cubeState.front[0][0];
        cubeState.top[1][0] = cubeState.front[1][0];
        cubeState.top[2][0] = cubeState.front[2][0];
        cubeState.front[0][0] = cubeState.bottom[0][0];
        cubeState.front[1][0] = cubeState.bottom[1][0];
        cubeState.front[2][0] = cubeState.bottom[2][0];
        cubeState.bottom[0][0] = cubeState.back[2][2];
        cubeState.bottom[1][0] = cubeState.back[1][2];
        cubeState.bottom[2][0] = cubeState.back[0][2];
        cubeState.back[2][2] = temp[0];
        cubeState.back[1][2] = temp[1];
        cubeState.back[0][2] = temp[2];
    }
}

// 旋转顶面
function rotateTop(direction) {
    // 旋转顶面自身
    cubeState.top = rotateMatrix(cubeState.top, direction);
    
    // 处理相邻面
    if (direction === 'clockwise') {
        const temp = [...cubeState.front[0]];
        cubeState.front[0] = cubeState.right[0];
        cubeState.right[0] = cubeState.back[0];
        cubeState.back[0] = cubeState.left[0];
        cubeState.left[0] = temp;
    } else {
        const temp = [...cubeState.front[0]];
        cubeState.front[0] = cubeState.left[0];
        cubeState.left[0] = cubeState.back[0];
        cubeState.back[0] = cubeState.right[0];
        cubeState.right[0] = temp;
    }
}

// 旋转底面
function rotateBottom(direction) {
    // 旋转底面自身
    cubeState.bottom = rotateMatrix(cubeState.bottom, direction);
    
    // 处理相邻面
    if (direction === 'clockwise') {
        const temp = [...cubeState.front[2]];
        cubeState.front[2] = cubeState.left[2];
        cubeState.left[2] = cubeState.back[2];
        cubeState.back[2] = cubeState.right[2];
        cubeState.right[2] = temp;
    } else {
        const temp = [...cubeState.front[2]];
        cubeState.front[2] = cubeState.right[2];
        cubeState.right[2] = cubeState.back[2];
        cubeState.back[2] = cubeState.left[2];
        cubeState.left[2] = temp;
    }
}

// 旋转矩阵
function rotateMatrix(matrix, direction) {
    const rotated = [];
    for (let i = 0; i < 3; i++) {
        rotated[i] = [];
        for (let j = 0; j < 3; j++) {
            if (direction === 'clockwise') {
                rotated[i][j] = matrix[2 - j][i];
            } else {
                rotated[i][j] = matrix[j][2 - i];
            }
        }
    }
    return rotated;
}

// 还原魔方
function resetCube() {
    cubeState = {
        front: [['green', 'green', 'green'], ['green', 'green', 'green'], ['green', 'green', 'green']],
        back: [['red', 'red', 'red'], ['red', 'red', 'red'], ['red', 'red', 'red']],
        right: [['blue', 'blue', 'blue'], ['blue', 'blue', 'blue'], ['blue', 'blue', 'blue']],
        left: [['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow']],
        top: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']],
        bottom: [['orange', 'orange', 'orange'], ['orange', 'orange', 'orange'], ['orange', 'orange', 'orange']]
    };
    updateCubeDisplay();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initCube);