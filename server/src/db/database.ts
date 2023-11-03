import pg from 'pg';

interface Bug {
  id: number
  description: string
  priority: number
  resolved: boolean
  created_at: Date
  updated_at: Date
  coords_x: number
  coords_y: number
  coords_z: number
}

export class BugsDB {
  private client: pg.Client;
  constructor() {
    this.client = new pg.Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    })
  }

  public async connect() {
    await this.client.connect()
  }

  public async disconnect() {
    await this.client.end()
  }

  public async createTable() {
    await this.client.query(`
      CREATE TABLE IF NOT EXISTS bugs (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        priority INT NOT NULL,
        resolved BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        coords_x INT NOT NULL,
        coords_y INT NOT NULL,
        coords_z INT NOT NULL
      )
    `)
  }

  public async getBugs(): Promise<Bug[]> {
    const res = await this.client.query('SELECT * FROM bugs')
    return res.rows
  }

  public async getBug(id: number): Promise<Bug> {
    const res = await this.client.query('SELECT * FROM bugs WHERE id = $1', [id])
    return res.rows[0]
  }

  public async createBug(description: string, priority: number, coords_x: number, coords_y: number, coords_z: number) {
    // Assuming the primary key column is named 'id'
    const query = 'INSERT INTO bugs (description, priority, coords_x, coords_y, coords_z) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const values = [description, priority, coords_x, coords_y, coords_z];
    
    try {
      const res = await this.client.query(query, values);
      return res.rows[0].id; // This will return the id of the newly created bug
    } catch (error) {
      // Handle the error appropriately
      console.error('Error creating new bug:', error);
      throw error;
    }
  }
  

  public async setBugResolvedState(id: number, state: boolean) {
    const res = await this.client.query('UPDATE bugs SET resolved = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [state, id])
    return res.rows[0]
  }

  public async changeBugPriority(id: number, priority: number) {
    const res = await this.client.query('UPDATE bugs SET priority = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [priority, id])
    return res.rows[0]
  }

  public async changeBugDescription(id: number, description: string) {
    const res = await this.client.query('UPDATE bugs SET description = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [description, id])
    return res.rows[0]
  }
}