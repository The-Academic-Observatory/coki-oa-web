import {Entity} from '../../lib/model';
import {getEntity, getEntityIds, idsToStaticPaths} from '../../lib/api';
import Link from "../../components/Link";

const category = 'institution';

type Props = {
    entity: Entity
}

export default function Institution({ entity }: Props) {
    return (
        <>
            {entity.id}
            <br />
            {entity.name}
            <br />
            <Link href="/">Back</Link>
        </>
    )
}

type Params = {
    params: {
        id: string
    }
}

export async function getStaticProps({params}: Params) {
    const entity = getEntity(category, params.id);
    return {
        props: {
            entity
        }
    }
}

export async function getStaticPaths() {
    const ids = getEntityIds(category);
    return {
        paths: idsToStaticPaths(ids),
        fallback: false
    }
}