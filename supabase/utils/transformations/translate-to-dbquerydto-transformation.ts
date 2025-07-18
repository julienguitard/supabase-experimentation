import type { Option } from "../../../packages/types";

export function edgeFunctionToStatement(edgeFunction:string):string{
    if (edgeFunction.includes('insert')){
        return 'insert';
    }
    else if (edgeFunction.includes('update')){
        return 'update';
    }
    else if (edgeFunction.includes('delete')){
        return 'delete';
    }
    else {
        return 'select';
    }
}

export function edgeFunctionToCacheTable(edgeFunction:string):Option<string>{
    switch (edgeFunction){
        case 'insert-links':
            return 'tmp_links_insert';
        case 'update-links':
            return 'tmp_links_update';
        case 'delete-links':
            return 'tmp_links_delete';
        default:
            return null;
    }
}

export function edgeFunctionToSQLFunction(edgeFunction:string):Option<string>{
    switch (edgeFunction){
        case 'insert-links':
            return 'insert_into_links';
        case 'update-links':
            return 'update_into_links';
        case 'delete-links':
            return 'delete_into_links';
        default:    
            return null;
    }
}

/*function translateToDBQueryDTO(edgeFunction:string,reqDTO:RequestDTO):DBQueryDTO{
    const {method, urlSearchParams, authHeader} = reqDTO;
    const statement = edgeFunctionToStatement(edgeFunction);
    switch (statement){
        case  'select' : {
            const {table, id} = urlSearchParams;
            if (id) {
                return {statement,table, id};
            }
            else {
                return {statement,table};
            }
        }
        case 'insert' : {
            const {table, id} = urlSearchParams;
            const body = reqDTO.body;
            if (id) {
                throw new Error('Inserting with an id is not allowed');
            }
            else {
                return {statement,table, body};
            }
        }
        case 'update' : {
            const {table, id} = urlSearchParams;
            const body = reqDTO.body;
            if (id) {
                throw new Error('Updating with an id is not allowed');
            }
            else {
                return {statement,table, body};
            }
        }
        case 'delete' : {
            const {table, id} = urlSearchParams;
            const body = reqDTO.body;
            if (id) {
                throw new Error('Deleting with an id is not allowed');
            }
            else {
                return {statement,table, body};
            }
        }
        default: {
            const {table, id} = urlSearchParams;
            if (id) {
                return {statement,table, id};
            }
            else {
                return {statement,table};
            }
        }

    }
}*/