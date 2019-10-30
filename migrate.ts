import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { get} from 'lodash';
import { parse } from 'yaml';

const dir = readdirSync('prev-adapters');
const needMigration = dir.filter(key => !existsSync(`adapters/${key}`));

needMigration.forEach(key => {
  const data = parse(readFileSync(`prev-adapters/${key}/adapter.yaml`, 'utf-8'));
  const name = get(data, 'name', key);
  const label = get(data, 'title', key);
  const description = get(data, 'description', `Adapter for ${label}`);
  const infoUrl = get(data, 'infoUrl', 'https://kendra.io');
  const maintainer = get(data, 'maintainer', 'Kendraio');
  const supportUrl = get(data, 'infoUrl', 'https://kendra.io');
  const version = get(data, 'version', '0.0.0');
  const uploads = get(data, 'uploads', false);
  const swagger = get(data, 'swagger', false);
  try {
    mkdirSync(`adapters/${key}`);
    writeFileSync(`adapters/${key}/kendraio-adapter.json`, JSON.stringify({
      name,
      label,
      description,
      version,
      infoUrl,
      maintainer,
      supportUrl,
      database: [],
      workflow: [],
      forms: [],
      ...(uploads) ? { upload: { enabled: true }} : {},
      ...(swagger) ? { apis: [ swagger ]} : {}
    }));
  } catch (e) {
    console.error(e);
  }
});
