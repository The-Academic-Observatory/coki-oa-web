import {Entity} from './model';
import fs from 'fs'
import {join} from 'path'

const dataPath: string = <string>process.env.DATA_PATH;


export function getEntityIds(category: string) {
    const path = join(dataPath, category);
    return fs.readdirSync(path).map((fileName) => fileName.replace(/\.json$/, ''));
}

export function idsToStaticPaths(ids: Array<string>) {
    return ids.map((entityId) => {
        return {
            params: {
                id: entityId,
            },
        }
    })
}

export function getEntity(category: string, id: string,): Entity {
    const filePath = join(dataPath, category, `${id}.json`);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getIndexTableData(category: string) {
    const filePath = join(dataPath, `${category}.json`);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getAutocompleteData() {
    const filePath = join(dataPath, `autocomplete.json`);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
