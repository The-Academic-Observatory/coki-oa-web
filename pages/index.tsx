import {
    Box,
    GridItem,
    Heading,
    SimpleGrid,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useBreakpointValue
} from '@chakra-ui/react';
import {Entity} from "../lib/model";
import {getAutocompleteData, getIndexTableData} from "../lib/api";
import Layout from "../components/Layout";
import React from 'react';
import IndexTable from "../components/IndexTable";
import Icon from "../components/Icon";

type Props = {
    countryList: Array<Entity>,
    institutionList: Array<Entity>,
    autocomplete: Array<object>
}
const countryText = "Open Access by country. Showing output counts, number and proportion of accessible outputs published between 1800 and 2021. You can sort and filter by region, subregion, number of publications, and open access levels. You may also search for a specific country.";
const institutionText = "Open Access by institution. Showing output counts, number and proportion of accessible outputs published between 1800 to 2021. You can sort and filter by region, subregion, country, institution type, number of publications or open access levels. You may also search for a specific institution.";

const maxTabsWidth = '970px';


const IndexPage = ({countryList, institutionList, autocomplete}: Props) => {
    // On mobile grid should take up entire screen
    const colSpan = useBreakpointValue({base: 6, xl: 4});

    return (
        <Box>
            <SimpleGrid columns={6} >
                <GridItem colSpan={colSpan}
                          maxWidth={maxTabsWidth}>
                    <Box pb="40px">
                        <Heading fontSize="25px"
                                 textTransform="uppercase"
                                 pb="12px"
                                 color="brand.500">Open Access Dashboard</Heading>
                        <Text fontSize="23px"
                              fontWeight="600"
                              color="gray.900">{countryText}</Text>
                    </Box>

                    <Tabs isFitted variant='dashboard' bg="white">
                        <TabList>
                            <Tab><Icon icon="website"
                                       size={24}
                                       marginRight="6px"/>Country</Tab>
                            <Tab><Icon icon="institution"
                                       size={24}
                                       marginRight="6px"/>Institution</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel p={0}>
                                <IndexTable entities={countryList} categoryName='Country'/>
                            </TabPanel>
                            <TabPanel p={0}>
                                <IndexTable entities={institutionList} categoryName='Institution'/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                </GridItem>
                {/*<GridItem colSpan={1} display={{base: 'none', xl: 'flex'}}>*/}
                {/*    <Filters/>*/}
                {/*</GridItem>*/}
            </SimpleGrid>
            {/*<Image display={{base: 'none', md: 'block'}}*/}
            {/*       htmlWidth="56%"*/}
            {/*       maxWidth="900px"*/}
            {/*       position="absolute"*/}
            {/*       top={136}*/}
            {/*       right={0}*/}
            {/*       zIndex={0}*/}
            {/*       // height={100}*/}
            {/*       objectPosition='right -136px'*/}
            {/*       objectFit={'cover'}*/}
            {/*       src='/coki-background.svg'*/}
            {/*       alt='Curtin Logo'/>*/}
        </Box>
    )
}

export async function getStaticProps() {
    const countryList = getIndexTableData('country'); //.slice(0, 30);
    const institutionList = getIndexTableData('institution'); //.slice(0, 30);
    const autocomplete = getAutocompleteData();
    return {
        props: {
            countryList: countryList,
            institutionList: institutionList,
            autocomplete: autocomplete
        }
    }
}

export default IndexPage

// <div className={styles.container}>
//     <Head>
//         <title>COKI Open Access Dashboard</title>
//         <meta name="description" content="COKI Open Access Dashboard"/>
//         <link rel="icon" href="/favicon.ico"/>
//     </Head>


{/*<main className={styles.main}>*/
}
{/*    <div>*/
}
{/*        <h1>Countries</h1>*/
}
{/*        <ul>*/
}
{/*            <li>*/
}
{/*                {countryList.map((entity) => {*/
}
{/*                    return <li key={entity.id}>*/
}
{/*                        <Link href={`/${entity.category}/${entity.id}`}>*/
}
{/*                            <a>{entity.name}</a>*/
}
{/*                        </Link>*/
}
{/*                    </li>*/
}
{/*                })}*/
}
{/*            </li>*/
}
{/*        </ul>*/
}

{/*        <h1>Institutions</h1>*/
}
{/*        <ul>*/
}
{/*            <li>*/
}
{/*                {institutionList.map((entity) => {*/
}
{/*                    return <li key={entity.id}>*/
}
{/*                        <Link href={`/${entity.category}/${entity.id}`}>*/
}
{/*                            <a>{entity.name}</a>*/
}
{/*                        </Link>*/
}
{/*                    </li>*/
}
{/*                })}*/
}
{/*            </li>*/
}
{/*        </ul>*/
}
{/*    </div>*/
}
{/*</main>*/
}