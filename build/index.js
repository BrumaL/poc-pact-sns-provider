(()=>{"use strict";var e={607:function(e,s,t){e=t.nmd(e);var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};s.__esModule=!0,s.sendMessage=void 0;var r=n(t(127)),o=n(t(480)),a=r.default();a.use(r.default.json());var i=process.env.PORT,u=void 0===i?3e3:i,d=new o.default.SharedIniFileCredentials({profile:"default"}),l=new o.default.SNS({credentials:d,region:"eu-north-1"});a.get("/status",(function(e,s){return s.json({status:"ok",sns:l})})),s.sendMessage=function(e){var s;return l.publish(e,(function(e,t){e?(console.log(e),s=e):(console.log(t),s=t)})),s},a.post("/sendMessage",(function(e,t){var n={Message:e.body.message,TopicArn:"arn:aws:sns:eu-north-1:286643423608:vs-prto-test-topic",MessageAttributes:{Country:{DataType:"String",StringValue:e.body.country},Region:{DataType:"String",StringValue:e.body.region}}},r=s.sendMessage(n);return console.log("response: ",r),t.send(r)})),t.c[t.s]===e&&a.listen(u,(function(){console.log("server started at http://localhost:"+u)})),s.default=a},480:e=>{e.exports=require("aws-sdk")},127:e=>{e.exports=require("express")}},s={};function t(n){var r=s[n];if(void 0!==r)return r.exports;var o=s[n]={id:n,loaded:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}t.c=s,t.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),t(t.s=607)})();