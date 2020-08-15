document.addEventListener('DOMContentLoaded', () => {


    const xAxisLength = 340;
    const yAxisLength = 230;

    const zeroX = 30;
    const zeroY = 30 + yAxisLength;

    const xAxisWork = xAxisLength - 20;
    const yAxisWork = yAxisLength - 20;

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    const initField = () => {
        ctx.clearRect(0,0,400,300);
        ctx.beginPath();

        ctx.moveTo(zeroX, zeroY - yAxisLength);
        ctx.lineTo(zeroX, zeroY);
        ctx.lineTo(zeroX + xAxisLength, zeroY);
        ctx.stroke();
    }

    const getDots = (xAxisWork, yAxisWork, dotCount) => {
        const getRandom = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        if (!dotCount) dotCount = getRandom(2, 10);
        const augment = Math.round(xAxisWork / dotCount);

        let dots = [];

        for (let i = 1; i <= dotCount; i++) {
            dots.push({'x': augment * i, 'y': getRandom(10, yAxisWork)});
        }
        return dots;
    }
    const drawPath = (canvas, zeroX, zeroY, dots) => {
        dots.forEach((item, i) => {
            if (i === 0) {
                canvas.stroke();
                canvas.moveTo(zeroX + item.x, zeroY - item.y);
            } else {
                canvas.lineTo(zeroX + item.x, zeroY - item.y);
            }
        });
        ctx.stroke();
        console.log(dots);
    }

    const getRandom = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    initField();
//  drawMarksOnAbs(getRandom(2, 10), zeroX, zeroY, xAxisWork);
//  console.log(getDots(xAxisWork, yAxisWork));
//  drawPath(ctx, zeroX, zeroY, getDots(xAxisWork, yAxisWork));


    const clickHandler = (event) => {
        if (event.target.id==='canvas') {
            initField();

            drawPath(ctx, zeroX, zeroY, getDots(xAxisWork, yAxisWork));



        }
    }
    document.addEventListener('click', clickHandler);

});