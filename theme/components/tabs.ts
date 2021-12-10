const Tabs = {
    variants: {
        dashboard: {
            tab: {
                fontFamily: "Brandon Grotesque Black",
                color: '#b7b7b7',
                fontSize: "16px",
                textTransform: "uppercase",
                height: "60px",
                bgColor: "#f0f0f0",
                _selected: {
                    bgColor: "white",
                    color: 'brand.500',
                },
                _focus: {
                    boxShadow: "none",
                }
            }
        }
    }
}

export default Tabs;