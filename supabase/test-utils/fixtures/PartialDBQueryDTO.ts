import type { Option } from '../../../packages/types';
import { makeDBResponseDataFromSelect } from './DBResponseData.ts';
import { makeDBResponseDataFromSQLFunction } from './DBResponseData.ts';


export function makeTableRowsSQLFunction(name: string): Partial<{table: string, rows: any[], sqlFunction: string}> {
    switch (name) {
        case 'links':
            return {table :'links', rows: undefined, sqlFunction: undefined}
        case 'contents':
            return {table :'contents', rows: undefined, sqlFunction: undefined}
        case 'summaries':
            return {table :'summaries', rows: undefined, sqlFunction: undefined}
        case 'fragments':
            return {table :'fragments', rows: undefined, sqlFunction: undefined}
        case 'chunks':
            return {table :'chunks', rows: undefined, sqlFunction: undefined}
        case 'vectors':
            return {table :'vectors', rows: undefined, sqlFunction: undefined}
        case 'matches':
            return {table :'matches', rows: undefined, sqlFunction: undefined}
        case 'questions':   
            return {table :'questions', rows: undefined, sqlFunction: undefined}
        case 'modified_questions':
            return {table :'modified_questions', rows: undefined, sqlFunction: undefined}
        case 'answers':
            return {table :'answers', rows: undefined, sqlFunction: undefined}
        case 'questions_matching_chunks':
            return {table :'questions_matching_chunks', rows: undefined, sqlFunction: undefined}
        case 'questions_to_answer_with_chunks':
            return {table :'questions_to_answer_with_chunks', rows: undefined, sqlFunction: undefined}
        case 'chunks_to_vectorize':
            return {table :'chunks_to_vectorize', rows: undefined, sqlFunction: undefined}
        case 'questions_neighbours_chunks':
            return {table :'questions_neighbours_chunks', rows: undefined, sqlFunction: undefined}
        case 'matches_to_answer_with_chunks':
            return {table :'matches_to_answer_with_chunks', rows: undefined, sqlFunction: undefined}
        case 'insert_into_links':
            return {table :undefined, rows: makeDBResponseDataFromSQLFunction('insert_into_links'), sqlFunction: 'insert_into_links'}
        case 'insert_into_contents':
            return {table :undefined, rows: makeDBResponseDataFromSQLFunction('insert_into_contents'), sqlFunction: 'insert_into_contents'}
        case 'insert_into_summaries':
            return {table :undefined, rows: makeDBResponseDataFromSQLFunction('insert_into_summaries'), sqlFunction: 'insert_into_summaries'}    
        case 'insert_into_fragments':
            return {table :undefined, rows: makeDBResponseDataFromSQLFunction('insert_into_fragments'), sqlFunction: 'insert_into_fragments'}
        case 'insert_into_chunks':
            return {table :undefined, rows: makeDBResponseDataFromSQLFunction('insert_into_chunks'), sqlFunction: 'insert_into_chunks'}
        case 'insert_into_vectors':
            return {table :undefined, rows: makeDBResponseDataFromSQLFunction('insert_into_vectors'), sqlFunction: 'insert_into_vectors'}
        case 'insert_into_matches':
            return {table :undefined, rows: makeDBResponseDataFromSQLFunction('insert_into_matches'), sqlFunction: 'insert_into_matches'}
        case 'insert_into_questions':
            return {table :undefined, rows: makeDBResponseDataFromSQLFunction('insert_into_questions'), sqlFunction: 'insert_into_questions'}
        case 'insert_into_modified_questions':
            return {table :undefined, rows: makeDBResponseDataFromSQLFunction('insert_into_modified_questions'), sqlFunction: 'insert_into_modified_questions'}
        case 'insert_into_answers':
            return {table :undefined, rows: makeDBResponseDataFromSQLFunction('insert_into_answers'), sqlFunction: 'insert_into_answers'}
        default:
            return {table: undefined, rows: undefined, sqlFunction: undefined}
    }
}