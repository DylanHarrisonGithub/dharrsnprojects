import { RouterResponse } from '../../services/router/router.service';
import { Theme, defaultTheme } from '../../models/models';
import db from '../../services/db/db.service';

export default async (request: any): Promise<RouterResponse> => {

const res = await db.row.read<Theme[]>('theme');

console.log('theme rout reaced')
  return new Promise<RouterResponse>(resolve => resolve({
    code: 200,
    json: {
      success: res.success,
      messages: res.messages,
      body: res.body?.length ? res.body.sort((a,b) => b.id - a.id)[0] : defaultTheme
    }
  }));
}