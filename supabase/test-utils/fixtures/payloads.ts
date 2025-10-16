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
  link_id: '123',
  ...overrides
})

// Content payload
export const makeContentPayload = (overrides: Partial<ContentPayload> = {}): ContentPayload => ({
  content_id: '123',
  ...overrides
})

// Match payload
export const makeMatchPayload = (overrides: Partial<MatchPayload> = {}): MatchPayload => ({
  match_id: '123',
  ...overrides
})

// Fragment payload
export const makeFragmentPayload = (overrides: Partial<FragmentPayload> = {}): FragmentPayload => ({
  fragment_id: '123',
  ...overrides
})

// Modified question payload
export const makeModifiedQuestionPayload = (
  overrides: Partial<ModifiedQuestionPayload> = {}
): ModifiedQuestionPayload => ({
  modified_question_id: '123',
  ...overrides
})

// Answer payload
export const makeAnswerPayload = (overrides: Partial<AnswerPayload> = {}): AnswerPayload => ({
  answer_id: '123',
  ...overrides
})

// Chunk payload
export const makeChunkPayload = (overrides: Partial<ChunkPayload> = {}): ChunkPayload => ({
  chunk_id: '123',
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

