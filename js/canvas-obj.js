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

        this.animationTime = 300;

        this.dotSet = [
            {"x": 0, "y": Math.round((this.graphAreaBegin.y - this.graphAreaEnd.y) / 2)},
            {"x": this.graphAreaLengthByX, "y": Math.round((this.graphAreaBegin.y - this.graphAreaEnd.y) / 2)},
        ];
    }

    initField() {
        this.display.strokeStyle = "gray";

        this.display.clearRect(0, 0, this.displayWidth, this.displayHeight);
        this.display.beginPath();
        this.display.moveTo(this.displayPadding, this.displayPadding);
        this.display.lineTo(this.displayPadding, this.displayHeight - this.displayPadding);
        this.display.lineTo(this.displayWidth - this.displayPadding, this.displayHeight - this.displayPadding);
        this.display.stroke();
    }

    drawPath(dots) {
        let path;
        (dots) ? path = dots : path = this.dotSet;
        this.display.clearRect(this.graphAreaBegin.x - 5,
            this.graphAreaBegin.y - this.graphAreaLengthByY - 5,
            this.graphAreaLengthByX + 10,
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

    generateDots(dotCount) {
        if (!dotCount) dotCount = this.getRandom(2, 10);
        console.log(dotCount);
        const augment = Math.round(this.graphAreaLengthByX / (dotCount - 1));
        let dots = [];

        for (let i = 0; i < dotCount; i++) {
            dots.push({'x': augment * i, 'y': this.getRandom(0, this.graphAreaLengthByY)});
        }
        return dots;
    }

    getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    drawAnimate(callback) {
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
            this.drawPath(arrayCurrent);

            if ((timestamp - start) < this.animationTime) {
                window.requestAnimationFrame(drawFrame);
            } else {
                callback();
            }
        }
        window.requestAnimationFrame(drawFrame);

    }

    positionCalculate(begin, end, duration, progress) {
        return Math.round(begin + Math.round(((end - begin) / duration) * progress));
    }

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

            let arrayFilled = longArray.map((itemOfBig) => {
                let differences = shortArray.map((itemOfSmall) => {
                    return Math.abs(itemOfSmall.x - itemOfBig.x);
                })
                return shortArray[differences.indexOf(Math.min(...differences))];
            })

            console.log(arrayFilled);
            return arrayFilled;
        } else {
            console.log('Error: array length are equal...');
        }


    }

    /*
        drawLoop() {
            setInterval(() => {
                let arrayStart = [{"x": 50, "y": 40}, {"x": 90, "y": 60}, {"x": 180, "y": 80}, {"x": 330, "y": 40}]
                let arrayFinish = [{"x": 50, "y": 40}, {"x": 90, "y": 210}, {"x": 180, "y": 180}, {"x": 330, "y": 40}]
                let arrayCurrent = [];
                for (let i = 0; i < arrayStart.length; i++) {
                    arrayCurrent.push({
                        'x': this.currentCalculate(arrayStart[i].x, arrayFinish[i].x, this.animationTime, this.animationProgress),
                        'y': this.zeroY - this.currentCalculate(arrayStart[i].y, arrayFinish[i].y, this.animationTime, this.animationProgress),
                    })
                }

                this.display.clearRect(31, 0, 400, 269);
                this.display.beginPath();
                arrayCurrent.forEach((item, index) => {
                    if (index = 0) {
                        this.display.beginPath();
                        this.display.moveTo(item.x, item.y);
                    } else {
                        this.display.lineTo(item.x, item.y);
                    }
                });
                this.display.stroke();


                if (this.animationProgress >= 1000) this.direction = false;

                if (this.animationProgress <= 0) this.direction = true;

                if (this.direction) {
                    this.animationProgress = this.animationProgress + 1;
                } else {
                    this.animationProgress = this.animationProgress - 1;
                }

            }, 1);
        }

        drawAnimate() {
            let arrayStart = [{"x": 50, "y": 40}, {"x": 90, "y": 60}, {"x": 90, "y": 60}, {"x": 330, "y": 40}]
            let arrayFinish = [{"x": 50, "y": 40}, {"x": 90, "y": 210}, {"x": 180, "y": 230}, {"x": 330, "y": 40}]
            let start = null;
            const drawFrame = (timestamp) => {
                let arrayCurrent = [];
                for (let i = 0; i < arrayStart.length; i++) {
                    arrayCurrent.push({
                        'x': this.currentCalculate(arrayStart[i].x, arrayFinish[i].x, this.animationTime, timestamp - start),
                        'y': this.zeroY - this.currentCalculate(arrayStart[i].y, arrayFinish[i].y, this.animationTime, timestamp - start),
                    })
                }

                if (!start) start = timestamp;
                this.display.clearRect(31, 0, 400, 269);
                this.display.beginPath();
                arrayCurrent.forEach((item, index) => {
                    if (index === 0) {
                        this.display.beginPath();
                        this.display.moveTo(item.x, item.y);
                    } else {
                        this.display.lineTo(item.x, item.y);
                    }
                });
                this.display.stroke();
                if ((timestamp - start) < 1000) window.requestAnimationFrame(drawFrame);

            }
            window.requestAnimationFrame(drawFrame);

        }


        currentCalculate(begin, end, stepCount, currentStep) {
            return begin + ((end - begin) / stepCount) * currentStep;
        }

        generateDots(dotCount) {
            if (!dotCount) dotCount = this.getRandom(2, 10);
            const augment = Math.round(this.displayWidth - 20 / dotCount);

            let dots = [];

            for (let i = 1; i <= dotCount; i++) {
                dots.push({'x': augment * i, 'y': this.getRandom(10, yAxisWork)});
            }
            return dots;
        }


    */
}

document.addEventListener('DOMContentLoaded', () => {

    const elArea = document.getElementById("canvas");

    const aniGraph = new GraphBuilder(elArea,);
    aniGraph.initField();
    aniGraph.drawPath();
    //aniGraph.drawAnimate();

    const clickHandler = () => {


        elArea.removeEventListener('click', clickHandler);
        aniGraph.drawAnimate(() => {
            elArea.addEventListener('click', clickHandler);
        });


    }


    elArea.addEventListener('click', clickHandler);


});

