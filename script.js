// 魔方状态管理
let cubeState = [];
const cubeSize = 3;
const cubeletSize = 100;
const gap = 4;

// 颜色定义
const colors = {
    front: 'front',
    back: 'back',
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right'
};

// 初始化魔方
function initCube() {
    const cubeElement = document.getElementById('cube');
    cubeElement.innerHTML = '';
    cubeState = [];
    
    // 创建27个小方块
    for (let x = 0; x < cubeSize; x++) {
        for (let y = 0; y < cubeSize; y++) {
            for (let z = 0; z < cubeSize; z++) {
                const cubelet = createCubelet(x, y, z);
                cubeElement.appendChild(cubelet);
                cubeState.push({x, y, z, element: cubelet});
            }
        }
    }
}

// 创建单个小方块
function createCubelet(x, y, z) {
    const cubelet = document.createElement('div');
    cubelet.className = 'cubelet';
    
    // 设置初始位置
    const offset = (cubeSize - 1) / 2;
    const posX = (x - offset) * cubeletSize;
    const posY = (y - offset) * cubeletSize;
    const posZ = (z - offset) * cubeletSize;
    
    cubelet.style.transform = `translate3d(${posX}px, ${posY}px, ${posZ}px)`;
    
    // 创建六个面
        const faces = ['front', 'back', 'up', 'down', 'left', 'right'];
        const faceLabels = {
            'front': '前 (F)',
            'back': '后 (B)',
            'up': '上 (U)',
            'down': '下 (D)',
            'left': '左 (L)',
            'right': '右 (R)'
        };
        
        faces.forEach(face => {
            const faceElement = document.createElement('div');
            faceElement.className = `face ${face}`;
            
            // 添加面标识文字
            const label = document.createElement('span');
            label.textContent = faceLabels[face];
            label.style.fontSize = '16px';
            label.style.fontWeight = 'bold';
            label.style.textShadow = '1px 1px 3px rgba(0,0,0,0.8)';
            label.style.webkitTextStroke = '1px rgba(0,0,0,0.5)';
            label.style.color = '#fff';
            label.style.letterSpacing = '0.5px';
            faceElement.appendChild(label);
            
            // 只有在表面的面才显示颜色
            let showFace = false;
            switch(face) {
                case 'front': showFace = z === cubeSize - 1;
                break;
                case 'back': showFace = z === 0;
                break;
                case 'up': showFace = y === cubeSize - 1;
                break;
                case 'down': showFace = y === 0;
                break;
                case 'left': showFace = x === 0;
                break;
                case 'right': showFace = x === cubeSize - 1;
                break;
            }
            
            if (!showFace) {
                faceElement.style.backgroundColor = '#333';
                faceElement.style.borderColor = '#555';
            }
            
            cubelet.appendChild(faceElement);
        });
    
    return cubelet;
}

// 旋转面
function rotateFace(face, direction) {
    let cubeletsToRotate = [];
    const offset = (cubeSize - 1) / 2;
    
    // 确定要旋转的面的小方块
    switch(face) {
        case 'F': // 前面 (z = 1)
            cubeletsToRotate = cubeState.filter(c => c.z === offset);
            rotateAroundAxis(cubeletsToRotate, direction, 'Z');
            break;
        case 'B': // 后面 (z = -1)
            cubeletsToRotate = cubeState.filter(c => c.z === -offset);
            rotateAroundAxis(cubeletsToRotate, -direction, 'Z');
            break;
        case 'U': // 上面 (y = 1)
            cubeletsToRotate = cubeState.filter(c => c.y === offset);
            rotateAroundAxis(cubeletsToRotate, direction, 'X');
            break;
        case 'D': // 下面 (y = -1)
            cubeletsToRotate = cubeState.filter(c => c.y === -offset);
            rotateAroundAxis(cubeletsToRotate, -direction, 'X');
            break;
        case 'L': // 左面 (x = -1)
            cubeletsToRotate = cubeState.filter(c => c.x === -offset);
            rotateAroundAxis(cubeletsToRotate, direction, 'Y');
            break;
        case 'R': // 右面 (x = 1)
            cubeletsToRotate = cubeState.filter(c => c.x === offset);
            rotateAroundAxis(cubeletsToRotate, -direction, 'Y');
            break;
    }
}

// 旋转层
function rotateLayer(layer, direction) {
    let cubeletsToRotate = [];
    
    // 确定要旋转的层的小方块
    switch(layer) {
        case 'M': // 中层（x=0）
            cubeletsToRotate = cubeState.filter(c => c.x === 0);
            rotateAroundAxis(cubeletsToRotate, direction, 'Y');
            break;
        case 'E': // 赤道层（y=0）
            cubeletsToRotate = cubeState.filter(c => c.y === 0);
            rotateAroundAxis(cubeletsToRotate, direction, 'X');
            break;
        case 'S': // S层（z=0）
            cubeletsToRotate = cubeState.filter(c => c.z === 0);
            rotateAroundAxis(cubeletsToRotate, direction, 'Z');
            break;
    }
}

