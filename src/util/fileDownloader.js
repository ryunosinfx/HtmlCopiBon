export class FileDownloader {
	static download(fileName, content, mimeType = 'text/plain') {
		const blob = new Blob([content], { type: mimeType });
		const ancker = document.createElement('a');
		ancker.style.display = 'none';
		ancker.download = fileName;
		ancker.href = window.URL.createObjectURL(blob);
		ancker.dataset.downloadurl = [mimeType, fileName, ancker.href].join(':');
		document.body.appendChild(ancker);
		ancker.click();
		setTimeout(() => {
			document.body.removeChild(ancker);
		});
	}
}
