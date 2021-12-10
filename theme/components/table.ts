const trFont = {
    fontFamily: 'Brandon Grotesque Medium',
    fontSize: '14px'
}

const margin = '24px'

const Table = {
    variants: {
        dashboard: {
            table: {
                width: `calc(100% - ${margin * 2})`,
                background: 'white',
                margin: '24px',
                fontSize: '50px',
                thead: {
                    th: {
                        fontFamily: 'Brandon Grotesque Black',
                        fontSize: '14px',
                        height: '50px',
                        verticalAlign: 'top',
                        textAlign: 'left',
                        textTransform: 'uppercase',
                    },
                },
                tbody: {
                    tr: {
                        height: '52px',
                        _even: {
                            background: "#F9FAFA",
                        },
                        _hover: {
                            background: 'white',
                            boxShadow: "0px 2px 25px 10px rgba(0,0,0,0.1)",
                            transform: 'scale(1)' // CSS box shadow not showing on odd rows: https://stackoverflow.com/questions/55046056/css-box-shadow-on-table-row-not-displaying-correctly
                        },
                        td: {
                            textTransform: 'uppercase',
                            p: trFont,
                            span: trFont
                        }
                    }
                }
            },
        }
    }
}

export default Table;