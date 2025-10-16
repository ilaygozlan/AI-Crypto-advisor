import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

export const versionHandler = (_req: Request, res: Response): void => {
  try {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    );
    res.json({ version: packageJson.version });
  } catch (error) {
    res.json({ version: 'unknown' });
  }
};
