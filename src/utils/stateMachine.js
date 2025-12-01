/**
 * Simple Finite State Machine
 *
 * Implements a lightweight FSM for managing component state
 * Prevents impossible states and makes transitions explicit
 *
 * Reference: Frontend Architecture Sovereign (frontend-2026)
 * "Ban 'isLoading' booleans. Use explicit states: idle, processing, success, failure"
 */

export class StateMachine {
  /**
   * Create a state machine
   *
   * @param {Object} config - State machine configuration
   * @param {string} config.initial - Initial state name
   * @param {Object} config.states - State definitions
   * @param {Function} config.onTransition - Callback on state change
   */
  constructor({ initial, states, onTransition }) {
    this.states = states;
    this.current = initial;
    this.onTransition = onTransition || (() => {});
    this.context = {};

    // Validate initial state exists
    if (!this.states[this.current]) {
      throw new Error(`Initial state "${this.current}" not defined in states`);
    }
  }

  /**
   * Get current state
   */
  getState() {
    return this.current;
  }

  /**
   * Get context data
   */
  getContext() {
    return this.context;
  }

  /**
   * Update context data
   */
  setContext(updates) {
    this.context = { ...this.context, ...updates };
  }

  /**
   * Send an event to trigger a transition
   *
   * @param {string} event - Event name
   * @param {Object} payload - Optional event data
   * @returns {boolean} - True if transition occurred
   */
  send(event, payload = {}) {
    const currentState = this.states[this.current];
    const transition = currentState?.on?.[event];

    if (!transition) {
      console.warn(`No transition for event "${event}" in state "${this.current}"`);
      return false;
    }

    // Determine next state
    const nextState = typeof transition === 'function'
      ? transition(this.context, payload)
      : transition;

    if (!this.states[nextState]) {
      throw new Error(`Target state "${nextState}" not defined`);
    }

    const previousState = this.current;
    this.current = nextState;

    // Call onTransition callback
    this.onTransition({
      from: previousState,
      to: nextState,
      event,
      payload,
      context: this.context,
    });

    return true;
  }

  /**
   * Check if machine is in a specific state
   *
   * @param {string} state - State name to check
   * @returns {boolean}
   */
  is(state) {
    return this.current === state;
  }

  /**
   * Check if machine can handle an event in current state
   *
   * @param {string} event - Event name
   * @returns {boolean}
   */
  can(event) {
    const currentState = this.states[this.current];
    return Boolean(currentState?.on?.[event]);
  }
}

/**
 * Create a simple cyclic state machine (for theme toggling, carousels, etc.)
 *
 * @param {Array<string>} stateNames - Ordered array of state names
 * @param {string} initial - Initial state (defaults to first state)
 * @param {Function} onTransition - Callback on state change
 * @returns {StateMachine}
 */
export function createCyclicMachine(stateNames, initial, onTransition) {
  if (!stateNames || stateNames.length === 0) {
    throw new Error('stateNames must be a non-empty array');
  }

  const states = {};
  stateNames.forEach((name, index) => {
    const nextIndex = (index + 1) % stateNames.length;
    const prevIndex = (index - 1 + stateNames.length) % stateNames.length;

    states[name] = {
      on: {
        NEXT: stateNames[nextIndex],
        PREV: stateNames[prevIndex],
        GOTO: (context, { target }) => target,
      },
    };
  });

  return new StateMachine({
    initial: initial || stateNames[0],
    states,
    onTransition,
  });
}

export default StateMachine;
