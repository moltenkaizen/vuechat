webpackJsonp([1],{AD15:function(e,s){},NHnr:function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var n=t("7+uW"),a={render:function(){var e=this.$createElement,s=this._self._c||e;return s("div",{attrs:{id:"app"}},[s("router-view")],1)},staticRenderFns:[]};var i=t("VU/8")({name:"App"},a,!1,function(e){t("AD15")},null,null).exports,o=t("/ocq"),r={name:"Chat",data:function(){return{messages:[],myName:"",myMessage:"",typingUsers:[]}},methods:{sendMessage:function(){if(this.myName){var e={author:this.myName,body:this.myMessage};console.log("message:",e),this.$socket.emit("message",e),this.messages.push(e),this.myMessage=""}else alert("You must set your name before hitting send")}},watch:{myMessage:function(){this.myMessage?(console.log("I am typing"),this.$socket.emit("typing",this.myName)):this.$socket.emit("notyping",this.myName)}},sockets:{connect:function(){console.log("socket connected")},message:function(e){console.log(e),e.author!==this.myName&&this.messages.push(e)},typing:function(e){console.log(e," is typing"),this.typingUsers.includes(e)||e===this.myName||this.typingUsers.push(e)},notyping:function(e){if(this.typingUsers.includes(e)){var s=this.typingUsers.indexOf(e);this.typingUsers.splice(s,1)}},disconnect:function(){console.log("socket disconnected")}}},m={render:function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("main",{attrs:{id:"app"}},[t("section",{ref:"chatArea",staticClass:"chat-area"},[e._l(e.messages,function(s){return t("p",{key:e.messages.indexOf(s),staticClass:"message",class:{"message-out":s.author===e.myName,"message-in":s.author!==e.myName}},[e._v("\n      "+e._s(s.body)+" - "),t("span",{directives:[{name:"show",rawName:"v-show",value:s.author!==e.myName,expression:"message.author !== myName"}]},[e._v(e._s(s.author))])])}),e._v(" "),t("p",{directives:[{name:"show",rawName:"v-show",value:e.typingUsers.length>0,expression:"typingUsers.length > 0"}],staticClass:"typing-indicator"},[e._l(e.typingUsers,function(s){return t("span",{key:s},[e._v("\n        "+e._s(s)+"\n        "),e.typingUsers.length>1?t("span",[e._v("and")]):e._e()])}),e._v(" "),1===e.typingUsers.length?t("span",[e._v("is")]):e.typingUsers.length>1?t("span",[e._v("are")]):e._e(),e._v("\n      typing...\n    ")],2)],2),e._v(" "),t("section",[t("form",{staticClass:"chat-inputs",on:{submit:function(s){return s.preventDefault(),e.sendMessage(s)}}},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.myMessage,expression:"myMessage"}],attrs:{autocomplete:"off",type:"text",placeholder:"Type your message"},domProps:{value:e.myMessage},on:{input:function(s){s.target.composing||(e.myMessage=s.target.value)}}}),e._v(" "),t("button",{attrs:{type:"submit"}},[e._v("Send")])])]),e._v(" "),t("section",{staticClass:"chat-who"},[t("h3",[e._v("You are chatting as")]),e._v(" "),t("input",{directives:[{name:"model",rawName:"v-model",value:e.myName,expression:"myName"}],attrs:{type:"text",required:"",placeholder:"Your Name"},domProps:{value:e.myName},on:{input:function(s){s.target.composing||(e.myName=s.target.value)}}})])])},staticRenderFns:[]};var c=t("VU/8")(r,m,!1,function(e){t("WuDa")},"data-v-52bc030d",null).exports;n.a.use(o.a);var u=new o.a({routes:[{path:"/",name:"Chat",component:c}]}),p=t("hMcO"),g=t.n(p);n.a.config.productionTip=!1,n.a.use(g.a,"http://localhost:3000"),new n.a({el:"#app",router:u,components:{App:i},template:"<App/>"})},WuDa:function(e,s){}},["NHnr"]);
//# sourceMappingURL=app.05e729007a0e3271d21c.js.map