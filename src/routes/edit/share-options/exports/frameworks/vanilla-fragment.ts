// Used to map fragment types to corresponding vanilla fragment tag.
const fragmentTagMap: Record<string, string> = {
};

export const createVanillaApp = (fragment: any) => {
	const fragmentData = JSON.stringify(fragment.data, null, '\t');
	const fragmentType = `${fragment.type}`;

	const indexHtml
= `<!DOCTYPE html>
<html>
	<head>
		<title>Vanilla</title>
		<meta charset='UTF-8' />
	</head>
	<body>
		<div style='height: 500px; min-width: 100%;'>
			<div id='my-fragment'></div>
		</div>
		<script src='src/index.js'>
		</script>
	</body>
</html>
`;

	const indexJs
= `import '@carbon/fragments/styles.css';
import { ${fragmentTagMap[fragmentType]} } from '@carbon/fragments';
// grab fragment holder DOM element
const fragmentHolder = document.getElementById('my-fragment');
// initialize the fragment
new ${fragmentTagMap[fragmentType]}(fragmentHolder, {
	data: ${fragmentData},
});
`;

	const packageJson = {
		dependencies: {
			'@carbon/fragments': '0.38.8',
			'carbon-components': '10.20.0',
			'@carbon/colors': '10.11.0',
			d3: '5.15.0'
		}
	};

	return {
		'index.html': indexHtml,
		'src/index.js': indexJs,
		'package.json': packageJson
	};
};
