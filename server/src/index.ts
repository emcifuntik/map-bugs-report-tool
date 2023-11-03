import { PointBlip, Vector3, VirtualEntity, VirtualEntityGroup, onClient, onRpc } from "alt-server";
import { BugsDB } from "./db/database.js";

const bugsDB = new BugsDB();
const bugsVirtualEntityGroup = new VirtualEntityGroup(64);

(async () => {
  await bugsDB.connect();
  await bugsDB.createTable();

  const allBugs = await bugsDB.getBugs();
  for (const bug of allBugs) {
    const virtualEntity = new VirtualEntity(
      bugsVirtualEntityGroup,
      new Vector3(bug.coords_x / 100, bug.coords_y / 100, bug.coords_z / 100),
      50,
      {
        id: bug.id,
        resolved: bug.resolved,
        priority: bug.priority,
        dateCreated: bug.created_at,
        dateUpdated: bug.updated_at,
        description: bug.description,
        type: "bug",
      }
    );

    const pointBlip = new PointBlip(new Vector3(bug.coords_x / 100, bug.coords_y / 100, bug.coords_z / 100), true);
    pointBlip.color = bug.resolved ? 2 : 1;
    virtualEntity.setMeta('pointBlip', pointBlip);
  }
})();

function getBugVirtualEntity(id: number): VirtualEntity {
  return VirtualEntity.all.find((ve) => ve.getStreamSyncedMeta("id") == id);
}

onRpc("getBugs", async (player) => {
  const bugs = await bugsDB.getBugs();
  return bugs;
});

onRpc("getBug", async (player, id: number) => {
  const bug = await bugsDB.getBug(id);
  return bug;
});

onRpc(
  "createBug",
  async (
    player,
    description: string,
    priority: number,
    coords_x: number,
    coords_y: number,
    coords_z: number
  ) => {
    const bugId = await bugsDB.createBug(
      description,
      priority,
      Math.round(coords_x),
      Math.round(coords_y),
      Math.round(coords_z)
    );

    const bug = await bugsDB.getBug(bugId);

    const virtualEntity = new VirtualEntity(
      bugsVirtualEntityGroup,
      new Vector3(coords_x / 100, coords_y / 100, coords_z / 100),
      200,
      {
        id: bugId,
        resolved: bug.resolved,
        priority: bug.priority,
        dateCreated: bug.created_at,
        dateUpdated: bug.updated_at,
        description: bug.description,
        type: "bug",
      }
    );

    const pointBlip = new PointBlip(new Vector3(bug.coords_x / 100, bug.coords_y / 100, bug.coords_z / 100), true);
    pointBlip.color = bug.resolved ? 2 : 1;
    virtualEntity.setMeta('pointBlip', pointBlip);

    return bug;
  }
);

onClient(
  "changeBugDescription",
  async (player, id: number, description: string) => {
    await bugsDB.changeBugDescription(id, description);

    const virtualEntity = getBugVirtualEntity(id);
    virtualEntity.setStreamSyncedMeta("description", description);
  }
);

onClient("setBugResolvedState", async (player, id: number, state: boolean) => {
  await bugsDB.setBugResolvedState(id, state);

  const virtualEntity = getBugVirtualEntity(id);
  virtualEntity.setStreamSyncedMeta("resolved", state);

  const pointBlip = virtualEntity.getMeta('pointBlip') as PointBlip;
  pointBlip.color = state ? 2 : 1;
});

onClient("changeBugPriority", async (player, id: number, priority: number) => {
  await bugsDB.changeBugPriority(id, priority);

  const virtualEntity = getBugVirtualEntity(id);
  virtualEntity.setStreamSyncedMeta("priority", priority);
});
