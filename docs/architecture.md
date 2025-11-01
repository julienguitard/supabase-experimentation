# Overview

# Migration

Database schema management using PostgreSQL functions, and Supabase CLI automation. No trigger are used at this stage.

It leverages buffer-table pattern combined with procedure calls for safe API operations with database-enforced consistency.

## Current Structure
supabase/migrations/
├── seed.sql                           # Initial data
├── backups/create-backups.sql         # Backup procedures
├── cleanups/drop-remaining-views-functions.sql
├── schemas/create-schemas.sql         # Core table schemas
├── restores/                          # Restore utilities
│   ├── create-restores.sql
│   └── drop-backups.sql
├── policies/create-policies.sql       # RLS policies
├── performance/create-indexes.sql     # Database indexes
├── views/                             # Computed views
│   ├── create-denormalized-views.sql
│   ├── create-chunks-arrays-views.sql
│   ├── create-latest-views.sql
│   ├── create-neighbours.sql
│   └── create-things-to-do.sql
├── buffers/                           # Buffer tables
│   ├── create-table-buffers.sql
│   └── create-view-buffers.sql
└── procedures/create-functions.sql    # SQL functions/procedures


## Design Principles

### Database-Centric Consistency

Business logic lives in PostgreSQL via functions,and constraints - ensuring ACID guarantees regardless of access method (Edge Functions, direct API, admin tools):
- Main Tables: Production data with strict RLS (user_id = auth.uid())
- Buffer Tables: Temporary staging with loose auth (auth.uid() IS NOT NULL)
- Merge Functions: Atomic transfers from buffers to main tables

### Entity Pattern

Each entity typically includes:
- Schema - Main table + buffer tables (tmp_*_insert, tmp_*_update, tmp_*_delete)
- Policies - RLS for user isolation
- Views - Denormalized or computed data
- Functions - Merge operations, business logic
- Indexes - Performance optimization

## Automation

There are 3 principles underlying this automation:
- Backup Before Changes: Always backup production before major schema changes
- Idempotent Migrations: Use DROP IF EXISTS rather CREATE OR REPLACE
- Dependency Order: Execute migrations respecting foreign keys and view dependencies

Current Script (scripts/reset-up-all.sh) executes migrations in dependency order:
- (Seed data)
- Backups
- Cleanups
- Schemas
- Restores/Policies
- Indexes
- Views (denormalized → chunks → latest → neighbours → things-to-do)
- Buffers
- Procedures

# Pipelines

Each edge functions handle a pipeline of atomic operations / functions / morphisms enabling type safety and possible recomposition of new edge functions through pipeline elements mix and matches:
-Type Safety: Strong contracts at every boundary
-Testability: Pure functions easy to test in isolation
-Composability: Small functions combine into complex pipelines
-Maintainability: Clear separation of concerns
-Extensibility: New operations follow established patterns
-Reusability: Field transformations shared across pipelines
-Parallel Execution: Natural support for concurrent operations
-Debugging: Clear data flow makes issues easy to trace

File Organization
pipeline/
├── pipeline.ts                 # Main orchestration
├── context.ts                  # DI container creation
├── context-elements.ts         # Client factory functions
├── pipeline-elements.ts        # Core transformation functions
└── transformations/
    ├── dbquerydto-translation.ts      # Business logic
    ├── dbquery-execution.ts           # Database operations
    ├── llmrequestdto-formatting.ts    # AI request formatting
    ├── llmmodel-compilation.ts        # AI client invocation
    ├── linkpayload.ts                 # Scraping transformations
    ├── fragmentpayload.ts             # Text chunking
    ├── chunkpayload.ts                # Embedding generation
    └── contentpayload.ts              # Content structuring
