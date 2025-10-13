# API Documentation

This directory contains the OpenAPI specification for the Supabase Edge Functions.

## Files

- `openapi.yaml` - OpenAPI 3.0 specification for all edge functions
- `index.html` - Standalone HTML viewer using Swagger UI
- `postman-collection.json` - Postman collection for API testing
- `README.md` - This file

## Viewing the Documentation

### Option 1: Swagger Editor (Online)

1. Go to [editor.swagger.io](https://editor.swagger.io/)
2. Click **File** → **Import file**
3. Select `openapi.yaml`

### Option 2: Swagger UI (Local)

Using Docker:
```bash
docker run -p 8080:8080 -e SWAGGER_JSON=/api/openapi.yaml -v $(pwd)/supabase/swagger:/api swaggerapi/swagger-ui
```

Then open: http://localhost:8080

### Option 3: VS Code Extension

1. Install the **OpenAPI (Swagger) Editor** extension
2. Open `openapi.yaml`
3. Right-click → **Preview Swagger**

### Option 4: ReDoc

Using npx:
```bash
npx @redocly/cli preview-docs supabase/swagger/openapi.yaml
```

### Option 5: Standalone HTML Viewer

Simply open `index.html` in your browser:
```bash
open supabase/swagger/index.html
# or
python3 -m http.server 8000
# Then navigate to http://localhost:8000/supabase/swagger/index.html
```

### Option 6: Postman

Import the Postman collection:
1. Open Postman
2. Click **Import**
3. Select `postman-collection.json`
4. Set the `SUPABASE_JWT_TOKEN` variable in the collection
5. Update `BASE_URL` if needed (defaults to localhost:54321)

## API Overview

### Base URLs

- **Production**: `https://your-project.supabase.co/functions/v1`
- **Local**: `http://localhost:54321/functions/v1`

### Authentication

All endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN
```

### Endpoint Categories

#### Database Operations
- `GET /select-table` - Select all rows from a table
- `GET /select-row` - Select a specific row by ID

#### Link Management
- `POST /insert-links` - Insert new links
- `PUT /update-links` - Update existing links
- `DELETE /delete-links` - Delete links
- `POST /fetch-links` - Fetch and scrape link content

#### Content Processing
- `POST /summarize-links` - Generate AI summaries of link content

#### Fragment Management
- `POST /check-fragments` - Check fragment status
- `POST /chunk-fragments` - Chunk fragments using tokenization

#### Vectorization
- `POST /vectorize-chunks` - Generate vector embeddings for semantic search

#### Question Management
- `POST /insert-questions` - Insert new questions
- `PUT /update-questions` - Update existing questions
- `DELETE /delete-questions` - Delete questions
- `POST /answer-questions` - Answer questions using AI and semantic search

## Example Requests

### Insert Links

```bash
curl -X POST https://your-project.supabase.co/functions/v1/insert-links \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "url": "https://example.com/article",
      "category": "technology"
    }
  ]'
```

### Select Table

```bash
curl "https://your-project.supabase.co/functions/v1/select-table?table=links" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Insert Questions

```bash
curl -X POST https://your-project.supabase.co/functions/v1/insert-questions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "question": "What is artificial intelligence?",
      "category": "AI"
    }
  ]'
```

### Answer Questions

```bash
curl -X POST https://your-project.supabase.co/functions/v1/answer-questions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Pipeline Architecture

The edge functions follow a pipeline architecture where each request goes through multiple transformation steps:

1. **Parse Request** - Extract URL params, headers, and body
2. **Translate to DB Query** - Convert to database query DTO
3. **Execute Query** - Run the database operation
4. **Transform Response** - Format the response

Some pipelines include additional steps for:
- Web scraping (fetch-links)
- AI processing (summarize-links, answer-questions)
- Tokenization (chunk-fragments)
- Vector embedding (vectorize-chunks)

## Development

### Updating the Spec

When adding new endpoints or modifying existing ones:

1. Update `openapi.yaml`
2. Validate the spec:
   ```bash
   npx @apidevtools/swagger-cli validate supabase/swagger/openapi.yaml
   ```

### Generating Client SDKs

You can generate client SDKs in various languages:

```bash
# TypeScript/JavaScript
npx @openapitools/openapi-generator-cli generate \
  -i supabase/swagger/openapi.yaml \
  -g typescript-fetch \
  -o ./generated/typescript-client

# Python
npx @openapitools/openapi-generator-cli generate \
  -i supabase/swagger/openapi.yaml \
  -g python \
  -o ./generated/python-client
```

## Notes

- All text content is hex-encoded before storage for consistency
- Questions and answers go through multiple AI processing steps
- The API uses Supabase JWT tokens for authentication
- Response format follows the `ResponseDTO` pattern with status, headers, body, and error fields

