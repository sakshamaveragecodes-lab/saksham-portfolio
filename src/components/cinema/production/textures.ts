import * as T from 'three';
import { asset } from '@/lib/site';
import maps from './texture-manifest.json';
/** Identical original pixels, decoded off the JS thread by the browser. */
export async function loadStudioTextures() {
    if (typeof document === 'undefined') {
        const loader = new T.ImageBitmapLoader().setOptions({ colorSpaceConversion: 'none' });
        const results = await Promise.allSettled([...maps.faces, maps.flow].map(map => loader.loadAsync(asset(map.url))));
        if (results.some(r => r.status === 'rejected')) {
            results.forEach(r => { if (r.status === 'fulfilled')
                r.value.close(); });
            throw Error('Original studio maps could not load');
        }
        const images = results.map(r => (r as PromiseFulfilledResult<ImageBitmap>).value), environmentMap = new T.CubeTexture(images.slice(0, 6)), grain = new T.Texture(images[6]);
        environmentMap.colorSpace = T.SRGBColorSpace;
        environmentMap.generateMipmaps = true;
        environmentMap.minFilter = T.LinearMipmapLinearFilter;
        environmentMap.needsUpdate = true;
        grain.colorSpace = T.NoColorSpace;
        grain.flipY = false;
        grain.generateMipmaps = false;
        grain.wrapS = grain.wrapT = T.RepeatWrapping;
        grain.minFilter = grain.magFilter = T.LinearFilter;
        grain.needsUpdate = true;
        environmentMap.addEventListener('dispose', () => images.slice(0, 6).forEach(image => image.close()));
        grain.addEventListener('dispose', () => images[6].close());
        return { environmentMap, grain };
    }
    const [environment, flow] = await Promise.allSettled([new T.CubeTextureLoader().loadAsync(maps.faces.map(f => asset(f.url))), new T.TextureLoader().loadAsync(asset(maps.flow.url))] as const);
    if (environment.status !== 'fulfilled' || flow.status !== 'fulfilled') {
        if (environment.status === 'fulfilled')
            environment.value.dispose();
        if (flow.status === 'fulfilled')
            flow.value.dispose();
        throw Error('Original studio lighting maps could not load');
    }
    const environmentMap = environment.value, grain = flow.value;
    environmentMap.colorSpace = T.SRGBColorSpace;
    environmentMap.generateMipmaps = true;
    environmentMap.minFilter = T.LinearMipmapLinearFilter;
    environmentMap.needsUpdate = true;
    grain.colorSpace = T.NoColorSpace;
    grain.flipY = false;
    grain.generateMipmaps = false;
    grain.wrapS = grain.wrapT = T.RepeatWrapping;
    grain.minFilter = grain.magFilter = T.LinearFilter;
    grain.needsUpdate = true;
    return { environmentMap, grain };
}
