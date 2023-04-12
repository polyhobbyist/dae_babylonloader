import {Context} from "../context"
import {LogLevel} from "../log"
import * as Loader from "./loader"
import * as Converter from "../converter/converter"
import * as Exporter from "../exporter/exporter"
import * as Utils from "./utils"
import * as MathUtils from "../math"


    export class Image extends Loader.EElement {
        initFrom: string | undefined;

        constructor() {
            super();
            this._className += "Image|";
        }

        static fromLink(link: Loader.Link, context: Context): Loader.Image  | undefined{
            return Loader.EElement._fromLink<Loader.Image>(link, "Image", context);
        }

        /**
        *   Parses an <image> element.
        */
        static parse(node: Node, context: Loader.Context): Loader.Image {
            var result: Loader.Image = new Loader.Image();

            result.id = context.getAttributeAsString(node, "id", undefined, true);
            context.registerUrlTarget(result, true);

            Utils.forEachChild(node, function (child: Node) {
                switch (child.nodeName) {
                    case "init_from":
                        result.initFrom = context.getTextContent(child);
                        break;
                    default:
                        context.reportUnexpectedChild(child);
                }
            });

            return result;
        }

    }
