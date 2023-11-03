import { Marker, Player, RGBA, Utils, VirtualEntity, log, on, showCursor, toggleGameControls } from "alt-client";
import { KeyCode, MarkerType, Vector3, clearEveryTick } from "alt-shared";
import { UI } from "./webview.js";
import { changeBugDescription, changeBugPriority, createBug, getAllBugs, getBug, setBugResolvedState } from "./bug.js";

const ui = new UI();

on('worldObjectStreamIn', (worldObject) => {
  if (worldObject instanceof VirtualEntity) {
    const virtualEntity = worldObject as VirtualEntity;
    if (virtualEntity.getStreamSyncedMeta('type') === 'bug') {
      const description = virtualEntity.getStreamSyncedMeta('description') as string;
      const tick = Utils.drawText3d(description, virtualEntity.pos);
      const marker = new Marker(MarkerType.MarkerSphere, virtualEntity.pos, new RGBA(255, 255, 0, 100), true, 50);
      marker.rot = new Vector3(Math.PI, 0, 0);
      marker.faceCamera = true;
      virtualEntity.setMeta('marker', marker);
      virtualEntity.setMeta('tick', tick.id);
    }
  }
});

on('worldObjectStreamOut', (worldObject) => {
  if (worldObject instanceof VirtualEntity) {
    const virtualEntity = worldObject as VirtualEntity;
    if (virtualEntity.getStreamSyncedMeta('type') === 'bug') {
      const tick = virtualEntity.getMeta('tick') as number;
      const marker = virtualEntity.getMeta('marker') as Marker;
      clearEveryTick(tick);
      marker.destroy();
    }
  }
});

ui.getView().on('createNewBug', async (description: string, priority: number) => {
  const playerPos = Player.local.pos;
  const bugId = await createBug(description, priority, playerPos.x * 100, playerPos.y * 100, playerPos.z * 100);
  ui.getView().emit('bugCreated', bugId, description, priority);
});

ui.getView().on('updateBug', async (bugId: number, description: string, priority: number, resolved: boolean) => {
  await changeBugDescription(bugId, description);
  await changeBugPriority(bugId, priority);
  await setBugResolvedState(bugId, resolved);
});

let isUIVisible = false;

ui.getView().on('teleportToBug', async (bugId: number) => {
  const bug = await getBug(bugId) as any;
  Player.local.pos = new Vector3(bug.coords_x / 100, bug.coords_y / 100, bug.coords_z / 100);

  if (isUIVisible) {
    isUIVisible = false;

    showCursor(isUIVisible);
    toggleGameControls(!isUIVisible);
    ui.setVisibility(isUIVisible);
    ui.setFocused(isUIVisible);
  }
});

let switchingUIState = false;

on('keyup', async (key) => {
  if (key == KeyCode['`']) {
    if (switchingUIState) 
      return;
    switchingUIState = true;
    log('Toggle UI visibility');
    isUIVisible = !isUIVisible;

    if (isUIVisible) {
      const allBugs = await getAllBugs();
      ui.getView().emit('pushBugs', allBugs);
    }

    showCursor(isUIVisible);
    toggleGameControls(!isUIVisible);
    ui.setVisibility(isUIVisible);
    ui.setFocused(isUIVisible);

    switchingUIState = false;
  }
});