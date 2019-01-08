import {TOGGLE_SLIDER} from '../actions/types';

const initialState = {
  isVotingSliderVisible: true
};

const metaBottomReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SLIDER:
      return {
        value: action.payload
      };
    default:
      return state;
  }
};
export default metaBottomReducer;
