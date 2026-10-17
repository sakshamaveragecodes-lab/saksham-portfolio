"""Original Evidence Foundry architecture. Blender4.3+, no downloaded assets.
Run: blender -b --python scripts/build-foundry-assets.py -- /absolute/output.glb
Coordinates below are authored in the website's Y-up world, converted for export.
"""
import bpy, math, sys, pathlib
from mathutils import Vector
LOD='--lod' in sys.argv
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def xyz(p):return(p[0],-p[2],p[1])
def mat(name,color,metal,rough,emission=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 if emission:p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emission
 return m
ceramic=mat('graphite_ceramic',(0.027,0.038,0.044),.55,.3);silver=mat('milled_titanium',(.37,.43,.46),.95,.24);dark=mat('recesses',(.008,.012,.017),.4,.3);brass=mat('champagne_alloy',(.4,.24,.1),.85,.25);light=mat('porcelain_light',(.68,.88,1),.15,.3,3)
static=[]
def box(name,p,d,m,bevel=.04,static_part=True):
 if LOD and name in ['floor_inlay','gutter','archive_pin']:return None
 bpy.ops.mesh.primitive_cube_add(size=1,location=xyz(p));o=bpy.context.object;o.name=name;o.dimensions=(d[0],d[2],d[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if bevel:
  b=o.modifiers.new('Machined edge radius','BEVEL');b.width=bevel;b.segments=1 if LOD else 2;bpy.ops.object.modifier_apply(modifier=b.name);n=o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL');bpy.ops.object.modifier_apply(modifier=n.name)
 o.data.materials.append(m)
 if static_part:static.append(o)
 return o
# Recessed process bed, layered endcaps and flow gutters.
box('process_bed',(0,-2.15,-9),(12,.5,33),ceramic,.18)
for side in [-1,1]:
 box('bed_reveal',(side*5.9,-1.94,-9),(.045,.035,32),light,.01)
 box('bed_shoulder',(side*6.5,-2.25,-9),(.85,.7,34),silver,.12)
 for i in range(22):
  z=6-i*1.48
  box('floor_inlay',(side*3.1,-1.89,z),(5.3,.018,.022),silver,.006)
  box('gutter',(side*5.4,-1.87,z),(.35,.06,.5),dark,.02)
# Asymmetric buttresses with trim/light recessed into their inner edge.
for i in range(6 if LOD else 9):
 z=3-i*(6.2 if LOD else 4.1)
 for s in [-1,1]:
  h=6.7+(i%3)*.35
  box('buttress',(s*7.4,h*.5-2,z),(.8,h,.65),ceramic,.14)
  box('inner_milled_edge',(s*6.98,h*.5-2,z),(.12,h-.45,.45),silver,.045)
  box('embedded_light',(s*6.89,h*.5-2,z),(.025,h-.9,.10),light,.008)
  box('foot',(s*7.1,-1.75,z),(1.55,.4,1.6),dark,.09)
 # Floating ceiling baffles create real occlusion / changing parallax.
 box('ceiling_spine',(.6,5.6+(i%2)*.35,z),(14,.32,.7),ceramic,.12)
 box('ceiling_inset',(.6,5.38+(i%2)*.35,z),(9,.04,.18),silver,.03)
# Pressure housing first scene, three intersecting structural laminations.
for i in range(3):
 box('inlet_laminate',(3.3,-1.65+i*.16,4.7),(4.6,.09,2.1-i*.13),silver,.08)
for s in [-1,1]:
 box('inlet_cheek',(3.3+s*2.3,-.93,4.9),(.18,1.6,2.8),ceramic,.12)
 box('inlet_trace',(3.3+s*2.41,-.93,4.9),(.018,1.2,1.9),brass,.02)
# Six authored segmented aperture leaves, with bevelled perimeter and engraved trim.
for i in range(6):
 a=i*math.tau/6;points=[]
 for r,angles in [(2.35,[a-.48+j*.096 for j in range(11)]),(4.05,[a+.48-j*.096 for j in range(11)])]:
  points += [(math.cos(t)*r,1.3+math.sin(t)*r,-13) for t in angles]
 verts=[xyz((x,y,z+d)) for d in [-.18,.18] for x,y,z in points];n=len(points);faces=[tuple(range(n-1,-1,-1)),tuple(range(n,n*2))]+[(j,(j+1)%n,(j+1)%n+n,j+n) for j in range(n)]
 mesh=bpy.data.meshes.new('iris_leaf_mesh');mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new('iris_leaf_'+str(i),mesh);bpy.context.collection.objects.link(o);o.data.materials.append(silver if i%2==0 else ceramic);bpy.context.view_layer.objects.active=o;o.select_set(True);b=o.modifiers.new('Leaf chamfer','BEVEL');b.width=.055;b.segments=1 if LOD else 2;bpy.ops.object.modifier_apply(modifier=b.name);o.select_set(False)
# Rear archive dais: blades, recesses and layered backing rather than a blank background.
box('archive_plinth',(0,-1.63,-25),(10,.55,9),ceramic,.2)
for i in range(15):
 box('archive_fin',((i-7)*.66,-.15,-28),(.09,3.6,2.1+(i%3)*.3),silver,.025)
 box('archive_pin',((i-7)*.66,1.7,-27.4),(.12,.045,.12),brass,.01)
box('archive_light',(0,-1.3,-21),(8,.055,.07),light,.02)
# Batch immutable architecture by material: six or fewer draw calls, preserve moving iris.
groups={m.name:[o for o in static if o.data.materials[0]==m] for m in [ceramic,silver,dark,brass,light]}
for m in [ceramic,silver,dark,brass,light]:
 group=groups[m.name];bpy.ops.object.select_all(action='DESELECT')
 for o in group:o.select_set(True)
 if group:bpy.context.view_layer.objects.active=group[0];bpy.ops.object.join();bpy.context.object.name='architecture_'+m.name;dec=bpy.context.object.modifiers.new('Bounded silhouette-preserving simplification','DECIMATE');dec.ratio=.35 if LOD else .48;bpy.ops.object.modifier_apply(modifier=dec.name)
out=pathlib.Path(sys.argv[sys.argv.index('--')+1]);out.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',export_yup=True,export_cameras=False,export_lights=False,export_materials='EXPORT',export_extras=True)
print('Original foundry exported:',out)
