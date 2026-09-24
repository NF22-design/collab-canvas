export const drawStroke = (ctx, stroke) => {
    if (!stroke.points || stroke.points.length < 2) return;

    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
};

export const redrawAll = (ctx, canvas, strokes) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach((stroke) => drawStroke(ctx, stroke));
};