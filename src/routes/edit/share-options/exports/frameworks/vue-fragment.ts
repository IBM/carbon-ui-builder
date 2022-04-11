// Used to map fragment types to corresponding vue fragment tag.
const fragmentTagMap: Record<string, string> = {
	'simple-bar-fragment': 'ccv-simple-bar-fragment',
	'grouped-bar-fragment': 'ccv-grouped-bar-fragment',
	'stacked-bar-fragment': 'ccv-stacked-bar-Fragment',
	'line-fragment': 'ccv-line-fragment',
	'scatter-fragment': 'ccv-scatter-fragment',
	'pie-fragment': 'ccv-pie-fragment',
	'donut-fragment': 'ccv-donut-fragment',
	dataAndOptions: ":data='data' :options='options'"
};

export const createVueApp = (fragment: any) => {
	const fragmentData = JSON.stringify(fragment.data, null, '\t');
	const fragmentType = `${fragment.type}`;

	const fragmentVue
= `<script>
	import Vue from 'vue';
	import '@carbon/fragments/styles.css';
	import fragmentsVue from '@carbon/fragments-vue';
	Vue.use(fragmentsVue);
	export default {
		name: 'Fragment',
		components: {},
		data() {
			return {
			data:
			${fragmentData}
		};
	},
	template:
		"<${fragmentTagMap[fragmentType]} :data='data' :options='options'></${fragmentTagMap[fragmentType]}>"
	};
</script>
`;

	const appVue
= `<template>
<div id='app' style='height: 500px; min-width: 100%;'>
<Fragment/>
</div>
</template>
<script>
	import Fragment from './components/fragment';
	export default {
		name: 'App',
		components: {
			Fragment
		}
	};
</script>
`;
	const mainJs
= `import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;
new Vue({
	render: h => h(App)
}).$mount('#app');
`;

	const packageJson = {
		dependencies: {
			'@carbon/fragments': '0.38.8',
			'@carbon/fragments-vue': '0.38.8',
			'@vue/cli-plugin-babel': '4.1.1',
			d3: '5.15.0',
			vue: '2.6.11'
		}
	};

	return {
		'src/components/fragment.vue': fragmentVue,
		'src/App.vue': appVue,
		'src/main.js': mainJs,
		'package.json': packageJson
	};
};
