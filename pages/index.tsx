import type {NextPage} from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {getAutocompleteData, getIndexTableData} from "../lib/api";
import {Entity} from "../lib/model";

type Props = {
    countryList: Array<Entity>,
    institutionList: Array<Entity>,
    autocomplete: Array<object>
}

const Home: NextPage = ({countryList, institutionList, autocomplete}: Props) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>COKI Open Access Dashboard</title>
                <meta name="description" content="COKI Open Access Dashboard"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <div>
                    <h1>Countries</h1>
                    <ul>
                        <li>
                            {countryList.map((entity) => {
                                return <li key={entity.id}>
                                    <Link href={`/${entity.category}/${entity.id}`}>
                                        <a>{entity.name}</a>
                                    </Link>
                                </li>
                            })}
                        </li>
                    </ul>

                    <h1>Institutions</h1>
                    <ul>
                        <li>
                            {institutionList.map((entity) => {
                                return <li key={entity.id}>
                                    <Link href={`/${entity.category}/${entity.id}`}>
                                        <a>{entity.name}</a>
                                    </Link>
                                </li>
                            })}
                        </li>
                    </ul>
                </div>
            </main>

            <footer className={styles.footer}>

            </footer>
        </div>
    )
}

export async function getStaticProps() {
    const countryList = getIndexTableData('country').slice(0, 30);
    const institutionList = getIndexTableData('institution').slice(0, 30);
    const autocomplete = getAutocompleteData();
    return {
        props: {
            countryList: countryList,
            institutionList: institutionList,
            autocomplete: autocomplete
        }
    }
}

export default Home
