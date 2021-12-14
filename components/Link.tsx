import {Link as ChakraLink} from "@chakra-ui/react"
import NextLink from 'next/link'
import {ReactNode} from "react";


const Link = ({href, children, ...rest}: { href: string, children: ReactNode }) => {
    return (
        <NextLink href={href} passHref>
            <ChakraLink {...rest}>{children}</ChakraLink>
        </NextLink>
    )
};

export default Link;