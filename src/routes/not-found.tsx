import React from 'react';
import { css } from 'emotion';
import { Button } from 'carbon-components-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/header';
// import the img placeholder svg
import placeholder from '../assets/chart-404.svg';

// styles for placeholder
const svgStyle = css`
	width: 25vw;
	height: auto;
	max-width: 400px;
`;

const placeholderContainer = css`
	margin-top: 48px;
	display: flex;
	flex-direction: column;
	height: calc(100vh - 48px);
	padding: 24px;
	padding-top: 64px;
	align-items: center;
`;

export const NotFound = () => {
	const navigate = useNavigate();
	return (
		<>
			<Header />
			<div className={placeholderContainer}>
				<img alt="Fragment not found" src={placeholder} className={svgStyle} />
				<div style={{ textAlign: 'left' }}>
					<h3>404: Not found</h3>
					<p style={{ marginTop: '0.5em' }}>
						This page does not exist, click  <strong>Go back</strong><br /> to return.
					</p>
					<Button style={{ marginTop: '1rem' }} onClick={() => navigate(-1)}>Go back</Button>
				</div>
			</div>
		</>
	);
};
