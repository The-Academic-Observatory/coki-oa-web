import {extendTheme, theme as base, withDefaultColorScheme, withDefaultVariant} from "@chakra-ui/react"
import {createBreakpoints} from '@chakra-ui/theme-tools'
import Table from './components/table'
import Button from './components/button'
import Tabs from './components/tabs'
import Breadcrumb from './components/breadcrumb'

const breakpoints = createBreakpoints({
    sm: '600px',
    md: '1000px',
    lg: '1600px',
    xl: '1920px',
    '2xl': '3840px',
})

const theme = extendTheme({
        breakpoints: breakpoints,
        colors: {
            brand: {
                100: '#FFECD1',
                200: '#FFD3A4',
                300: '#FFB38E', // FFB576
                400: '#FF9754',
                500: '#FF671C', // buttons
                600: '#D25A1F', // DB4914
                700: '#B7300E',
                800: '#931B08',
                900: '#7A0D05',
            },
            grey: {
                100: '#FFFFFF', // header
                200: '#FAFAFA', // contents background
                300: '#F7F7F7', // content top of dashboard bg / alternating row / mobile footer
                400: '#F2F2F2', // sidebar,
                500: '#EBEBEB', // tab not selected
                600: '#DFDFDF', //
                700: '#BFBFBF',
                800: '#A6A6A6', // deselected tab header text
                900: '#101820', // desktop footer
            }
        },
        fonts: {
            heading: `BrandonGrotesque-Bold, ${base.fonts?.heading}`,
            body: `Brandon Grotesque Light, ${base.fonts?.body}`
        },
        components: {
            Table,
            Button,
            Tabs,
            Breadcrumb
        },
    },

    withDefaultColorScheme({
        colorScheme: 'brand',
        components: ['Button'],
    }),
    withDefaultVariant({
        'variant': 'filled',
        components: ["Input", 'Select']
    })
);

export default theme;