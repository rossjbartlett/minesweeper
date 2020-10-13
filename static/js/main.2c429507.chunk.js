(this.webpackJsonpminesweeper=this.webpackJsonpminesweeper||[]).push([[0],[,,,,function(e,t,n){e.exports=n(11)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),i=n(3),o=n.n(i),c=(n(9),n(1)),u=(n(10),["blue","green","red","purple","magenta","black"]),s={easy:{name:"Easy",size:[10,10],numBombs:10,width:"40vw",fontSize:["2.9vw","7vw"]},medium:{name:"Medium",size:[13,18],numBombs:40,width:"50vw",fontSize:["2.3vw","4vw"]},hard:{name:"Hard",size:[20,24],numBombs:99,width:"50vw",fontSize:["1.7vw","3vw"]}};function l(e,t,n){return[[t-1,n-1],[t-1,n],[t-1,n+1],[t,n-1],[t,n+1],[t+1,n-1],[t+1,n],[t+1,n+1]].filter((function(t){return e[t[0]]&&e[t[0]][t[1]]}))}function f(e){var t=e.currentDifficulty,n=e.setDifficulty,r=e.reset,i=e.time,o=e.lost,c=e.won,u=e.numFlags,l={color:o?"red":c?"green":"inherit"};return a.a.createElement("div",{id:"header"},a.a.createElement("select",{id:"difficulty",name:"difficulty",onChange:function(e){return n(s[e.target.value])}},Object.keys(s).map((function(e){return a.a.createElement("option",{value:e,key:e},s[e].name)}))),a.a.createElement("div",null,a.a.createElement("span",{id:"numFlagsIcon"},"\ud83d\udea9"),t.numBombs-u),a.a.createElement("div",{style:l},a.a.createElement("span",{id:"timeIcon"},"\u23f1"),i),a.a.createElement("div",{id:"resetBtn",onClick:r},"\u21ba"))}function m(e){var t=e.colorClass,n=e.numAdjBombs,r=e.square,i=e.uncover,o=e.setFlagged,c=e.lost,s=r.isBomb,l=r.isUncovered,f=r.isFlagged,m="";c&&s?m="\ud83d\udca3":f?m="\ud83d\udea9":l&&(m=s?"\ud83d\udca3":n>0?n:"");var d={color:u[n]};return a.a.createElement("div",{className:"square ".concat(t," ").concat(l?"uncovered":""),onClick:function(e){f||i()},onContextMenu:function(e){e.preventDefault(),l||o(!f)},style:d},a.a.createElement("div",{className:"content"},m))}function d(e){var t=e.grid,n=e.updateGrid,r=e.lost,i=e.won,o=e.gameStarted,c=e.setGameStarted,u=e.setWon,s=e.setLost,f=e.currentDifficulty,d=e.isMobile,v={gridTemplateColumns:"repeat(".concat(t[0].length,", 1fr)"),pointerEvents:r||i?"none":"",width:d?"100vw":f.width,fontSize:f.fontSize[d?1:0]},g=["c0","c1"];function w(e,n){return l(t,e,n).map((function(e){return t[e[0]][e[1]]})).filter((function(e){return e.isBomb})).length}function b(e,r){t[e][r].isBomb?s(!0):(!function e(n,r){t[n][r].isFlagged||t[n][r].isUncovered||(t[n][r].isUncovered=!0,t[n][r].isBomb||w(n,r)>0||l(t,n,r).forEach((function(t){e(t[0],t[1])})))}(e,r),n(t),o||c(!0),t.flat().filter((function(e){return!e.isBomb})).every((function(e){return e.isUncovered}))&&u(!0))}return a.a.createElement("div",{id:"grid",style:v},t.map((function(e,i){return e.map((function(e,o){return a.a.createElement(m,{square:e,key:""+i+o,colorClass:g[(i+o)%2],numAdjBombs:w(i,o),uncover:function(){return b(i,o)},setFlagged:function(e){return function(e,r,a){t[e][r].isFlagged=a,n(t)}(i,o,e)},lost:r})}))})))}var v=function(){var e=Object(r.useState)(s.easy),t=Object(c.a)(e,2),n=t[0],i=t[1],o=Object(r.useState)([[]]),u=Object(c.a)(o,2),l=u[0],m=u[1],v=Object(r.useState)(0),g=Object(c.a)(v,2),w=g[0],b=g[1],h=Object(r.useState)(!1),p=Object(c.a)(h,2),E=p[0],y=p[1],j=Object(r.useState)(!1),O=Object(c.a)(j,2),S=O[0],B=O[1],k=Object(r.useState)(!1),z=Object(c.a)(k,2),F=z[0],M=z[1],C=Object(r.useState)(),D=Object(c.a)(C,2),I=D[0],W=D[1],A=a.a.useState(window.innerWidth),U=Object(c.a)(A,2),G=U[0],J=U[1];function N(){(!l[0].length||S||F||l.flat().every((function(e){return!e.isUncovered}))||window.confirm("Are you sure you want to reset the game?"))&&(m(function(e){for(var t=e.size,n=e.numBombs,r=new Array(t[0]).fill().map((function(){return new Array(t[1]).fill({})})),a=0;a<n;){var i=Math.floor(Math.random()*t[0]),o=Math.floor(Math.random()*t[1]);r[i][o].isBomb||(r[i][o]={isBomb:!0},a++)}return console.log("grid",r),r}(n)),b(0),clearInterval(I),y(!1),B(!1),M(!1))}a.a.useEffect((function(){window.addEventListener("resize",(function(){return J(window.innerWidth<=700)}))}),[]),Object(r.useEffect)(N,[n]),Object(r.useEffect)((function(){E&&W(setInterval((function(){b((function(e){return e+1}))}),1e3))}),[E]),Object(r.useEffect)((function(){(S||F)&&clearInterval(I)}),[S,F,I]);var q=l.flat().filter((function(e){return e.isFlagged})).length;return a.a.createElement("div",{id:"app"},a.a.createElement("div",{id:"game"},a.a.createElement(f,{currentDifficulty:n,setDifficulty:i,reset:N,time:w,lost:S,won:F,numFlags:q}),a.a.createElement(d,{grid:JSON.parse(JSON.stringify(l)),updateGrid:m,lost:S,won:F,gameStarted:E,setGameStarted:y,setLost:B,setWon:M,currentDifficulty:n,isMobile:G})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(v,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[4,1,2]]]);
//# sourceMappingURL=main.2c429507.chunk.js.map