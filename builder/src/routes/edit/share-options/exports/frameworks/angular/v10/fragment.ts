import {
	Document,
	DocumentPreliminary,
	DocumentView,
	Folder,
	Html,
	Json
} from '@carbon/react/icons';
import { getAllFragmentStyleClasses } from '@carbon-builder/player';
import { hasFragmentStyleClasses } from '../../../../../../../utils/fragment-tools';
import { format } from '../../utils';
import {
	formatOptionsCss,
	formatOptionsHtml,
	formatOptionsTypescript,
	getAllSubfragments,
	getAngularInputsFromJson,
	getAngularOutputsFromJson,
	jsonToAngularImports,
	jsonToTemplate
} from './utils';
import { classNameFromFragment, tagNameFromFragment } from '@carbon-builder/sdk';

const getComponentCode = (fragment: any, fragments: any[], globalStyleClasses: any, customComponentsCollections: any[]) => {
	const componentCode: any = { // this is the folder for the component
		name: tagNameFromFragment(fragment),
		icon: Folder,
		items: []
	};
	const subFragments = getAllSubfragments(fragment.data, fragments);

	// component.ts
	componentCode.items.push({
		name: `${tagNameFromFragment(fragment)}.component.ts`,
		code: format(
			`import { Component, Input, Output, EventEmitter } from '@angular/core';
			@Component({
				selector: 'app-${tagNameFromFragment(fragment)}',
				templateUrl: './${tagNameFromFragment(fragment)}.component.html'${hasFragmentStyleClasses(fragment) ? `,
				styleUrls: ['./${tagNameFromFragment(fragment)}.component.scss']` : ''}
			})
			export class ${classNameFromFragment(fragment)} {
				${getAngularInputsFromJson(fragment.data)}
				${getAngularOutputsFromJson(fragment.data)}
			}
		`, formatOptionsTypescript),
		icon: Document
	});

	// component.html
	componentCode.items.push({
		name: `${tagNameFromFragment(fragment)}.component.html`,
		code: format(jsonToTemplate(fragment.data, fragments, customComponentsCollections), formatOptionsHtml),
		icon: Html
	});

	// module.ts
	componentCode.items.push({
		name: `${tagNameFromFragment(fragment)}.module.ts`,
		code: format(
			`import { NgModule } from "@angular/core";
			import { ${jsonToAngularImports(fragment.data).join(', ')} } from 'carbon-components-angular';
			import { ${classNameFromFragment(fragment)} } from "./${tagNameFromFragment(fragment)}.component";
			${Object.values(subFragments).map((f) =>
					`import { ${classNameFromFragment(f)}Module} from "../${tagNameFromFragment(f)}/${tagNameFromFragment(f)}.module";`).join('\n')
				}

			@NgModule({
				imports: [${[
					...jsonToAngularImports(fragment.data),
					...Object.values(subFragments).map((fragment) => `${classNameFromFragment(fragment)}Module`)
				].join(', ')}],
				declarations: [${classNameFromFragment(fragment)}],
				exports: [${classNameFromFragment(fragment)}]
			})
			export class ${classNameFromFragment(fragment)}Module {}
		`, formatOptionsTypescript),
		icon: DocumentPreliminary
	});

	// component.scss
	componentCode.items.push({
		name: `${tagNameFromFragment(fragment)}.component.scss`,
		code: format(
			`${getAllFragmentStyleClasses(fragment, [], globalStyleClasses).map((styleClass: any) => {
				if (!styleClass.content || !styleClass.content.trim()) {
					return null;
				}

				return `.${styleClass.id} {
					${styleClass.content}
				}`;
			}).join('\n')}`,
			formatOptionsCss
		),
		icon: DocumentView
	});

	return componentCode;
};

const getAllComponentsCode = (json: any, fragments: any[], globalStyleClasses: any, customComponentsCollections: any[]) => {
	let allComponents: any[] = [];

	if (json.data) {
		allComponents = [
			...allComponents,
			getComponentCode(json, fragments, globalStyleClasses, customComponentsCollections),
			...getAllComponentsCode(json.data, fragments, globalStyleClasses, customComponentsCollections)
		];
	}

	if (json.type === 'fragment') {
		const fragment = fragments.find(f => f.id === json.fragmentId);

		allComponents = [
			...allComponents,
			getComponentCode(fragment, fragments, globalStyleClasses, customComponentsCollections),
			...getAllComponentsCode(fragment.data, fragments, globalStyleClasses, customComponentsCollections)
		];
	}

	json.items?.forEach((item: any) => {
		allComponents = [
			...allComponents,
			...getAllComponentsCode(item, fragments, globalStyleClasses, customComponentsCollections)
		];
	});

	return allComponents;
};

