import type {Metadata,Viewport} from 'next';
import {Navigation,Footer} from '@/components/navigation';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL('https://saksham-portfolio.vercel.app'),title:{default:'Saksham Jadhav — AI & Software Engineering',template:'%s · Saksham Jadhav'},description:'Explore Saksham Pradeep Jadhav’s AI, RAG, NLP, computer vision and software engineering projects through source-backed case studies and interactive demonstrations.',openGraph:{type:'website',locale:'en_IN',siteName:'Saksham Jadhav · Engineering Portfolio',images:[{url:'/og.png',width:1200,height:630,alt:'Saksham Jadhav — Intelligence, engineered.'}]},twitter:{card:'summary_large_image',images:['/og.png']},robots:{index:true,follow:true},icons:{icon:'/icon.svg'}};
export const viewport:Viewport={themeColor:'#090b10',width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Navigation/><main id="main">{children}</main><Footer/></body></html>}
