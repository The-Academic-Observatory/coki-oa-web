import {Entity} from '../../lib/model';
import {getEntity, getEntityIds, idsToStaticPaths} from '../../lib/api';

const category = 'country';

type Props = {
    entity: Entity
}

export default function Country({ entity }: Props) {
    return (
        <>
            {entity.id}
            <br />
            {entity.name}
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