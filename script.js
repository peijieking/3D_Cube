class RubiksCube {
    constructor() {
        this.cube = document.getElementById('cube');
        this.cubelets = document.querySelectorAll('.cubelet');
        this.colors = {
            U: '#0046ad',   // 蓝色
            D: '#ff0000',   // 红色
            L: '#ffffff',   // 白色
            R: '#ffff00',   // 黄色
            F: '#009b48',   // 绿色
            B: '#ff5800'    // 橙色
        };
        // 保存每个方块的初始位置
        this.initialPositions = Array.from(this.cubelets).map(cubelet => cubelet.dataset.position);
        this.reset();
    }
    
    reset() {
        // 重置所有方块到初始位置和颜色
        this.cubelets.forEach((cubelet, index) => {
            const initialPosition = this.initialPositions[index];
            const face = initialPosition[0];
            cubelet.dataset.position = initialPosition;
            cubelet.style.backgroundColor = this.colors[face];
        });
        this.cube.style.transform = 'rotateX(-20deg) rotateY(20deg)';
    }
    
    rotateLayer(layer, direction) {
        // 防止同时旋转多个层
        if (this.isRotating) return;
        this.isRotating = true;
        
        const layerElements = this.getLayerElements(layer);
        const positions = this.getLayerPositions(layer);
        const newPositions = this.calculateNewPositions(layer, positions, direction);
        
        // 执行旋转动画
        this.animateRotation(layer, direction, () => {
            // 更新方块位置和颜色
            for (let i = 0; i < layerElements.length; i++) {
                layerElements[i].dataset.position = newPositions[i];
                const newFace = newPositions[i][0];
                layerElements[i].style.backgroundColor = this.colors[newFace];
            }
            this.isRotating = false;
        });
    }
    
    getLayerElements(layer) {
        const elements = [];
        this.cubelets.forEach(cubelet => {
            const position = cubelet.dataset.position;
            if (this.isInLayer(position, layer)) {
                elements.push(cubelet);
            }
        });
        return elements;
    }
    
    getLayerPositions(layer) {
        const positions = [];
        this.cubelets.forEach(cubelet => {
            const position = cubelet.dataset.position;
            if (this.isInLayer(position, layer)) {
                positions.push(position);
            }
        });
        return positions;
    }
    
    isInLayer(position, layer) {
        const face = position[0];
        const row = parseInt(position[1]);
        const col = parseInt(position[2]);
        
        switch(layer) {
            case 'U': // 上层
                return face === 'U' || 
                       (face === 'F' && row === 0) || 
                       (face === 'R' && row === 0) || 
                       (face === 'B' && row === 0) || 
                       (face === 'L' && row === 0);
            case 'D': // 下层
                return face === 'D' || 
                       (face === 'F' && row === 2) || 
                       (face === 'R' && row === 2) || 
                       (face === 'B' && row === 2) || 
                       (face === 'L' && row === 2);
            case 'L': // 左层
                return face === 'L' || 
                       (face === 'F' && col === 0) || 
                       (face === 'U' && col === 0) || 
                       (face === 'B' && col === 2) || 
                       (face === 'D' && col === 0);
            case 'R': // 右层
                return face === 'R' || 
                       (face === 'F' && col === 2) || 
                       (face === 'U' && col === 2) || 
                       (face === 'B' && col === 0) || 
                       (face === 'D' && col === 2);
            case 'F': // 前层
                return face === 'F' || 
                       (face === 'U' && row === 2) || 
                       (face === 'R' && col === 0) || 
                       (face === 'D' && row === 0) || 
                       (face === 'L' && col === 2);
            case 'B': // 后层
                return face === 'B' || 
                       (face === 'U' && row === 0) || 
                       (face === 'L' && col === 0) || 
                       (face === 'D' && row === 2) || 
                       (face === 'R' && col === 2);
            default:
                return false;
        }
    }
    
    calculateNewPositions(layer, positions, direction) {
        const newPositions = [];
        const isClockwise = direction === 'clockwise';
        
        positions.forEach(pos => {
            const face = pos[0];
            const row = parseInt(pos[1]);
            const col = parseInt(pos[2]);
            let newFace = face;
            let newRow = row;
            let newCol = col;
            
            // 根据不同的层和旋转方向计算新位置
            switch(layer) {
                case 'U': // 上层旋转
                    if (face === 'U') {
                        // 上层本身的旋转
                        if (isClockwise) {
                            newRow = col;
                            newCol = 2 - row;
                        } else {
                            newRow = 2 - col;
                            newCol = row;
                        }
                    } else if (face === 'F') {
                        // 前面上层 -> 右面上层
                        if (isClockwise) {
                            newFace = 'R';
                        } else {
                            newFace = 'L';
                            newCol = 2;
                        }
                    } else if (face === 'R') {
                        // 右面上层 -> 后面上层
                        if (isClockwise) {
                            newFace = 'B';
                        } else {
                            newFace = 'F';
                        }
                    } else if (face === 'B') {
                        // 后面上层 -> 左面上层
                        if (isClockwise) {
                            newFace = 'L';
                            newCol = 2;
                        } else {
                            newFace = 'R';
                        }
                    } else if (face === 'L') {
                        // 左面上层 -> 前面上层
                        if (isClockwise) {
                            newFace = 'F';
                        } else {
                            newFace = 'B';
                        }
                    }
                    break;
                    
                case 'D': // 下层旋转
                    if (face === 'D') {
                        // 下层本身的旋转
                        if (isClockwise) {
                            newRow = col;
                            newCol = 2 - row;
                        } else {
                            newRow = 2 - col;
                            newCol = row;
                        }
                    } else if (face === 'F') {
                        // 前面下层 -> 左面下层
                        if (isClockwise) {
                            newFace = 'L';
                        } else {
                            newFace = 'R';
                            newCol = 2;
                        }
                    } else if (face === 'L') {
                        // 左面下层 -> 后面下层
                        if (isClockwise) {
                            newFace = 'B';
                        } else {
                            newFace = 'F';
                        }
                    } else if (face === 'B') {
                        // 后面下层 -> 右面下层
                        if (isClockwise) {
                            newFace = 'R';
                            newCol = 2;
                        } else {
                            newFace = 'L';
                        }
                    } else if (face === 'R') {
                        // 右面下层 -> 前面下层
                        if (isClockwise) {
                            newFace = 'F';
                        } else {
                            newFace = 'B';
                        }
                    }
                    break;
                    
                case 'L': // 左层旋转
                    if (face === 'L') {
                        // 左层本身的旋转
                        if (isClockwise) {
                            newRow = col;
                            newCol = 2 - row;
                        } else {
                            newRow = 2 - col;
                            newCol = row;
                        }
                    } else if (face === 'F') {
                        // 前面左层 -> 下层左层
                        if (isClockwise) {
                            newFace = 'D';
                            newRow = 0;
                        } else {
                            newFace = 'U';
                            newRow = 2;
                        }
                    } else if (face === 'U') {
                        // 上面左层 -> 前面左层
                        if (isClockwise) {
                            newFace = 'F';
                        } else {
                            newFace = 'B';
                            newCol = 2;
                        }
                    } else if (face === 'B') {
                        // 后面左层 -> 上面左层
                        if (isClockwise) {
                            newFace = 'U';
                            newRow = 2;
                        } else {
                            newFace = 'D';
                            newRow = 0;
                            newCol = 2;
                        }
                    } else if (face === 'D') {
                        // 下面左层 -> 后面左层
                        if (isClockwise) {
                            newFace = 'B';
                            newCol = 2;
                        } else {
                            newFace = 'F';
                        }
                    }
                    break;
                    
                case 'R': // 右层旋转
                    if (face === 'R') {
                        // 右层本身的旋转
                        if (isClockwise) {
                            newRow = col;
                            newCol = 2 - row;
                        } else {
                            newRow = 2 - col;
                            newCol = row;
                        }
                    } else if (face === 'F') {
                        // 前面右层 -> 上面右层
                        if (isClockwise) {
                            newFace = 'U';
                            newRow = 2;
                        } else {
                            newFace = 'D';
                            newRow = 0;
                        }
                    } else if (face === 'D') {
                        // 下面右层 -> 前面右层
                        if (isClockwise) {
                            newFace = 'F';
                        } else {
                            newFace = 'B';
                            newCol = 2;
                        }
                    } else if (face === 'B') {
                        // 后面右层 -> 下面右层
                        if (isClockwise) {
                            newFace = 'D';
                            newRow = 0;
                            newCol = 2;
                        } else {
                            newFace = 'U';
                            newRow = 2;
                        }
                    } else if (face === 'U') {
                        // 上面右层 -> 后面右层
                        if (isClockwise) {
                            newFace = 'B';
                            newCol = 2;
                        } else {
                            newFace = 'F';
                        }
                    }
                    break;
                    
                case 'F': // 前层旋转
                    if (face === 'F') {
                        // 前层本身的旋转
                        if (isClockwise) {
                            newRow = col;
                            newCol = 2 - row;
                        } else {
                            newRow = 2 - col;
                            newCol = row;
                        }
                    } else if (face === 'U') {
                        // 上面前层 -> 右面左层
                        if (isClockwise) {
                            newFace = 'R';
                            newCol = 0;
                        } else {
                            newFace = 'L';
                            newCol = 2;
                            newRow = 2;
                        }
                    } else if (face === 'R') {
                        // 右面左层 -> 下面前层
                        if (isClockwise) {
                            newFace = 'D';
                            newRow = 0;
                        } else {
                            newFace = 'U';
                            newRow = 2;
                        }
                    } else if (face === 'D') {
                        // 下面前层 -> 左面右层
                        if (isClockwise) {
                            newFace = 'L';
                            newCol = 2;
                            newRow = 2;
                        } else {
                            newFace = 'R';
                            newCol = 0;
                        }
                    } else if (face === 'L') {
                        // 左面右层 -> 上面前层
                        if (isClockwise) {
                            newFace = 'U';
                            newRow = 2;
                        } else {
                            newFace = 'D';
                            newRow = 0;
                        }
                    }
                    break;
                    
                case 'B': // 后层旋转
                    if (face === 'B') {
                        // 后层本身的旋转
                        if (isClockwise) {
                            newRow = col;
                            newCol = 2 - row;
                        } else {
                            newRow = 2 - col;
                            newCol = row;
                        }
                    } else if (face === 'U') {
                        // 上面后层 -> 左面左层
                        if (isClockwise) {
                            newFace = 'L';
                            newCol = 0;
                        } else {
                            newFace = 'R';
                            newCol = 2;
                            newRow = 2;
                        }
                    } else if (face === 'L') {
                        // 左面左层 -> 下面后层
                        if (isClockwise) {
                            newFace = 'D';
                            newRow = 2;
                        } else {
                            newFace = 'U';
                            newRow = 0;
                        }
                    } else if (face === 'D') {
                        // 下面后层 -> 右面右层
                        if (isClockwise) {
                            newFace = 'R';
                            newCol = 2;
                            newRow = 2;
                        } else {
                            newFace = 'L';
                            newCol = 0;
                        }
                    } else if (face === 'R') {
                        // 右面右层 -> 上面后层
                        if (isClockwise) {
                            newFace = 'U';
                            newRow = 0;
                        } else {
                            newFace = 'D';
                            newRow = 2;
                        }
                    }
                    break;
            }
            
            newPositions.push(`${newFace}${newRow}${newCol}`);
        });
        
        return newPositions;
    }
    

    
    animateRotation(layer, direction, callback) {
        const isClockwise = direction === 'clockwise';
        const rotationMap = {
            U: isClockwise ? 'rotateX(90deg)' : 'rotateX(-90deg)',
            D: isClockwise ? 'rotateX(-90deg)' : 'rotateX(90deg)',
            L: isClockwise ? 'rotateY(-90deg)' : 'rotateY(90deg)',
            R: isClockwise ? 'rotateY(90deg)' : 'rotateY(-90deg)',
            F: isClockwise ? 'rotateZ(90deg)' : 'rotateZ(-90deg)',
            B: isClockwise ? 'rotateZ(-90deg)' : 'rotateZ(90deg)'
        };
        
        this.cube.style.transform = `rotateX(-20deg) rotateY(20deg) ${rotationMap[layer]}`;
        
        setTimeout(() => {
            this.cube.style.transform = 'rotateX(-20deg) rotateY(20deg)';
            callback();
        }, 500);
    }
}

// 初始化魔方
const cube = new RubiksCube();