// 绕轴旋转小方块
function rotateAroundAxis(cubelets, direction, axis) {
    cubelets.forEach(cubelet => {
        const element = cubelet.element;
        const currentTransform = element.style.transform;
        
        // 应用旋转动画
        let rotation = '';
        switch(axis) {
            case 'X':
                rotation = `rotateX(${direction * 90}deg)`;
                break;
            case 'Y':
                rotation = `rotateY(${direction * 90}deg)`;
                break;
            case 'Z':
                rotation = `rotateZ(${direction * 90}deg)`;
                break;
        }
        
        element.style.transform = currentTransform + ' ' + rotation;
        
        // 更新小方块的坐标和颜色面状态
        setTimeout(() => {
            const x = cubelet.x;
            const y = cubelet.y;
            const z = cubelet.z;
            
            // 更新坐标
            switch(axis) {
                case 'X':
                    if (direction === 1) {
                        cubelet.y = z;
                        cubelet.z = -y;
                    } else {
                        cubelet.y = -z;
                        cubelet.z = y;
                    }
                    break;
                case 'Y':
                    if (direction === 1) {
                        cubelet.x = -z;
                        cubelet.z = x;
                    } else {
                        cubelet.x = z;
                        cubelet.z = -x;
                    }
                    break;
                case 'Z':
                    if (direction === 1) {
                        cubelet.x = y;
                        cubelet.y = -x;
                    } else {
                        cubelet.x = -y;
                        cubelet.y = x;
                    }
                    break;
            }
            
            // 更新颜色面
            updateCubeletColors(cubelet);
            
            // 重置变换，保持最终状态
            element.style.transform = currentTransform;
        }, 400);
    });
}

// 更新小方块的颜色面
function updateCubeletColors(cubelet) {
    const element = cubelet.element;
    const faces = element.querySelectorAll('.face');
    const x = cubelet.x;
    const y = cubelet.y;
    const z = cubelet.z;
    const offset = (cubeSize - 1) / 2;
    
    // 移除所有颜色类
    faces.forEach(face => {
        face.classList.remove('front', 'back', 'up', 'down', 'left', 'right');
        face.style.backgroundColor = '#333';
        face.style.borderColor = '#555';
    });
    
    // 确保面的顺序与创建时一致
    const faceOrder = ['front', 'back', 'up', 'down', 'left', 'right'];
    
    // 根据新的位置设置颜色面
    faceOrder.forEach((faceName, index) => {
        let isVisible = false;
        switch(faceName) {
            case 'front':
                isVisible = z === offset;
                break;
            case 'back':
                isVisible = z === -offset;
                break;
            case 'up':
                isVisible = y === offset;
                break;
            case 'down':
                isVisible = y === -offset;
                break;
            case 'left':
                isVisible = x === -offset;
                break;
            case 'right':
                isVisible = x === offset;
                break;
        }
        
        if (isVisible) {
            faces[index].classList.add(faceName);
        }
    });
}

// 整体旋转魔方
function rotateCube(axis, direction) {
    const cube = document.getElementById('cube');
    let currentTransform = cube.style.transform || 'rotateX(-20deg) rotateY(-20deg)';
    
    // 解析当前旋转角度
    let rx = -20, ry = -20, rz = 0;
    const rxMatch = currentTransform.match(/rotateX\(([-+]?\d+)deg\)/);
    const ryMatch = currentTransform.match(/rotateY\(([-+]?\d+)deg\)/);
    const rzMatch = currentTransform.match(/rotateZ\(([-+]?\d+)deg\)/);
    
    if (rxMatch) rx = parseInt(rxMatch[1]);
    if (ryMatch) ry = parseInt(ryMatch[1]);
    if (rzMatch) rz = parseInt(rzMatch[1]);
    
    // 应用新的旋转
    switch(axis) {
        case 'X':
            rx += direction * 90;
            break;
        case 'Y':
            ry += direction * 90;
            break;
        case 'Z':
            rz += direction * 90;
            break;
    }
    
    cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
}

// 还原魔方
function resetCube() {
    const cube = document.getElementById('cube');
    cube.style.transform = 'rotateX(-20deg) rotateY(-20deg) rotateZ(0deg)';
    
    // 重新初始化魔方状态
    setTimeout(() => {
        initCube();
    }, 600);
}

// 页面加载完成后初始化魔方
window.addEventListener('load', initCube);