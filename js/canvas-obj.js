class GraphBuilder {
    constructor(element, padding = 30) {
        this.display = element.getContext("2d");
        this.displayWidth = element.width;
        this.displayHeight = element.height;
        this.displayPadding = padding;

        this.graphAreaBegin = {'x': this.displayPadding + 20, 'y': this.displayHeight - (this.displayPadding + 20)}
        this.graphAreaEnd = {'x': this.displayWidth - (this.displayPadding + 20), 'y': this.displayPadding + 20}
        this.graphAreaLengthByX = this.graphAreaEnd.x - this.graphAreaBegin.x;
        this.graphAreaLengthByY = this.graphAreaBegin.y - this.graphAreaEnd.y;

        this.animationTime = 700;

        this.dotSet = [
            {"x": 0, "y": Math.round((this.graphAreaBegin.y - this.graphAreaEnd.y) / 2)},
            {"x": this.graphAreaLengthByX, "y": Math.round((this.graphAreaBegin.y - this.graphAreaEnd.y) / 2)},
        ];
    }

    //Очистка поля и отрисовка осей координат
    initField() {
        this.display.strokeStyle = "gray";
        this.display.clearRect(0, 0, this.displayWidth, this.displayHeight);
        this.display.beginPath();
        this.display.moveTo(this.displayPadding, this.displayPadding);
        this.display.lineTo(this.displayPadding, this.displayHeight - this.displayPadding);
        this.display.lineTo(this.displayWidth - this.displayPadding, this.displayHeight - this.displayPadding);
        this.display.stroke();
    }

    //Отрисовка графика на основе массива координат
    drawPath(dots) {
        let path;
        (dots) ? path = dots : path = this.dotSet;
        this.display.clearRect(this.graphAreaBegin.x - 10,
            this.graphAreaBegin.y - this.graphAreaLengthByY - 5,
            this.graphAreaLengthByX + 20,
            this.graphAreaLengthByY + 10);
        this.display.beginPath();
        this.display.fillStyle = "white";
        this.display.strokeStyle = "black";
        path.forEach((item, i) => {
            if (i === 0) {
                this.display.moveTo(this.graphAreaBegin.x + item.x, this.graphAreaBegin.y - item.y);
            } else {
                if (i === path.length - 1) item.x = this.graphAreaLengthByX; //для сброса погрешности на округлениях
                this.display.lineTo(this.graphAreaBegin.x + item.x, this.graphAreaBegin.y - item.y);
            }
        });
        this.display.stroke();

        this.display.beginPath();
        path.forEach((item, i) => {
            if (i === 0) {
                this.display.moveTo(this.graphAreaBegin.x + item.x, this.graphAreaBegin.y - item.y);

                this.display.arc(this.graphAreaBegin.x + item.x, this.graphAreaBegin.y - item.y, 4, 0, (Math.PI / 180) * 360, true)
            } else {
                this.display.moveTo(this.graphAreaBegin.x + item.x, this.graphAreaBegin.y - item.y);

                if (i === path.length - 1) item.x = this.graphAreaLengthByX; //для сброса погрешности на округлениях
                this.display.arc(this.graphAreaBegin.x + item.x, this.graphAreaBegin.y - item.y, 4, 0, (Math.PI / 180) * 360, true)
            }
        });
        this.display.stroke();
        this.display.fill();
    }

    //Генерация массива точек заданной или случайной длины (при отсутствии параметров)
    generateDots(dotCount) {
        if (!dotCount) dotCount = this.getRandom(2, 10);
        const augment = Math.round(this.graphAreaLengthByX / (dotCount - 1));
        let dots = [];
        for (let i = 0; i < dotCount; i++) {
            dots.push({'x': augment * i, 'y': this.getRandom(0, this.graphAreaLengthByY)});
        }
        return dots;
    }

    //Генератор псевдослучайных чисел в заданном диапазоне
    getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //Генерация массива промежуточных координат для отрисовки анимации перехода
    setupAnimate() {
        let arrayStart = this.dotSet;
        let arrayFinish = this.generateDots();
        this.dotSet = arrayFinish;
        if (arrayStart.length !== arrayFinish.length) {
            if (arrayStart.length > arrayFinish.length) {
                arrayFinish = this.arrayNormalize(arrayStart, arrayFinish);
            } else {
                arrayStart = this.arrayNormalize(arrayStart, arrayFinish);
            }
        }
        let start = null;
        const drawFrame = (timestamp) => {
            if (!start) start = timestamp;
            let progress = timestamp - start;
            if (progress > this.animationTime) progress = this.animationTime;
            let arrayCurrent = [];
            for (let i = 0; i < arrayStart.length; i++) {
                arrayCurrent.push({
                    'x': this.positionCalculate(arrayStart[i].x, arrayFinish[i].x, this.animationTime, progress),
                    'y': this.positionCalculate(arrayStart[i].y, arrayFinish[i].y, this.animationTime, progress),
                });
            }
            this.dotSet = arrayCurrent.reduce((accumulator, item, index, array) => {
                if (index < (array.length - 1)) {
                    if (array[index].x !== array[index + 1].x) {
                        accumulator.push(item);
                    }
                } else {
                    accumulator.push(array[array.length-1]);
                }
                return accumulator;
            }, []);
            this.drawPath(arrayCurrent);
            if ((timestamp - start) < this.animationTime) {
                window.requestAnimationFrame(drawFrame);
            }
        }
        window.requestAnimationFrame(drawFrame);
    }

    //Расчёт позиции
    positionCalculate(begin, end, duration, progress) {
        return Math.round(begin + Math.round(((end - begin) / duration) * progress));
    }

    // Приведение более короткого массива к более длинному.
    // Создаёт пары недостающие пары координат для длинного массива копируя ближайшие (по оси Х) значения короткого.
    // По этим траекториям происходит разделение либо слияние точек.
    arrayNormalize(arrayA, arrayB) {
        let shortArray;
        let longArray;
        if (arrayA.length !== arrayB.length) {
            if (arrayA.length > arrayB.length) {
                shortArray = arrayB;
                longArray = arrayA;
            } else {
                shortArray = arrayA;
                longArray = arrayB;
            }
            return longArray.map((itemOfBig) => {
                let differences = shortArray.map((itemOfSmall) => {
                    return Math.abs(itemOfSmall.x - itemOfBig.x);
                })
                return shortArray[differences.indexOf(Math.min(...differences))];
            })
        } else {
            console.log('Error: array length are equal...');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const elArea = document.getElementById("canvas");
    const aniGraph = new GraphBuilder(elArea,);
    aniGraph.initField();
    aniGraph.setupAnimate();
    elArea.addEventListener('click', () => {
        aniGraph.setupAnimate();
    });
});

