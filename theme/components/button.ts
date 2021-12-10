const Button = {
    variants: {
        dashboard: {
            bgColor: 'brand.500',
            color: 'white',
            transitionProperty: "common",
            transitionDuration: "normal",
            fontFamily: 'Brandon Grotesque Medium',
            fontSize: '12px',
            fontWeight: "normal",
            borderRadius: '25px',
            height: '24px',
            paddingLeft: '12px',
            paddingRight: '12px',
            _hover: {
                bgColor: 'brand.600',
                cursor: 'pointer'
            }
        }
    }
}

export default Button;