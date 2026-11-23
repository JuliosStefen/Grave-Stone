import { world, system } from '@minecraft/server';

let tempSave

export function graveSave() {

    if (tempSave == undefined) {

        tempSave = JSON.parse(world?.getDynamicProperty('graveSave') ?? '{}');

        tempSave.player ??= {}
    }

    system.runTimeout(() => world.setDynamicProperty('graveSave', JSON.stringify(tempSave)), 5)

    return tempSave
}