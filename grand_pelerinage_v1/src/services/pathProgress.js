/**
 * Progression du sentier : les époques et les étapes s'ouvrent dans l'ordre.
 * Une étape déjà accomplie reste rejouable.
 */

export function isEpochUnlocked(epochId, epochs, stagesByEpoch, completedIds) {
  const order = epochs.map((epoch) => epoch.id);
  const index = order.indexOf(epochId);
  if (index < 0) return false;
  if (index === 0) return true;
  const done = new Set(completedIds);
  for (let i = 0; i < index; i += 1) {
    const stages = stagesByEpoch[order[i]] || [];
    if (stages.some((stage) => !done.has(stage.id))) return false;
  }
  return true;
}

export function isStagePlayable(stageId, epochId, epochs, stagesByEpoch, completedIds) {
  const done = new Set(completedIds);
  if (done.has(stageId)) return true;
  if (!isEpochUnlocked(epochId, epochs, stagesByEpoch, completedIds)) return false;
  const stages = stagesByEpoch[epochId] || [];
  const index = stages.findIndex((stage) => stage.id === stageId);
  if (index < 0) return false;
  return stages.slice(0, index).every((stage) => done.has(stage.id));
}

export function isBonusPlayable(bonus, epochs, stagesByEpoch, completedIds) {
  if (!bonus) return false;
  const done = new Set(completedIds);
  if (done.has(bonus.id)) return true;
  const stages = stagesByEpoch[bonus.epoch] || [];
  if (stages.length === 0) return false;
  if (!isEpochUnlocked(bonus.epoch, epochs, stagesByEpoch, completedIds)) return false;
  return stages.every((stage) => done.has(stage.id));
}

export function firstOpenStage(stages, completedIds) {
  const done = new Set(completedIds);
  return stages.find((stage) => !done.has(stage.id)) || stages[0] || null;
}
