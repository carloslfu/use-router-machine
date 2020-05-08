import { routerMachine } from 'xstate-router'
import { useState, useMemo, useEffect } from 'react'
import {
  Machine,
  MachineConfig,
  EventObject,
  State,
  StateSchema,
  Interpreter,
} from 'xstate'

interface HookArgs<TContext, TState extends StateSchema, TEvent extends EventObject> {
  config: MachineConfig<TContext, TState, TEvent>,
  options: any,
  initialContext: TContext,
  history?
}

export function useRouterMachine<
  TContext = any,
  TState extends StateSchema = any,
  TEvent extends EventObject = any
>(args: HookArgs<TContext, TState, TEvent>): {
  state: State<TContext, TEvent>;
  context: TContext;
  send: TSendFn<TContext, TEvent>;
  service: Interpreter<TContext, TState, TEvent>;
} {
  const machine = useMemo(
    () => Machine<TContext, TState, TEvent>(args.config, args.options, args.initialContext),
    []
  );

  const [state, setState] = useState<State<TContext, TEvent>>(
    machine.initialState
  );
  const [context, setContext] = useState<TContext>(machine.context!);

  // Setup the service only once.
  const service = useMemo(() => {
    const service = routerMachine<TContext, TState, TEvent>(args)
    setState(service.state)
    setContext(service.machine.context as any)
    service.onTransition(state => setState(state as any));
    service.onChange(ctx => setContext(ctx));
    return service;
  }, []);

  // Stop the service when unmounting.
  useEffect(() => {
    return () => {
      service.stop();
    }
  }, []);

  return { state, send: service.send, context, service };
}

type TSendFn<TContext, TEvent extends EventObject> = (
  event: TEvent
) => State<TContext, TEvent>;
