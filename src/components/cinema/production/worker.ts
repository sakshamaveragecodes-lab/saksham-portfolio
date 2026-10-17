/// <reference lib="webworker" />
import { createStage, type StageOptions, type StageUpdate } from './engine';
import { loadStudioTextures } from './textures';
import { cinemaState } from '../timeline';
declare const self: DedicatedWorkerGlobalScope;
let handle: ReturnType<typeof createStage> | undefined, disposed = false, latest: StageUpdate;
cinemaState.present = progress => self.postMessage({ type: 'present', progress });
self.onmessage = event => {
    const message = event.data;
    if (message.type === 'dispose') {
        disposed = true;
        handle?.dispose();
        self.postMessage({ type: 'disposed' });
        self.close();
        return;
    }
    if (message.type === 'update') {
        Object.assign(cinemaState, message.state);
        latest = message.view;
        handle?.update(latest);
        return;
    }
    if (message.type === 'initialize') {
        latest = message.view;
        Object.assign(cinemaState, message.state);
        void loadStudioTextures().then(textures => { if (disposed) {
            textures.environmentMap.dispose();
            textures.grain.dispose();
            return;
        } handle = createStage({ ...latest, ...textures, canvas: message.canvas, review: message.review, onReady: () => self.postMessage({ type: 'ready' }), onFailure: () => self.postMessage({ type: 'failure' }), onWorld: (world, title) => self.postMessage({ type: 'world', world, title }), publish: receipt => self.postMessage({ type: 'receipt', receipt }) } satisfies StageOptions); }).catch(error => {console.error('Engineering stage initialization failed',error);self.postMessage({ type: 'failure' })});
    }
};
