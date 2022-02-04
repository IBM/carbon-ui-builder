import { format as formatPrettier, Options } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import { allComponents } from '../../../../../fragment-components';
import { getAllFragmentStyleClasses, hasFragmentStyleClasses } from '../../../../../utils/fragment-tools';

const format = (source: string, options?: Options | undefined) => {
	// we're catching and ignorring errors so live editing doesn't throw errors
	try {
		return formatPrettier(source, options);
	} catch (_) {
		return source;
	}
};

const addIfNotExist = (arr: any[], items: string[] | undefined) => {
    items?.forEach(item => {
        if (!arr.includes(item)) {
            arr.push(item);
        }
    });
    return arr;
}

const jsonToAngularImports = (json: any) => {
    const imports: any[] = [];

	for (let [key, component] of Object.entries(allComponents)) {
		if (json.type === key) {
			addIfNotExist(imports, component.componentInfo.codeExport.angular?.imports);
		}
	}

	if (json.items) {
        json.items.forEach((item: any) => {
            addIfNotExist(imports, jsonToAngularImports(item));
        });
	}

    return imports;
};

const getAngularInputsFromJson = (json: any): string => {
	const getOne = (json: any) => {
		for (let [key, component] of Object.entries(allComponents)) {
			if (json.type === key) {
				return component.componentInfo.codeExport.angular?.inputs({json}) || '';
			}
		}
		return '';
	};

	return `${getOne(json)} ${json.items ? json.items.map((item: any) => getAngularInputsFromJson(item)).join('\n') : ''}
	`;
};

const getAngularOutputsFromJson = (json: any): string => {
	const getOne = (json: any) => {
		for (let [key, component] of Object.entries(allComponents)) {
			if (json.type === key) {
				return component.componentInfo.codeExport.angular?.outputs({json}) || '';
			}
		}
		return '';
	};

	return `${getOne(json)} ${json.items ? json.items.map((item: any) => getAngularOutputsFromJson(item)).join('\n') : ''}
	`;
};

export const jsonToTemplate = (json: any) => {
    if (typeof json === "string" || !json) {
        return json;
    }

	for (let [key, component] of Object.entries(allComponents)) {
		if (json.type === key && !component.componentInfo.codeExport.angular.isNotDirectExport) {
			return component.componentInfo.codeExport.angular.code({json, jsonToTemplate});
		}
	}

    if (json.items) {
        return json.items.map((item: any) => jsonToTemplate(item)).join('\n');
    }
};


export const createAngularApp = (fragment: any) => {
	const formatOptionsTypescript: Options = {
		plugins: [parserBabel],
		trailingComma: 'none',
		useTabs: true,
		parser: 'babel-ts'
	};
	const formatOptionsHtml: Options = {
		plugins: [parserHtml],
		trailingComma: 'none',
		useTabs: true,
		parser: 'html'
	};
	const formatOptionsCss: Options = {
		parser: 'css',
		plugins: [parserCss]
	};

	const appComponentHtml =
		`<app-fragment></app-fragment>
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
		import { FragmentModule } from './components/fragment/fragment.module';

		@NgModule({
			imports: [BrowserModule, FragmentModule],
			declarations: [AppComponent],
			bootstrap: [AppComponent]
		})
		export class AppModule {}
		`;

	const fragmentModuleTs =
		`import { NgModule } from '@angular/core';
		import { ${jsonToAngularImports(fragment.data).join(', ')} } from 'carbon-components-angular';
		import { FragmentComponent } from './fragment.component';

		@NgModule({
			imports: [${jsonToAngularImports(fragment.data).join(', ')}],
			declarations: [FragmentComponent],
			exports: [FragmentComponent]
		})
		export class FragmentModule {}
		`;

	const fragmentComponentTs =
		`import { Component, Input, Output, EventEmitter } from '@angular/core';
		@Component({
			selector: 'app-fragment',
			templateUrl: './fragment.component.html'${hasFragmentStyleClasses(fragment) ? `,
			styleUrls: ['./fragment.component.scss']` : ''}
		})
		export class FragmentComponent {
			${getAngularInputsFromJson(fragment.data)}
			${getAngularOutputsFromJson(fragment.data)}
		}`;

	const fragmentComponentHtml = jsonToTemplate(fragment.data);

	const fragmentComponentScss = getAllFragmentStyleClasses(fragment).map((styleClass: any) => `.${styleClass.id} {
		${styleClass.content}
	}`).join('\n');

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
			'carbon-components-angular': '4.56.3',
			'carbon-components': '10.50.0'
		}
	};

	return {
		'src/index.html': format(indexHtml, formatOptionsHtml),
		'src/main.ts': format(mainTs, formatOptionsTypescript),
		'src/polyfills.ts': format("import 'zone.js/dist/zone';", formatOptionsTypescript),
		'src/styles.scss': format('', formatOptionsCss),
		'src/app/app.component.html': format(appComponentHtml, formatOptionsHtml),
		'src/app/app.component.ts': format(appComponentTs, formatOptionsTypescript),
		'src/app/app.module.ts': format(appModule, formatOptionsTypescript),
		'src/app/components/fragment/fragment.module.ts': format(fragmentModuleTs, formatOptionsTypescript),
		'src/app/components/fragment/fragment.component.ts': format(fragmentComponentTs, formatOptionsTypescript),
		'src/app/components/fragment/fragment.component.html': format(fragmentComponentHtml, formatOptionsHtml),
		'src/app/components/fragment/fragment.component.scss': hasFragmentStyleClasses(fragment)
			? format(fragmentComponentScss, formatOptionsCss)
			: undefined,
		'.angular-cli.json': angularCliJson,
		'package.json': packageJson
	};
};
