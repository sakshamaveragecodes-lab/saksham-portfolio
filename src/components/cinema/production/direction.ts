import type {WorldKey} from '../worlds';
import type {V3} from './model';
export type StageKey=WorldKey|'home'|'sourcelens';
type Direction={title:string;geometry:string;camera:V3[];focus:V3[];color:string};
const d=(title:string,geometry:string,color:string,camera:V3[],focus:V3[]):Direction=>({title,geometry,color,camera,focus});
/** Camera paths are continuous splines through architectural space, not orbit animations. */
export const directions:Record<StageKey,Direction>={
 home:d('The intelligence loom','branching liquid ribbons → eight engineered instruments','#c1dce2',[[12,6,17],[5,3,7],[1,2,-2],[-5,5,-9],[10,7,-6]],[[-1,0,-2],[0,0,-5],[0,0,-12],[0,1,-18],[0,0,-18]]),
 sourcelens:d('The evidence foundry','folded silver → aperture → retained source archive','#bcd5de',[[10,5,13],[6,3,6],[.8,2,0],[-1,3,-12],[6,4,-18]],[[-2,1,-2],[0,1,-6],[0,1,-12],[0,1,-23],[0,1,-24]]),
 careerlens:d('The matching atelier','thirteen helicoidal louvers → three scoring terraces','#d3dfdb',[[12,6,15],[7,3,8],[1,1,3],[-6,4,0],[7,6,6]],[[0,1,-3],[0,1,-3],[0,1,-4],[0,1,-4],[0,1,-4]]),
 form:d('The kinetic observatory','articulated anatomical rig inside a split motion capture chamber','#a9d5c9',[[11,4,14],[5,2,8],[0,1,3],[-6,3,1],[7,5,8]],[[0,0,-2],[0,0,-3],[0,0,-5],[0,1,-5],[0,0,-3]]),
 studybuddy:d('The local reading room','turning paper → local processor → closed-loop reading desk','#ddccb1',[[12,6,14],[6,3,7],[0,1,1],[-6,3,-3],[8,5,5]],[[0,0,-2],[0,0,-3],[0,0,-6],[0,0,-8],[0,0,-5]]),
 pymentor:d('The orchestration passage','three articulated connector locks, parser and boundary branch','#c6bfdf',[[12,5,16],[5,2,8],[0,1,0],[-2,2,-8],[11,8,11]],[[0,0,-2],[0,0,-6],[0,0,-12],[0,0,-18],[0,0,-9]]),
 airbnb:d('The residual city','two data terraces and a lifted regression canopy','#b8d8db',[[15,10,17],[8,6,9],[2,3,2],[-8,5,-2],[8,10,5]],[[0,-1,-4],[0,0,-5],[0,0,-7],[0,0,-8],[0,-1,-6]]),
 'logistic-diabetes':d('The decision membrane','sigmoid sectional sculpture → separated decision chambers','#b4ccdf',[[12,5,16],[6,2,9],[0,1,4],[-6,4,0],[8,5,7]],[[0,0,-2],[0,0,-3],[0,0,-4],[0,0,-4],[0,0,-4]]),
 'random-forest-diabetes':d('The branching observatory','rooted decision architectures → separated ensemble → convergence','#b9d0b8',[[13,4,17],[7,2,10],[0,3,4],[-6,7,-1],[9,10,9]],[[0,1,-3],[0,2,-4],[0,3,-5],[0,3,-5],[0,2,-5]]),
 projects:d('The engineering archipelago','eight dissimilar pavilions connected by metallic channels','#c0d9df',[[16,10,20],[8,5,11],[0,3,3],[-8,6,-4],[10,10,6]],[[0,0,-4],[0,0,-5],[0,0,-7],[0,0,-7],[0,0,-6]]),
 about:d('The formation quarry','excavated curved strata unfold into a working space','#d9d0ba',[[13,6,16],[7,3,9],[0,1,3],[-7,3,-2],[9,6,6]],[[0,0,-3],[0,0,-4],[0,0,-5],[0,0,-5],[0,0,-5]]),
 skills:d('The capability exchange','four interlocking engineered bridges with an exposed core','#c0d9df',[[13,7,17],[7,3,9],[0,2,3],[-6,4,-1],[9,7,7]],[[0,0,-3],[0,0,-4],[0,0,-5],[0,0,-5],[0,0,-5]]),
 experience:d('The learning promenade','a continuous ascending stair unwraps into milestone platforms','#c4cfdb',[[14,7,17],[7,3,10],[0,3,4],[-5,6,-2],[9,10,6]],[[0,0,-3],[0,1,-4],[0,2,-5],[0,3,-5],[0,2,-5]]),
 certifications:d('The provenance repository','three nested faceted vaults open to their source records','#ddcfad',[[12,5,16],[6,2,9],[0,1,3],[-5,4,0],[8,6,7]],[[0,0,-3],[0,0,-4],[0,0,-5],[0,0,-5],[0,0,-5]]),
 resume:d('The professional folio','a hinged folio and precision paper stack reveal one retained document','#cdd7de',[[12,6,15],[6,3,9],[0,1,4],[-5,4,-1],[8,6,6]],[[0,0,-3],[0,0,-4],[0,0,-5],[0,0,-5],[0,0,-5]]),
 contact:d('The signal confluence','two continuous metallic ducts merge into an open meeting chamber','#b6d5df',[[13,5,16],[6,2,9],[0,1,2],[-5,3,-5],[8,5,1]],[[0,0,-3],[0,0,-5],[0,0,-9],[0,0,-11],[0,0,-10]])
};

export type LightRig={key:V3;rim:V3;studioYaw:number;roughness:number;warmth:string;exposure:number};
const rig=(key:V3,rim:V3,studioYaw:number,roughness:number,warmth='#d9eaff',exposure=1.25):LightRig=>({key,rim,studioYaw,roughness,warmth,exposure});
/** Raking, overhead, lateral and back-lit studio arrangements. The reflection rig rotates with them. */
export const lightRigs:Record<StageKey,LightRig>={
 home:rig([-8,10,4],[7,3,-20],0,.18),
 sourcelens:rig([-5,9,2],[3,1,-28],.4,.16),
 careerlens:rig([-3,10,-3],[6,4,-12],1.1,.25,'#f2e8d5'),
 form:rig([-6,4,3],[5,7,-10],-.6,.3,'#d7f0e8',1.3),
 studybuddy:rig([-3,5,-2],[5,6,2],2.1,.28,'#ffdfb5',1.3),
 pymentor:rig([-8,5,-10],[5,3,-24],-1.2,.14,'#ddd7f1',1.3),
 airbnb:rig([-3,14,6],[7,6,-18],.8,.32,'#ecf3f2',1.2),
 'logistic-diabetes':rig([-8,3,0],[6,4,-14],1.7,.15,'#c8d8ef'),
 'random-forest-diabetes':rig([-5,4,4],[2,9,-12],-.4,.26,'#d9e8d8'),
 projects:rig([-8,12,2],[6,4,-18],.2,.21),
 about:rig([-7,6,-2],[5,8,-12],.9,.28,'#e9dfc8'),
 skills:rig([-3,11,4],[8,3,-12],-.8,.2),
 experience:rig([-6,5,4],[4,11,-12],.55,.24),
 certifications:rig([-4,7,2],[6,3,-14],1.4,.18,'#f2dfbb'),
 resume:rig([-6,9,4],[4,4,-12],-.3,.25,'#e0e8ee'),
 contact:rig([-7,4,3],[3,8,-17],-1.5,.16)
};
