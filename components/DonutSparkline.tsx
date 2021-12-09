import {HStack, Text} from "@chakra-ui/react";

function calcDonutSettings(value: number, color: string, strokeWidth = 5, size = 24) {
    let r = (size - strokeWidth) / 2;
    let c = size / 2.0;
    let circumference = 2 * Math.PI * r;
    let seg1 = value / 100.0 * circumference;
    let seg2 = circumference - seg1;
    let bgOffset = 0.25 * circumference;  // move 25% anti-clockwise
    let fgOffset = seg2 + bgOffset;
    let bgStrokeDasharray: Array<number> = [seg1, seg2];
    let fgStrokeDasharray: Array<number> = [seg2, seg1];

    return {
        strokeWidth: strokeWidth,
        size: size,
        r: r,
        c: c,
        circumference: circumference,
        bgStrokeDasharray: bgStrokeDasharray,
        fgStrokeDasharray: fgStrokeDasharray,
        bgOffset: bgOffset,
        fgOffset: fgOffset
    }
}

type Props = {
    value: number,
    color: string
}


const DonutSparkline = ({value, color}: Props) => {
    let s = calcDonutSettings(value, color);
    return (
        <HStack spacing={1}>
            <Text>{value.toFixed(0)}%</Text>
            <svg width={24} height={24} viewBox="0 0 24 24">
                <circle cx={s.c} cy={s.c} fillOpacity="0" r={s.r} stroke={color}
                        strokeDasharray={s.bgStrokeDasharray.join(" ")} strokeDashoffset={s.bgOffset}
                        strokeWidth={s.strokeWidth}/>
                <circle cx={s.c} cy={s.c} fillOpacity={0} r={s.r} stroke="#ededed"
                        strokeDasharray={s.fgStrokeDasharray.join(" ")} strokeDashoffset={s.fgOffset}
                        strokeWidth={s.strokeWidth}/>
            </svg>
        </HStack>
    )
};

export default DonutSparkline;