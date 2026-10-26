/**
 * One switch for every demo-only line. Keep it on while the coach, accounts,
 * payments and shopping are simulated; build with VITE_DEMO=false only once
 * they are real services. It is a compile-time constant, so the launch build
 * drops the demo copy entirely.
 */
export const DEMO = import.meta.env.VITE_DEMO !== "false";
