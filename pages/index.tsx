import {
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

type Props = {
    countryList: Array<Entity>,
    institutionList: Array<Entity>,
    autocomplete: Array<object>
}


const IndexPage = ({countryList, institutionList, autocomplete}: Props) => {
    // On mobile grid should take up entire screen
    const colSpan = useBreakpointValue({base: 6, xl: 4});

    return (
        <Layout>
            <Heading>Open Access Dashboard</Heading>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sem sapien, pellentesque vitae feugiat
                rhoncus, gravida pretium
                nulla. Sed non sapien pulvinar, facilisis dolor aliquet, eleifend purus. Morbi ultrices velit eu ante
                dapibus, eget ullamcorper mauris
                convallis. Maecenas bibendum neque sit amet urna consequat posuere eu eu risus.</Text>
            <SimpleGrid columns={6}>
                <GridItem colSpan={colSpan}>
                    <Tabs isFitted variant='enclosed'>
                        <TabList>
                            <Tab>Country</Tab>
                            <Tab>Institution</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <IndexTable entities={countryList} categoryName='Country'/>
                            </TabPanel>
                            <TabPanel>
                                <IndexTable entities={institutionList} categoryName='Institution'/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </GridItem>
                {/*<GridItem colSpan={1} display={{base: 'none', xl: 'flex'}}>*/}
                {/*    <Filters/>*/}
                {/*</GridItem>*/}
            </SimpleGrid>
        </Layout>
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