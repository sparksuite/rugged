(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{80:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return v})),a.d(t,"metadata",(function(){return f})),a.d(t,"toc",(function(){return h})),a.d(t,"default",(function(){return w}));var n=a(3),r=a(7),l=a(0),o=a.n(l),s=a(104),i=a(88),c=a(82),u=a(76),d=a.n(u);var m=37,b=39;var p=function(e){var t=e.lazy,a=e.block,n=e.defaultValue,r=e.values,s=e.groupId,u=e.className,p=Object(i.a)(),g=p.tabGroupChoices,v=p.setTabGroupChoices,f=Object(l.useState)(n),h=f[0],O=f[1],w=l.Children.toArray(e.children),j=[];if(null!=s){var y=g[s];null!=y&&y!==h&&r.some((function(e){return e.value===y}))&&O(y)}var I=function(e){var t=e.target,a=j.indexOf(t),n=w[a].props.value;O(n),null!=s&&(v(s,n),setTimeout((function(){var e,a,n,r,l,o,s,i;(e=t.getBoundingClientRect(),a=e.top,n=e.left,r=e.bottom,l=e.right,o=window,s=o.innerHeight,i=o.innerWidth,a>=0&&l<=i&&r<=s&&n>=0)||(t.scrollIntoView({block:"center",behavior:"smooth"}),t.classList.add(d.a.tabItemActive),setTimeout((function(){return t.classList.remove(d.a.tabItemActive)}),2e3))}),150))},k=function(e){var t,a;switch(e.keyCode){case b:var n=j.indexOf(e.target)+1;a=j[n]||j[0];break;case m:var r=j.indexOf(e.target)-1;a=j[r]||j[j.length-1]}null===(t=a)||void 0===t||t.focus()};return o.a.createElement("div",{className:"tabs-container"},o.a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:Object(c.a)("tabs",{"tabs--block":a},u)},r.map((function(e){var t=e.value,a=e.label;return o.a.createElement("li",{role:"tab",tabIndex:h===t?0:-1,"aria-selected":h===t,className:Object(c.a)("tabs__item",d.a.tabItem,{"tabs__item--active":h===t}),key:t,ref:function(e){return j.push(e)},onKeyDown:k,onFocus:I,onClick:I},a)}))),t?Object(l.cloneElement)(w.filter((function(e){return e.props.value===h}))[0],{className:"margin-vert--md"}):o.a.createElement("div",{className:"margin-vert--md"},w.map((function(e,t){return Object(l.cloneElement)(e,{key:t,hidden:e.props.value!==h})}))))};var g=function(e){var t=e.children,a=e.hidden,n=e.className;return o.a.createElement("div",{role:"tabpanel",hidden:a,className:n},t)},v={title:"Install",slug:"/"},f={unversionedId:"getting-started/install",id:"getting-started/install",isDocsHomePage:!1,title:"Install",description:"Installation is simple. Just run one of the following two commands, depending on whether you\u2019re using Yarn or npm:",source:"@site/docs/getting-started/install.md",slug:"/",permalink:"/docs/",editUrl:"https://github.com/sparksuite/rugged/edit/master/website/docs/getting-started/install.md",version:"current",sidebar:"default"},h=[],O={toc:h};function w(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(s.b)("wrapper",Object(n.a)({},O,a,{components:t,mdxType:"MDXLayout"}),Object(s.b)("p",null,"Installation is simple. Just run one of the following two commands, depending on whether you\u2019re using Yarn or npm:"),Object(s.b)(p,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},Object(s.b)(g,{value:"yarn",mdxType:"TabItem"},Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-bash"},"yarn add --dev rugged\n"))),Object(s.b)(g,{value:"npm",mdxType:"TabItem"},Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-bash"},"npm install --save-dev rugged\n")))))}w.isMDXComponent=!0}}]);