type Props = {
    values: Array<number>,
    colors: Array<string>,
    width: number,
    height: number
}

export type Rect = {
    x: number,
    width: number,
    color: string
};


function calcRects(values: Array<number>, colors: Array<string>, width: number): Array<Rect> {
    let rects = [];
    const total = values.reduce((sum: number, n: number) => sum + n, 0);

    let x = 0;
    for (let i = 0; i < values.length; i++) {
        let value = values[i];
        let color = colors[i];
        let rectWidth = value / total * width;
        let rect: Rect = {
            x: x,
            width: rectWidth,
            color: color
        }
        rects.push(rect);
        x += rectWidth;
    }

    return rects;
}


const BreakdownSparkline = ({values, colors, width, height}: Props) => {
    const viewBox = [0, 0, width, height];
    const rects = calcRects(values, colors, width);
    return (
        <svg width={width} height={height} viewBox={viewBox.join(" ")}>
            return (
            {rects.map((rect) => (
                <rect x={rect.x} width={rect.width} height={height} fill={rect.color}/>
            ))}
            )
        </svg>
    )
};

export default BreakdownSparkline;