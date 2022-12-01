// Imports
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// Define the features
const features = [
	{
		title: 'Performant design',
		imageUrl: 'img/undraw_speed_test.svg',
		description: (
			<>Rugged is designed to be fast and efficient out-of-the-box, with a small size and few dependencies.</>
		),
	},
	{
		title: 'Use everywhere',
		imageUrl: 'img/undraw_powerful.svg',
		description: (
			<>Use Rugged both from a terminal during local development and in continuous integration environments.</>
		),
	},
	{
		title: 'Thoroughly tested',
		imageUrl: 'img/undraw_online_test.svg',
		description: <>An extensive suite of automated tests verifies every change to the codebase.</>,
	},
	{
		title: 'Beautiful output',
		imageUrl: 'img/undraw_art_museum.svg',
		description: <>Carefully crafted to produce visually appealing output for both successes and failure.</>,
	},
];

// The individual feature component
interface FeatureProps {
	imageUrl: string;
	title: string;
	description: React.ReactElement;
}

function Feature({ imageUrl, title, description }: FeatureProps) {
	const imgUrl = useBaseUrl(imageUrl);
	return (
		<div className={clsx('col col--3', styles.feature)}>
			{imgUrl && (
				<div className='text--center'>
					<img className={styles.featureImage} src={imgUrl} alt={title} />
				</div>
			)}
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	);
}

// Function component
const Home: React.FC = () => {
	// Get the site config
	const context = useDocusaurusContext();
	const { siteConfig } = context;

	// Get the URL to the GIF
	const gifUrl = useBaseUrl('img/screen-recording.gif');

	// Return JSX
	return (
		<Layout title={`Test orchestration`} description='Orchestrate package testing across uneven terrain'>
			<header className={clsx('hero hero--primary', styles.heroBanner)}>
				<div className='container'>
					<h1 className='hero__title'>{siteConfig.title}</h1>
					<p className='hero__subtitle'>{siteConfig.tagline}</p>
					<div className={styles.buttons}>
						<Link className={clsx('button button--lg', styles.getStarted)} to={useBaseUrl('docs/')}>
							Get started
						</Link>
					</div>
				</div>
			</header>

			<main>
				<section>
					<div className='container'>
						<div className='row' style={{ paddingTop: '2rem', maxWidth: '1100px', margin: 'auto' }}>
							<div className='col col-12'>
								<h1>The problem</h1>

								<p>
									Today, people can consume your package in many contexts—in Node.js, in a browser, in an ECMAScript
									module, in a Common JS module, within a library (e.g., React, Angular, etc.), with assistance from
									compilers/transpilers/bundlers (e.g., TypeScript, Babel, Webpack, etc.), even inside test runners
									(e.g., Jest, Mocha, etc.). Each of these contexts has a unique set of capabilities, limitations,
									requirements, global variables, etc. that could impact or even break your package’s behavior.
								</p>

								<p>
									Further, testing often only occurs against the source files that are available in the repository,
									which is problematic in two ways… First, tools may manipulate the source code in such a way that the
									compiled/transpiled/bundled version behaves slightly differently than the source code. Second,
									misconfigurations in your <code>package.json</code> may cause necessary files to be excluded from the
									published version of your package.
								</p>
							</div>
						</div>

						<div className='row' style={{ paddingBottom: '2rem', maxWidth: '1100px', margin: 'auto' }}>
							<div className='col col-12'>
								<h1>How Rugged helps</h1>

								<p>
									Rugged facilitates testing your package in the environments and contexts where your package will be
									used, using the files that would be published (i.e., the compiled/transpiled/bundled files that are
									included according to your <code>package.json</code> settings).
								</p>

								<p>
									This is done by injecting the compiled &amp; packaged version of your package into a series of minimal
									test projects you create, which mimic the various contexts in which your package could be
									used/consumed. These test projects live in your package’s repository and simply need a{' '}
									<code>test</code> script in their <code>package.json</code> files. Rugged will run the{' '}
									<code>test</code> script in each test project to verify your package works as expected in each
									environment/context.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section>
					<div className='container'>
						<div className='row'>
							<div className={`col col-12 ${styles.screenRecordingCol}`}>
								<img src={gifUrl} alt='Screen recording' className={styles.screenRecordingImg} />
							</div>
						</div>
					</div>
				</section>

				{features && features.length > 0 && (
					<section className={styles.features}>
						<div className='container'>
							<div className='row'>
								{features.map((props, idx) => (
									<Feature key={idx} {...props} />
								))}
							</div>
						</div>
					</section>
				)}
			</main>
		</Layout>
	);
};

export default Home;
