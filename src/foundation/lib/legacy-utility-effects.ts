export interface LegacyMessageCounts {
  atCount: number;
  messageCount: number;
  replyCount: number;
  systemCount: number;
}

export interface LegacyUtilityEffects {
  throwError(error: any): void;
  logOffAndNavigate(): void;
  changeCurrentUser(userInfo: any): void;
  getMessageCounts(): LegacyMessageCounts;
  clearMessageCounts(): void;
}

let effects: LegacyUtilityEffects;

export function configureLegacyUtilityEffects(
  configuredEffects: LegacyUtilityEffects
): void {
  effects = configuredEffects;
}

function getEffects(): LegacyUtilityEffects {
  if (!effects) {
    throw new Error("Legacy utility effects have not been configured");
  }
  return effects;
}

export function throwLegacyError(error: any): void {
  getEffects().throwError(error);
}

export function logOffAndNavigate(): void {
  getEffects().logOffAndNavigate();
}

export function changeLegacyCurrentUser(userInfo: any): void {
  getEffects().changeCurrentUser(userInfo);
}

export function getLegacyMessageCounts(): LegacyMessageCounts {
  return getEffects().getMessageCounts();
}

export function clearLegacyMessageCounts(): void {
  getEffects().clearMessageCounts();
}
