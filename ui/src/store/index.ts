import { createStore } from 'vuex'

// Define a type for the bug object
export interface Bug {
  id: number;
  description: string;
  resolved: boolean;
  priority: number;
}

// Type your state
export interface State {
  bugs: Bug[];
}

// Create the store with the state and mutations typed
const store = createStore<State>({
  state: {
    bugs: [
      {
        description: 'This is a bug 1',
        id: 1,
        resolved: false,
        priority: 1
      },
      {
        description: 'This is a bug 2',
        id: 2,
        resolved: false,
        priority: 1
      },
      {
        description: 'This is a bug 3',
        id: 3,
        resolved: false,
        priority: 1
      }
    ]
  },
  mutations: {
    // Correctly type the bug parameter
    addBug (state, bug: Bug) {
      state.bugs.push(bug);
    },
    // Correctly type the bugsArray parameter
    addBugs (state, bugsArray: Bug[]) {
      state.bugs.push(...bugsArray);
    },
    // Correctly type the newBugs parameter
    replaceBugs (state, newBugs: Bug[]) {
      state.bugs = newBugs;
    },
    updateBug(state, bugData) {
      const index = state.bugs.findIndex(bug => bug.id === bugData.id);
      if (index !== -1) {
        state.bugs[index] = { ...state.bugs[index], ...bugData };
      }
    },
  },
  actions: {
    addBug ({ commit }, bug: Bug) {
      commit('addBug', bug);
    },
    addBugs ({ commit }, bugsArray: Bug[]) {
      commit('addBugs', bugsArray);
    },
    replaceBugs ({ commit }, newBugs: Bug[]) {
      commit('replaceBugs', newBugs);
    },
    updateBug({ commit }, bugData) {
      commit('updateBug', bugData);
    }
  }
});

console.log(window.alt);

window.alt.on('pushBugs', (bugsArray: Bug[]) => {
  store.dispatch('replaceBugs', bugsArray);
});

window.alt.on('bugCreated', (bugId: number, description: string, priority: number) => {
  store.dispatch('addBug', {
    id: bugId,
    description,
    priority,
    resolved: false
  });
});

export default store;
