// Used to map fragment types to corresponding angular tag.
const fragmentTagMap: Record<string, string> = {
};

export const createAngularApp = (fragment: any) => {
	const fragmentData = JSON.stringify(fragment.data, null, '\t');
	const fragmentType = `${fragment.type}`;

	const appComponentHtml
= `<${fragmentTagMap[fragmentType]} [data]='data' [options]='options'></${fragmentTagMap[fragmentType]}>
`;
	const appComponentTs
= `import { Component } from '@angular/core';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	data = ${fragmentData};
}
`;
	const appModule
= `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FragmentsModule } from '@carbon/fragments-angular';
import { AppComponent } from './app.component';
@NgModule({
	imports: [BrowserModule, FragmentsModule],
	declarations: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {}
`;

	const indexHtml
= `<!DOCTYPE html>
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

	const mainTs
= `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch(err => console.log(err));
`;

	const angularCliJson
= `{
	"apps": [
		{
			"root": "src",
			"outDir": "dist",
			"assets": ["assets", "favicon.ico"],
			"index": "index.html",
			"main": "main.ts",
			"polyfills": "polyfills.ts",
			"prefix": "app",
			"styles": ["styles.css"],
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
			'@angular/animations': '8.2.14',
			'@angular/common': '8.2.14',
			'@angular/compiler': '8.2.14',
			'@angular/core': '8.2.14',
			'@angular/forms': '8.2.14',
			'@angular/platform-browser': '8.2.14',
			'@angular/platform-browser-dynamic': '8.2.14',
			'@angular/router': '8.2.14',
			'@carbon/fragments': '0.38.8',
			'@carbon/fragments-angular': '0.38.8',
			'core-js': '3.6.0',
			d3: '5.15.0',
			rxjs: '6.5.3',
			'zone.js': '0.10.2'
		}
	};

	return {
		'src/index.html': indexHtml,
		'src/main.ts': mainTs,
		'src/app/app.component.html': appComponentHtml,
		'src/app/app.component.ts': appComponentTs,
		'src/app/app.module.ts': appModule,
		'.angular-cli.json': angularCliJson,
		'package.json': packageJson
	};
};
