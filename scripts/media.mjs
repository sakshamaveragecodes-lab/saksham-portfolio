import sharp from 'sharp';
import {readdir,unlink} from 'node:fs/promises';
for(const file of await readdir('public/media')){if(!/\.(png|jpg)$/.test(file))continue;await sharp(`public/media/${file}`).resize({width:1440,withoutEnlargement:true}).webp({quality:82}).toFile(`public/media/${file.replace(/\.(png|jpg)$/,'.webp')}`);await unlink(`public/media/${file}`)}
