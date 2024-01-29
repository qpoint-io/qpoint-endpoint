import compose from 'koa-compose'
import { Context } from './context'

// The Qpoint endpoint: a middleware pattern for handling requests
export class Endpoint<Env = any> {
  state: Object
  stack: Function[]

  constructor(state: Object = {}) {
    // initial state to seed the context
    this.state = state;

    // the middleware stack
    this.stack = [];
  }

  // The api for registering a plugin
  use(fn: Function) {
    // add to middleware
    this.stack.push(fn);

    // return self to allow chaining
    return this;
  }

  // Respond to the fetch event
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      // initialize a context
      const context = new Context<Env>(request, env, ctx, this.state);

      // compose the request middlewares
      const run = compose(this.stack);

      // run the stack
      await run(context);

      // return the response
      return context.response;

    } catch (error) {
      console.error(`Unhandled stack error: ${error.message}`)
      console.error(error.stack)

      return new Response('Internal Qpoint Error', { status: 500 })
    }
  }
}

export function GetEnv(key: string): string | undefined {
  let value: string | undefined;

  // Using type assertion for Deno
  if (typeof (globalThis as any).Deno !== "undefined") {
    value = (globalThis as any).Deno.env.get(key);
  }
  // Using type assertion for process
  else if (typeof (globalThis as any).process !== "undefined" && (globalThis as any).process.env) {
    value = (globalThis as any).process.env[key];
  }

  return value;
}

