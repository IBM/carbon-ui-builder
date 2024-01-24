import React, { useEffect, useState } from 'react';
import {
	Button,
	ContentSwitcher,
	Dropdown,
	Switch,
	TextInput
} from '@carbon/react';
import { Checkmark } from '@carbon/icons-react';
import Handlebars from 'handlebars';
import Editor from '@monaco-editor/react';
import { css } from 'emotion';

export const CustomComponentsCollectionEditor = ({ collection, setCollection, featuredCollectionsItems }: any) => {
	const [jsonParseError, setJsonParseError] = useState('');
	const [model, _setModel] = useState(JSON.stringify(collection, null, '\t'));
	const [collectionTypeIndex, setCollectionTypeIndex] = useState(collection.type === 'featured' ? 0 : collection.type === 'url' ? 1 : 2);

	const [selectedFeaturedCollection, setSelectedFeaturedCollection] = useState(null as { id: string; text: string } | null);
	const [collectionName, setCollectionName] = useState(collection.name);
	const [collectionUrl, setCollectionUrl] = useState(collection.url || '');

	featuredCollectionsItems = featuredCollectionsItems || [];

	useEffect(() => {
		if (collection.type !== 'featured' || !featuredCollectionsItems) {
			return;
		}

		const featuredCollectionItem = featuredCollectionsItems.find((item: any) => item.id === collection.collection);

		if (featuredCollectionItem) {
			setSelectedFeaturedCollection(featuredCollectionItem);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [featuredCollectionsItems]);

	const setModel = (modelString: string) => {
		_setModel(modelString);
		try {
			if (modelString) {
				const parsedModel = JSON.parse(modelString);
				parsedModel.components.forEach((component: any, index: number) => {
					// try parsing template to check for compile errors
					try {
						(Handlebars.compile(component.htmlPreview))((component.defaultInputs));
					} catch (e) {
						throw new Error(`Component ${index} [${component?.type}] htmlPreview` + e);
					}
				});
				setCollection(parsedModel);
			}

			setJsonParseError('');
		} catch (e) {
			setJsonParseError((e as any).toString());
		}
	};

	const handleEditorChange = (value: any, _event: any) => {
		setModel(value);
	};

	return <>
		<ContentSwitcher
		className={css`margin-bottom: 1rem;`}
		selectedIndex={collectionTypeIndex}
		onChange={({ index }: any) => setCollectionTypeIndex(index)}>
			<Switch
				name='featured'
				text='Featured collections'
			/>
			<Switch
				name='url'
				text='URL'
			/>
			<Switch
				name='json'
				text='Edit JSON'
			/>
		</ContentSwitcher>
		{
			collectionTypeIndex === 0
			&& <>
				<TextInput
					id={`${collection.name}-collection-name`}
					type='text'
					labelText='Name'
					value={collectionName}
					helperText='The collecton name'
					placeholder='My custom components collection'
					onChange={(event: any) => setCollectionName(event.currentTarget.value)} />
				<Dropdown
					id={`${collection.name}-collection`}
					titleText='Components collection'
					helperText='Select a custom components collection'
					selectedItem={selectedFeaturedCollection}
					label='Select...'
					items={featuredCollectionsItems}
					itemToString={(item: any) => item ? item.text : ''}
					onChange={({ selectedItem }: any) => setSelectedFeaturedCollection(selectedItem)} />
				<Button
				renderIcon={Checkmark}
				className={css`margin-top: 1rem;`}
				disabled={!collectionName || !selectedFeaturedCollection}
				onClick={() => {
					setCollection({
						name: collectionName,
						type: 'featured',
						collection: selectedFeaturedCollection?.id
					});
				}}>
					Apply
				</Button>
			</>
		}
		{
			collectionTypeIndex === 1
			&& <>
				<TextInput
					id={`${collection.name}-url-name`}
					type='text'
					labelText='Name'
					value={collectionName}
					helperText='The collecton name'
					placeholder='My custom components collection'
					onChange={(event: any) => setCollectionName(event.currentTarget.value)} />
				<TextInput
					id={`${collection.name}-url`}
					type='text'
					labelText='Address'
					value={collectionUrl}
					helperText='The address of the JSON representing the custom collection'
					placeholder='https://address.goes.here'
					onChange={(event: any) => setCollectionUrl(event.currentTarget.value)} />
				<Button
				renderIcon={Checkmark}
				className={css`margin-top: 1rem;`}
				disabled={!collectionName || !collectionUrl}
				onClick={() => {
					setCollection({
						name: collectionName,
						type: 'url',
						url: collectionUrl
					});
				}}>
					Apply
				</Button>
			</>
		}
		{
			collectionTypeIndex === 2
			&& <>
				<p>Valid JSON is automatically saved on edit.</p>
				{
					jsonParseError
					&& <>
						Not saved until the error is corrected:
						<code style={{ color: '#a00', marginBottom: '10pt', width: '100%' }}>
							<pre>{jsonParseError}</pre>
						</code>
					</>
				}
				<Editor
					height='calc(100vh - 340px)'
					language='json'
					value={model}
					onChange={handleEditorChange} />
			</>
		}
	</>;
};
