import { createContext, useContext, useMemo, useState } from 'react';

// backend/src/main/java/.../domain/user/entity/enums 실제 enum 값 기준 (2026-08-15 확인)
export const MEAL_PATTERN_MAP = {
  regular: 'REGULAR',
  'sometimes-skip': 'SOMETIMES_SKIP',
  'often-skip': 'OFTEN_SKIP',
};

export const REST_ACTIVITY_MAP = {
  sleep: 'NAP_SLEEP',
  shower: 'BATH',
  study: 'READING_STUDY',
  exercise: 'EXERCISE_STRETCH',
  animals: 'PET_CARE',
  walking: 'WALK_CAFE',
  yoga: 'MEDITATION',
  etc: 'OTHER',
};

export const SENSITIVITY_MAP = {
  1: 'LOW',
  2: 'MEDIUM',
  3: 'HIGH',
};

export const SKIN_TYPE_MAP = {
  dry: 'DRY',
  oily: 'OILY',
  combination: 'COMBINATION',
  sensitive: 'SENSITIVE',
};

export const SKIN_CONCERN_MAP = {
  dryness: 'DRYNESS',
  redness: 'REDNESS',
  trouble: 'TROUBLE',
  barrier: 'SKIN_BARRIER',
  texture: 'ROUGHNESS',
  sebum: 'OILINESS',
  wrinkle: 'WRINKLE',
  etc: 'OTHER',
};

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const [data, setData] = useState({
    shiftDStart: null,
    shiftDEnd: null,
    shiftEStart: null,
    shiftEEnd: null,
    shiftNStart: null,
    shiftNEnd: null,
    targetSleepMinutes: null,
    mealPattern: null,
    restActivities: [],
    sensitivityLevel: null,
    skinType: null,
    skinConcerns: [],
  });

  const updateOnboarding = (partial) => setData((prev) => ({ ...prev, ...partial }));

  const value = useMemo(() => ({ data, updateOnboarding }), [data]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding은 OnboardingProvider 안에서만 사용할 수 있어요.');
  return ctx;
}
