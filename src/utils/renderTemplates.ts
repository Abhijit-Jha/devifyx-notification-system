import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
//template can be sms or email
export function renderTemplate(template: "sms" | "email", data: Record<string, any>) {
    const absolutePath = path.join(__dirname, '..', `/template/${template}.hbs`);
    const source = fs.readFileSync(absolutePath, 'utf8');
    const t = handlebars.compile(source);
    return t(data);
}