Example Pipeline Flow
typescript// Complete request handling flow
export async function handleRequest(request: Request): Promise<Response> {
  // 1. Parse: External → DTO
  const requestDTO = parseRequest(request);
  
  // 2. Translate: DTO → DTO (business logic)
  const dbQueryDTO = translateRequestDTOToDBQueryDTO(requestDTO);
  
  // 3. Compile: DTO → Execution (inject client)
  const context = createClientsContext('edge-function-name');
  const dbQuery = compileToDBQuery(context.client, dbQueryDTO);
  
  // 4. Execute: Async operation
  const dbResponseDTO = await executeDBQuery(dbQuery);
  
  // 5. Format: Result → DTO
  const responseDTO = formatToResponseDTO(dbResponseDTO);
  
  // 6. Create: DTO → External
  return createResponse(responseDTO);
}

To add new functionality:
- Define DTOs for your domain
- Create context objects for required clients
- Implement transformations following naming patterns
- Compose into pipeline using existing orchestration
- Test each layer independently

The architecture naturally scales to new operations while maintaining consistency and type safety.

## Principles

The pipeline architecture implements a functional data flow pattern with clear separation between data transformations (pure DTOs), dependency-injected clients (context-aware objects), and executable operations (execution objects). The design follows morphism principles where each transformation is a well-typed function between domain boundaries.

## Core Pipeline Steps

The pipeline consists of six fundamental steps that transform data through different domain boundaries.

Starting with the simple of an edge function requesting the Supabase database and sending back the results:
External Request → RequestDTO → DBQueryDTO → DBQuery → DBResponseDTO → ResponseDTO → 
External Response

1. Parse (External → DTO)
Boundary: External world → Internal validated data
Function Pattern: parse*
Example: parseRequest(request: Request): RequestDTO

Validates and sanitizes external input
Converts raw HTTP requests into strongly-typed DTOs
Handles malformed input gracefully
Pure transformation with no side effects

2. Translate (DTO → DTO)

Boundary: One domain semantics → Another domain semantics
Function Pattern: translate* or formatTo*
Example: translateRequestDTOToDBQueryDTO(req: RequestDTO): DBQueryDTO

Applies business logic and domain rules
Maps HTTP semantics to database semantics
Pure business transformations
Composes field-level transformations
No external dependencies required

3. Compile (DTO → Execution Object)

Boundary: Data structure → Executable operation
Function Pattern: compileTo*
Example: compileToDBQuery(client: Client, dto: DBQueryDTO): DBQuery

Injects runtime dependencies (clients, connections)
Creates executable objects ready for invocation
Handles technical configuration
Returns operation-ready objects (not results)

4. Execute (Execution Object → Result)
Boundary: Operation → Side effect
Function Pattern: execute*
Example: executeDBQuery(query: DBQuery): Promise<DBResponseDTO>

Performs async I/O operations
Executes database queries, API calls, or browser operations
*Handles errors and retries*
Always async (returns Promise)

5. Format (Result → DTO)
Boundary: External result → Internal structure
Function Pattern: formatTo*
Example: formatToResponseDTO(dbResp: DBResponseDTO): ResponseDTO

Structures external responses into DTOs
Maps domain results to response format
Normalizes error states
Pure transformation

6. Create (DTO → External)
Boundary: Internal data → External format
Function Pattern: create*
Example: createResponse(dto: ResponseDTO): Response

Serializes DTOs to external format
Sets HTTP headers and status codes
Final boundary before system exit
Pure transformation

## Pipeline Elements
### Data Transfer Objects (DTOs)
DTOs are immutable, validated data structures that cross domain boundaries. They enforce contracts between pipeline stages.
Core DTOs

RequestDTO: Validated HTTP request data

typescript  interface RequestDTO {
    readonly path: string;
    readonly method: HttpMethod;
    readonly params: Record<string, string>;
    readonly body?: unknown;
    readonly headers: Record<string, string>;
    readonly userId?: string;
  }

DBQueryDTO: Business-level database query specification

typescript  interface DBQueryDTO {
    readonly table: string;
    readonly operation: 'select' | 'insert' | 'update' | 'delete';
    readonly filters?: Record<string, unknown>;
    readonly data?: unknown;
  }

