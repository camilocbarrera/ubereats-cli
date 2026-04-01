import { existsSync } from "fs";
import { join } from "path";
import { UberEatsConfigSchema, type UberEatsConfig } from "./schemas/config";
import { CONFIG_FILENAME } from "./constants";

const CONFIG_PATH = join(import.meta.dir, "..", CONFIG_FILENAME);

export async function loadConfig(): Promise<UberEatsConfig> {
  if (!existsSync(CONFIG_PATH)) {
    throw new Error(
      `No config found. Run: ubereats login`
    );
  }
  const text = await Bun.file(CONFIG_PATH).text();
  const parsed = UberEatsConfigSchema.safeParse(JSON.parse(text));
  if (!parsed.success) {
    throw new Error(`Invalid config: ${parsed.error.message}`);
  }
  return parsed.data;
}

export async function saveConfig(config: UberEatsConfig): Promise<void> {
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}
