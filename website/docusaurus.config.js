module.exports = {
	title: 'Rugged',
	tagline: 'Orchestrate package testing across uneven terrain',
	url: 'https://ruggedjs.io/',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'sparksuite',
	projectName: 'rugged',
	themeConfig: {
		navbar: {
			title: '',
			logo: {
				alt: 'Logo',
				src: 'img/logo.png',
			},
			items: [
				{
					to: 'docs/',
					activeBasePath: 'docs',
					label: 'Docs',
					position: 'left',
				},
				{
					href: 'https://github.com/sparksuite/rugged',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'light',
			links: [
				{
					title: 'GitHub',
					items: [
						{
							label: 'Repository',
							to: 'https://github.com/sparksuite/rugged',
						},
						{
							label: 'Submit an issue',
							to: 'https://github.com/sparksuite/rugged/issues/new',
						},
						{
							label: 'How to contribute',
							to: 'https://github.com/sparksuite/rugged/blob/master/CONTRIBUTING.md',
						},
					],
				},
				{
					title: 'Sparksuite',
					items: [
						{
							label: 'About us',
							href: 'https://www.sparksuite.com',
						},
						{
							label: 'Open source',
							href: 'https://github.com/sparksuite',
						},
						{
							label: 'Careers',
							href: 'https://sparksuite.careers',
						},
					],
				},
			],
		},
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/sparksuite/rugged/edit/master/website/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			},
		],
	],
};
