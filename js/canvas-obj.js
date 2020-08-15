class GraphBuilder {
    constructor(element, padding) {
        this.display = element.getContext("2d");
        this.displayWidth = element.width;
        this.displayHeight = element.height;
        this.displayPadding = padding;

        this.graphAreaBegin = {'x': this.displayPadding+20, 'y': this.displayHeight-(this.displayPadding+20)}
        this.graphAreaEnd = {'x': this.displayWidth-(this.displayPadding+20), 'y': this.displayPadding+20}

        this.animationTime = 1000; //
        this.animationProgress = 0;
    }

    initField() {
        this.display.clearRect(0, 0, this.displayWidth, this.displayHeight);
        this.display.beginPath();
        this.display.moveTo(this.zeroX - 20, 30);
        this.display.lineTo(this.zeroX - 20, this.zeroY);
        this.display.lineTo(this.displayWidth - 30, this.zeroY);
        this.display.stroke();
    }

    drawPath() {
        this.dots.forEach((item, i) => {
            if (i === 0) {
                this.display.beginPath();
                this.display.moveTo(this.zeroX + item.x, this.zeroY - item.y);
            } else {
                this.display.lineTo(this.zeroX + item.x, this.zeroY - item.y);
            }
        });
        this.display.stroke();
    }

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
        let arrayFinish = [{"x": 50, "y": 40}, {"x": 90, "y": 210}, {"x": 180, "y":230}, {"x": 330, "y": 40}]
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
            if ((timestamp - start)<1000) window.requestAnimationFrame(drawFrame);

        }
        window.requestAnimationFrame(drawFrame);

    }


    currentCalculate(begin, end, stepCount, currentStep) {
        return begin + ((end - begin) / stepCount) * currentStep;
    }

    generateDots(dotCount) {
        if (!dotCount) dotCount = this.getRandom(2, 10);
        const augment = Math.round(this.displayWidth-20 / dotCount);

        let dots = [];

        for (let i = 1; i <= dotCount; i++) {
            dots.push({'x': augment * i, 'y': this.getRandom(10, yAxisWork)});
        }
        return dots;
    }

    getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

document.addEventListener('DOMContentLoaded', () => {

    const elArea = document.getElementById("canvas");
    const aniGraph = new GraphBuilder(elArea, 400, 300);
    aniGraph.initField();
    aniGraph.drawPath();
    aniGraph.drawAnimate();

});