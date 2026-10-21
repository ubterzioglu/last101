import { describe, expect, it } from 'vitest';
import {
  INITIAL_SUBMISSION,
  shouldSubmit,
  submissionReducer,
} from '@/components/tools/questionnaire-submission';

const KEY = '{"answers":[["q1",3]],"score":72}';

describe('questionnaire submission state', () => {
  it('submits once when the answers are complete', () => {
    expect(shouldSubmit(INITIAL_SUBMISSION, KEY)).toBe(true);
    expect(shouldSubmit(INITIAL_SUBMISSION, '')).toBe(false);
  });

  it('does not resend the same answers automatically after a failure (no retry loop)', () => {
    const started = submissionReducer(INITIAL_SUBMISSION, { type: 'start', key: KEY });
    const failed = submissionReducer(started, { type: 'failure', key: KEY, error: 'Service not configured' });

    expect(failed.status).toBe('error');
    expect(failed.error).toBe('Service not configured');
    expect(shouldSubmit(failed, KEY)).toBe(false);
  });

  it('resends the same answers only after an explicit retry', () => {
    const failed = submissionReducer(
      submissionReducer(INITIAL_SUBMISSION, { type: 'start', key: KEY }),
      { type: 'failure', key: KEY, error: 'x' },
    );
    const retried = submissionReducer(failed, { type: 'retry' });

    expect(retried.status).toBe('idle');
    expect(shouldSubmit(retried, KEY)).toBe(true);
  });

  it('stops after a success but submits changed answers again', () => {
    const done = submissionReducer(
      submissionReducer(INITIAL_SUBMISSION, { type: 'start', key: KEY }),
      { type: 'success', key: KEY },
    );

    expect(done.status).toBe('success');
    expect(shouldSubmit(done, KEY)).toBe(false);
    expect(shouldSubmit(done, `${KEY}-edited`)).toBe(true);
  });

  it('ignores a late result for answers that were reset meanwhile', () => {
    const started = submissionReducer(INITIAL_SUBMISSION, { type: 'start', key: KEY });
    const reset = submissionReducer(started, { type: 'reset' });
    const late = submissionReducer(reset, { type: 'failure', key: KEY, error: 'late' });

    expect(late).toEqual(INITIAL_SUBMISSION);
  });
});