DBResponseDTO: Database operation results
ResponseDTO: Structured HTTP response data
ScrapableDTO: URLs and content to scrape
ScrapedDTO: Scraped content with metadata
LLMRequestDTO: AI model invocation parameters
LLMResponseDTO: AI model responses
TokenizableDTO: Text content for tokenization
TokenizedDTO: Tokenized text with metadata
EmbeddingRequestDTO: Vector embedding parameters
EmbeddingResponseDTO: Generated embeddings

DTO Design Principles

Readonly: All fields marked as readonly for immutability
Validation: Structure enforced at boundary
Serializable: Can be JSON-serialized for storage/transmission
Domain-specific: Each DTO represents a specific domain concept
No behavior: Pure data containers with no methods

### Context-aware Objects (Dependency Injection)

Context-awre objects manage runtime dependencies and are injected into compilation and execution steps. They handle client lifecycle, configuration, and resource management.
ClientsContext
The central DI container that provides clients based on edge function requirements:
typescriptinterface ClientsContext {
  browserlessClient?: BrowserlessClient;
  aiClient?: AIClient;
  hexCodec?: HexCodec;
  textCodec?: TextCodec;
  tokenizer?: Tokenizer;
}
Client Types

AIClient: Union type for LLM providers (OpenAI, Anthropic, DeepSeek)

Handles API authentication
Manages rate limiting
Supports parallel invocation


BrowserlessClient: Web scraping and browser automation

Manages browser instances
Handles page lifecycle
Coordinates parallel scraping


Codecs: Text/Hex encoding utilities

TextCodec: UTF-8 encoding/decoding
HexCodec: Hex encoding with text codec dependency


Tokenizer: Text tokenization for chunking

Integrates with tokenizer executor
Manages token limits
Preserves fragment metadata

Context Creation
Context is created per edge function with specific client requirements:
typescriptfunction createClientsContext(edgeFunctionName: string): ClientsContext {
  switch (edgeFunctionName) {
    case 'fetch-links':
      return { 
        browserlessClient: createBrowserlessClient(),
        hexCodec: createHexCodec(createTextCodec())
      };
    case 'summarize-links':
      return { 
        hexCodec: createHexCodec(createTextCodec()),
        aiClient: createOpenAIClient()
      };
    case 'vectorize-chunks':
      return { 
        hexCodec: createHexCodec(createTextCodec()),
        aiClient: createOpenAIClient()
      };
    // ... other cases
  }
}

### Execution Objects

Execution objects are prepared operations ready for invocation. They encapsulate both the operation specification and the dependencies needed to execute it.

Core Execution Objects

DBQuery: Compiled database query with client

typescript  type DBQuery = {
    client: Client;
    query: QueryBuilder;
    operation: 'select' | 'insert' | 'update' | 'delete';
  }

ScrapeQuery: Browser automation specification

typescript  type ScrapeQuery = {
    browserlessClient: BrowserlessClient;
    urls: string[];
    options: ScrapeOptions;
  }

LLMModel: AI model invocation specification

typescript  type LLMModel = {
    aiClient: AIClient;
    request: SingleLLMRequestDTO;
  }

EmbeddingModel: Vector embedding specification

typescript  type EmbeddingModel = {
    aiClient: OpenAI;
    request: SingleEmbeddingRequestDTO;
  }

TokenizerExecutor: Text tokenization specification

typescript  type TokenizerExecutor = {
    tokenizer: Tokenizer;
    content: string;
  }
Execution Object Pattern
All execution objects follow the same pattern:

Compiled from DTOs via compileTo* functions
Include injected dependencies (clients, connections)
Executed via async execute* functions
Return domain-specific DTOs as results

## Function Naming Strategy
Functions follow a systematic naming convention based on their role in the pipeline and the boundaries they cross.
Decision Tree
What does the function do?
├─ Cross external boundary?
│  ├─ INTO system → parse*
│  └─ OUT OF system → create*
├─ Transform between DTOs?
│  ├─ Business logic → translate*
│  └─ Formatting → formatTo*
├─ Prepare for execution?
│  └─ With dependencies → compileTo*
└─ Perform I/O operation?
   └─ Async side effect → execute*
