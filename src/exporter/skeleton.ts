/// <reference path="context.ts" />
/// <reference path="format.ts" />
/// <reference path="../math.ts" />
import * as BABYLON from 'babylonjs';
import * as MathUtils from '../math'

module COLLADA.Exporter {

    export class Skeleton {

        static toJSON(skeleton: COLLADA.Converter.Skeleton, context: COLLADA.Exporter.Context): COLLADA.Exporter.BoneJSON[] | undefined{
            if (!skeleton) {
                return undefined ;
            }

            // TODO: options for this
            var mat_tol: number = 6;
            var pos_tol: number = 6;
            var scl_tol: number = 3;
            var rot_tol: number = 6;

            var result: COLLADA.Exporter.BoneJSON[] = [];
            skeleton.bones.forEach((bone) => {

                // Bone default transform
                var mat: BABYLON.Matrix = bone.node.initialLocalMatrix;
                var pos = new BABYLON.Vector3(0, 0, 0);
                var rot= new BABYLON.Quaternion(0, 0, 0, 1);
                var scl= new BABYLON.Vector3(1, 1, 1);
                mat.decompose(scl, rot, pos);

                // Bone inverse bind matrix
                var inv_bind_mat: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                MathUtils.copyNumberArray(bone.invBindMatrix, inv_bind_mat, 16);

                /* TODO Polyhobbyist

                result.push({
                    name: bone.name,
                    parent: skeleton.bones.indexOf(bone.parent),
                    skinned: bone.attachedToSkin,
                    inv_bind_mat: inv_bind_mat.map((x) => COLLADA.MathUtils.round(x, mat_tol)),
                    pos: pos.map((x) => MathUtils.round(x, pos_tol)),
                    rot: rot.map((x) => COLLADA.MathUtils.round(x, rot_tol)),
                    scl: scl.map((x) => COLLADA.MathUtils.round(x, scl_tol))
                });
                */
            });

            return result;
        }
    }
}