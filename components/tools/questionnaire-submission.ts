export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface SubmissionState {
  status: SubmissionStatus;
  /**
   * Answers of the last attempt. Kept after a failure on purpose: the same
   * answers are only sent again after an explicit retry, otherwise every
   * re-render would resend them and the status box would flicker forever.
   */
  attemptedKey: string;
  error: string;
}

export type SubmissionEvent =
  | { type: 'start'; key: string }
  | { type: 'success'; key: string }
  | { type: 'failure'; key: string; error: string }
  | { type: 'retry' }
  | { type: 'reset' };

export const INITIAL_SUBMISSION: SubmissionState = { status: 'idle', attemptedKey: '', error: '' };

export function submissionReducer(state: SubmissionState, event: SubmissionEvent): SubmissionState {
  switch (event.type) {
    case 'start':
      return { status: 'submitting', attemptedKey: event.key, error: '' };
    case 'success':
      // A result for answers that were reset or changed meanwhile is stale.
      return event.key === state.attemptedKey ? { ...state, status: 'success', error: '' } : state;
    case 'failure':
      return event.key === state.attemptedKey ? { ...state, status: 'error', error: event.error } : state;
    case 'retry':
    case 'reset':
      return INITIAL_SUBMISSION;
  }
}

/** True when these completed answers have not been sent (or explicitly retried) yet. */
export function shouldSubmit(state: SubmissionState, completionKey: string): boolean {
  return completionKey !== '' && state.attemptedKey !== completionKey;
}
