document.addEventListener('DOMContentLoaded', () => {


    const xAxisLength = 340;
    const yAxisLength = 230;

    const zeroX = 50;
    const zeroY = 30 + yAxisLength;

    const xAxisWork = xAxisLength - 40;
    const yAxisWork = yAxisLength - 20;

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let previosDots = [{"x": 20, "y": 50}, {"x": xAxisWork, "y": 50}];

    const initField = () => {
console.log('cls');
        ctx.clearRect(0,0,400,300);
        ctx.beginPath();

        ctx.moveTo(zeroX-20, zeroY - yAxisLength);
        ctx.lineTo(zeroX-20, zeroY);
        ctx.lineTo(zeroX + xAxisLength, zeroY);

        ctx.moveTo(zeroX+xAxisWork, zeroY);
        ctx.lineTo(zeroX+xAxisWork, zeroY-300);


        ctx.stroke();
    }

    const drawMarksOnAbs = (dotCount, zeroX, zeroY, area) => {
        ctx.beginPath();
        for (let i = 1; i <= dotCount; i++) {
            console.log(dotCount);
            const augment = area / dotCount;
            ctx.moveTo(zeroX + i * augment, zeroY);
            ctx.lineTo(zeroX + i * augment, zeroY + 10);
        }
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

        for (let i = 0; i <= dotCount; i++) {
            dots.push({'x': augment * i, 'y': getRandom(10, yAxisWork)});
        }
        return dots;
    }
    const drawPath = (canvas, zeroX, zeroY, dots) => {
        dots.forEach((item, i) => {
            if (i === 0) {
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