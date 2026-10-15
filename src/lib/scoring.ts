import roleData from './job_roles.json';
export const roles = roleData.map(r => ({...r, required:r.required.split('|'), preferred:r.preferred ? r.preferred.split('|'):[]}));
export function scoreRole(selected: string[], index: number) {
 const role=roles[index];
 const all=[...new Set([...role.required,...role.preferred])];
 const matched=all.filter(s=>selected.includes(s));
 const idf=(s:string)=> Math.log((1+roles.length)/(1+roles.filter(r=>[...r.required,...r.preferred].includes(s)).length))+1;
 const total=all.reduce((sum,s)=>sum+idf(s)**2,0);
 const cosine=total ? Math.sqrt(matched.reduce((sum,s)=>sum+idf(s)**2,0)/total):0;
 const core=role.required.filter(s=>selected.includes(s)).length/role.required.length;
 const preferred=role.preferred.length ? role.preferred.filter(s=>selected.includes(s)).length/role.preferred.length:0;
 const corePoints=(role.preferred.length?75:90)*core;
 const preferredPoints=15*preferred;
 const similarityPoints=10*cosine;
 return {score:Math.round((corePoints+preferredPoints+similarityPoints)*10)/10,corePoints,preferredPoints,similarityPoints,matched,missing:role.required.filter(s=>!selected.includes(s)),preferredMissing:role.preferred.filter(s=>!selected.includes(s))};
}
