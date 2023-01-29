import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@carbon/react';

export const LinkButton = ({ to, ...rest }: any) => {
	const navigate = useNavigate();
	return <Button onClick={() => navigate(to)} {...rest} />;
};
