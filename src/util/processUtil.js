export class ProcessUtil {
	static wait(waitMs = 1000) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, waitMs);
		});
	}
}
