// Styled components — the default export.
// Consumers: import { Button } from 'flintwork';
export { Button } from './styled';

// Re-export Dialog and Tabs from primitives until styled wrappers exist.
// These will move to styled exports in subsequent phases.
export { Dialog } from './primitives/dialog';
export { Tabs } from './primitives/tabs';