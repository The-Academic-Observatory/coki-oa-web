import React from "react";
import IcoMoon from "react-icomoon";
import {Box, BoxProps} from "@chakra-ui/react";


const iconSet = require("./selection.json");


interface IconProps extends BoxProps {
    icon: string
    size: number
}

const Icon = ({icon, size, ...rest}: IconProps) => {
    const pixelSize = size / 4;

    return (
        <Box width={pixelSize} height={pixelSize} {...rest}>
            <IcoMoon iconSet={iconSet} icon={icon} size={size}/>
        </Box>)
};

export default Icon;