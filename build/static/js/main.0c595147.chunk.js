(this["webpackJsonpbloglist-frontend"]=this["webpackJsonpbloglist-frontend"]||[]).push([[0],{16:function(e,t,n){e.exports=n(40)},39:function(e,t,n){},40:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),u=n(15),c=n.n(u),o=n(2),l=n.n(o),s=n(4),i=n(3),p=function(e){var t=e.blog;return r.a.createElement("div",{className:"blog"},r.a.createElement("a",{href:t.url}," ",t.title," by ",t.author," "),"added by ",null===t.user?"":t.user.name)},m=function(){return r.a.createElement("div",{style:{color:"green",fontStyle:"italic",fontSize:16}},r.a.createElement("br",null),r.a.createElement("em",null,"Note app, from Andrei to Andrei"))},f=function(e){return null===e.message?null:r.a.createElement("div",{className:e.type},e.message)},g=n(5),b=n.n(g),d=null,v={getAll:function(){return b.a.get("/api/blogs").then((function(e){return e.data}))},create:function(){var e=Object(s.a)(l.a.mark((function e(t){var n,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={headers:{Authorization:d}},e.next=3,b.a.post("/api/blogs",t,n);case 3:return a=e.sent,e.abrupt("return",a.data);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),update:function(e,t){return b.a.put("".concat("/api/blogs","/").concat(e),t).then((function(e){return e.data}))},setToken:function(e){d="bearer ".concat(e)}},h={login:function(){var e=Object(s.a)(l.a.mark((function e(t){var n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.a.post("/api/login",t);case 2:return n=e.sent,e.abrupt("return",n.data);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},E=function(){var e=Object(a.useState)([]),t=Object(i.a)(e,2),n=t[0],u=t[1],c=Object(a.useState)(!0),o=Object(i.a)(c,2),g=(o[0],o[1],Object(a.useState)("title...")),b=Object(i.a)(g,2),d=b[0],E=b[1],O=Object(a.useState)("author..."),j=Object(i.a)(O,2),w=j[0],y=j[1],S=Object(a.useState)("url..."),k=Object(i.a)(S,2),x=k[0],T=k[1],A=Object(a.useState)(""),B=Object(i.a)(A,2),C=B[0],N=B[1],I=Object(a.useState)(""),J=Object(i.a)(I,2),U=J[0],z=J[1],D=Object(a.useState)(""),P=Object(i.a)(D,2),W=P[0],q=P[1],F=Object(a.useState)(""),G=Object(i.a)(F,2),H=G[0],K=G[1],L=Object(a.useState)(null),M=Object(i.a)(L,2),Q=M[0],R=M[1];Object(a.useEffect)((function(){v.getAll().then((function(e){return u(e)}))}),[]),Object(a.useEffect)((function(){var e=window.localStorage.getItem("loggedBlogAppUser");if(e){var t=JSON.parse(e);R(t),v.setToken(t.token)}}),[]);var V=function(){var e=Object(s.a)(l.a.mark((function e(t){var a,r;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),a={title:d,author:w,url:x,user:Q},e.prev=2,e.next=5,v.create(a);case 5:r=e.sent,u(n.concat(r)),E(""),y(""),T(""),N("Blog added with success"),z("success"),setTimeout((function(){N(""),z("")}),5e3),e.next=20;break;case 15:e.prev=15,e.t0=e.catch(2),N("Blog addition failed with exception: ".concat(e.t0)),z("error"),setTimeout((function(){N(""),z("")}),5e3);case 20:case"end":return e.stop()}}),e,null,[[2,15]])})));return function(t){return e.apply(this,arguments)}}(),X=function(){var e=Object(s.a)(l.a.mark((function e(t){var n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.prev=1,e.next=4,h.login({username:W,password:H});case 4:n=e.sent,window.localStorage.setItem("loggedBlogAppUser",JSON.stringify(n)),v.setToken(n.token),R(n),q(""),K(""),N("Welcome in you dear ".concat(n.name)),z("success"),setTimeout((function(){N(""),z("")}),5e3),e.next=21;break;case 15:e.prev=15,e.t0=e.catch(1),console.log(e.t0),N("wrong user name or password"),z("error"),setTimeout((function(){N(""),z("")}),5e3);case 21:case"end":return e.stop()}}),e,null,[[1,15]])})));return function(t){return e.apply(this,arguments)}}(),Y=function(e){y(e.target.value)},Z=function(e){E(e.target.value)},$=function(e){T(e.target.value)},_=function(){return r.a.createElement("form",{onSubmit:X},r.a.createElement("div",null,"username",r.a.createElement("input",{type:"text",value:W,name:"Username",onChange:function(e){var t=e.target;return q(t.value)}})),r.a.createElement("div",null,"password",r.a.createElement("input",{type:"password",value:H,name:"Password",onChange:function(e){var t=e.target;return K(t.value)}})),r.a.createElement("button",{type:"submit"},"login"))};return r.a.createElement("div",null,r.a.createElement("h1",null,"Blogs"),r.a.createElement(f,{message:C,type:U}),null===Q?_():r.a.createElement("div",null,r.a.createElement("p",null,Q.name," logged in",r.a.createElement("button",{onClick:function(){return window.localStorage.removeItem("loggedBlogAppUser"),N("Bye, ".concat(Q.name)),z("success"),setTimeout((function(){N(""),z("")}),5e3),v.setToken(null),R(null),void _()}}," logout ")),r.a.createElement("form",{onSubmit:V},r.a.createElement("input",{value:w,onChange:Y}),r.a.createElement("input",{value:d,onChange:Z}),r.a.createElement("input",{value:x,onChange:$}),r.a.createElement("button",{type:"submit"},"save")),r.a.createElement("ul",null,n.map((function(e,t){return r.a.createElement(p,{key:t,blog:e})})))),r.a.createElement(m,null))};n(39);c.a.render(r.a.createElement(E,null),document.getElementById("root"))}},[[16,1,2]]]);
//# sourceMappingURL=main.0c595147.chunk.js.map