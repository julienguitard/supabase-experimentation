export function makeDBResponseDataFromSelect(selectTable: string): any[] {
    switch (selectTable) {
        case 'links':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', url: 'https://example.com', category: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', url: 'https://example.com', category: 'test2', user_id: '456'}];
        case 'contents':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', link_id: '123', status: '200', content: 'test', error: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', link_id: '456', status: 'test2', content: 'test2', error: 'test2', user_id: '456'}];
        case 'summaries':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', content_id: '123', summary: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', content_id: '456', summary: 'test2', user_id: '456'}];
        case 'questions':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', question: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', question: 'test2', user_id: '456'}];
        case 'fragments':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', source_table: 'contents', source_column: 'test', source_id: '123', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', source_table: 'test2', source_column: 'test2', source_id: '456', user_id: '456'}];
        case 'chunks':      
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', fragment_id: '123', chunk: 'test', start_: 1, end_: 2, length_: 3, user_id: '123'},{id: '456', created_at: '2021-01-02', fragment_id: '456', chunk: 'test2', start_: 4, end_: 5, length_: 6, user_id: '456'}];
        case 'vectors':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', chunk_id: '123', embeddings: [1, 2, 3], user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', chunk_id: '456', embeddings: [4, 5, 6], user_id: '456'}];
        case 'matches':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', question_id: '123', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', question_id: '456', user_id: '456'}];
        case 'questions_matching_chunks':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', question_id: '123', chunk_id: '123', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', question_id: '456', chunk_id: '456', user_id: '456'}];
        case 'modified_questions':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', match_id: '123', modified_question: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', match_id: '456', modified_question: 'test2', user_id: '456'}];
        case 'answers':  
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', modified_question_id: '123', answer: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', modified_question_id: '456', answer: 'test2', user_id: '456'}];
        case 'links_to_scrape':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', url: 'https://example.com', category: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', url: 'https://example.com', category: 'test2', user_id: '456'}];
        case 'links_to_scrape_extract':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', url: 'https://example.com', category: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', url: 'https://example.com', category: 'test2', user_id: '456'}];
        case 'contents_to_summarize':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', link_id: '123', status: '200', content: 'test', error: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', link_id: '456', status: 'test2', content: 'test2', error: 'test2', user_id: '456'}];
        case 'contents_to_summarize_extract':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', link_id: '123', status: '200', content: 'test', error: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', link_id: '456', status: 'test2', content: 'test2', error: 'test2', user_id: '456'}];
        case 'entities_to_fragment':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', source_table: 'test', source_column: 'test', source_id: '123', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', source_table: 'test2', source_column: 'test2', source_id: '456', user_id: '456'}];
        case 'entities_to_fragment_extract':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', source_table: 'test', source_column: 'test', source_id: '123', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', source_table: 'test2', source_column: 'test2', source_id: '456', user_id: '456'}];
        case 'fragments_to_chunk':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', fragment_id: '123', chunk: 'test', start_: 1, end_: 2, length_: 3, user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', fragment_id: '456', chunk: 'test2', start_: 4, end_: 5, length_: 6, user_id: '456'}];
        case 'fragments_to_chunk_extract':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', fragment_id: '123', chunk: 'test', start_: 1, end_: 2, length_: 3, user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', fragment_id: '456', chunk: 'test2', start_: 4, end_: 5, length_: 6, user_id: '456'}];
        case 'chunks_to_vectorize': 
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', chunk_id: '123', embeddings: [1, 2, 3], user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', chunk_id: '456', embeddings: [4, 5, 6], user_id: '456'}];
        case 'chunks_to_vectorize_extract':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', chunk_id: '123', embeddings: [1, 2, 3], user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', chunk_id: '456', embeddings: [4, 5, 6], user_id: '456'}];
        case 'questions_neighbours_chunks': 
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', question_id: '123', chunk_id: '123', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', question_id: '456', chunk_id: '456', user_id: '456'}];
        case 'questions_to_answer_with_chunks_agg':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', question_id: '123', chunks: ['test'], user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', question_id: '456', chunks: ['test2'], user_id: '456'}];
        case 'modified_questions_with_chunks_agg':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', match_id: '123', chunks: ['test'], user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', match_id: '456', chunks: ['test2'], user_id: '456'}];
        case 'answers_with_chunks_agg':
            return [{id: '123', created_at: '2021-01-01', modified_question_id: '123', chunks: ['test'], user_id: '123'},{id: '456', created_at: '2021-01-02', modified_question_id: '456', chunks: ['test2'], user_id: '456'}];
        case 'questions_to_answer_with_chunks_extract':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', question_id: '123', chunk_id: '123', chunk: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', question_id: '456', chunk_id: '456', chunk: 'test2', user_id: '456'}];
        case 'questions_to_answer_with_chunks': 
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', question_id: '123', chunk_id: '123', chunk: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', question_id: '456', chunk_id: '456', chunk: 'test2', user_id: '456'}];
        case 'modified_questions_with_chunks':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', match_id: '123', chunk_id: '123', chunk: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', match_id: '456', chunk_id: '456', chunk: 'test2', user_id: '456'}];
        default:        
            return [];
    }
}


export function makeDBResponseDataFromSQLFunction(sqlFunction: string): any[] {
    switch (sqlFunction) {
        case 'insert_into_links':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', url: 'https://example.com', category: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', url: 'https://example.com', category: 'test2', user_id: '456'}];
        case 'insert_into_contents':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', link_id: '123', status: '200', content: 'test', error: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', link_id: '456', status: '200', content: 'test2', error: 'test2', user_id: '456'}];
        case 'insert_into_summaries':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', content_id: '123', summary: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', content_id: '456', summary: 'test2', user_id: '456'}];
        case 'insert_into_fragments':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', source_table: 'contents', source_column: 'test', source_id: '123', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', source_table: 'test2', source_column: 'test2', source_id: '456', user_id: '456'}];
        case 'insert_into_chunks':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', fragment_id: '123', chunk: 'test', start_: 1, end_: 2, length_: 3, user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', fragment_id: '456', chunk: 'test2', start_: 4, end_: 5, length_: 6, user_id: '456'}];
        case 'insert_into_vectors':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', chunk_id: '123', embeddings: [1, 2, 3], user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', chunk_id: '456', embeddings: [4, 5, 6], user_id: '456'}];
        case 'insert_into_questions':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', question: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', question: 'test2', user_id: '456'}];
        case 'insert_into_modified_questions':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', match_id: '123', modified_question: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', match_id: '456', modified_question: 'test2', user_id: '456'}];
        case 'insert_into_answers':
            return [{id: '123', created_at: '2021-01-01 06:00:00+00', modified_question_id: '123', answer: 'test', user_id: '123'},{id: '456', created_at: '2021-01-02 06:00:00+00', modified_question_id: '456', answer: 'test2', user_id: '456'}];
        default:
            return [];
    }
}