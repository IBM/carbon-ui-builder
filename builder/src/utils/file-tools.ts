import { extension } from 'mime-types';

export const getFullFileName = (name: string, mimeType: string) => (
	`${name}.${extension(mimeType)}`
);

export const saveFile = (url: string, fileName: string) => {
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = fileName;
	anchor.click();
};

export const saveBlob = (blob: any, fileName: string) => {
	const url = URL.createObjectURL(blob);
	saveFile(url, fileName);

	// Give it a second to download :)
	setTimeout(() => {
		URL.revokeObjectURL(url);
	}, 1000);
};

export const warningNotificationProps = {
	lowContrast: true,
	role: 'alert',
	notificationType: 'inline',
	kind: 'warning',
	title: 'Uploaded data has been modified',
	subtitle: 'data did not match expected format so we modified it so you can still use it'
};

export const errorNotificationProps = {
	lowContrast: true,
	role: 'alert',
	notificationType: 'inline',
	kind: 'error',
	title: 'Error',
	subtitle: ''
};
