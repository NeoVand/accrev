import type { Egg } from '$lib/eggs/registry';

class RewardQueue {
	queue = $state<Egg[]>([]);

	get current(): Egg | undefined {
		return this.queue[0];
	}

	push(egg: Egg | null | undefined) {
		if (!egg) return;
		this.queue.push(egg);
	}

	dismiss() {
		this.queue.shift();
	}

	clear() {
		this.queue = [];
	}
}

export const rewards = new RewardQueue();
