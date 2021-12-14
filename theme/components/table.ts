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
                margin: {base: "14px 0 0 0", md: margin},
                fontSize: '50px',
                thead: {
                    th: {
                        bgColor: 'white',
                        fontFamily: 'Brandon Grotesque Black',
                        fontSize: '14px',
                        height: '50px',
                        verticalAlign: 'top',
                        textAlign: 'left',
                        textTransform: 'uppercase',
                        _first: {
                            position: 'sticky',
                            left: 0,
                        }
                    },
                },
                tbody: {
                    tr: {
                        height: '52px',
                        _even: {
                            background: "#F9FAFA",
                            td: {
                                _first: {
                                    background: {base: "#F9FAFA", md: 'none'},
                                }
                            }
                        },
                        _odd: {
                            background: "white",
                            td: {
                                _first: {
                                    background: {base: "white", md: 'none'},
                                }
                            }
                        },
                        _hover: {
                            position: 'relative',
                            background: 'white',
                            boxShadow: "0px 2px 25px 10px rgba(0,0,0,0.1)",
                            transform: 'scale(1)', // CSS box shadow not showing on odd rows: https://stackoverflow.com/questions/55046056/css-box-shadow-on-table-row-not-displaying-correctly,
                            td: {
                                _first: {
                                    background: {base: "white", md: 'none'},
                                }
                            }
                        },
                        td: {
                            textTransform: 'uppercase',
                            p: trFont,
                            span: trFont,
                            'z-index': 0,
                            _first: {
                                position: 'sticky',
                                left: 0,
                            },
                        }
                    }
                }
            },
        }
    }
}

export default Table;