'use client';
import {useState} from 'react';
import {Copy,Check} from 'lucide-react';
export function CopyContact({email}:{email:string}){const[state,setState]=useState<'ready'|'copied'|'failed'>('ready');return <div className="copy-contact"><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(email);setState('copied')}catch{setState('failed')}}}>{state==='copied'?<Check size={16}/>:<Copy size={16}/>} {state==='copied'?'Email copied':'Copy professional email'}</button><span role="status">{state==='copied'?'Ready to paste into your mail application.':state==='failed'?`Clipboard unavailable. Select the email above: ${email}`:'Or use the email link above to open your mail application.'}</span></div>}
