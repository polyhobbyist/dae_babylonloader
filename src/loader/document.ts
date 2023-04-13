import {Context} from "../context"
import {LogLevel} from "../log"
import * as Loader from "./loader"
import * as Converter from "../converter/converter"
import * as Exporter from "../exporter/exporter"
import * as Utils from "./utils"
import * as MathUtils from "../math"
import {MaterialLibrary} from "./material"
import {EffectLibrary} from "./effect"
import {GeometryLibrary} from "./geometry"
import {ImageLibrary} from "./image"
import {VisualSceneLibrary} from "./visual_scene"
import {ControllerLibrary} from "./controller"
import {AnimationLibrary} from "./animation"
import {LightLibrary} from "./light"
import {CameraLibrary} from "./camera"
import {VisualSceneNodeLibrary} from "./visual_scene_node"


    export class Document {
        scene: Loader.Scene | undefined;
        asset: Loader.Asset | undefined;
        libEffects: EffectLibrary;
        libMaterials: MaterialLibrary;
        libGeometries: GeometryLibrary;
        libControllers: ControllerLibrary;
        libLights: LightLibrary;
        libCameras: CameraLibrary;
        libImages: ImageLibrary;
        libVisualScenes: VisualSceneLibrary;
        libAnimations: AnimationLibrary;
        libNodes: VisualSceneNodeLibrary;

        constructor() {
            this.libEffects = new EffectLibrary();
            this.libMaterials = new MaterialLibrary();
            this.libGeometries = new GeometryLibrary();
            this.libControllers = new ControllerLibrary();
            this.libLights = new LightLibrary();
            this.libCameras = new CameraLibrary;
            this.libImages = new ImageLibrary;
            this.libVisualScenes = new VisualSceneLibrary;
            this.libAnimations = new AnimationLibrary;
            this.libNodes = new VisualSceneNodeLibrary();
        }

        static parse(doc: XMLDocument, context: Loader.LoaderContext): Loader.Document {

            // There should be one top level <COLLADA> element
            var colladaNodes = doc.getElementsByTagName("COLLADA");
            if (colladaNodes.length === 0) {
                context.log?.write("Cannot parse document, no top level COLLADA element.", LogLevel.Error);
                return new Loader.Document();
            } else if (colladaNodes.length > 1) {
                context.log?.write("Cannot parse document, more than one top level COLLADA element.", LogLevel.Error);
                return new Loader.Document();
            }

            return Loader.Document.parseCOLLADA(colladaNodes[0] || colladaNodes.item(0), context);
        }

        static parseCOLLADA(node: Node, context: Loader.LoaderContext): Loader.Document {
            var result: Loader.Document = new Loader.Document();

            Utils.forEachChild(node, function (child: Node) {
                switch (child.nodeName) {
                    case "asset":
                        result.asset = Loader.Asset.parse(child, context);
                        break;
                    case "scene":
                        result.scene = Loader.Scene.parse(child, context);
                        break;
                    case "library_effects":
                        result.libEffects = EffectLibrary.parse(child, context);
                        break;
                    case "library_materials":
                        result.libMaterials = MaterialLibrary.parse(child, context);
                        break;
                    case "library_geometries":
                        result.libGeometries = GeometryLibrary.parse(child, context);
                        break;
                    case "library_images":
                        result.libImages = ImageLibrary.parse(child, context);
                        break;
                    case "library_visual_scenes":
                        result.libVisualScenes = VisualSceneLibrary.parse(child, context);
                        break;
                    case "library_controllers":
                        result.libControllers = ControllerLibrary.parse(child, context);
                        break;
                    case "library_animations":
                        result.libAnimations = AnimationLibrary.parse(child, context);
                        break;
                    case "library_lights":
                        result.libLights = LightLibrary.parse(child, context);
                        break;
                    case "library_cameras":
                        result.libCameras = CameraLibrary.parse(child, context);
                        break;
                    case "library_nodes":
                        result.libNodes = VisualSceneNodeLibrary.parse(child, context);
                        break;
                    default:
                        context.reportUnexpectedChild(child);
                }
            });

            return result;
        }
    };
