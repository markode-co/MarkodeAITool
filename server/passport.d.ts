// server/passport.d.ts
import type passport from "passport";

// إعادة تصدير passport مع النوع الصحيح
declare const _passport: typeof passport;
export default _passport;
