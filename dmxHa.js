import{readFileSync as t}from"fs";import{join as e}from"path";import n from"ws";async function s(n){return await JSON.parse(t(e(process.cwd(),n),"utf8"))}const o={};function i(){return Object.keys(o)}function r(t,e){o[t].value=e}const a={};(async()=>{const t=await s("settings/settings.json");Object.assign(a,t)})();const c="event",u="result";let l;function d(t){l.send(JSON.stringify(t))}function f(t){if(Array.isArray(t))for(const e of t)i().includes(e.entity_id)&&r(e.entity_id,e?.attributes?.brightness??0)}const g={};let h;function p(){const t=[];for(const[e,n]of Object.entries(g))n.currentValue+=n.gap,r(e,n.currentValue),t.push([n.dmxAddress,Math.round(n.currentValue)]),n.step--,0===n.step&&delete g[e];console.log("dmxUpdate:",t),0===Object.keys(g).length&&(clearInterval(h),h=void 0)}function b(t){if(i().includes(t.entity_id)){const{attributes:e,entity_id:n,state:s}=t,i=o[n];n.startsWith("cover"),n.startsWith("light")&&function(t,e,n,s){g[t]&&(n=Math.round(g[t].currentValue)),g[t]={currentValue:n,dmxAddress:e,gap:(s-n)/a.DMXsteps,step:a.DMXsteps},h||(h=setInterval(p,a.DMXtransitionDurationInMs/10))}(n,i.DMX_address,i.value,function(t,e,n){if("off"===t)return 0;null===e&&(e=255);n&&(e=Math.round(n*e/255));return e}(s,e.brightness,i.max)),n.startsWith("switch")&&function(t,e,n){r(t,n),console.log("updateDmxWithoutTransition",[e,n])}(n,i.DMX_address,function(t){return"off"===t?0:255}(s))}}(async()=>{await async function(){Object.assign(o,await s("settings/dmx.json"))}(),await async function(t,e){l=new n("ws://"+a.homeAssistantAddress+"/api/websocket"),l.on("open",(function(){console.log("Connected to Home Assistant WebSocket")})),l.on("message",(function(n){const s=JSON.parse(n.toString("utf8"));switch(s.type){case"auth_ok":console.log("Authentication successful"),d({type:"get_states",id:1}),d({id:2,type:"subscribe_events",event_type:"state_changed"});break;case"auth_invalid":console.error("Authentication failed");break;case"auth_required":console.log("Authentication required"),d({type:"auth",access_token:a.token});break;case u:t(s.result),console.log("get initials states successful");break;case c:e(s.event.data.new_state)}})),l.on("error",(function(t){console.error("WebSocket error:",t)})),l.on("close",(function(){console.log("Disconnected from Home Assistant WebSocket")}))}(f,b)})();