import {Log, LogLevel} from "../log"


import * as Utils from "./utils"
import * as MathUtils from "../math"
import {Texture} from "./texture"
import {AnimationTarget} from "./animation"
import * as COLLADAContext from "../context"
import {Options} from "./options"
import {BoundingBox} from "./bounding_box"
import { Effect } from "../loader/effect"
import { EffectTechnique } from "../loader/effect_technique"
import { InstanceMaterial } from "../loader/instance_material"
import { ConverterContext } from "./context"
import * as MaterialLoader from "../loader/material"

    export class MaterialMap {
        symbols: { [symbol: string]: Material };

        constructor() {
            this.symbols = {};
        }
    }

    export class Material {
        name: string;
        diffuse: Texture;
        specular: Texture;
        normal: Texture;

        constructor() {
            this.name = null;
            this.diffuse = null;
            this.specular = null;
            this.normal = null;
        }

        static createDefaultMaterial(context: ConverterContext): Material {
            var result: Material = context.materials.findConverter(null);
            if (result) {
                return result;
            } else {
                result = new Material();
                context.materials.register(undefined, result);
                return result;
            }
        }

        static createMaterial(instanceMaterial: InstanceMaterial, context: ConverterContext): Material {

            var material = MaterialLoader.Material.fromLink(instanceMaterial.material, context);
            if (!material) {
                context.log.write("Material not found, material skipped.", LogLevel.Warning);
                return Material.createDefaultMaterial(context);
            }

            var effect: Effect = Effect.fromLink(material.effect, context);
            if (!effect) {
                context.log.write("Material effect not found, using default material", LogLevel.Warning);
                return Material.createDefaultMaterial(context);
            }

            var technique: EffectTechnique = effect.technique;
            if (!technique) {
                context.log.write("Material effect not found, using default material", LogLevel.Warning);
                return Material.createDefaultMaterial(context);
            }

            if (technique.diffuse !== null && technique.diffuse.color !== null) {
                context.log.write("Material " + material.id + " contains constant diffuse colors, colors ignored", LogLevel.Warning);
            }

            if (technique.specular !== null && technique.specular.color !== null) {
                context.log.write("Material " + material.id + " contains constant specular colors, colors ignored", LogLevel.Warning);
            }

            var result: Material = context.materials.findConverter(material);
            if (result) return result;

            result = new Material();
            result.name = material.id;
            result.diffuse = Texture.createTexture(technique.diffuse, context);
            result.specular = Texture.createTexture(technique.specular, context);
            result.normal = Texture.createTexture(technique.bump, context);
            context.materials.register(material, result);

            return result;
        }

        static getMaterialMap(instanceMaterials: InstanceMaterial[], context: ConverterContext): MaterialMap {
            var result: MaterialMap = new MaterialMap();

            var numMaterials: number = 0;
            for (var i: number = 0; i < instanceMaterials.length; i++) {
                var instanceMaterial: InstanceMaterial = instanceMaterials[i];

                var symbol: string = instanceMaterial.symbol;
                if (!symbol) {
                    context.log.write("Material instance has no symbol, material skipped.", LogLevel.Warning);
                    continue;
                }

                if (result.symbols[symbol] != null) {
                    context.log.write("Material symbol " + symbol + " used multiple times", LogLevel.Error);
                    continue;
                }

                result.symbols[symbol] = Material.createMaterial(instanceMaterial, context);
            }
            return result;
        }
    }
