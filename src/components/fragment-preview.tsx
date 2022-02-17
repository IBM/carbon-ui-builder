import React, { useEffect, useState } from 'react';

import { Loading } from 'carbon-components-react';

import { css } from 'emotion';
import { getPreviewUrl } from '../utils/fragment-tools';

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

export const FragmentPreview = ({ fragment, previewUrl, setPreviewUrl }: any) => {
	const updatePreviewUrl = async () => {
		if (setPreviewUrl) {
			setPreviewUrl(await getPreviewUrl(fragment));
		}
	}

	useEffect(() => {
		updatePreviewUrl();
	}, [fragment])

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
