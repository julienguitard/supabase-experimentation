import type {
  LinkPayload,
  ContentPayload,
  MatchPayload,
  FragmentPayload,
  ModifiedQuestionPayload,
  AnswerPayload,
  ChunkPayload
} from '../../../packages/types/index.ts'

// Link payload
export const makeLinkPayload = (overrides: Partial<LinkPayload> = {}): LinkPayload => ({
  link_id: 'test-link-id',
  ...overrides
})

// Content payload
export const makeContentPayload = (overrides: Partial<ContentPayload> = {}): ContentPayload => ({
  content_id: 'test-content-id',
  ...overrides
})

// Match payload
export const makeMatchPayload = (overrides: Partial<MatchPayload> = {}): MatchPayload => ({
  match_id: 'test-match-id',
  ...overrides
})

// Fragment payload
export const makeFragmentPayload = (overrides: Partial<FragmentPayload> = {}): FragmentPayload => ({
  fragment_id: 'test-fragment-id',
  ...overrides
})

// Modified question payload
export const makeModifiedQuestionPayload = (
  overrides: Partial<ModifiedQuestionPayload> = {}
): ModifiedQuestionPayload => ({
  modified_question_id: 'test-modified-question-id',
  ...overrides
})

// Answer payload
export const makeAnswerPayload = (overrides: Partial<AnswerPayload> = {}): AnswerPayload => ({
  answer_id: 'test-answer-id',
  ...overrides
})

// Chunk payload
export const makeChunkPayload = (overrides: Partial<ChunkPayload> = {}): ChunkPayload => ({
  chunk_id: 'test-chunk-id',
  ...overrides
})

// Handy ready-to-use samples
export const sampleLinkPayload = makeLinkPayload()
export const sampleContentPayload = makeContentPayload()
export const sampleMatchPayload = makeMatchPayload()
export const sampleFragmentPayload = makeFragmentPayload()
export const sampleModifiedQuestionPayload = makeModifiedQuestionPayload()
export const sampleAnswerPayload = makeAnswerPayload()
export const sampleChunkPayload = makeChunkPayload()

