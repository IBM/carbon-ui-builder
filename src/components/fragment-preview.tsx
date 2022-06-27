import React, { useEffect, useRef, useState } from 'react';

import { Loading } from 'carbon-components-react';

import { css } from 'emotion';
import {
	getFragmentPreview,
	getUrlFromBlob,
	RenderProps,
	sleep
} from '../utils/fragment-tools';

const fragmentImage = css`
	width: auto;
	height: auto;
	max-height: 173px;
	max-width: 333px;
	display: block;
	padding-top: 8px;
`;
const imagePlaceholderStyle = css`
	height: 173px;
`;
const spinner = css`
	position: absolute;
	top: calc(50% - 44px - 32px);
	width: calc(100% - 16px);

	.bx--loading {
		margin: auto;
	}
`;

export const FragmentPreview = ({ fragment, resetPreview }: any) => {
	const [previewUrl, setPreviewUrl] = useState('');
	const dbRef = useRef({
		transaction: (_storeNames: string | Iterable<string>, _mode?: IDBTransactionMode) => (undefined as unknown as IDBTransaction)
	} as IDBDatabase);
	const dbVersion = 1;
	const requestRef = useRef(indexedDB.open('imagePreviewFiles', dbVersion));

	const renderProps: RenderProps = {
		id: fragment.id,
		name: fragment.title,
		width: 800,
		height: 400,
		preview: {
			format: 'png',
			width: 330,
			height: 200
		}
	};

	const putImagePreviewInDb = (blob: any) => {
		// Open a transaction to the database
		const transaction = dbRef.current.transaction(['imagePreviews'], 'readwrite');

		if (!transaction) {
			return;
		}

		// Put the blob into the dabase
		transaction.objectStore('imagePreviews').put({
			lastModified: fragment.lastModified,
			image: blob
		}, fragment.id);
	};

	const getImagePreviewFromDb = async (): Promise<{ lastModified: string; image: any } | undefined> => {
		return new Promise((resolve) => {
			(async () => {
				// Open a transaction to the database
				let transaction = dbRef.current?.transaction(['imagePreviews'], 'readwrite');

				// give it a chance to establish a connection to the db on component mount
				// by retrying a few times if it hadn't yet
				for (let i = 0; i < 10; i++) {
					if (!transaction) {
						await sleep(50);
						transaction = dbRef.current?.transaction(['imagePreviews'], 'readwrite');
					} else {
						break;
					}
				}

				if (!transaction) {
					resolve(undefined);
					return;
				}

				const request = transaction.objectStore('imagePreviews').get(fragment.id);
				request.onsuccess = (event: any) => {
					resolve((event.target as any)?.result);
				};
				request.onerror = (_event: any) => {
					resolve(undefined);
				};
			})();
		});
	};

	const updatePreviewUrl = async () => {
		const imageBlob = await getFragmentPreview(fragment, renderProps);
		putImagePreviewInDb(imageBlob);
		setPreviewUrl(await getUrlFromBlob(imageBlob) as string);
	};

	const createObjectStore = (dataBase: IDBDatabase) => {
		dataBase.createObjectStore('imagePreviews');
	};

	const updateImagePreviewFromDb = async () => {
		const imagePreviewInfo = await getImagePreviewFromDb();

		let imgFile = imagePreviewInfo?.image;
		if (!imgFile) {
			const imageBlob = await getFragmentPreview(fragment, renderProps);
			putImagePreviewInDb(imageBlob);
			imgFile = imageBlob;
		}

		// Get window.URL object
		const URL = window.URL || window.webkitURL;

		// Create and revoke ObjectURL
		const imgURL = URL.createObjectURL(imgFile);

		setPreviewUrl(imgURL);
	};

	useEffect(() => {
		requestRef.current.onerror = (_event: any) => {
			console.log('Error creating/accessing IndexedDB database');
		};

		requestRef.current.onsuccess = (_event: any) => {
			dbRef.current = requestRef.current.result;

			dbRef.current.onerror = (_event: any) => {
				console.log('Error creating/accessing IndexedDB database');
			};

			updateImagePreviewFromDb();
		};

		requestRef.current.onupgradeneeded = (event) => {
			createObjectStore((event.target as any)?.result);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!resetPreview) {
			return;
		}

		resetPreview.current = updatePreviewUrl;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetPreview]);

	useEffect(() => {
		(async () => {
			if ((await getImagePreviewFromDb())?.lastModified !== fragment.lastModified) {
				updatePreviewUrl();
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fragment]);

	return (
		<>
			{
				previewUrl
					? <img
						loading='lazy'
						src={previewUrl}
						className={fragmentImage}
						alt={`fragment preview: ${fragment.title}`} />
					: <div className={imagePlaceholderStyle} />
			}
			<div className={spinner}>
				{ !previewUrl && <Loading withOverlay={false} active={!previewUrl} /> }
			</div>
		</>
	);
};
