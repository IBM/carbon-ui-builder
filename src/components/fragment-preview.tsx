import React, { useEffect, useState } from 'react';

import { Loading } from 'carbon-components-react';

import { css } from 'emotion';
import { getFragmentPreview, RenderProps } from '../utils/fragment-tools';

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

export const getPreviewUrl = async (fragment: any) => {
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

	const imageBlob = await getFragmentPreview(fragment, renderProps);
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(imageBlob ? imageBlob : new Blob());
		reader.onloadend = () => {
			resolve(reader.result ? reader.result.toString() : '');
		};
	})
}

export const FragmentPreview = ({ fragment, previewUrl }: any) => {
    const [activePreviewUrl, setActivePreviewUrl] = useState(previewUrl);

	useEffect(() => {
		if (!previewUrl) {
			const setPreviewUrl = async () => {
				const url = await getPreviewUrl(fragment);
				setActivePreviewUrl(url);
			}
			setPreviewUrl();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setActivePreviewUrl(previewUrl);
	}, [previewUrl])

	return (
        <>
            {
                activePreviewUrl
                ? <img
                    loading='lazy'
                    src={activePreviewUrl}
                    className={fragmentImage}
                    alt={`fragment preview: ${fragment.title}`} />
                : <div className={imagePlaceholderStyle} />
            }
            <div className={spinner}>
                <Loading withOverlay={false} active={!activePreviewUrl} />
            </div>
        </>
	);
};
