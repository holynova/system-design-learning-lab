export const alphabet='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function base62(value){let n=BigInt(value),out='';do{out=alphabet[Number(n%62n)]+out;n/=62n}while(n>0n);return out}
export function encode(t,dc,worker,seq){return (BigInt(t)<<22n)|(BigInt(dc)<<17n)|(BigInt(worker)<<12n)|BigInt(seq)}
export function decode(id){let n=BigInt(id);return [Number(n>>22n),Number((n>>17n)&31n),Number((n>>12n)&31n),Number(n&4095n)]}
export function hashCode(str,length){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return base62(BigInt(h)%(62n**BigInt(length))).padStart(length,'0')}
export function kvScenario(R,W,delay,offline,read){let nodes=[1,1,1];let log=[{title:'初始状态',detail:'固定副本 A/B/C；x=1，版本 v1。单写者递增版本。',nodes:[...nodes],ack:0}];let ack=0;
 for(let i=0;i<2;i++){if(offline===i){log.push({title:`无法联系 ${'ABC'[i]}`,detail:'网络隔离，不等于数据丢失；该副本没有确认。',nodes:[...nodes],ack});continue}nodes[i]=2;ack++;log.push({title:`${'ABC'[i]} 写入 x=2`,detail:`确认 ${ack}/${W}。${ack>=W?'达到写入门槛。':'继续等待确认。'}`,nodes:[...nodes],ack})}
 if(!delay&&offline!==2){nodes[2]=2;ack++;log.push({title:'C 收到写入',detail:`确认 ${ack}/${W}。`,nodes:[...nodes],ack})}
 log.push({title:ack>=W?'写请求已确认':'写请求尚未确认',detail:ack>=W?'成功确认不等于每个副本已更新。':'未满足 W；这是待定结果，不能据此认定没有写入。',nodes:[...nodes],ack});
 const targets=read==='C'?[2,0,1]:[0,2,1];const reached=targets.filter(i=>i!==offline).slice(0,R);let value=reached.length===R?Math.max(...reached.map(i=>nodes[i])):null;
 log.push({title:value===null?'读请求等待':`读取返回 x=${value}`,detail:`读集合 ${reached.map(i=>'ABC'[i]).join('、')}，响应 ${reached.length}/${R}。${value===null?'不足 R。':`看到版本 ${reached.map(i=>'v'+nodes[i]).join('、')}；按单写者版本号选最新。`}`,nodes:[...nodes],ack,value});
 if(delay&&offline!==2){nodes[2]=2;log.push({title:'延迟消息到达 C',detail:'后台复制完成。早先读到的旧值不会被追溯更改。',nodes:[...nodes],ack})}
 if(offline>=0){nodes[offline]=2;log.push({title:'网络恢复并执行读修复',detail:'重新连通后比较版本，旧副本更新为 v2。本场景显式触发修复。',nodes:[...nodes],ack})}
 return log}
