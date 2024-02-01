import { useContext, useEffect, useState } from 'react';
import { GithubContext, GlobalStateContext } from '../context';
import axios from 'axios';

export const useRemoteCustomComponentsCollections = () => {
	const { customComponentsCollections } = useContext(GlobalStateContext);
	const { getFeaturedCustomComponentsCollection } = useContext(GithubContext);

	const [collections, setCollections] = useState([] as any[]);
	const promises: any[] = [];
	customComponentsCollections.forEach((collection: any) => {
		if (collection.type === 'featured') {
			promises.push(getFeaturedCustomComponentsCollection(collection.collection));
		}

		if (collection.type === 'url') {
			promises.push(axios.get(collection.url, { responseType: 'text' }).then((value: any) => value.data));
		}
	});

	useEffect(() => {
		Promise.all(promises).then((data: any[]) => {
			setCollections(data);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return [collections, setCollections];
};