export const createAngularApp = (fragment: any, fragments: any[], globalStyleClasses: any, customComponentsCollections: any[]) => {
	const tagName = tagNameFromFragment(fragment);
	const className = classNameFromFragment(fragment);

	const allComponents = getAllComponentsCode(fragment, fragments, globalStyleClasses, customComponentsCollections);

	const appComponentHtml =
		`<app-${tagName}></app-${tagName}>
		`;

	const appComponentTs =
		`import { Component } from '@angular/core';
		@Component({
			selector: 'app-root',
			templateUrl: './app.component.html'
		})
		export class AppComponent {
		}
		`;

	const appModule =
		`import { NgModule } from '@angular/core';
		import { BrowserModule } from '@angular/platform-browser';
		import { AppComponent } from './app.component';
		import { ${className}Module } from './components/${tagName}/${tagName}.module';

		@NgModule({
			imports: [BrowserModule, ${className}Module],
			declarations: [AppComponent],
			bootstrap: [AppComponent]
		})
		export class AppModule {}
		`;

	const indexHtml =
		`<!DOCTYPE html>
		<html lang='en'>
			<head>
				<meta charset='utf-8' />
				<title>Angular</title>
			</head>
			<body>
				<app-root></app-root>
			</body>
		</html>
		`;

	const mainTs =
		`import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
		import { AppModule } from './app/app.module';

		import "carbon-components/css/carbon-components.min.css";

		platformBrowserDynamic()
			.bootstrapModule(AppModule)
			.catch(err => console.log(err));
		`;

	const angularCliJson =
		`{
	"apps": [
		{
			"root": "src",
			"outDir": "dist",
			"assets": ["assets", "favicon.ico"],
			"index": "index.html",
			"main": "main.ts",
			"polyfills": "polyfills.ts",
			"prefix": "app",
			"styles": ["styles.scss"],
			"scripts": [],
			"environmentSource": "environments/environment.ts",
			"environments": {
				"dev": "environments/environment.ts",
				"prod": "environments/environment.prod.ts"
			}
		}
	]
}
`;

	const packageJson = {
		dependencies: {
			'@angular/animations': '12.2.0',
			'@angular/common': '12.2.0',
			'@angular/compiler': '12.2.0',
			'@angular/core': '12.2.0',
			'@angular/forms': '12.2.0',
			'@angular/platform-browser': '12.2.0',
			'@angular/platform-browser-dynamic': '12.2.0',
			'@angular/router': '12.2.0',
			'rxjs': '6.6.0',
			'tslib': '2.3.0',
			'sass': '1.45.0',
			'zone.js': '0.11.4',
			'carbon-components-angular': '4.71.0',
			'carbon-components': '10.58.0'
		}
	};

	return [
		{
			name: 'package.json',
			code: packageJson,
			icon: Json
		},
		{
			name: '.angular-cli.json',
			code: angularCliJson,
			icon: Json
		},
		{
			name: 'src',
			icon: Folder,
			isExpanded: true,
			items: [
				{
					name: 'index.html',
					code: format(indexHtml, formatOptionsHtml),
					icon: Html
				},
				{
					name: 'main.ts',
					code: format(mainTs, formatOptionsTypescript),
					icon: Document
				},
				{
					name: 'polyfills.ts',
					code: format("import 'zone.js/dist/zone';", formatOptionsTypescript),
					icon: Document
				},
				{
					name: 'styles.scss',
					code: format('', formatOptionsCss),
					icon: DocumentView
				},
				{
					name: 'app',
					icon: Folder,
					isExpanded: true,
					items: [
						{
							name: 'app.component.html',
							code: format(appComponentHtml, formatOptionsHtml),
							icon: Html
						},
						{
							name: 'app.component.ts',
							code: format(appComponentTs, formatOptionsTypescript),
							icon: Document
						},
						{
							name: 'app.module.ts',
							code: format(appModule, formatOptionsTypescript),
							icon: DocumentPreliminary
						},
						...allComponents
					]
				}
			]
		}
	];
};
