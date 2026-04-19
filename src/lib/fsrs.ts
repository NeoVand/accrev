import {
	createEmptyCard,
	fsrs,
	generatorParameters,
	Rating,
	State,
	type Card
} from 'ts-fsrs';
import type { CardDirection, Grade, Review } from './types';

/** FSRS scheduler configured with fuzz so identical cards don't all pile up on the same day. */
const scheduler = fsrs(generatorParameters({ enable_fuzz: true }));

const stateToString = (s: State): Review['state'] => {
	switch (s) {
		case State.Learning:
			return 'learning';
		case State.Review:
			return 'review';
		case State.Relearning:
			return 'relearning';
		default:
			return 'new';
	}
};

const stringToState = (s: Review['state']): State => {
	switch (s) {
		case 'learning':
			return State.Learning;
		case 'review':
			return State.Review;
		case 'relearning':
			return State.Relearning;
		default:
			return State.New;
	}
};

export function reviewToCard(r: Review | null | undefined): Card {
	if (!r) return createEmptyCard(new Date());
	return {
		due: new Date(r.dueAt),
		stability: r.stability,
		difficulty: r.difficulty,
		elapsed_days: 0,
		scheduled_days: 0,
		learning_steps: 0,
		reps: r.reps,
		lapses: r.lapses,
		state: stringToState(r.state),
		last_review: r.lastReviewedAt ? new Date(r.lastReviewedAt) : undefined
	};
}

export function cardToReview(
	c: Card,
	termId: number,
	direction: CardDirection
): Omit<Review, 'id'> {
	return {
		termId,
		direction,
		stability: c.stability,
		difficulty: c.difficulty,
		dueAt: c.due.getTime(),
		reps: c.reps,
		lapses: c.lapses,
		lastReviewedAt: c.last_review ? c.last_review.getTime() : Date.now(),
		state: stateToString(c.state)
	};
}

const gradeToRating: Record<Grade, Rating> = {
	1: Rating.Again,
	2: Rating.Hard,
	3: Rating.Good,
	4: Rating.Easy
};

export function nextCard(current: Review | null | undefined, grade: Grade, now: Date = new Date()): Card {
	const card = reviewToCard(current);
	const result = scheduler.next(card, now, gradeToRating[grade]);
	return result.card;
}
