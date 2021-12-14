import React, {ReactNode} from 'react'
import {
    Box,
    BoxProps, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    Drawer,
    DrawerContent,
    Flex,
    FlexProps,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Stack,
    StackProps,
    Text,
    useBreakpointValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'

import Icon from './Icon'
import {SearchIcon} from '@chakra-ui/icons'
import Link from './Link'

interface LinkProps {
    name: string;
    icon: string;
    href: string;
}

const cokiLogoWidthMobile = 146;
const cokiLogoWidthDesktop = 269;
const curtinLogoWidthDesktop = 245;
const curtinLogoWidthMobile = 210;

const iconSize: number = 48;
const navbarHeightMobile: number = 68;
const navbarHeightDesktop: number = 136;
const navbarLrPaddingMobile = 22;
const navbarLrPaddingDesktop = 40 / 4;


const sidebarPaddingLeft = 32 / 4;
const sidebarWidth: number = 340; //374

const navFooterColor = {base: 'grey.900', md: 'grey.100'};
const footerFontSize = "1em";
const footerFontFamily = "Brandon Grotesque Medium";

const links: Array<LinkProps> = [
    {name: 'Open Access Dashboard', icon: 'dashboard', href: '/'},
    {name: 'Open Access', icon: 'open', href: '/open'},
    {name: 'How it Works', icon: 'how', href: '/how'},
    {name: 'Data', icon: 'data', href: '/data'},
    {name: 'About', icon: 'about', href: '/about'},
    {name: 'Contact', icon: 'contact', href: '/contact'},
];


export default function Layout({
                                   children,
                               }: {
    children: ReactNode;
}) {
    const {
        isOpen: isOpenSidebar,
        onOpen: onOpenSidebar,
        onClose: onCloseSidebar
    } = useDisclosure()
    const {
        isOpen: isOpenSearch,
        onOpen: onOpenSearch,
        onClose: onCloseSearch
    } = useDisclosure()

    return (
        <Flex flexDirection='column' minH="100vh">
            <Box p={0}>
                <Navbar isOpenSidebar={isOpenSidebar} onOpenSidebar={onOpenSidebar} onCloseSidebar={onCloseSidebar}/>
                {/*onSearchOpen={onOpenSearch}*/}
                <Drawer
                    autoFocus={false}
                    isOpen={isOpenSidebar}
                    placement="left"
                    onClose={onCloseSidebar}
                    returnFocusOnClose={false}
                    onOverlayClick={onCloseSidebar}
                    size="full">
                    {/* pointerEvents={"none"} stops the drawer from blocking pointer events from the close button */}
                    <DrawerContent bg={'none'}
                                   pointerEvents={"none"}>
                        <SidebarContent onClose={onCloseSidebar}/>
                    </DrawerContent>
                </Drawer>
            </Box>

            <Flex flex={1}>
                <Box w={sidebarWidth}
                     bg='grey.400'
                     display={{base: 'none', md: 'block'}}>
                    <SidebarContent
                        w={sidebarWidth}
                        onClose={() => onCloseSidebar}
                        display={{base: 'none', md: 'block'}}/>
                </Box>
                <Box flex={1}
                     bg='grey.200'>
                    <Flex flexDirection='column'>
                        <Box flex={1}
                             px={{base: 0, md: '40px'}}
                             pt={{base: '30px', md: '50px'}}
                             pb={{base: '30px', md: '90px'}}>
                            <Breadcrumb pb="54px">
                                <BreadcrumbItem>
                                    <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <BreadcrumbLink href='/about'>About</BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem isCurrentPage>
                                    <BreadcrumbLink href='#'>Current</BreadcrumbLink>
                                </BreadcrumbItem>
                            </Breadcrumb>
                            {children}
                        </Box>
                    </Flex>
                </Box>
            </Flex>

            <Footer sidebarWidth={sidebarWidth}/>
        </Flex>
    );
}


interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({onClose, ...rest}: SidebarProps) => {
    const paddingTop = 90;
    return (
        <Box
            bg={{base: 'grey.100', md: 'grey.400'}}
            position={{base: "absolute", md: 'relative'}}
            top={{base: navbarHeightMobile, md: 0}}
            w={{base: 'full', md: 80}}
            pt={{base: 0, md: paddingTop}}
            {...rest}>

            {links.map((link) => (
                // pointerEvents={"auto"} enables the NavItem to receive mouse events
                <NavItem key={link.name}
                         icon={link.icon}
                         href={link.href}
                         text={link.name}
                         pointerEvents={"auto"}
                />
            ))}
        </Box>
    );
};

const Footer = ({...rest}) => {
    const padding = 10;

    return (
        <Flex>
            {/*Left side of the footer that makes the sidebar look like part of the footer*/}
            <Box w={sidebarWidth} minWidth={sidebarWidth}
                 bg='grey.400'
                 display={{base: 'none', md: 'block'}}>
                <Flex alignItems='center'
                      justifyContent='center'
                      h='full'>
                    <a href={'https://www.curtin.edu.au/'}
                       target={'_blank'}
                       rel="noreferrer">
                        <Image htmlWidth={curtinLogoWidthDesktop}
                               src='/logo-curtin.svg'
                               alt='Curtin Logo'/>
                    </a>
                </Flex>
            </Box>

            {/*base*/}
            <Flex flex={1}
                  display={{base: 'flex', md: 'none'}}
                  bg='grey.300'
                  borderTop='1px'
                  borderColor='grey.500'
                  p={padding}
                  flexDirection='column'
                  alignItems="center"
                  justifyContent='space-between'>

                <Flex
                    w='full'
                    alignItems="center"
                    justifyContent='space-between'>

                    <FooterLinks/>
                    <FooterSocialMedia/>
                </Flex>

                <Flex
                    w='full'
                    alignItems="center"
                    justifyContent='space-between'
                    pt={padding}>

                    <FooterCredits/>
                    <a href={'https://www.curtin.edu.au/'}
                       target={'_blank'}
                       rel="noreferrer">
                        <Image htmlWidth={curtinLogoWidthMobile}
                               src='/logo-curtin.svg'
                               alt='Curtin Logo'/>
                    </a>
                </Flex>

            </Flex>

            {/*md*/}
            <Flex flex={1}
                  display={{base: 'none', md: 'flex', lg: 'none', xl: 'none', '2xl': 'none'}}
                  bg='grey.900'
                  p="10"
                  flexDirection='column'
                  alignItems="center"
                  justifyContent='space-between'>

                <FooterLinks justifyContent={'space-between'} w={'full'} direction={'row'}/>

                <Flex
                    w='full'
                    alignItems="center"
                    justifyContent='space-between'
                    pt={padding}>

                    <FooterCredits/>
                    <FooterSocialMedia direction={'row'}/>
                </Flex>

            </Flex>

            {/*lg*/}
            <Flex flex={1}
                  display={{base: 'none', md: 'none', lg: 'flex'}}
                  bg='grey.900'
                  p="10"
                  flexDirection='row'
                  alignItems="center"
                  justifyContent='space-between'>

                <FooterCredits/>
                <FooterLinks spacing={padding} direction={'row'}/>
                <FooterSocialMedia direction={'row'}/>
            </Flex>
        </Flex>
    );
};

const FooterLinks = ({...rest}: StackProps) => {
    return (
        <Stack {...rest} >
            return (
            {links.map((l) => (
                <Link href={l.href}
                      color={navFooterColor}
                      fontSize={footerFontSize}
                      textTransform="uppercase"
                      fontFamily={footerFontFamily}>{l.name}</Link>
            ))}
            )
        </Stack>
    )
}

const FooterCredits = ({...rest}: StackProps) => {
    return (
        <VStack align="left" {...rest}>
            <Link href="https://clearbit.com/"
                  color={navFooterColor}
                  fontSize={footerFontSize}
                  fontFamily={footerFontFamily}>Company Logos by Clearbit</Link>
            <Link href="https://www.highcharts.com/"
                  color={navFooterColor}
                  fontSize={footerFontSize}
                  fontFamily={footerFontFamily}>Charts by Highcharts</Link>
        </VStack>
    )
}

const FooterSocialMedia = ({...rest}: StackProps) => {
    return (
        <Stack  {...rest}>
            <Flex alignItems="center" justifyContent="center">
                <Text color={navFooterColor}
                      display={{base: 'none', xl: 'block'}}
                      fontSize={footerFontSize}
                      textTransform="uppercase"
                      fontFamily={footerFontFamily}>Share</Text>
            </Flex>
            <a href={'https://twitter.com/'}
               target={'_blank'}
               rel="noreferrer">
                <Icon icon="twitter"
                      size={iconSize}
                      color={navFooterColor}/>
            </a>

            <a href={'https://www.linkedin.com/'}
               target={'_blank'}
               rel="noreferrer">
                <Icon icon="linkedin"
                      size={iconSize}
                      color={navFooterColor}/>
            </a>

            <a href={'https://www.facebook.com/'}
               target={'_blank'}
               rel="noreferrer">
                <Icon icon="facebook"
                      size={iconSize}
                      color={navFooterColor}/>
            </a>
        </Stack>
    )
}


interface NavbarProps extends FlexProps {
    isOpenSidebar: () => void;
    onOpenSidebar: () => void;
    onCloseSidebar: () => void;
}

const Navbar = ({isOpenSidebar, onOpenSidebar, onCloseSidebar, ...rest}: NavbarProps) => {
    // const [value, setValue] = useControllableState({ defaultValue: false });
    const iconSize = 24;
    return (
        <Flex
            px={{base: navbarLrPaddingMobile, md: navbarLrPaddingDesktop}}
            height={{base: navbarHeightMobile, md: navbarHeightDesktop}}
            alignItems="center"
            bg={navFooterColor}
            justifyContent='space-between'>

            <IconButton
                variant="clean"
                aria-label="Open menu"
                onClick={() => {
                    if (!isOpenSidebar) {
                        onOpenSidebar();
                    } else {
                        onCloseSidebar();
                    }
                }}
                icon={isOpenSidebar ? <Icon icon="cross" size={iconSize}/> : <Icon icon="burger" size={iconSize}/>}
                display={{base: 'flex', md: 'none'}}
                isRound
                size='lg'
                _focus={{
                    boxShadow: "none"
                }}
                _active={{
                    bg: "rgba(236, 236, 236, 0.3)",
                    boxShadow: "none",
                }}
                color={'grey.100'}
            />

            <Link href={'/'}>
                <Image htmlWidth={cokiLogoWidthDesktop}
                       src='/logo.svg'
                       alt='COKI Logo'
                       display={{base: 'none', md: 'block'}}/>

                <Image htmlWidth={cokiLogoWidthMobile}
                       src='/logo-white.svg'
                       alt='COKI Logo'
                       display={{base: 'block', md: 'none'}}/>
            </Link>

            <Image display={{base: 'none', md: 'block'}}
                   htmlWidth="56%"
                   maxWidth="900px"
                   position="absolute"
                   top={0}
                   right={0}
                   zIndex={0}
                   height={navbarHeightDesktop}
                   objectPosition='right top'
                   objectFit={'cover'}
                   src='/coki-background.svg'
                   alt='Curtin Logo'/>

            <InputGroup
                display={{base: 'none', md: 'flex'}}
                borderColor="grey.900"
                bg="white"
                rounded={50}
                w={388}>
                <InputLeftElement
                    pointerEvents='none'
                    children={<SearchIcon color='gray.900'/>}
                />
                <Input variant='outline'
                       rounded={50}
                       _placeholder={{textTransform: "uppercase", color: "gray.900"}}
                       color="gray.900"
                       focusBorderColor='brand.400'
                       fontFamily="Brandon Grotesque Medium"
                       placeholder='Search'/>
            </InputGroup>

            <IconButton
                variant='clean'
                display={{base: 'flex', md: 'none'}}
                aria-label="Search"

                isRound
                size='lg'
                _focus={{
                    boxShadow: "none"
                }}
                _active={{
                    bg: "rgba(236, 236, 236, 0.3)",
                    boxShadow: "none",
                }}
                color={'white'}
                icon={<Icon icon="search" size={iconSize}/>}
            />
        </Flex>
    );
};

interface NavItemProps extends FlexProps {
    icon: string;
    href: string;
    text: string;
}

const NavItem = ({icon, href, text, ...rest}: NavItemProps) => {
    const iconSize = 32;
    const height = 74;
    const borderRight = 5;
    const textSize = 16;
    const hover = useBreakpointValue({
        base: {
            bg: 'grey.500',
        },
        md: {
            bg: 'brand.500',
            color: 'grey.100',
            borderRight: borderRight,
            borderColor: 'brand.300',
            borderStyle: 'solid'
        }
    });
    const style = useBreakpointValue({
        base: {
            borderBottom: '1px',
            borderColor: '#EBEBEB',
            borderStyle: 'solid'
        },
        md: {}
    });

    return (
        <Link href={href} style={{textDecoration: 'none'}}>
            <Flex
                align="center"
                width={{base: 'full', md: sidebarWidth}}
                height={height}
                role="group"
                cursor="pointer"
                pl={sidebarPaddingLeft}
                style={style}
                _hover={hover}
                {...rest}>
                <Icon mr="2"
                      icon={icon}
                      size={iconSize}/>
                <Text textTransform="uppercase"
                      fontFamily="Brandon Grotesque Medium"
                      fontSize={textSize}
                      lineHeight={textSize / 4}>{text}</Text>
            </Flex>
        </Link>
    );
};
