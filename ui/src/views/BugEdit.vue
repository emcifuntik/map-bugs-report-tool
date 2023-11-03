<template>
  <v-container>
    <v-textarea v-model="bugDescription" :counter="300" label="Bug description" required></v-textarea>
    <v-select
      v-model="bugPriority"
      label="Priority"
      :items="[
        'Low',
        'Middle',
        'High',
      ]"
    ></v-select>
    <v-switch v-model="bugResolved" color="success" label="Resolved"></v-switch>

    <div class="d-flex flex-column">
      <v-btn color="warning" class="mt-4" block type="submit" @click="saveBug">Save</v-btn>
      <v-btn color="success" class="mt-4" block type="success" @click="teleportToBug">Teleport</v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store, { Bug } from '@/store';
import { priorityToInt, intToPriority } from '@/utils/bugPriority';

const route = useRoute();
const router = useRouter();

const bugDescription = ref<string>('');
const bugPriority = ref<string>('Low');
const bugResolved = ref<boolean>(false);

// Function to load the bug data
function loadBugData(bugId: string) {
  const bug = store.state.bugs.find((b: Bug) => b.id === parseInt(bugId));

  if (bug) {
    bugDescription.value = bug.description;
    bugPriority.value = intToPriority(bug.priority); // assuming you have a utility to convert back to string representation
    bugResolved.value = bug.resolved;
  } else {
    // Handle the case where no bug is found for the given ID
    console.warn(`No bug found with id ${bugId}`);
    // Redirect to a default page or show an error message
    router.push({ name: 'BugList' }); // Redirect to bug list page or wherever appropriate
  }
}

watch(route, (to, from) => {
  if (to.params.bugId) {
    loadBugData(to.params.bugId as string);
  }
});

function saveBug() {
  const bugId = parseInt(route.params.bugId as string);
  const priorityValue = priorityToInt(bugPriority.value);
  
  // Dispatch an action to update the bug in the store
  store.dispatch('updateBug', {
    id: bugId,
    description: bugDescription.value,
    priority: priorityValue,
    resolved: bugResolved.value
  });

  alt.emit('updateBug', bugId, bugDescription.value, priorityValue, bugResolved.value);
}

// Add logic to fetch and populate the bug data if it exists when the component is mounted
const bugId = parseInt(route.params.bugId as string);
if (bugId) {
  const bug = store.state.bugs.find(b => b.id === bugId);
  if (bug) {
    bugDescription.value = bug.description;
    bugPriority.value = intToPriority(bug.priority); // You would need to convert the priority back to its string representation
    bugResolved.value = bug.resolved;
  }
}

function teleportToBug() {
  const bugId = route.params.bugId;
  alt.emit('teleportToBug', bugId);
}

</script>
