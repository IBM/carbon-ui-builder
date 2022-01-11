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

export const FragmentPreview = ({ fragment, resetPreviewRef }: any) => {
    const [previewUrl, setPreviewUrl] = useState('');

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

	const resetPreview = async () => {
		const imageBlob = await getFragmentPreview(fragment, renderProps);
		const reader = new FileReader();
		reader.readAsDataURL(imageBlob ? imageBlob : new Blob());
		reader.onloadend = () => {
			const imageUrl: string = reader.result ? reader.result.toString() : '';
			setPreviewUrl(imageUrl);
		};
	};

	useEffect(() => {
		resetPreview();
		if (resetPreviewRef) {
			resetPreviewRef.current = resetPreview;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
                <Loading withOverlay={false} active={!previewUrl} />
            </div>
        </>
	);
};
