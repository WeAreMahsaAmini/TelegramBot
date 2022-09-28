import { Context } from 'telegraf';
import { SessionData } from './session.interface';

export interface CTX extends Context {
  session?: SessionData;
}