Naming Patterns
PatternBoundaryDependenciesAsyncExampleparse*External → DTONoneNoparseRequesttranslate*DTO → DTO (business)NoneNotranslateRequestDTOToDBQueryDTOformatTo*DTO → DTO (structure)NoneNoformatToResponseDTOcompileTo*DTO → ExecutionRequiredNocompileToDBQueryexecute*Execution → ResultEmbeddedYesexecuteDBQuerycreate*DTO → ExternalNoneNocreateResponse
Field-Level Transformations
Within translate* functions, use granular field transformations:

extract*: Pull data from structures (extractTableFromPath)
map*: Transform concepts (mapHttpMethodToDbOperation)
parse*: Convert formats (parseQueryParamsToFilters)

## Conceptuals aspects

### Dual Granularity Architecture
The pipeline implements a two-dimensional granularity system:
Horizontal: Pipeline Steps
Parse → Translate → Compile → Execute → Format → Create
Vertical: Field Types
- Path fields
- Method fields
- Query parameters
- Headers
- Body data
- Metadata
Matrix Organization
Each intersection creates a focused, single-responsibility function:
                   Path    Method   Query   Headers   Body
Parse              ✓       ✓        ✓       ✓         ✓
Translate          ✓       ✓        ✓       -         ✓
Compile            -       -        ✓       -         ✓
Execute            -       -        -       -         -
Format             -       -        -       ✓         ✓
Create             ✓       ✓        -       ✓         ✓
Example functions from the matrix:

extractTableFromPath (Path × Translate)
mapHttpMethodToDbOperation (Method × Translate)
parseQueryParamsToFilters (Query × Translate)
applyFiltersToQuery (Query × Compile)

### Morphism Patterns

The pipeline implements several category theory-inspired morphism patterns for type-safe transformations:
-Key-Preserving Morphism
-Transformations that preserve identity/key fields across type changes:
typescripttype KeyPreservingMorphism<K, A, B> = (input: A & { key: K }) => B & { key: K }

Example: Database operations that preserve row IDs:
typescriptfunction updateRow<K extends { id: string }>(
  row: K & { data: OldData }
): K & { data: NewData } {
  return {
    ...row,
    data: transformData(row.data)
  };
}
-Interface-Preserving Morphism
Transformations that change interface shape while preserving payload:
typescripttype InterfacePreservingMorphism<I, J, T> = (input: I & T) => J & T
Example: Protocol transformations:
typescript// HTTP interface → Database interface, preserving content
function translateToDBQueryDTO(
  req: RequestDTO & { content: T }
): DBQueryDTO & { content: T }
-Bivariant Functor Pattern
Simultaneous transformation of interface and payload with constraints:
typescripttype BivariantFunctor<I, J, A, B> = (input: I & A) => J & B
Example: Complete data pipeline transformations:
typescriptfunction fullPipeline(
  request: HttpRequest & { body: RawData }
): DbResponse & { body: ProcessedData }
-Parallel Execution
For batch operations (LLM processing, scraping), the pipeline supports parallel execution with client cloning:

### Execution Strategies

Single Execution: For individual operations

typescript   const result = await executeLLMModel(model);

Batch Execution: For multiple operations with shared context

typescript   const results = await Promise.all(
     requests.map(req => compileTo*(client, req))
       .map(exec => execute*(exec))
   );

Parallel with Cloning: For large batches requiring isolated clients

typescript   // Client cloning ensures isolation and rate limit management
   const results = await executeInParallel(
     requests,
     (req) => compileTo*(cloneClient(client), req),
     (exec) => execute*(exec)
   );
Concurrency Control

Client cloning: Prevents shared state issues
Rate limiting: Managed per client instance
Batch sizing: Configurable for memory management
Error isolation: Failures don't cascade



