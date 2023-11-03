import { emitRpc, emitServer } from "alt-client";

export async function getAllBugs() {
  return await emitRpc("getBugs");
}

export async function getBug(id: number) {
  return await emitRpc("getBug", id);
}

export async function createBug(description: string, priority: number, coords_x: number, coords_y: number, coords_z: number) {
  return await emitRpc("createBug", description, priority, coords_x, coords_y, coords_z);
}

export async function changeBugDescription(id: number, description: string) {
  await emitServer("changeBugDescription", id, description);
}

export async function setBugResolvedState(id: number, state: boolean) {
  await emitServer("setBugResolvedState", id, state);
}

export async function changeBugPriority(id: number, priority: number) {
  await emitServer("changeBugPriority", id, priority);
}

