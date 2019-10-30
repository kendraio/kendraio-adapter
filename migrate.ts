import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { get} from 'lodash';
import { parse } from 'yaml';

mkdirSync('adapters');
const dir = readdirSync('prev-adapters');
const needMigration = dir.filter(key => !existsSync(`adapters/${key}`));

needMigration.forEach(key => {
  const data = parse(readFileSync(`prev-adapters/${key}/adapter.yaml`, 'utf-8'));
  const name = get(data, 'name', key);
  const label = get(data, 'title', key);
  const description = get(data, 'description', `Adapter for ${label}`);
  const infoUrl = get(data, 'infoUrl', 'https://kendra.io');
  const maintainer = get(data, 'maintainer', 'Kendraio');
  const supportUrl = get(data, 'supportUrl', 'https://kendra.io');
  const version = get(data, 'version', '0.0.0');
  const uploads = get(data, 'uploads', false);

  mkdirSync(`adapters/${key}`);
  mkdirSync(`adapters/${key}/schemas`);
  mkdirSync(`adapters/${key}/forms`);
  mkdirSync(`adapters/${key}/configs`);

  const hasSwagger = get(data, 'swagger', false);
  let swagger: string|boolean = false;
  if (!!hasSwagger) {
    const swaggerParts = hasSwagger.split('/');
    const swaggerName = swaggerParts[swaggerParts.length - 1];
    swagger = `swagger/${swaggerName}`;
    mkdirSync(`adapters/${key}/swagger`);
    copyFileSync(hasSwagger, `adapters/${key}/${swagger}`);
  }

  const database = get(data, 'database', []).map((sourceSchema: string) => {
    const schemaPathParts = sourceSchema.split('/');
    const name = schemaPathParts[schemaPathParts.length - 1];
    const schema = `schemas/${name}`;
    copyFileSync(sourceSchema, `adapters/${key}/${schema}`);
    return ({ name, schema });
  });
  const workflow = get(data, 'configs', []).map(sourceConfig => {
    const configData = JSON.parse(readFileSync(sourceConfig, 'utf-8'));
    const configPathParts = sourceConfig.split('/');
    const fileName = configPathParts[configPathParts.length - 1];
    const title = get(configData, 'title', `${sourceConfig}`);
    const config = `configs/${fileName}`;
    copyFileSync(sourceConfig, `adapters/${key}/${config}`);
    return ({ title, config })
  });
  const sourceForms = get(data, 'forms', {});
  const forms = Object.keys(sourceForms).map((formId: string) => {
    const { jsonSchema, uiSchema } = sourceForms[formId];
    const jsonSchemaData = JSON.parse(readFileSync(jsonSchema, 'utf-8'));
    const title = get(jsonSchemaData, 'title', formId);

    const jsonSchemaPathParts = jsonSchema.split('/');
    const jsonSchemaName = jsonSchemaPathParts[jsonSchemaPathParts.length - 1];
    const newJsonSchema = `schemas/${jsonSchemaName}`;
    if (!existsSync(newJsonSchema)) {
      copyFileSync(jsonSchema, `adapters/${key}/${newJsonSchema}`);
    }

    const uiSchemaPathParts = uiSchema.split('/');
    const uiSchemaName = uiSchemaPathParts[uiSchemaPathParts.length - 1];
    const newUiSchema = `forms/${uiSchemaName}`;
    copyFileSync(uiSchema, `adapters/${key}/${newUiSchema}`);

    return ({ formId, title, jsonSchema: newJsonSchema, uiSchema: newUiSchema });
  });

  try {
    writeFileSync(`adapters/${key}/kendraio-adapter.json`, JSON.stringify({
      name,
      label,
      description,
      version,
      infoUrl,
      maintainer,
      supportUrl,
      database,
      workflow,
      forms,
      ...(uploads) ? { upload: { enabled: true }} : {},
      ...(!!swagger) ? { apis: [ swagger ]} : {}
    }, null, 2));
  } catch (e) {
    console.error(e);
  }
});
