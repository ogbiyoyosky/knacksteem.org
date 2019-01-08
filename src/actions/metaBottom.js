import {VOTE_POWER_CHANGE, TOGGLE_SLIDER} from './types';
export const toggleSlider = payload => {
    return {
      type: TOGGLE_SLIDER,
      payload
    };
  };