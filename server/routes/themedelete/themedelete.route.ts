import { RouterResponse } from '../../services/router/router.service';
import { Theme } from '../../definitions/models/Theme/theme';
import { defaultTheme } from '../../definitions/data/data';
import db from '../../services/db/db.service';

export default async (request: any): Promise<RouterResponse> => {

  const deleteRes = await db.row.query(`DELETE FROM theme WHERE id = (SELECT MAX(id) FROM theme);`);
  
  const res = await db.row.read<Theme[]>('theme');

  return new Promise<RouterResponse>(resolve => resolve({
    code: 200,
    json: {
      success: res.success,
      messages: res.messages,
      body: res.body?.length ? res.body.sort((a,b) => b.id - a.id)[0] : defaultTheme
    }
  }));
}