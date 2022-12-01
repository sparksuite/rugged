"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[886],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),p=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},l=function(e){var t=p(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),d=p(r),f=o,g=d["".concat(c,".").concat(f)]||d[f]||u[f]||a;return r?n.createElement(g,s(s({ref:t},l),{},{components:r})):n.createElement(g,s({ref:t},l))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,s=new Array(a);s[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:o,s[1]=i;for(var p=2;p<a;p++)s[p]=r[p];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},5122:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>p});var n=r(7462),o=(r(7294),r(3905));const a={title:"Create test projects",slug:"/getting-started/create-test-projects"},s=void 0,i={unversionedId:"getting-started/create-test-projects",id:"getting-started/create-test-projects",title:"Create test projects",description:"For Rugged to work, your repository must contain at least one test project. By default, these are contained within the test-projects/ directory at the root of your repository.",source:"@site/docs/getting-started/create-test-projects.md",sourceDirName:"getting-started",slug:"/getting-started/create-test-projects",permalink:"/docs/getting-started/create-test-projects",draft:!1,editUrl:"https://github.com/sparksuite/rugged/edit/master/website/docs/getting-started/create-test-projects.md",tags:[],version:"current",frontMatter:{title:"Create test projects",slug:"/getting-started/create-test-projects"},sidebar:"default",previous:{title:"Install",permalink:"/docs/"},next:{title:"Options",permalink:"/docs/configuration/options"}},c={},p=[],l={toc:p};function u(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"For Rugged to work, your repository must contain at least one test project. By default, these are contained within the ",(0,o.kt)("inlineCode",{parentName:"p"},"test-projects/")," directory at the root of your repository."),(0,o.kt)("p",null,"Test projects are independent of one another, and should be relatively-minimal versions of what projects that use your package would look like."),(0,o.kt)("p",null,"Each test project just needs a ",(0,o.kt)("inlineCode",{parentName:"p"},"package.json")," file with a ",(0,o.kt)("inlineCode",{parentName:"p"},"test")," script. Rugged will run this test script in each test project."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'{3} title="test-projects/example/package.json"',"{3}":!0,title:'"test-projects/example/package.json"'},'{\n    "scripts": {\n        "test": "jest"\n    }\n}\n')),(0,o.kt)("p",null,"Every package is unique and will require a different set of test projects. However, we have a handful of test project suggestions, which you can find in the sidebar on the left."))}u.isMDXComponent=!0}}]);