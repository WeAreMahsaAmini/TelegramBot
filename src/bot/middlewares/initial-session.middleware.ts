import { CTX } from '../interfaces';

export const intialSession = () => {
  return async (ctx: CTX, next) => {
    if (!ctx.session) {
      ctx.session = { lastCelebrityId: '', messageCount: '' };
    }
    next();
  };
};
