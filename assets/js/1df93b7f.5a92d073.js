(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{76:function(e,a,t){"use strict";t.r(a);var n=t(3),r=t(0),l=t.n(r),c=t(94),i=t(102),s=t(97),o=t(16),m=t(98),u=t(77),d=t.n(u),g=[{title:"Performant design",imageUrl:"img/undraw_speed_test.svg",description:l.a.createElement(l.a.Fragment,null,"Rugged is designed to be fast and efficient out-of-the-box, with a small size and few dependencies.")},{title:"Use everywhere",imageUrl:"img/undraw_powerful.svg",description:l.a.createElement(l.a.Fragment,null,"Use Rugged both from a terminal during local development and in continuous integration environments.")},{title:"Thoroughly tested",imageUrl:"img/undraw_online_test.svg",description:l.a.createElement(l.a.Fragment,null,"An extensive suite of automated tests verifies every change to the codebase.")},{title:"Beautiful output",imageUrl:"img/undraw_art_museum.svg",description:l.a.createElement(l.a.Fragment,null,"Carefully crafted to produce visually appealing output for both successes and failure.")}];function p(e){var a=e.imageUrl,t=e.title,n=e.description,r=Object(m.a)(a);return l.a.createElement("div",{className:Object(c.a)("col col--3",d.a.feature)},r&&l.a.createElement("div",{className:"text--center"},l.a.createElement("img",{className:d.a.featureImage,src:r,alt:t})),l.a.createElement("h3",null,t),l.a.createElement("p",null,n))}a.default=function(){var e=Object(o.default)().siteConfig,a=void 0===e?{}:e,t=Object(m.a)("img/screen-recording.gif");return l.a.createElement(i.a,{title:"Test orchestration",description:"Orchestrate package testing across uneven terrain"},l.a.createElement("header",{className:Object(c.a)("hero hero--primary",d.a.heroBanner)},l.a.createElement("div",{className:"container"},l.a.createElement("h1",{className:"hero__title"},a.title),l.a.createElement("p",{className:"hero__subtitle"},a.tagline),l.a.createElement("div",{className:d.a.buttons},l.a.createElement(s.a,{className:Object(c.a)("button button--lg",d.a.getStarted),to:Object(m.a)("docs/")},"Get started")))),l.a.createElement("main",null,l.a.createElement("section",null,l.a.createElement("div",{className:"container"},l.a.createElement("div",{className:"row",style:{paddingTop:"2rem",maxWidth:"1100px",margin:"auto"}},l.a.createElement("div",{className:"col col-12"},l.a.createElement("h1",null,"The problem"),l.a.createElement("p",null,"Today, people can consume your package in many contexts\u2014in Node.js, in a browser, in an ECMAScript module, in a Common JS module, within a library (e.g., React, Angular, etc.), with assistance from compilers/transpilers/bundlers (e.g., TypeScript, Babel, Webpack, etc.), even inside test runners (e.g., Jest, Mocha, etc.). Each of these contexts has a unique set of capabilities, limitations, requirements, global variables, etc. that could impact or even break your package\u2019s behavior."),l.a.createElement("p",null,"Further, testing often only occurs against the source files that are available in the repository, which is problematic in two ways\u2026 First, tools may manipulate the source code in such a way that the compiled/transpiled/bundled version behaves slightly differently than the source code. Second, misconfigurations in your ",l.a.createElement("code",null,"package.json")," may cause necessary files to be excluded from the published version of your package."))),l.a.createElement("div",{className:"row",style:{paddingBottom:"2rem",maxWidth:"1100px",margin:"auto"}},l.a.createElement("div",{className:"col col-12"},l.a.createElement("h1",null,"How Rugged helps"),l.a.createElement("p",null,"Rugged facilitates testing your package in the environments and contexts where your package will be used, using the files that would be published (i.e., the compiled/transpiled/bundled files that are included according to your ",l.a.createElement("code",null,"package.json")," settings)."),l.a.createElement("p",null,"This is done by injecting the compiled & packaged version of your package into a series of minimal test projects you create, which mimic the various contexts in which your package could be used/consumed. These test projects live in your package\u2019s repository and simply need a"," ",l.a.createElement("code",null,"test")," script in their ",l.a.createElement("code",null,"package.json")," files. Rugged will run the"," ",l.a.createElement("code",null,"test")," script in each test project to verify your package works as expected in each environment/context."))))),l.a.createElement("section",null,l.a.createElement("div",{className:"container"},l.a.createElement("div",{className:"row"},l.a.createElement("div",{className:"col col-12 "+d.a.screenRecordingCol},l.a.createElement("img",{src:t,alt:"Screen recording",className:d.a.screenRecordingImg}))))),g&&g.length>0&&l.a.createElement("section",{className:d.a.features},l.a.createElement("div",{className:"container"},l.a.createElement("div",{className:"row"},g.map((function(e,a){return l.a.createElement(p,Object(n.a)({key:a},e))})))))))}}}]);